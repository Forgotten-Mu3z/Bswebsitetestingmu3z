import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { CommerceProvider } from '@/components/store/commerce-provider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    'https://blackshark-gaming-oman.xxgunone11.chatgpt.site',
  ),
  title: 'BLACKSHARK | Gaming PCs, Components & Gear in Oman',
  description:
    'Shop BLACKSHARK gaming PCs, PC components, consoles, monitors, and gaming gear priced in Omani rials.',
  icons: { icon: '/favicon.svg' },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    title: 'BLACKSHARK Gaming Oman',
    description:
      'Gaming PCs, PC components, consoles, monitors, and gaming gear.',
    siteName: 'BLACKSHARK',
  },
};

export const viewport: Viewport = {
  themeColor: '#03060c',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CommerceProvider>{children}</CommerceProvider>
      </body>
    </html>
  );
}
