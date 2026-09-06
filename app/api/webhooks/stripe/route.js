import { jsonError } from '../../../../backend/lib/http.js';
import { requireStripe } from '../../../../backend/lib/stripe.js';
import { recordPaymentEvent } from '../../../../backend/modules/orderRepository.js';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const signature = request.headers.get('stripe-signature');
    if (!signature) {
      throw Object.assign(new Error('Missing Stripe signature'), {
        status: 400,
      });
    }
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw Object.assign(new Error('Webhook secret is not configured'), {
        status: 503,
      });
    }

    // Stripe requires the exact, unparsed request body for signature checks.
    const payload = await request.text();
    const event = requireStripe().webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
    const result = await recordPaymentEvent(event);

    return Response.json({ received: true, result });
  } catch (error) {
    if (error.type === 'StripeSignatureVerificationError') error.status = 400;
    return jsonError(error);
  }
}
