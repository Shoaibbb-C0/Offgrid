'use client';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import Logo from './Logo';
export default function Navbar({ onSearch }) {
  const [menu, setMenu] = useState(false);
  const { cart, setCartOpen, currency, setCurrency } = useStore();
  const count = cart.reduce((s, x) => s + x.qty, 0);
  return (
    <>
      <div className="announcement">
        INSTANT DELIVERY · SECURE CHECKOUT · 7-DAY RETURNS
      </div>
      <nav className="nav-shell">
        <button
          className="icon-button mobile-only"
          onClick={() => setMenu(!menu)}
          aria-label="Toggle menu"
        >
          {menu ? <X /> : <Menu />}
        </button>
        <Logo />
        <div className="nav-links">
          <a href="/#shop">Shop</a>
          <a href="/#collections">Collections</a>
          <a href="/#journal">Journal</a>
        </div>
        <div className="nav-actions">
          <select
            aria-label="Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option>USD</option>
            <option>INR</option>
          </select>
          <button aria-label="Search" onClick={onSearch}>
            <Search />
          </button>
          <a href="/#wishlist" aria-label="Wishlist">
            <Heart />
          </a>
          <button
            aria-label={`Cart with ${count} items`}
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag />
            <b>{count}</b>
          </button>
        </div>
      </nav>
      {menu && (
        <div className="mobile-menu">
          <a href="/#shop">Shop all</a>
          <a href="/#collections">Collections</a>
          <a href="/order-lookup">Order lookup</a>
          <a href="/policies">Shipping & returns</a>
          <a href="/admin">Admin demo</a>
        </div>
      )}
    </>
  );
}
