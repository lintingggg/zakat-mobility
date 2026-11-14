import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zakat Mobility - From Productive Zakat to Economic Mobility',
  description: 'Platform Penyaluran Zakat Produktif dengan Pendekatan 6M (Mapping, Matching, Mentoring, Market, Monitoring, Moving Up).',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased bg-slate-950 text-slate-900 selection:bg-emerald-200">
        {children}
      </body>
    </html>
  );
}
