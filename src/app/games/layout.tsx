import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
    title: 'Semua Game Top Up',
    description:
        'Katalog lengkap game untuk top-up di Grimoire Coins. Mobile Legends, Free Fire, PUBG Mobile, Genshin Impact, Valorant & 100+ game dengan harga termurah.',
    path: '/games',
    keywords: [
        'daftar game top up',
        'katalog game',
        'semua game',
        'mobile legends',
        'free fire',
        'pubg mobile',
        'genshin impact',
        'top up game murah',
    ],
});

export default function GamesLayout({ children }: { children: React.ReactNode }) {
    return children;
}
