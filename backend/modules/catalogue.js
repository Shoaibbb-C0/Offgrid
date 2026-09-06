import { products } from '../../frontend/data/products.js';
export function priceCart(lines) {
  if (!Array.isArray(lines) || !lines.length)
    throw Object.assign(new Error('Cart is empty'), { status: 400 });
  return lines.map((line) => {
    const product = products.find((p) => p.id === line.productId);
    if (!product)
      throw Object.assign(new Error('Unknown product'), { status: 400 });
    if (!['Personal', 'Commercial'].includes(line.license))
      throw Object.assign(new Error('Invalid license'), { status: 400 });
    const qty = Math.max(1, Math.min(10, Number(line.quantity) || 1));
    const unitPrice = product.price * (line.license === 'Commercial' ? 2 : 1);
    return {
      productId: product.id,
      name: product.name,
      license: line.license,
      quantity: qty,
      unitPrice,
      lineTotal: unitPrice * qty,
    };
  });
}
