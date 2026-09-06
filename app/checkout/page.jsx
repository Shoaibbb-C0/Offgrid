'use client';
import { useState } from 'react';
import { Lock } from 'lucide-react';
import { money, useStore } from '../../frontend/context/StoreContext';
export default function Checkout() {
  const { detailed, total, currency } = useStore();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: form.get('email'),
          currency,
          lines: detailed.map((item) => ({
            productId: item.id,
            license: item.license,
            quantity: item.qty,
          })),
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || 'Checkout could not start');
      window.location.assign(result.checkoutUrl);
    } catch (reason) {
      setError(reason.message);
      setBusy(false);
    }
  };
  return (
    <main className="checkout-page">
      <section>
        <p className="eyebrow">SECURE CHECKOUT / STRIPE TEST MODE</p>
        <h1>Almost yours.</h1>
        <div className="test-banner">
          <Lock /> Test mode — no real payment will be taken.
        </div>
        <form onSubmit={submit}>
          <h2>Delivery details</h2>
          <label>
            Email
            <input
              name="email"
              type="email"
              required
              placeholder="you@studio.com"
            />
          </label>
          <label>
            Full name
            <input name="name" required placeholder="Shoaib Khan" />
          </label>
          <div className="form-row">
            <label>
              Country
              <select name="country" required defaultValue="IN">
                <option value="IN">India</option>
                <option value="SG">Singapore</option>
                <option value="JP">Japan</option>
                <option value="AE">United Arab Emirates</option>
              </select>
            </label>
            <label>
              Company (optional)
              <input name="company" />
            </label>
          </div>
          <h2>Payment</h2>
          <div className="stripe-mock">
            <b>stripe</b>
            <span>Hosted checkout opens securely after continue.</span>
          </div>
          {error && (
            <p role="alert" className="checkout-error">
              {error}
            </p>
          )}
          <button className="add-large" disabled={!detailed.length || busy}>
            {busy
              ? 'Reserving inventory…'
              : `Continue to Stripe · ${money(total, currency)}`}
          </button>
          <p className="secure-note">
            <Lock /> Price and availability are revalidated by the server.
          </p>
        </form>
      </section>
      <aside>
        <h2>Your order</h2>
        {detailed.map((item) => (
          <div className="checkout-line" key={item.id + item.license}>
            <span style={{ background: item.product.accent }}>OG</span>
            <div>
              <b>{item.product.name}</b>
              <small>
                {item.license} · Qty {item.qty}
              </small>
            </div>
            <strong>{money(item.unitPrice * item.qty, currency)}</strong>
          </div>
        ))}
        <div className="checkout-total">
          <span>Total</span>
          <strong>{money(total, currency)}</strong>
        </div>
      </aside>
    </main>
  );
}
