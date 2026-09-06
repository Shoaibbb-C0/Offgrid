'use client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { products } from '../data/products';
const StoreContext = createContext(null);
export function StoreProvider({ children }) {
  const [cart, setCart] = useState([]);
  const restored = useRef(false);
  const [currency, setCurrency] = useState('USD');
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = JSON.parse(localStorage.getItem('offgrid-cart'));
        if (Array.isArray(saved)) setCart(saved);
      } catch {
      } finally {
        restored.current = true;
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (restored.current)
      localStorage.setItem('offgrid-cart', JSON.stringify(cart));
  }, [cart]);
  const add = (id, license = 'Personal') => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    setCart((current) => {
      const found = current.find(
        (item) => item.id === id && item.license === license,
      );
      return found
        ? current.map((item) =>
            item === found
              ? { ...item, qty: Math.min(item.qty + 1, product.stock) }
              : item,
          )
        : [...current, { id, license, qty: 1 }];
    });
    setCartOpen(true);
  };
  const remove = (id, license) =>
    setCart((current) =>
      current.filter((item) => !(item.id === id && item.license === license)),
    );
  const update = (id, license, qty) =>
    setCart((current) =>
      current.map((item) =>
        item.id === id && item.license === license
          ? { ...item, qty: Math.max(1, qty) }
          : item,
      ),
    );
  const toggleWish = (id) =>
    setWishlist((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  const detailed = cart.map((item) => ({
    ...item,
    product: products.find((product) => product.id === item.id),
    unitPrice:
      (products.find((product) => product.id === item.id)?.price || 0) *
      (item.license === 'Commercial' ? 2 : 1),
  }));
  const total = detailed.reduce(
    (sum, item) => sum + item.unitPrice * item.qty,
    0,
  );
  return (
    <StoreContext.Provider
      value={{
        cart,
        detailed,
        total,
        currency,
        setCurrency,
        cartOpen,
        setCartOpen,
        add,
        remove,
        update,
        wishlist,
        toggleWish,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
export const useStore = () => useContext(StoreContext);
export const money = (usd, currency) =>
  currency === 'INR'
    ? `₹${Math.round(usd * 84).toLocaleString('en-IN')}`
    : `$${usd.toFixed(0)}`;
