import { Router } from 'express';
import { requireStripe } from '../lib/stripe.js';
import { recordPaymentEvent } from '../modules/orderRepository.js';
const router = Router();
router.post('/stripe', async (req, res, next) => {
  try {
    const signature = req.headers['stripe-signature'];
    if (!signature)
      throw Object.assign(new Error('Missing Stripe signature'), {
        status: 400,
      });
    if (!process.env.STRIPE_WEBHOOK_SECRET)
      throw Object.assign(new Error('Webhook secret is not configured'), {
        status: 503,
      });
    const event = requireStripe().webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
    const result = await recordPaymentEvent(event);
    res.json({ received: true, result });
  } catch (error) {
    next(error);
  }
});
export default router;
