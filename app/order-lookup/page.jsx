'use client';
import { useState } from 'react';
import { ArrowRight, PackageSearch } from 'lucide-react';
export default function Lookup() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/orders/lookup', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          orderId: form.get('orderId'),
          email: form.get('email'),
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Order not found');
      setResult(body.order);
    } catch (reason) {
      setResult(null);
      setError(reason.message);
    }
  };
  return (
    <main className="simple-page">
      <div>
        <p className="eyebrow">SECURE ORDER LOOKUP</p>
        <h1>
          Find your
          <br />
          downloads.
        </h1>
        <p>Enter the email and order number from your receipt.</p>
        <form onSubmit={submit}>
          <label>
            Order number
            <input name="orderId" required placeholder="OG-260906-A8K2" />
          </label>
          <label>
            Email address
            <input
              name="email"
              required
              type="email"
              placeholder="you@studio.com"
            />
          </label>
          <button className="add-large">
            Find order <ArrowRight />
          </button>
        </form>
        {error && <p role="alert">{error}</p>}
        {result && (
          <div className="lookup-result">
            <PackageSearch />
            <div>
              <b>Order found</b>
              <p>
                {result.state} · {(result.total_minor / 100).toFixed(2)}{' '}
                {result.currency}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
