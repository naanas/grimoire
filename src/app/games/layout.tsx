import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Semua Game - Grimoire Coins',
    description: 'Jelajahi semua game yang tersedia untuk top-up di Grimoire Coins. Mobile Legends, Free Fire, PUBG Mobile, Genshin Impact, Valorant, dan banyak game populer lainnya dengan harga terbaik.',
    keywords: [
        'daftar game',
        'semua game',
        'katalog game',
        'mobile legends',
        'free fire',
        'pubg mobile',
        'genshin impact',
        'top up mobile legends',
        'top up free fire',
        'game online indonesia'
    ],
    openGraph: {
        title: 'Semua Game - Grimoire Coins',
        description: 'Jelajahi semua game yang tersedia untuk top-up dengan harga terbaik.',
    },
};

export default function GamesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
