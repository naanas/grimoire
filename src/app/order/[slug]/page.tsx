import OrderForm from './OrderForm';

export default async function OrderPage({ params }: { params: Promise<{ slug: string }> }) {
    // Await params for Next.js 15+
    const { slug } = await params;

    // Map slug to readable name
    const gameNames: Record<string, string> = {
        'mobile-legends': 'Mobile Legends',
        'free-fire': 'Free Fire',
        'pubg-mobile': 'PUBG Mobile',
        'genshin-impact': 'Genshin Impact',
    };

    const gameName = gameNames[slug] || slug;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-black mb-8 text-[var(--hell-fire)] uppercase border-b border-[var(--dark-blood)] pb-4">
                Topup <span className="text-white">{gameName}</span>
            </h1>

            <div className="bg-[#111] border border-[#222] rounded-xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--blood-red)]/20 blur-3xl rounded-full pointer-events-none"></div>
                <OrderForm gameSlug={slug} />
            </div>
        </div>
    );
}
