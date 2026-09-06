export const runtime = 'nodejs';

export function GET() {
  return Response.json({
    ok: true,
    service: 'offgrid-commerce',
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
    supabaseConfigured: Boolean(
      process.env.SUPABASE_URL &&
      (process.env.SUPABASE_SECRET_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_KEY),
    ),
  });
}
