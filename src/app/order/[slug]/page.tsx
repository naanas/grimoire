import OrderForm from './OrderForm';
import ReviewStats from '@/components/reviews/ReviewStats';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';
import { Metadata } from 'next';

// Format slug to readable game name
function formatGameName(slug: string): string {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .replace(/ [A-Z]$/, '');
}

// Game-specific SEO keywords map
const gameKeywords: Record<string, string[]> = {
    'mobile-legends': ['diamond ml', 'topup mobile legends', 'beli diamond ml', 'top up ml murah', 'diamond mobile legends murah'],
    'free-fire': ['dm ff', 'diamond free fire', 'topup ff murah', 'beli diamond ff', 'ff diamond murah'],
    'pubg-mobile': ['uc pubg', 'topup pubg mobile', 'beli uc pubg', 'unknown cash pubg murah'],
    'genshin-impact': ['genesis crystal genshin', 'topup genshin', 'primogem genshin'],
    'honkai-star-rail': ['stellar jade', 'topup honkai star rail', 'oneiric shard'],
    'valorant': ['vp valorant', 'topup valorant', 'valorant points murah'],
};

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const gameName = formatGameName(slug);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://grimoirecoins.store';

    const baseSlug = Object.keys(gameKeywords).find(k => slug.startsWith(k)) || '';
    const specificKeywords = gameKeywords[baseSlug] || [];

    const title = `Top Up ${gameName} Murah & Cepat | Grimoire Coins`;
    const description = `Top up ${gameName} murah, aman, dan instan di Grimoire Coins! Harga terbaik, proses otomatis 24/7, bayar pakai transfer bank, QRIS, e-wallet.`;

    return {
        title,
        description,
        keywords: [
            `topup ${gameName.toLowerCase()}`,
            `top up ${gameName.toLowerCase()} murah`,
            `beli ${gameName.toLowerCase()}`,
            `${gameName.toLowerCase()} murah`,
            ...specificKeywords,
            'topup game murah',
            'top up game indonesia',
            'grimoire coins',
        ],
        openGraph: {
            title,
            description,
            url: `${baseUrl}/order/${slug}`,
            siteName: 'Grimoire Coins',
            type: 'website',
            locale: 'id_ID',
        },
        alternates: { canonical: `${baseUrl}/order/${slug}` },
    };
}

export default async function OrderPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const gameName = formatGameName(slug);

    return (
        <div className="min-h-screen">
            {/* ─── GAME HERO HEADER ─────────────────────────────────────────────── */}
            <div className="relative w-full overflow-hidden" style={{ paddingTop: '72px' }}>
                {/* Dark gradient base */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a0404] to-[#0a0a0a]" />

                {/* Faint grid pattern */}
                <div className="absolute inset-0 bg-grid-pattern opacity-20" />

                {/* Side blood glow accents */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[var(--blood-red)] to-transparent opacity-60" />
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[var(--blood-red)] to-transparent opacity-60" />

                {/* Content */}
                <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 pt-4 pb-8 md:py-10">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-stone-600 mb-6 font-mono">
                        <span>Grimoire</span>
                        <span className="text-[var(--blood-red)]">▸</span>
                        <span>Top Up</span>
                        <span className="text-[var(--blood-red)]">▸</span>
                        <span className="text-stone-400">{gameName}</span>
                    </div>

                    {/* Main title */}
                    <div className="flex items-start gap-4">
                        {/* Vertical accent bar */}
                        <div className="hidden md:block w-1 self-stretch bg-gradient-to-b from-[var(--blood-red)] via-[var(--blood-red)]/50 to-transparent rounded-full shrink-0" />

                        <div>
                            <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-[var(--blood-red)] mb-2 flex items-center gap-2">
                                <span className="inline-block w-4 h-[1px] bg-[var(--blood-red)]" />
                                Ritual Purchase
                            </p>
                            <h1 className="text-3xl md:text-5xl font-black uppercase leading-tight">
                                <span className="text-stone-500 text-xl md:text-2xl block font-bold tracking-widest mb-1">Top Up</span>
                                <span className="glitch-text font-[family-name:var(--font-cinzel)] tracking-wider text-white" data-text={gameName}>{gameName}</span>
                            </h1>
                            <div className="flex items-center gap-4 mt-4">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[10px] text-green-500 font-mono uppercase tracking-widest">Proses Instan</span>
                                </div>
                                <div className="h-3 w-[1px] bg-stone-800" />
                                <span className="text-[10px] text-stone-600 font-mono uppercase tracking-widest">24/7 Active</span>
                                <div className="h-3 w-[1px] bg-stone-800" />
                                <span className="text-[10px] text-stone-600 font-mono uppercase tracking-widest">ᛟ Secured</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom fade */}
                <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
            </div>

            {/* ─── ORDER FORM ───────────────────────────────────────────────────── */}
            <div className="max-w-4xl mx-auto px-4 md:px-8 pb-8 space-y-16">
                <div className="page-enter">
                    <OrderForm gameSlug={slug} />
                </div>

                {/* ─── REVIEWS ──────────────────────────────────────────────────── */}
                <div className="space-y-8 pt-8 border-t border-stone-900">
                    {/* Reviews header */}
                    <div className="flex items-center gap-3">
                        <span className="text-[var(--blood-red)] font-mono">ᚷ</span>
                        <h2 className="text-xl font-black text-white uppercase tracking-wider font-[family-name:var(--font-cinzel)]">
                            Testimonies
                        </h2>
                        <div className="flex-1 h-[1px] bg-gradient-to-r from-[var(--blood-red)]/40 to-transparent" />
                    </div>

                    <ReviewStats categorySlug={slug} />
                    <ReviewForm categorySlug={slug} />

                    <div>
                        <h3 className="text-sm font-black text-stone-500 uppercase tracking-widest mb-4 font-mono">All Reviews</h3>
                        <ReviewList categorySlug={slug} />
                    </div>
                </div>
            </div>
        </div>
    );
}
