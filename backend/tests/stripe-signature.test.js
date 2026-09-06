import test from 'node:test';
import assert from 'node:assert/strict';
import Stripe from 'stripe';
void test('Stripe webhook payload requires a valid signature', () => {
  const stripe = new Stripe('sk_test_placeholder');
  const secret = 'whsec_test_secret';
  const payload = JSON.stringify({
    id: 'evt_1',
    type: 'checkout.session.completed',
  });
  const header = stripe.webhooks.generateTestHeaderString({ payload, secret });
  assert.equal(
    stripe.webhooks.constructEvent(payload, header, secret).id,
    'evt_1',
  );
  assert.throws(
    () => stripe.webhooks.constructEvent(payload, header, 'wrong_secret'),
    /signature/,
  );
});
