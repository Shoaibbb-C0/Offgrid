'use client';
import { ArrowUpRight, Heart, Plus } from 'lucide-react';
import { money, useStore } from '../context/StoreContext';
export default function ProductCard({ product, index = 0 }) {
  const { add, currency, wishlist, toggleWish } = useStore();
  return (
    <article
      className="product-card"
      style={{ '--accent': product.accent, '--delay': `${index * 55}ms` }}
    >
      <a href={`/product/${product.slug}`} className="product-visual">
        <span className="index">{String(index + 1).padStart(2, '0')}</span>
        {product.badge && <span className="badge">{product.badge}</span>}
        <div className="visual-object">
          <div />
          <div />
          <div />
          <strong>OG</strong>
        </div>
        <span className="view-label">
          View product <ArrowUpRight />
        </span>
      </a>
      <button
        className="wish"
        aria-label="Toggle wishlist"
        aria-pressed={wishlist.includes(product.id)}
        onClick={() => toggleWish(product.id)}
      >
        <Heart fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
      </button>
      <button
        className="quick-add"
        aria-label={`Quick add ${product.name}`}
        onClick={() => add(product.id)}
      >
        <Plus />
      </button>
      <div className="product-meta">
        <p>{product.category}</p>
        <h3>
          <a href={`/product/${product.slug}`}>{product.name}</a>
        </h3>
        <div>
          <span>Personal / Commercial</span>
          <strong>From {money(product.price, currency)}</strong>
        </div>
      </div>
    </article>
  );
}
