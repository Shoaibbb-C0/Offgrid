import {
  ArrowUpRight,
  Box,
  Download,
  PackageCheck,
  ReceiptText,
} from 'lucide-react';
const orders = [
  ['OG-260906-A8K2', 'S. Khan', 'Nexus UI System', '$89', 'Paid'],
  ['OG-260905-D2M4', 'A. Lee', 'Founder Stack Bundle', '$149', 'Paid'],
  ['OG-260904-Q7R1', 'M. Tan', 'Orbit Icon Library', '$49', 'Pending'],
];
export default function Admin() {
  return (
    <main className="admin-page">
      <header>
        <div>
          <p className="eyebrow">ADMIN / DEMO</p>
          <h1>Good morning.</h1>
        </div>
        <button>
          Export orders <Download />
        </button>
      </header>
      <section className="admin-stats">
        <article>
          <span>
            <ReceiptText />
          </span>
          <p>Revenue</p>
          <strong>$12,480</strong>
          <small>↑ 18.4% this month</small>
        </article>
        <article>
          <span>
            <PackageCheck />
          </span>
          <p>Paid orders</p>
          <strong>146</strong>
          <small>100% fulfilled</small>
        </article>
        <article>
          <span>
            <Box />
          </span>
          <p>Licenses left</p>
          <strong>184</strong>
          <small>Across 16 products</small>
        </article>
      </section>
      <section className="admin-table">
        <div>
          <h2>Recent orders</h2>
          <button>
            View all <ArrowUpRight />
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o[0]}>
                {o.map((x, i) => (
                  <td key={x}>
                    {i === 4 ? <span className={x.toLowerCase()}>{x}</span> : x}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
