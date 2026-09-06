create extension if not exists pgcrypto;

create type order_state as enum(
  'pending',
  'paid',
  'fulfilled',
  'payment_failed',
  'expired',
  'cancelled',
  'refunded'
);

create table products (
  id uuid primary key default gen_random_uuid(),
  external_id text unique not null,
  slug text unique not null,
  name text not null,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products,
  license text not null check (license in ('Personal', 'Commercial')),
  price_usd_cents integer not null check (price_usd_cents >= 0),
  available integer not null check (available >= 0),
  unique (product_id, license)
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null
);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products,
  storage_path text not null,
  alt text not null,
  position integer not null default 0
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  public_id text unique not null,
  email text not null,
  state order_state not null default 'pending',
  currency text not null check (currency in ('USD', 'INR')),
  total_minor integer not null,
  provider_session_id text unique,
  created_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders,
  variant_id uuid not null references product_variants,
  purchased_name text not null,
  purchased_license text not null,
  unit_price_minor integer not null,
  quantity integer not null check (quantity > 0)
);

create table inventory_reservations (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders,
  variant_id uuid not null references product_variants,
  quantity integer not null check (quantity > 0),
  expires_at timestamptz not null,
  consumed_at timestamptz,
  released_at timestamptz
);

create table payment_events (
  id uuid primary key default gen_random_uuid(),
  provider_event_id text unique not null,
  event_type text not null,
  payload jsonb not null,
  processed_at timestamptz not null default now()
);

create table inventory_movements (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references product_variants,
  order_id uuid references orders,
  delta integer not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create index inventory_reservations_active on inventory_reservations (variant_id, expires_at)
where
  consumed_at is null
  and released_at is null;

alter table orders enable row level security;

alter table order_items enable row level security;

alter table payment_events enable row level security;

-- Service-role-only policies should be applied in Supabase; public order lookup must use a rate-limited server function returning only verified matching records.
revoke all on products,
product_variants,
categories,
product_images,
orders,
order_items,
inventory_reservations,
payment_events,
inventory_movements
from
  anon,
  authenticated;

grant all on products,
product_variants,
categories,
product_images,
orders,
order_items,
inventory_reservations,
payment_events,
inventory_movements to service_role;

create or replace function create_checkout_order (p_email text, p_currency text, p_items jsonb) returns jsonb language plpgsql security definer
set
  search_path = public as $$
declare v_order_id uuid:=gen_random_uuid();v_public_id text:='OG-'||to_char(now(),'YYMMDD')||'-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,4));v_item jsonb;v_variant product_variants%rowtype;v_name text;v_qty int;v_total bigint:=0;v_unit bigint;v_reserved bigint;
begin
  if p_currency not in ('USD','INR') or jsonb_array_length(p_items)=0 then raise exception 'Invalid checkout';end if;
  insert into orders(id,public_id,email,state,currency,total_minor) values(v_order_id,v_public_id,lower(p_email),'pending',p_currency,0);
  for v_item in select * from jsonb_array_elements(p_items) loop
    v_qty:=(v_item->>'quantity')::int;
    select pv.* into v_variant from product_variants pv join products p on p.id=pv.product_id where p.external_id=v_item->>'product_id' and pv.license=v_item->>'license' and p.active for update of pv;
    if not found or v_qty<1 or v_qty>10 then raise exception 'Invalid product variant';end if;
    select name into v_name from products where id=v_variant.product_id;
    select coalesce(sum(quantity),0) into v_reserved from inventory_reservations where variant_id=v_variant.id and consumed_at is null and released_at is null and expires_at>now();
    if v_variant.available-v_reserved<v_qty then raise exception 'Insufficient inventory';end if;
    v_unit:=case when p_currency='INR' then round(v_variant.price_usd_cents*84) else v_variant.price_usd_cents end;
    insert into order_items(order_id,variant_id,purchased_name,purchased_license,unit_price_minor,quantity) values(v_order_id,v_variant.id,v_name,v_variant.license,v_unit,v_qty);
    insert into inventory_reservations(order_id,variant_id,quantity,expires_at) values(v_order_id,v_variant.id,v_qty,now()+interval '15 minutes');
    v_total:=v_total+(v_unit*v_qty);
  end loop;
  update orders set total_minor=v_total where id=v_order_id;
  return jsonb_build_object('order_id',v_order_id,'public_id',v_public_id,'total_minor',v_total);
end $$;

create or replace function process_stripe_event (
  p_provider_event_id text,
  p_event_type text,
  p_payload jsonb,
  p_order_id uuid,
  p_payment_status text
) returns jsonb language plpgsql security definer
set
  search_path = public as $$
declare v_order orders%rowtype;v_res inventory_reservations%rowtype;
begin
  insert into payment_events(provider_event_id,event_type,payload) values(p_provider_event_id,p_event_type,p_payload) on conflict(provider_event_id) do nothing;
  if not found then return jsonb_build_object('duplicate',true);end if;
  if p_order_id is null then return jsonb_build_object('duplicate',false,'ignored',true);end if;
  select * into v_order from orders where id=p_order_id for update;
  if not found then raise exception 'Order not found';end if;
  if p_event_type='checkout.session.completed' and p_payment_status='paid' and v_order.state='pending' then
    for v_res in select * from inventory_reservations where order_id=p_order_id and consumed_at is null and released_at is null for update loop
      if v_res.expires_at<=now() then raise exception 'Reservation expired';end if;
      update product_variants set available=available-v_res.quantity where id=v_res.variant_id and available>=v_res.quantity;
      if not found then raise exception 'Insufficient inventory while fulfilling';end if;
      update inventory_reservations set consumed_at=now() where id=v_res.id;
      insert into inventory_movements(variant_id,order_id,delta,reason) values(v_res.variant_id,p_order_id,-v_res.quantity,'paid_order');
    end loop;
    update orders set state='fulfilled' where id=p_order_id;
  elsif p_event_type in ('checkout.session.expired','payment_intent.payment_failed') and v_order.state='pending' then
    update inventory_reservations set released_at=now() where order_id=p_order_id and consumed_at is null and released_at is null;
    update orders set state=case when p_event_type='checkout.session.expired' then 'expired'::order_state else 'payment_failed'::order_state end where id=p_order_id;
  end if;
  return jsonb_build_object('duplicate',false,'order_id',p_order_id);
end $$;

create or replace function lookup_order (p_public_id text, p_email text) returns table (
  public_id text,
  state order_state,
  currency text,
  total_minor integer,
  created_at timestamptz
) language sql security definer
set
  search_path = public as $$ select o.public_id,o.state,o.currency,o.total_minor,o.created_at from orders o where o.public_id=p_public_id and lower(o.email)=lower(p_email) limit 1 $$;

revoke all on function create_checkout_order (text, text, jsonb),
process_stripe_event (text, text, jsonb, uuid, text),
lookup_order (text, text)
from
  public,
  anon,
  authenticated;

grant
execute on function create_checkout_order (text, text, jsonb),
process_stripe_event (text, text, jsonb, uuid, text),
lookup_order (text, text) to service_role;
