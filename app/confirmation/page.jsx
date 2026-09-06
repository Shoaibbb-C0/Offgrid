import { Check, Download, Mail } from 'lucide-react';
export default function Confirmation() {
  return (
    <main className="status-page">
      <div className="status-icon">
        <Check />
      </div>
      <p className="eyebrow">ORDER CONFIRMED</p>
      <h1>
        Your toolkit
        <br />
        is ready.
      </h1>
      <p>
        Order <b>OG-260906-A8K2</b> is paid. Download links were sent to your
        email and remain available below.
      </p>
      <div className="download-card">
        <span>OG</span>
        <div>
          <b>Nexus UI System</b>
          <small>Personal license · v4.2</small>
        </div>
        <button>
          <Download /> Download
        </button>
      </div>
      <div className="status-actions">
        <a href="/">
          <span>Continue exploring</span>
        </a>
        <a href="/order-lookup">
          <Mail /> Look up an order
        </a>
      </div>
    </main>
  );
}
