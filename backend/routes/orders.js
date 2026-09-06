import { Router } from 'express';
import { z } from 'zod';
import { findPublicOrder } from '../modules/orderRepository.js';
const router = Router();
const schema = z.object({
  orderId: z.string().min(6).max(40),
  email: z.email(),
});
router.post('/lookup', async (req, res, next) => {
  try {
    const input = schema.parse(req.body);
    const order = await findPublicOrder({
      publicId: input.orderId,
      email: input.email,
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ order });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res.status(400).json({ error: 'Invalid lookup' });
    next(error);
  }
});
export default router;
