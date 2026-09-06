# Offgrid commerce architecture

## Experience and merchandising

- **Primary journey:** editorial hero → category/product discovery → product license choice → persistent cart → server-repriced Stripe handoff → webhook-confirmed order → instant download.
- **Hierarchy:** brand proposition and shop CTA first, catalogue filters second, deeper system narrative and category stories third, support and account access last.
- **Merchandising:** 16 products across UI Systems, Code Kits, Icon Systems, Launch Packs, and Visual Assets. Product cards expose name, category, starting price, license options, and quick-add without relying on hover.
- **Mobile:** one-column narrative, horizontally swipeable catalogue, persistent 44px+ touch targets, native scrolling, no scroll hijacking.

## Commerce model

- `products` own current catalogue content; `product_variants` represent Personal and Commercial licenses.
- `orders` progress through `pending → paid → fulfilled`, or `pending → payment_failed | expired | cancelled | refunded`.
- `order_items` snapshot purchased name, unit price, currency, and license so catalogue edits never rewrite history.
- `inventory_reservations` are created transactionally for 15 minutes when checkout starts. A paid event consumes the reservation; expiration/failure releases it.
- `payment_events.provider_event_id` is unique. A transaction inserts the event once, locks the order, verifies the allowed transition, finalizes inventory once, and marks fulfillment.
- Admins may correct customer metadata and resend downloads after payment, but cannot edit captured prices, currency, line items, or payment records.

## Application boundaries

- `app/`: Vinext/React route entrypoints.
- `frontend/components/`: reusable navigation, product card, search, cart, and shell primitives.
- `frontend/context/`: device-local demo cart/currency/wishlist state.
- `frontend/data/`: 16-product demo catalogue.
- `backend/`: Express API, validation, catalogue, checkout, orders, inventory, payment event, and auth modules.
- `database/schema.sql`: Supabase PostgreSQL schema, constraints, row-level-security notes, and atomic inventory functions.
- `assets/`: source/license registry for all downloaded or external creative references. Runtime copies live in `public/assets/`.

## Security, quality, and operations

- Browser line items are treated only as product/variant/quantity references; totals are recalculated from database prices.
- Stripe webhook signatures are verified against the raw request body; success-page navigation never marks an order paid.
- Helmet security headers, explicit CORS origins, JSON size limits, rate limiting, schema validation, secure cookies, admin role checks, and allowlisted upload MIME/size limits are expected in production.
- Semantic headings, labelled controls, keyboard focus, reduced-motion fallbacks, structured product metadata, responsive images, lazy loading, and route metadata cover accessibility/SEO/performance.
- Tests cover last-license concurrency, repeated/out-of-order webhooks, cart repricing, invalid variants, failed/abandoned checkout, order lookup privacy, and admin authorization.

Stripe Checkout and Supabase persistence are fully wired. They stay disabled until the account-owned environment credentials are supplied; setup is documented in `INTEGRATION_SETUP.md`.
