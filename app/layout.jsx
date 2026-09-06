import { Space_Grotesk, Syne } from 'next/font/google';
import './globals.css';
import AppShell from '../frontend/components/AppShell';
const sans = Space_Grotesk({ variable: '--font-sans', subsets: ['latin'] });
const display = Syne({ variable: '--font-display', subsets: ['latin'] });
export const metadata = {
  title: 'Offgrid — Digital goods for people who ship',
  description:
    'Premium UI systems, icon libraries and production-ready code kits.',
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${display.variable}`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
