import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
    title: 'Lacak Pesanan',
    description:
        'Cek status pesanan top up game kamu di Grimoire Coins. Masukkan nomor invoice untuk melihat progres pembayaran dan pengiriman item.',
    path: '/track',
    keywords: ['cek pesanan', 'lacak invoice', 'status top up', 'grimoire coins track'],
});

export default function TrackLayout({ children }: { children: React.ReactNode }) {
    return children;
}
