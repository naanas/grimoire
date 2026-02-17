import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Ketentuan Layanan',
    description: 'Syarat dan ketentuan penggunaan platform Grimoire Coins untuk layanan top-up game online.',
};

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-300 py-20 px-4 md:px-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4 border-b border-gray-800 pb-8">
                    <h1 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-cinzel)] text-white uppercase tracking-widest text-[var(--blood-red)] drop-shadow-[0_0_10px_rgba(187,10,30,0.4)]">
                        Ketentuan Layanan
                    </h1>
                    <p className="text-sm text-gray-500 uppercase tracking-widest">
                        Terakhir Diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-6 text-sm md:text-base leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Ikhtisar</h2>
                        <p>
                            Situs web ini dioperasikan oleh Grimoire Coins. Di seluruh situs, istilah "kami", "kita" dan "milik kami" mengacu pada Grimoire Coins. Dengan mengunjungi situs kami dan/atau membeli sesuatu dari kami, Anda terlibat dalam "Layanan" kami dan setuju untuk terikat oleh syarat dan ketentuan berikut ("Ketentuan Layanan", "Ketentuan"), termasuk syarat dan ketentuan tambahan serta kebijakan yang dirujuk di sini dan/atau tersedia melalui hyperlink.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. Akurasi, Kelengkapan, dan Ketepatan Waktu Informasi</h2>
                        <p>
                            Kami tidak bertanggung jawab jika informasi yang tersedia di situs ini tidak akurat, lengkap, atau terkini. Materi di situs ini disediakan hanya untuk informasi umum dan tidak boleh diandalkan atau digunakan sebagai satu-satunya dasar untuk membuat keputusan.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. Modifikasi Layanan dan Harga</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Harga produk kami dapat berubah tanpa pemberitahuan.</li>
                            <li>Kami berhak setiap saat untuk mengubah atau menghentikan Layanan (atau bagian atau konten apa pun di dalamnya) tanpa pemberitahuan setiap saat.</li>
                            <li>Kami tidak akan bertanggung jawab kepada Anda atau pihak ketiga mana pun atas modifikasi, perubahan harga, penangguhan, atau penghentian Layanan.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. Produk atau Layanan</h2>
                        <p>
                            Produk atau layanan tertentu mungkin tersedia secara eksklusif online melalui situs web. Produk atau layanan ini mungkin memiliki jumlah terbatas dan hanya dapat dikembalikan atau ditukar sesuai dengan Kebijakan Pengembalian kami. Kami berhak, tetapi tidak berkewajiban, untuk membatasi penjualan produk atau Layanan kami kepada siapa pun, wilayah geografis, atau yurisdiksi mana pun.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">5. Akurasi Penagihan dan Informasi Akun</h2>
                        <p>
                            Kami berhak menolak pesanan apa pun yang Anda lakukan dengan kami. Kami dapat, atas kebijakan kami sendiri, membatasi atau membatalkan jumlah yang dibeli per orang, per rumah tangga, atau per pesanan. Anda setuju untuk memberikan informasi pembelian dan akun yang terkini, lengkap, dan akurat untuk semua pembelian yang dilakukan di toko kami.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">6. Pembayaran</h2>
                        <p>
                            Kami menggunakan <b>Tripay</b> sebagai penyedia layanan pembayaran pihak ketiga. Dengan melakukan transaksi, Anda setuju untuk tunduk pada Syarat dan Ketentuan yang berlaku di Tripay. Kami tidak menyimpan detail kartu kredit Anda secara langsung.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">7. Kesalahan, Ketidakakuratan, dan Kelalaian</h2>
                        <p>
                            Terkadang mungkin ada informasi di situs kami atau di Layanan yang berisi kesalahan ketik, ketidakakuratan, atau kelalaian yang mungkin terkait dengan deskripsi produk, harga, promosi, penawaran, biaya pengiriman produk, waktu transit, dan ketersediaan. Kami berhak untuk memperbaiki kesalahan, ketidakakuratan, atau kelalaian apa pun, dan untuk mengubah atau memperbarui informasi atau membatalkan pesanan jika informasi apa pun dalam Layanan atau di situs web terkait tidak akurat setiap saat tanpa pemberitahuan sebelumnya.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">8. Hukum yang Berlaku</h2>
                        <p>
                            Ketentuan Layanan ini dan perjanjian terpisah apa pun di mana kami memberikan Layanan kepada Anda akan diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia.
                        </p>
                    </section>
                </div>

                {/* Footer Link */}
                <div className="pt-8 border-t border-gray-800 text-center">
                    <a href="/" className="text-[var(--blood-red)] hover:text-white transition-colors text-xs uppercase tracking-widest font-bold">
                        &larr; Kembali ke Beranda
                    </a>
                </div>
            </div>
        </div>
    );
}
