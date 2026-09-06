import { createClient } from '@supabase/supabase-js';
let client;
export function getSupabase() {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const secret =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !secret) return null;
  client = createClient(url, secret, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: { headers: { 'x-application-name': 'offgrid-commerce' } },
  });
  return client;
}
export function requireSupabase() {
  const value = getSupabase();
  if (!value)
    throw Object.assign(new Error('Supabase is not configured'), {
      status: 503,
      code: 'SUPABASE_NOT_CONFIGURED',
    });
  return value;
}
