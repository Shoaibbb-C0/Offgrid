# OFFGRID

A premium, mobile-first digital goods storefront for UI systems, code kits, icon libraries, and launch assets. Offgrid combines an editorial shopping experience with a server-authoritative Stripe and Supabase commerce backend.

## Highlights

- 16-product catalogue with Personal and Commercial license variants
- Responsive editorial storefront with animated product cards
- Search, category filters, sorting, wishlist, and persistent cart
- USD and INR display and checkout support
- Stripe-hosted Checkout in test mode
- Supabase PostgreSQL orders, reservations, inventory, and payment events
- Signature-verified, idempotent Stripe webhooks
- Guest checkout with optional account and admin interface demonstrations
- Secure order lookup, confirmation, delivery, return, and licensing pages
- Reduced-motion support and touch-first mobile interactions
- Self-hosted Space Grotesk and Syne fonts with no runtime Google Fonts dependency

## Stack

- **React 19** — interactive storefront components and state
- **Next.js** — App Router, server rendering, development, and Vercel-ready production builds
- **JavaScript + JSX** — frontend and backend application code
- **Tailwind CSS engine + custom CSS** — responsive design, typography, and motion
- **Next.js Route Handlers** — same-domain, server-only commerce API
- **Supabase PostgreSQL** — products, orders, reservations, inventory, and payment events
- **Stripe Checkout** — hosted test payments and signed webhooks
- **Zod** — API request validation
- **Next.js security headers + Vercel Firewall** — same-origin HTTP protection
- **Lucide** — lightweight interface icons
- **Oxlint + Oxfmt** — static analysis and consistent formatting
- **Node test runner** — commerce and webhook security tests

## Project structure

```text
app/                    Storefront routes and global styles
frontend/components/    Reusable commerce and navigation components
frontend/context/       Cart, currency, and wishlist state
frontend/data/          Demo product catalogue
app/api/                Vercel-ready checkout, orders, health, and webhook routes
backend/lib/            Stripe, Supabase, and HTTP server utilities
backend/modules/        Pricing, checkout, order, and payment logic
backend/tests/          Security and commerce tests
database/schema.sql     PostgreSQL schema and atomic commerce functions
database/seed.sql       Products and license variants
assets/                 Original asset archive and license register
public/assets/          Browser-served creative assets
```

Generated directories such as `.next` and `dist` are intentionally ignored.

## Local setup

Requirements:

- Node.js 22.13 or newer
- A Supabase project
- A Stripe account in test mode
- Stripe CLI for local webhook forwarding

Install dependencies:

```bash
npm install
```

Copy `.env.example` to `.env` and provide the account-owned values:

```env
PUBLIC_APP_URL=http://localhost:3000
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SECRET_KEY=sb_secret_YOUR_KEY

STRIPE_SECRET_KEY=sk_test_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
```

Never commit `.env`. The Supabase secret key and Stripe secret key must remain server-only.

## Database setup

In the Supabase SQL Editor:

1. Run `database/schema.sql`.
2. Run `database/seed.sql`.

The schema creates catalogue, order, reservation, payment-event, and inventory-movement tables. PostgreSQL functions perform checkout reservation and payment fulfillment transactionally.

## Run locally

Start the complete storefront and API:

```bash
npm run dev
```

Forward Stripe test events in another terminal:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the emitted `whsec_...` value into `.env`, then restart Next.js.

Open `http://localhost:3000`. The same-domain API health endpoint is available at `http://localhost:3000/api/health`.

Stripe's successful test card is `4242 4242 4242 4242` with any future expiry and any CVC. No real payment is collected in test mode.

## Commerce flow

```text
Cart
  → Next.js validates product, license, quantity, price, and currency
  → Supabase creates a pending order and 15-minute reservation
  → Next.js creates a Stripe-hosted Checkout Session
  → Stripe sends a signed payment event
  → PostgreSQL records the unique event
  → Order is fulfilled and inventory changes exactly once
```

The success-page redirect never marks an order paid. Only a verified webhook can fulfill it. Duplicate Stripe events are accepted safely without repeating inventory movements.

## Commands

```bash
npm run dev       # Storefront development server
npm run build     # Production build
npm run lint      # Static analysis
npm run format    # Format source files
npm test          # Commerce and Stripe security tests
```

## Documentation

- `ARCHITECTURE.md` — experience, commerce model, security, and application boundaries
- `INTEGRATION_SETUP.md` — detailed Stripe and Supabase configuration
- `assets/README.md` — image sources, authors, and licenses

## License

This repository is a portfolio project. Third-party visual assets retain the licenses documented in `assets/README.md`.
