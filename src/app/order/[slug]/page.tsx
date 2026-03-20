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
        .replace(/ [A-Z]$/, ''); // Remove trailing variation letters like "A", "B"
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
    const description = `Top up ${gameName} murah, aman, dan instan di Grimoire Coins! Harga terbaik, proses otomatis 24/7, bayar pakai transfer bank, QRIS, e-wallet. Dapatkan ${gameName} dengan harga termurah sekarang!`;

    return {
        title,
        description,
        keywords: [
            `topup ${gameName.toLowerCase()}`,
            `top up ${gameName.toLowerCase()} murah`,
            `beli ${gameName.toLowerCase()}`,
            `${gameName.toLowerCase()} murah`,
            `top up ${gameName.toLowerCase()} termurah`,
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
        alternates: {
            canonical: `${baseUrl}/order/${slug}`,
        },
    };
}

export default async function OrderPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const gameName = formatGameName(slug);

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Order Section */}
            <div>
                <h1 className="text-3xl font-black mb-8 text-[var(--hell-fire)] uppercase border-b border-[var(--dark-blood)] pb-4">
                    Topup <span className="text-white">{gameName}</span>
                </h1>
                <OrderForm gameSlug={slug} />
            </div>

            {/* Reviews Section */}
            <div className="space-y-8 pt-8 border-t border-neutral-800">
                <h2 className="text-2xl font-black text-white uppercase">User Reviews</h2>
                <ReviewStats categorySlug={slug} />
                <ReviewForm categorySlug={slug} />
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">All Reviews</h3>
                    <ReviewList categorySlug={slug} />
                </div>
            </div>
        </div>
    );
}
