import type { Metadata, Viewport } from 'next';
import { Inter, Cinzel } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundEffects from '@/components/BackgroundEffects';
import ChatWidget from '@/components/ChatWidget';
import LayoutWrapper from '@/components/LayoutWrapper';
import StructuredData from '@/components/StructuredData';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#07050d',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Grimoire Coins - Top Up Game Murah, Cepat & Aman',
    template: '%s | Grimoire Coins'
  },
  description: 'Top up game murah, aman, dan instan! Mobile Legends diamond, Free Fire diamond, UC PUBG, Genshin Genesis Crystal, Valorant Points, dan 100+ game lainnya. Proses otomatis 24/7, harga termurah, garansi keamanan. Bayar via transfer bank, QRIS, GoPay, OVO, Dana.',
  keywords: [
    // Primary
    'top up game',
    'topup game',
    'top up game murah',
    'topup game murah',
    'top up game indonesia',
    // Mobile Legends
    'diamond ml',
    'diamond mobile legends',
    'top up mobile legends',
    'topup ml murah',
    'beli diamond ml murah',
    // Free Fire
    'dm ff',
    'diamond free fire',
    'top up ff',
    'topup ff murah',
    'beli diamond ff',
    // PUBG
    'uc pubg',
    'top up pubg mobile',
    'beli uc pubg murah',
    // Others
    'top up genshin impact',
    'genesis crystal genshin',
    'valorant points murah',
    'top up honkai star rail',
    'top up call of duty mobile',
    // Brand
    'grimoire coins',
    'top up otomatis',
    'top up 24 jam',
    'voucher game murah',
    'jual diamond game',
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
      <body className={`${inter.variable} ${cinzel.variable} bg-(--background) text-white min-h-screen selection:bg-(--blood-red) selection:text-white antialiased`} suppressHydrationWarning>
        <StructuredData />
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}

