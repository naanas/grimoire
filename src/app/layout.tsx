import type { Metadata, Viewport } from 'next';
import { Inter, Cinzel } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundEffects from '@/components/BackgroundEffects';
import ChatWidget from '@/components/ChatWidget';
import LayoutWrapper from '@/components/LayoutWrapper';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Grimoire Coins - Top Up Game Murah, Cepat & Aman',
    template: '%s | Grimoire Coins'
  },
  description: 'Top up game termurah dan tercepat! Mobile Legends, Free Fire, PUBG Mobile, Genshin Impact, dan game populer lainnya. Proses otomatis 24/7, pembayaran mudah, dan customer service responsif.',
  keywords: [
    'top up game',
    'top up game murah',
    'diamond ml',
    'diamond mobile legends',
    'uc pubg',
    'dm ff',
    'top up ff',
    'voucher game',
    'joki game',
    'topup game indonesia',
    'grimoire coins',
    'beli diamond',
    'top up cepat',
    'top up otomatis'
  ],
  authors: [{ name: 'Grimoire Coins' }],
  creator: 'Grimoire Coins',
  publisher: 'Grimoire Coins',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: '/',
    siteName: 'Grimoire Coins',
    title: 'Grimoire Coins - Top Up Game Murah, Cepat & Aman',
    description: 'Top up game termurah dan tercepat! Mobile Legends, Free Fire, PUBG Mobile, Genshin Impact, dan game populer lainnya.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Grimoire Coins Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grimoire Coins - Top Up Game Murah, Cepat & Aman',
    description: 'Top up game termurah dan tercepat! Mobile Legends, Free Fire, PUBG Mobile, Genshin Impact, dan game populer lainnya.',
    images: ['/logo.png'],
    creator: '@grimoirecoins',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here after registering with search engines
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${cinzel.variable} bg-[var(--background)] text-white min-h-screen selection:bg-[var(--blood-red)] selection:text-white antialiased`} suppressHydrationWarning>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
