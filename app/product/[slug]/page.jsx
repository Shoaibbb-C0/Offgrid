'use client';
import React, { use } from 'react';
import { Check, Download, ShieldCheck, Zap } from 'lucide-react';
import { products } from '../../../frontend/data/products';
import { money, useStore } from '../../../frontend/context/StoreContext';
export default function ProductPage({ params }) {
  const { slug } = use(params);
  const { add, currency } = useStore();
  const [license, setLicense] = React.useState('Personal');
  const product = products.find((p) => p.slug === slug) || products[0];
  const price = product.price * (license === 'Commercial' ? 2 : 1);
  return (
    <main className="product-page">
      <div className="pdp-gallery">
        <div className="pdp-art" style={{ '--accent': product.accent }}>
          <span>{product.category}</span>
          <strong>OG</strong>
          <div />
          <div />
        </div>
        <div className="pdp-detail-grid">
          <span>820+ components</span>
          <span>Auto layout</span>
          <span>Variables ready</span>
          <span>Dark mode</span>
        </div>
      </div>
      <section className="pdp-buy">
        <p className="eyebrow">OFFGRID / {product.category.toUpperCase()}</p>
        <h1>{product.name}</h1>
        <p className="pdp-description">
          {product.description} Designed to move from exploration to production
          without losing momentum.
        </p>
        <div className="license-group">
          <h2>Choose a license</h2>
          {['Personal', 'Commercial'].map((item) => (
            <button
              key={item}
              className={license === item ? 'selected' : ''}
              onClick={() => setLicense(item)}
            >
              <span>
                <b>{item}</b>
                <small>
                  {item === 'Personal'
                    ? 'One individual, unlimited personal projects'
                    : 'One team, unlimited commercial projects'}
                </small>
              </span>
              <strong>
                {money(
                  product.price * (item === 'Commercial' ? 2 : 1),
                  currency,
                )}
              </strong>
            </button>
          ))}
        </div>
        <button className="add-large" onClick={() => add(product.id, license)}>
          Add to cart — {money(price, currency)}
        </button>
        <div className="pdp-assurances">
          <span>
            <Download /> Instant download
          </span>
          <span>
            <Zap /> Lifetime updates
          </span>
          <span>
            <ShieldCheck /> Secure checkout
          </span>
        </div>
        <details>
          <summary>What’s included</summary>
          <ul>
            {product.formats.map((item) => (
              <li key={item}>
                <Check />
                {item}
              </li>
            ))}
          </ul>
        </details>
        <details>
          <summary>License details</summary>
          <p>
            You may use the asset in unlimited end products. Redistribution,
            sublicensing, and resale as a competing asset are prohibited.
          </p>
        </details>
      </section>
    </main>
  );
}
