import 'dotenv/config';
import express from 'express';
import { security } from './middleware/security.js';
import checkout from './routes/checkout.js';
import webhooks from './routes/webhooks.js';
import orders from './routes/orders.js';
import { config } from './config.js';
const app = express();
app.use(...security);
app.use(
  '/api/webhooks',
  express.raw({ type: 'application/json', limit: '256kb' }),
  webhooks,
);
app.use(express.json({ limit: '100kb' }));
app.get('/api/health', (_, res) =>
  res.json({
    ok: true,
    service: 'offgrid-commerce',
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
    supabaseConfigured: Boolean(
      process.env.SUPABASE_URL &&
      (process.env.SUPABASE_SECRET_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_KEY),
    ),
  }),
);
app.use('/api/checkout', checkout);
app.use('/api/orders', orders);
app.use((error, _req, res, _next) => {
  console.error(error.code || error.type || error.message);
  res.status(error.status || 400).json({
    error: error.status ? error.message : 'Request could not be processed',
    code: error.code,
  });
});
if (process.env.NODE_ENV !== 'test')
  app.listen(config.port, () =>
    console.log(`Offgrid API listening on ${config.port}`),
  );
export default app;
