# Offgrid

I built Offgrid as an idea for a digital shop. It sells example UI kits, code items, and icon packs. I made the cart and checkout flow to practice how a shop works behind the scenes.

## What it can do

- Show products and license types
- Search, sort, and filter products
- Save items to a wishlist
- Keep items in a cart
- Start a Stripe test checkout
- Save orders with Supabase

This project is set up for Stripe test payments. Use test keys while trying it out.

## Tools used

Next.js, React, JavaScript, Supabase, Stripe, Zod, Tailwind CSS

## Run it on your computer

You need Node.js 22.13 or newer, a Supabase project, and a Stripe test account.

```bash
npm install
```

Copy `.env.example` to `.env` and add your own test settings:

```env
PUBLIC_APP_URL=http://localhost:3000
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SECRET_KEY=YOUR_SUPABASE_SECRET_KEY
STRIPE_SECRET_KEY=YOUR_STRIPE_TEST_KEY
STRIPE_WEBHOOK_SECRET=YOUR_STRIPE_WEBHOOK_SECRET
```

In Supabase, run these files in order:

1. `database/schema.sql`
2. `database/seed.sql`

Start the site:

```bash
npm run dev
```

Open `http://localhost:3000`.

To test Stripe webhooks locally, use Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Keep your `.env` file and secret keys private. A Stripe test checkout does not take real payments.
