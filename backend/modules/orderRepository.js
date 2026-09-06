import { requireSupabase } from '../lib/supabase.js';
function fail(error, message) {
  if (error)
    throw Object.assign(new Error(`${message}: ${error.message}`), {
      status: 500,
    });
}
export async function createOrderWithReservation({ email, currency, items }) {
  const db = requireSupabase();
  const { data, error } = await db.rpc('create_checkout_order', {
    p_email: email,
    p_currency: currency,
    p_items: items.map((item) => ({
      product_id: item.productId,
      license: item.license,
      quantity: item.quantity,
    })),
  });
  fail(error, 'Unable to reserve inventory');
  return data;
}
export async function attachCheckoutSession(orderId, sessionId) {
  const db = requireSupabase();
  const { error } = await db
    .from('orders')
    .update({ provider_session_id: sessionId })
    .eq('id', orderId)
    .eq('state', 'pending');
  fail(error, 'Unable to attach checkout session');
}
export async function recordPaymentEvent(event) {
  const db = requireSupabase();
  const object = event.data.object;
  const { data, error } = await db.rpc('process_stripe_event', {
    p_provider_event_id: event.id,
    p_event_type: event.type,
    p_payload: event,
    p_order_id: object.metadata?.order_id || null,
    p_payment_status: object.payment_status || null,
  });
  fail(error, 'Unable to process payment event');
  return data;
}
export async function findPublicOrder({ publicId, email }) {
  const db = requireSupabase();
  const { data, error } = await db.rpc('lookup_order', {
    p_public_id: publicId,
    p_email: email,
  });
  fail(error, 'Unable to find order');
  return data?.[0] || null;
}
