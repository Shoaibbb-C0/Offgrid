import test from 'node:test';
import assert from 'node:assert/strict';
import { priceCart } from '../modules/catalogue.js';
void test('browser-supplied prices are ignored', () => {
  const [line] = priceCart([
    {
      productId: 'prod_1',
      license: 'Personal',
      quantity: 2,
      price: 1,
      total: 2,
    },
  ]);
  assert.equal(line.unitPrice, 89);
  assert.equal(line.lineTotal, 178);
});
void test('commercial license price is selected on the server', () => {
  const [line] = priceCart([
    { productId: 'prod_1', license: 'Commercial', quantity: 1 },
  ]);
  assert.equal(line.unitPrice, 178);
});
void test('unknown variants are rejected', () => {
  assert.throws(
    () =>
      priceCart([{ productId: 'prod_1', license: 'Enterprise', quantity: 1 }]),
    /Invalid license/,
  );
});
