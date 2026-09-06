import { z } from 'zod';
import { jsonError } from '../../../backend/lib/http.js';
import { priceCart } from '../../../backend/modules/catalogue.js';
import {
  attachCheckoutSession,
  createOrderWithReservation,
} from '../../../backend/modules/orderRepository.js';
import { createStripeCheckout } from '../../../backend/modules/stripeCheckout.js';

export const runtime = 'nodejs';

const bodySchema = z.object({
  email: z.email(),
  currency: z.enum(['USD', 'INR']).default('USD'),
  lines: z
    .array(
      z.object({
        productId: z.string().min(1),
        license: z.enum(['Personal', 'Commercial']),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1)
    .max(25),
});

export async function POST(request) {
  try {
    const input = bodySchema.parse(await request.json());
    const items = priceCart(input.lines);
    const order = await createOrderWithReservation({ ...input, items });
    const appUrl = process.env.PUBLIC_APP_URL || new URL(request.url).origin;
    const session = await createStripeCheckout({
      ...input,
      order,
      items,
      appUrl,
    });
    await attachCheckoutSession(order.order_id, session.id);

    return Response.json(
      {
        orderId: order.public_id,
        checkoutUrl: session.url,
        testMode: !process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_'),
      },
      { status: 201 },
    );
  } catch (error) {
    return jsonError(error, 'Invalid checkout request');
  }
}
