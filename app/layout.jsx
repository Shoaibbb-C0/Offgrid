import './globals.css';
import AppShell from '../frontend/components/AppShell';
export const metadata = {
  title: 'Offgrid — Digital goods for people who ship',
  description:
    'Premium UI systems, icon libraries and production-ready code kits.',
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
