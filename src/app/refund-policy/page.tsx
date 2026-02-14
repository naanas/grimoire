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
                        <p>
                            Pengembalian dana hanya akan diproses jika terjadi kondisi berikut:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>Transaksi dinyatakan GAGAL oleh sistem kami, namun saldo Anda telah terpotong.</li>
                            <li>Produk sedang gangguan atau stok kosong dalam waktu yang lama (lebih dari 24 jam) setelah pembayaran sukses.</li>
                            <li>Terjadi kesalahan sistem fatal yang menyebabkan produk tidak terkirim.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. Proses Pengajuan Refund</h2>
                        <p>
                            Jika Anda mengalami masalah seperti poin di atas, silakan hubungi Customer Service kami melalui WhatsApp dengan menyertakan:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>Nomor Invoice / Kode Transaksi.</li>
                            <li>Bukti Transfer / Screenshot Pembayaran.</li>
                            <li>Detail Masalah.</li>
                        </ul>
                        <p className="mt-2">
                            Tim kami akan melakukan pengecekan dalam waktu maksimal 1x24 jam kerja.
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
