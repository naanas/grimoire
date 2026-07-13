import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
    title: 'Status Pesanan',
    description: 'Halaman status transaksi Grimoire Coins.',
    path: '/order/status',
    noIndex: true,
});

export default function OrderStatusLayout({ children }: { children: React.ReactNode }) {
    return children;
}
