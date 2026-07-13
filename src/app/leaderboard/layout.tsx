import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
    title: 'Leaderboard',
    description:
        'Lihat peringkat pemain teratas di Grimoire Coins. Kompetisi top-up dan aktivitas komunitas gamer Indonesia.',
    path: '/leaderboard',
    keywords: ['leaderboard grimoire coins', 'peringkat top up game'],
});

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
    return children;
}
