import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Kebijakan Pengembalian Dana',
    description: 'Kebijakan refund dan pengembalian dana untuk transaksi di Grimoire Coins. Pelajari syarat dan ketentuan pengembalian dana kami.',
};

export default function RefundPolicy() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-300 py-20 px-4 md:px-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4 border-b border-gray-800 pb-8">
                    <h1 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-cinzel)] text-white uppercase tracking-widest text-[var(--blood-red)] drop-shadow-[0_0_10px_rgba(187,10,30,0.4)]">
                        Kebijakan Pengembalian Dana
                    </h1>
                    <p className="text-sm text-gray-500 uppercase tracking-widest">
                        Terakhir Diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-6 text-sm md:text-base leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Barang Digital</h2>
                        <p>
                            Semua produk yang dijual di Grimoire Coins adalah barang digital (voucher game, pulsa, token listrik, dll). Karena sifatnya, produk yang telah berhasil dikirim atau direedem <b>TIDAK DAPAT DIKEMBALIKAN (NON-REFUNDABLE)</b>. Harap pastikan nomor HP, ID Game, atau detail akun yang Anda masukkan sudah benar sebelum melakukan pembayaran.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. Kondisi Pengembalian Dana (Refund)</h2>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>
                                <b>Anggota (Login):</b> Jika transaksi dinyatakan GAGAL oleh sistem provider game namun saldo Anda telah terpotong, dana akan dikembalikan secara <b>OTOMATIS</b> ke dalam <b>Saldo Akun (Balance)</b> Grimoire Coins Anda. Saldo ini dapat digunakan kembali untuk bertransaksi kapan saja tanpa potongan biaya.
                            </li>
                            <li>
                                <b>Tamu (Guest):</b> Jika Anda bertransaksi tanpa login dan terjadi kegagalan sistem, status transaksi akan ditandai sebagai <span className="text-yellow-500">REFUND NEEDED</span>. Anda wajib menghubungi Customer Service untuk proses verifikasi manual. Pengembalian dana mungkin diberikan dalam bentuk Kode Voucher dengan nilai setara.
                            </li>
                            <li>
                                Produk sedang gangguan atau stok kosong dalam waktu yang lama (lebih dari 24 jam) setelah pembayaran sukses.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. Proses Pengajuan Refund (Khusus Guest)</h2>
                        <p>
                            Bagi pengguna yang tidak login (Guest), silakan hubungi Customer Service kami melalui WhatsApp dengan menyertakan detail berikut untuk klaim refund manual:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>Nomor Invoice / Kode Transaksi.</li>
                            <li>Bukti Transfer / Screenshot Pembayaran.</li>
                            <li>Detail Masalah.</li>
                        </ul>
                        <p className="mt-2 text-yellow-500 bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                            <b>Saran:</b> Kami sangat menyarankan Anda untuk <b>Mendaftar/Login</b> sebelum bertransaksi agar jika terjadi kegagalan, saldo dapat kembali otomatis (Instant Refund).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. Pembatalan Transaksi</h2>
                        <p>
                            Transaksi yang statusnya masih MENUNGGU PEMBAYARAN dapat dibatalkan secara otomatis oleh sistem jika tidak dibayar dalam batas waktu yang ditentukan. Transaksi yang sudah SUKSES tidak dapat dibatalkan.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">5. Hubungi Kami</h2>
                        <p>
                            Jika ada pertanyaan mengenai kebijakan ini, silakan hubungi kami melalui kontak WhatsApp yang tersedia di halaman utama.
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
