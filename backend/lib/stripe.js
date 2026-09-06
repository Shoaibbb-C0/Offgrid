import Stripe from 'stripe';
let client;
export function getStripe() {
  if (client) return client;
  if (!process.env.STRIPE_SECRET_KEY) return null;
  client = new Stripe(process.env.STRIPE_SECRET_KEY, {
    appInfo: { name: 'Offgrid Commerce', version: '1.0.0' },
  });
  return client;
}
export function requireStripe() {
  const value = getStripe();
  if (!value)
    throw Object.assign(new Error('Stripe is not configured'), {
      status: 503,
      code: 'STRIPE_NOT_CONFIGURED',
    });
  return value;
}
