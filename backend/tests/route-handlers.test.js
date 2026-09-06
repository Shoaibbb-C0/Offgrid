import test from 'node:test';
import assert from 'node:assert/strict';
import { GET as health } from '../../app/api/health/route.js';
import { POST as checkout } from '../../app/api/checkout/route.js';
import { POST as lookup } from '../../app/api/orders/lookup/route.js';
import { POST as stripeWebhook } from '../../app/api/webhooks/stripe/route.js';

void test('health route reports integration configuration safely', async () => {
  const response = health();
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.ok, true);
  assert.equal(body.service, 'offgrid-commerce');
  assert.equal(typeof body.stripeConfigured, 'boolean');
  assert.equal(typeof body.supabaseConfigured, 'boolean');
});

void test('checkout route rejects malformed browser input', async () => {
  const response = await checkout(
    new Request('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'not-an-email', lines: [] }),
    }),
  );
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error, 'Invalid checkout request');
});

void test('order lookup route rejects malformed credentials', async () => {
  const response = await lookup(
    new Request('http://localhost:3000/api/orders/lookup', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ orderId: 'x', email: 'invalid' }),
    }),
  );
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error, 'Invalid lookup');
});

void test('webhook route requires a Stripe signature', async () => {
  const response = await stripeWebhook(
    new Request('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{}',
    }),
  );
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error, 'Missing Stripe signature');
});
