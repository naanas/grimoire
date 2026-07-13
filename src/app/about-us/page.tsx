import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
    title: 'Tentang Kami',
    description:
        'Grimoire Coins adalah platform top-up game terpercaya di Indonesia. Proses instan 24 jam, aman, dan resmi untuk Mobile Legends, Free Fire, PUBG Mobile, dan game populer lainnya.',
    path: '/about-us',
    keywords: ['tentang grimoire coins', 'platform top up game indonesia'],
});

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-300 py-20 px-4 md:px-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4 border-b border-gray-800 pb-8">
                    <h1 className="text-3xl md:text-5xl font-bold font-(family-name:--font-cinzel) text-(--blood-red) uppercase tracking-widest drop-shadow-[0_0_10px_rgba(187,10,30,0.4)]">
                        Tentang Kami
                    </h1>
                    <p className="text-sm text-gray-500 uppercase tracking-widest">
                        Grimoire Coins - Your Gateway to Premium Gaming
                    </p>
                </div>

                <div className="space-y-8 text-base md:text-lg leading-relaxed text-justify">
                    <p>
                        <span className="text-(--blood-red) font-bold">Grimoire Coins</span> didirikan dengan satu misi sederhana: memberikan pengalaman top-up game yang cepat, aman, dan tanpa kompromi. Kami memahami bahwa setiap detik dalam game sangat berharga, dan itulah mengapa kami membangun platform yang dirancang untuk kecepatan dan keandalan.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 text-center">
                        <div className="p-6 border border-gray-800 rounded bg-gray-900/50 hover:border-(--blood-red) transition-colors group">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">⚡</div>
                            <h3 className="text-white font-bold mb-2 uppercase tracking-wide">Instan</h3>
                            <p className="text-sm text-gray-400">Proses otomatis 24/7. Item langsung masuk ke akun Anda dalam hitungan detik setelah pembayaran.</p>
                        </div>
                        <div className="p-6 border border-gray-800 rounded bg-gray-900/50 hover:border-(--blood-red) transition-colors group">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🔒</div>
                            <h3 className="text-white font-bold mb-2 uppercase tracking-wide">Aman</h3>
                            <p className="text-sm text-gray-400">Transaksi dilindungi enkripsi tingkat tinggi dan gateway pembayaran resmi yang terpercaya.</p>
                        </div>
                        <div className="p-6 border border-gray-800 rounded bg-gray-900/50 hover:border-(--blood-red) transition-colors group">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">💎</div>
                            <h3 className="text-white font-bold mb-2 uppercase tracking-wide">Resmi</h3>
                            <p className="text-sm text-gray-400">Kami hanya menjual produk legal dan resmi. Akun game Anda dijamin aman dari banned.</p>
                        </div>
                    </div>

                    <p>
                        Berbasis di Jakarta, Indonesia, kami bangga dapat melayani ribuan gamers setiap harinya. Dukungan pelanggan kami siap membantu Anda jika terjadi kendala, memastikan pengalaman belanja yang tenang dan memuaskan.
                    </p>

                    <p>
                        Terima kasih telah mempercayakan kebutuhan gaming Anda kepada <span className="text-(--blood-red) font-bold">Grimoire Coins</span>.
                    </p>
                </div>

                <div className="pt-8 border-t border-gray-800 text-center">
                    <a href="/" className="text-(--blood-red) hover:text-white transition-colors text-xs uppercase tracking-widest font-bold">
                        &larr; Kembali ke Beranda
                    </a>
                </div>
            </div>
        </div>
    );
}
