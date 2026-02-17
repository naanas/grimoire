import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Kebijakan Privasi',
    description: 'Kebijakan privasi Grimoire Coins menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.',
};

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-300 py-20 px-4 md:px-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4 border-b border-gray-800 pb-8">
                    <h1 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-cinzel)] text-white uppercase tracking-widest text-[var(--blood-red)] drop-shadow-[0_0_10px_rgba(187,10,30,0.4)]">
                        Kebijakan Privasi
                    </h1>
                    <p className="text-sm text-gray-500 uppercase tracking-widest">
                        Terakhir Diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-6 text-sm md:text-base leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Pendahuluan</h2>
                        <p>
                            Selamat datang di Grimoire Coins ("kami", "kita", atau "milik kami"). Kami menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan membagikan informasi pribadi Anda saat Anda mengunjungi atau melakukan pembelian dari situs web kami.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. Informasi yang Kami Kumpulkan</h2>
                        <p>
                            Saat Anda mengunjungi Situs, kami secara otomatis mengumpulkan informasi tertentu tentang perangkat Anda, termasuk informasi tentang browser web Anda, alamat IP, zona waktu, dan beberapa cookie yang diinstal pada perangkat Anda. Selain itu, saat Anda melakukan pembelian atau mencoba melakukan pembelian melalui Situs, kami mengumpulkan informasi tertentu dari Anda, termasuk nama, nomor WhatsApp (untuk konfirmasi pesanan), dan informasi pembayaran (seperti metode pembayaran yang dipilih).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. Penggunaan Informasi</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Memproses pesanan dan pembayaran Anda.</li>
                            <li>Berkomunikasi dengan Anda terkait status pesanan.</li>
                            <li>Menyaring pesanan kami untuk potensi risiko atau penipuan using Tripay payment gateway.</li>
                            <li>Meningkatkan dan mengoptimalkan Situs kami (misalnya, dengan menghasilkan analitik tentang bagaimana pelanggan kami menjelajah dan berinteraksi dengan Situs).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. Berbagi Informasi Pribadi</h2>
                        <p>
                            Kami membagikan Informasi Pribadi Anda dengan pihak ketiga untuk membantu kami menggunakan Informasi Pribadi Anda, seperti yang dijelaskan di atas. Misalnya, kami menggunakan Tripay sebagai gateway pembayaran kami. Kami juga dapat membagikan Informasi Pribadi Anda untuk mematuhi hukum dan peraturan yang berlaku.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">5. Keamanan Data</h2>
                        <p>
                            Kami mengambil langkah-langkah keamanan yang wajar untuk melindungi informasi pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah. Namun, perlu diketahui bahwa tidak ada metode transmisi melalui internet atau metode penyimpanan elektronik yang 100% aman.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">6. Perubahan Kebijakan Ini</h2>
                        <p>
                            Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu untuk mencerminkan, misalnya, perubahan pada praktik kami atau untuk alasan operasional, hukum, atau peraturan lainnya.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">7. Hubungi Kami</h2>
                        <p>
                            Untuk informasi lebih lanjut tentang praktik privasi kami, jika Anda memiliki pertanyaan, atau jika Anda ingin mengajukan keluhan, silakan hubungi kami melalui WhatsApp atau email yang tertera di situs kami.
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
