import { z } from 'zod';
import { jsonError } from '../../../../backend/lib/http.js';
import { findPublicOrder } from '../../../../backend/modules/orderRepository.js';

export const runtime = 'nodejs';

const bodySchema = z.object({
  orderId: z.string().min(6).max(40),
  email: z.email(),
});

export async function POST(request) {
  try {
    const input = bodySchema.parse(await request.json());
    const order = await findPublicOrder({
      publicId: input.orderId,
      email: input.email,
    });

    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    return Response.json({ order });
  } catch (error) {
    return jsonError(error, 'Invalid lookup');
  }
}
