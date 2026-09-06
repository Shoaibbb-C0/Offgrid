insert into
  products (external_id, slug, name, description)
values
  (
    'prod_1',
    'nexus-ui',
    'Nexus UI System',
    'A modular Figma system with 820 responsive components.'
  ),
  (
    'prod_2',
    'orbit-icons',
    'Orbit Icon Library',
    '2,400 precise icons across six weights.'
  ),
  (
    'prod_3',
    'foundry-commerce',
    'Foundry Commerce Kit',
    'Production-ready commerce foundations.'
  ),
  (
    'prod_4',
    'signal-dashboard',
    'Signal Dashboard',
    'Data visualization patterns.'
  ),
  (
    'prod_5',
    'mono-icons',
    'Mono Micro Icons',
    'A crisp 16px icon set.'
  ),
  (
    'prod_6',
    'relay-saas',
    'Relay SaaS Starter',
    'Auth, billing and teams.'
  ),
  (
    'prod_7',
    'launch-deck',
    'Launch Deck System',
    'Pitch and product slides.'
  ),
  (
    'prod_8',
    'grain-mockups',
    'Grain Device Scenes',
    'Editorial device scenes.'
  ),
  (
    'prod_9',
    'vector-fields',
    'Vector Field Pack',
    'Animated gradient fields.'
  ),
  (
    'prod_10',
    'atlas-webflow',
    'Atlas Site Kit',
    'Editorial portfolio system.'
  ),
  (
    'prod_11',
    'kernel-wireframes',
    'Kernel Wireframes',
    'Product flows.'
  ),
  (
    'prod_12',
    'kinetic-type',
    'Kinetic Type Lab',
    'Type motion presets.'
  ),
  (
    'prod_13',
    'checkout-patterns',
    'Checkout Patterns',
    'Checkout components.'
  ),
  (
    'prod_14',
    'founder-stack',
    'Founder Stack Bundle',
    'Design, launch and pitch.'
  ),
  (
    'prod_15',
    'terminal-scenes',
    'Terminal Scene Pack',
    'Dark code scenes.'
  ),
  (
    'prod_16',
    'grid-icons',
    'Grid Icon System',
    'Geometric icons.'
  )
on conflict (external_id) do nothing;

insert into
  product_variants (product_id, license, price_usd_cents, available)
select
  p.id,
  l.license,
  case p.external_id
    when 'prod_1' then 8900
    when 'prod_2' then 4900
    when 'prod_3' then 11900
    when 'prod_4' then 7900
    when 'prod_5' then 3900
    when 'prod_6' then 9900
    when 'prod_7' then 5900
    when 'prod_8' then 4500
    when 'prod_9' then 3500
    when 'prod_10' then 8500
    when 'prod_11' then 5500
    when 'prod_12' then 6900
    when 'prod_13' then 6500
    when 'prod_14' then 14900
    when 'prod_15' then 2900
    else 4200
  end * case
    when l.license = 'Commercial' then 2
    else 1
  end,
  12
from
  products p
  cross join (
    values
      ('Personal'),
      ('Commercial')
  ) l (license)
on conflict (product_id, license) do nothing;
