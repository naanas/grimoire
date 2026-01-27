import OrderForm from './OrderForm';

export default async function OrderPage({ params }: { params: Promise<{ slug: string }> }) {
    // Await params for Next.js 15+
    const { slug } = await params;

    // Format slug to readable name (e.g. mobile-legends-b -> Mobile Legends B)
    const gameName = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-3xl font-black mb-8 text-[var(--hell-fire)] uppercase border-b border-[var(--dark-blood)] pb-4">
                Topup <span className="text-white">{gameName}</span>
            </h1>

            <OrderForm gameSlug={slug} />
        </div>
    );
}
