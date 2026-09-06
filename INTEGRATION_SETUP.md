# Stripe + Supabase setup

The code is complete; only account-owned values and one SQL execution remain.

## 1. Supabase first

1. Create a Supabase project and wait for its database to become available.
2. Open **SQL Editor → New query**. Run `database/schema.sql`, then run `database/seed.sql`.
3. Open the project **Connect** dialog or **Settings → API Keys**. Copy the Project URL and a server-only **Secret key** (`sb_secret_...`). New projects should prefer the secret key over the legacy `service_role` key.
4. Copy `.env.example` to `.env` and set:

   ```env
   SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   SUPABASE_SECRET_KEY=sb_secret_YOUR_KEY
   ```

5. Never prefix the secret with `NEXT_PUBLIC_`, and never paste it into browser code. The storefront only reaches Supabase through server-only Next.js Route Handlers.

## 2. Stripe test mode

1. Create or open a Stripe account, turn on **Test mode**, then open **Developers → API keys**. Copy the test secret key beginning with `sk_test_`.
2. Put it in `.env`:

   ```env
   STRIPE_SECRET_KEY=sk_test_YOUR_KEY
   ```

3. Install/sign in to the Stripe CLI, then forward local webhook events:

   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. The CLI prints a signing secret beginning with `whsec_`. Add it to `.env` as `STRIPE_WEBHOOK_SECRET`. Keep the listener running while testing.
5. Start the complete application:

   ```bash
   npm run dev
   ```

6. Add an item, continue to Stripe, and use Stripe's successful test card `4242 4242 4242 4242`, any future expiry, and any CVC/postcode. For a decline test, use `4000 0000 0000 9995`.

For a deployed API, create a Stripe webhook endpoint ending in `/api/webhooks/stripe`, subscribe to `checkout.session.completed`, `checkout.session.expired`, and `payment_intent.payment_failed`, then use that endpoint's distinct signing secret in the deployed environment.

## Verification

- `GET http://localhost:3000/api/health` must show both integrations as configured.
- A successful checkout creates one `orders` row, snapshots its `order_items`, consumes reservations, and writes one negative `inventory_movements` row per item.
- Re-sending the same Stripe event returns `duplicate: true` and does not decrement inventory again.
- The success-page redirect is informational only; fulfillment is performed exclusively by the signed webhook transaction.
