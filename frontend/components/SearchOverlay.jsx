'use client';
import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { products } from '../data/products';
export default function SearchOverlay({ open, onClose }) {
  const [q, setQ] = useState('');
  useEffect(() => {
    if (open)
      setTimeout(() => document.querySelector('#global-search')?.focus(), 80);
  }, [open]);
  if (!open) return null;
  const results = products
    .filter((p) =>
      (p.name + p.category + p.description)
        .toLowerCase()
        .includes(q.toLowerCase()),
    )
    .slice(0, 6);
  return (
    <div className="search-overlay">
      <header>
        <Search />
        <input
          id="global-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search systems, kits, icons…"
        />
        <button onClick={onClose}>
          <X />
        </button>
      </header>
      <div className="search-results">
        <p>{q ? `${results.length} results` : 'POPULAR NOW'}</p>
        {results.map((p) => (
          <a href={`/product/${p.slug}`} key={p.id}>
            <span style={{ background: p.accent }}>OG</span>
            <div>
              <b>{p.name}</b>
              <small>{p.category}</small>
            </div>
            <strong>${p.price}</strong>
          </a>
        ))}
      </div>
    </div>
  );
}
