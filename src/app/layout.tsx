import type { Metadata } from 'next';
import { Inter, Cinzel } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundEffects from '@/components/BackgroundEffects';
import ChatWidget from '@/components/ChatWidget';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' });

export const metadata: Metadata = {
  title: 'Grimoire Coins | Premium Topup',
  description: 'Topup Game Murah & Estetik',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${cinzel.variable} bg-[var(--background)] text-white min-h-screen selection:bg-[var(--blood-red)] selection:text-white antialiased`} suppressHydrationWarning>
        <BackgroundEffects />
        <Navbar />
        <main className="relative z-10 flex flex-col flex-grow min-h-screen pt-20">
          {children}
        </main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
