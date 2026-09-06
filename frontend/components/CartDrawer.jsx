'use client';
import { ArrowRight, Minus, Plus, Trash2, X } from 'lucide-react';
import { money, useStore } from '../context/StoreContext';
export default function CartDrawer() {
  const { cartOpen, setCartOpen, detailed, total, currency, remove, update } =
    useStore();
  return (
    <>
      {cartOpen && (
        <button
          className="drawer-backdrop"
          aria-label="Close cart"
          onClick={() => setCartOpen(false)}
        />
      )}
      <aside
        className={`cart-drawer ${cartOpen ? 'open' : ''}`}
        aria-hidden={!cartOpen}
        aria-label="Shopping cart"
      >
        <header>
          <div>
            <span>YOUR CART</span>
            <h2>
              {detailed.length
                ? `${detailed.length} good choice${detailed.length > 1 ? 's' : ''}`
                : 'Still considering?'}
            </h2>
          </div>
          <button onClick={() => setCartOpen(false)} aria-label="Close">
            <X />
          </button>
        </header>
        <div className="cart-lines">
          {detailed.length === 0 ? (
            <div className="empty-cart">
              <p>Your next shortcut is waiting.</p>
              <a href="/#shop" onClick={() => setCartOpen(false)}>
                Explore all assets <ArrowRight />
              </a>
            </div>
          ) : (
            detailed.map((x) => (
              <div className="cart-line" key={`${x.id}-${x.license}`}>
                <div
                  className="cart-thumb"
                  style={{ background: x.product.accent }}
                >
                  OG
                </div>
                <div>
                  <h3>{x.product.name}</h3>
                  <p>{x.license} license</p>
                  <div className="qty">
                    <button onClick={() => update(x.id, x.license, x.qty - 1)}>
                      <Minus />
                    </button>
                    <span>{x.qty}</span>
                    <button onClick={() => update(x.id, x.license, x.qty + 1)}>
                      <Plus />
                    </button>
                  </div>
                </div>
                <div>
                  <strong>{money(x.unitPrice * x.qty, currency)}</strong>
                  <button
                    className="remove"
                    onClick={() => remove(x.id, x.license)}
                    aria-label="Remove"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {detailed.length > 0 && (
          <footer>
            <div>
              <span>Subtotal</span>
              <strong>{money(total, currency)}</strong>
            </div>
            <p>Taxes calculated at checkout. Instant digital delivery.</p>
            <a className="checkout-button" href="/checkout">
              Secure checkout <ArrowRight />
            </a>
          </footer>
        )}
      </aside>
    </>
  );
}
