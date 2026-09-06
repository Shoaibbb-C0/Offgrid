'use client';
import { useState } from 'react';
import { StoreProvider } from '../context/StoreContext';
import Navbar from './Navbar';
import CartDrawer from './CartDrawer';
import SearchOverlay from './SearchOverlay';
import SiteFooter from './SiteFooter';
export default function AppShell({ children }) {
  const [search, setSearch] = useState(false);
  return (
    <StoreProvider>
      <Navbar onSearch={() => setSearch(true)} />
      {children}
      <SiteFooter />
      <CartDrawer />
      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </StoreProvider>
  );
}
