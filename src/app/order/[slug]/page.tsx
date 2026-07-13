import OrderForm from './OrderForm';
import ReviewStats from '@/components/reviews/ReviewStats';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';
import GameStructuredData from '@/components/GameStructuredData';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { buildPageMetadata, getGameKeywords, SITE_NAME } from '@/lib/seo';

function formatGameName(slug: string): string {
    return slug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .replace(/ [A-Z]$/, '');
}

async function fetchCategory(slug: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    try {
        const res = await fetch(`${apiUrl}/categories/${slug}`, {
            next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.success ? data.data : null;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const category = await fetchCategory(slug);
    const gameName = category?.name || formatGameName(slug);
    const title = `Top Up ${gameName} Murah & Instan`;
    const description = `Top up ${gameName} termurah di ${SITE_NAME}! Proses otomatis 24 jam, aman & terpercaya. Bayar QRIS, transfer bank, GoPay, OVO, Dana. Diamond & item langsung masuk.`;

    return buildPageMetadata({
        title,
        description,
        path: `/order/${slug}`,
        keywords: getGameKeywords(slug, gameName),
    });
}

export default async function OrderPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const category = await fetchCategory(slug);
    const gameName = category?.name || formatGameName(slug);
    const seoDescription = `Top up ${gameName} murah dan instan di ${SITE_NAME}. Pilih nominal diamond/item, bayar via QRIS atau e-wallet, proses otomatis 24 jam.`;

    return (
        <div className="min-h-screen">
            <GameStructuredData
                slug={slug}
                gameName={gameName}
                description={seoDescription}
                image={category?.image}
            />

            <div className="relative w-full overflow-hidden" style={{ paddingTop: '10px' }}>
                <div className="max-w-4xl mx-auto px-4 md:px-8 pt-4 pb-8 md:py-10">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-stone-600 hover:text-[#00f5ff] transition-colors text-[10px] uppercase tracking-widest font-mono mb-4"
                    >
                        <ArrowLeft size={14} />
                        Kembali ke Beranda
                    </Link>

                    <nav
                        aria-label="Breadcrumb"
                        className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-stone-600 mb-6 font-mono"
                    >
                        <Link href="/" className="hover:text-stone-400 transition-colors">
                            {SITE_NAME}
                        </Link>
                        <span className="text-(--blood-red)">▸</span>
                        <Link href="/games" className="hover:text-stone-400 transition-colors">
                            Top Up
                        </Link>
                        <span className="text-(--blood-red)">▸</span>
                        <span className="text-stone-400">{gameName}</span>
                    </nav>

                    <div className="flex items-start gap-4">
                        <div className="hidden md:block w-1 self-stretch bg-linear-to-b from-(--blood-red) via-(--blood-red)/50 to-transparent rounded-full shrink-0" />

                        <div>
                            <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-(--blood-red) mb-2 flex items-center gap-2">
                                <span className="inline-block w-4 h-px bg-(--blood-red)" />
                                Top Up Game Indonesia
                            </p>
                            <h1 className="text-3xl md:text-5xl font-black uppercase leading-tight">
                                <span className="text-stone-500 text-xl md:text-2xl block font-bold tracking-widest mb-1">
                                    Top Up
                                </span>
                                <span
                                    className="glitch-text font-(family-name:--font-cinzel) tracking-wider text-white"
                                    data-text={gameName}
                                >
                                    {gameName}
                                </span>
                            </h1>
                            <p className="mt-4 text-sm text-stone-400 max-w-2xl leading-relaxed">
                                Beli diamond, UC, VP, dan item {gameName} dengan harga termurah. Proses
                                otomatis 24 jam di {SITE_NAME} — aman, cepat, dan mudah.
                            </p>
                            <div className="flex items-center gap-4 mt-5 bg-black/50 w-fit px-4 py-2 rounded-sm border border-white/10 backdrop-blur-md">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                                    <span className="text-[10px] text-green-400 font-mono uppercase tracking-widest font-bold">
                                        Proses Instan
                                    </span>
                                </div>
                                <div className="h-3 w-px bg-stone-600" />
                                <span className="text-[10px] text-stone-300 font-mono uppercase tracking-widest font-bold">
                                    24/7 Active
                                </span>
                                <div className="h-3 w-px bg-stone-600" />
                                <span className="text-[10px] text-stone-300 font-mono uppercase tracking-widest font-bold">
                                    ᛟ Secured
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-8 pb-8 space-y-16">
                <div className="page-enter">
                    <OrderForm gameSlug={slug} />
                </div>

                <section className="glass-panel rounded-2xl p-6 md:p-8 border border-white/5">
                    <h2 className="text-lg font-black text-white uppercase tracking-wider font-(family-name:--font-cinzel) mb-4">
                        Kenapa Top Up {gameName} di {SITE_NAME}?
                    </h2>
                    <div className="text-sm text-stone-400 leading-relaxed space-y-3">
                        <p>
                            {SITE_NAME} menyediakan layanan top up {gameName} dengan sistem otomatis yang
                            berjalan 24 jam. Setelah pembayaran berhasil, pesanan diproses langsung tanpa
                            menunggu admin online.
                        </p>
                        <p>
                            Kami mendukung berbagai metode pembayaran populer di Indonesia: QRIS, virtual
                            account bank, Alfamart/Indomaret, GoPay, OVO, Dana, dan ShopeePay. Cocok untuk
                            pemain yang ingin top up cepat, murah, dan aman.
                        </p>
                    </div>
                </section>

                <div className="space-y-8 pt-8 border-t border-stone-900">
                    <div className="flex items-center gap-3">
                        <span className="text-(--blood-red) font-mono">ᚷ</span>
                        <h2 className="text-xl font-black text-white uppercase tracking-wider font-(family-name:--font-cinzel)">
                            Testimonies
                        </h2>
                        <div className="flex-1 h-px bg-linear-to-r from-(--blood-red)/40 to-transparent" />
                    </div>

                    <ReviewStats categorySlug={slug} />
                    <ReviewForm categorySlug={slug} />

                    <div>
                        <h3 className="text-sm font-black text-stone-500 uppercase tracking-widest mb-4 font-mono">
                            All Reviews
                        </h3>
                        <ReviewList categorySlug={slug} />
                    </div>
                </div>
            </div>
        </div>
    );
}
