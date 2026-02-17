import OrderForm from './OrderForm';
import ReviewStats from '@/components/reviews/ReviewStats';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';

export default async function OrderPage({ params }: { params: Promise<{ slug: string }> }) {
    // Await params for Next.js 15+
    const { slug } = await params;

    // Format slug to readable name (e.g. mobile-legends-b -> Mobile Legends B)
    const gameName = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

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

                {/* Rating Stats */}
                <ReviewStats categorySlug={slug} />

                {/* Review Form */}
                <ReviewForm categorySlug={slug} />

                {/* Reviews List */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">All Reviews</h3>
                    <ReviewList categorySlug={slug} />
                </div>
            </div>
        </div>
    );
}
