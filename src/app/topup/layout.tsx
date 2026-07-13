import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
    title: 'Top Up Saldo',
    description:
        'Isi saldo akun Grimoire Coins untuk checkout lebih cepat. Top up saldo wallet dengan QRIS, transfer bank, dan e-wallet.',
    path: '/topup',
    keywords: ['top up saldo', 'deposit grimoire coins', 'isi saldo game'],
});

export default function TopupLayout({ children }: { children: React.ReactNode }) {
    return children;
}
