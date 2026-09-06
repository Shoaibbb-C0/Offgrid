import { requireStripe } from '../lib/stripe.js';
export async function createStripeCheckout({ order, email, currency, items }) {
  const stripe = requireStripe();
  const appUrl = process.env.PUBLIC_APP_URL || 'http://localhost:3000';
  return stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: email,
    client_reference_id: order.order_id,
    metadata: { order_id: order.order_id, public_id: order.public_id },
    line_items: items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: currency.toLowerCase(),
        unit_amount:
          currency === 'INR'
            ? Math.round(item.unitPrice * 84 * 100)
            : item.unitPrice * 100,
        product_data: {
          name: item.name,
          description: `${item.license} license`,
          metadata: { product_id: item.productId, license: item.license },
        },
      },
    })),
    success_url: `${appUrl}/confirmation?order=${encodeURIComponent(order.public_id)}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/checkout?cancelled=1`,
    billing_address_collection: 'auto',
  });
}
