import { Router } from 'express';
import { z } from 'zod';
import { priceCart } from '../modules/catalogue.js';
import {
  createOrderWithReservation,
  attachCheckoutSession,
} from '../modules/orderRepository.js';
import { createStripeCheckout } from '../modules/stripeCheckout.js';
const router = Router();
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
router.post('/', async (req, res, next) => {
  try {
    const input = bodySchema.parse(req.body);
    const items = priceCart(input.lines);
    const order = await createOrderWithReservation({ ...input, items });
    const session = await createStripeCheckout({ ...input, order, items });
    await attachCheckoutSession(order.order_id, session.id);
    res.status(201).json({
      orderId: order.public_id,
      checkoutUrl: session.url,
      testMode: !process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_'),
    });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ error: 'Invalid checkout request', issues: error.issues });
    next(error);
  }
});
export default router;
