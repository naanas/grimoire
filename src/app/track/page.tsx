'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, AlertCircle, CheckCircle, Clock, XCircle, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TrackOrderPage() {
    const [invoiceId, setInvoiceId] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!invoiceId.trim()) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/check-status/${invoiceId}`);
            const data = await res.json();

            if (data.success) {
                setResult(data.data);
            } else {
                setError(data.message || 'Transaksi tidak ditemukan');
            }
        } catch (err) {
            setError('Gagal menghubungi server');
        } finally {
            setLoading(false);
        }
    };

    const getStatusParams = (status: string) => {
        switch (status) {
            case 'SUCCESS': return { color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: CheckCircle, text: 'Berhasil' };
            case 'PENDING': return { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: Clock, text: 'Menunggu Pembayaran' };
            case 'PROCESSING': return { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Loader2, text: 'Sedang Diproses' };
            case 'FAILED': return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: XCircle, text: 'Gagal' };
            case 'EXPIRED': return { color: 'text-gray-500', bg: 'bg-gray-500/10', border: 'border-gray-500/20', icon: XCircle, text: 'Kadaluarsa' };
            default: return { color: 'text-stone-400', bg: 'bg-stone-500/10', border: 'border-stone-500/20', icon: AlertCircle, text: status };
        }
    };

    return (
        <div className="min-h-screen bg-[var(--void-black)] text-stone-200 selection:bg-[var(--blood-red)] selection:text-white font-[family-name:var(--font-geist-sans)]">
            <Navbar />

            <main className="pt-32 pb-20 px-4 md:px-8 max-w-3xl mx-auto min-h-[80vh] flex flex-col justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        Lacak <span className="text-[var(--blood-red)]">Pesanan</span>
                    </h1>
                    <p className="text-stone-400">Masukkan Nomor Invoice (GRM-XXXX) untuk mengecek status transaksi Anda.</p>
                </motion.div>

                {/* Search Box */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative z-10"
                >
                    <form onSubmit={handleSearch} className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--blood-red)] to-[var(--dark-blood)] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                        <div className="relative flex items-center bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-2 shadow-2xl">
                            <Search className="ml-4 text-stone-500 w-6 h-6" />
                            <input
                                type="text"
                                value={invoiceId}
                                onChange={(e) => setInvoiceId(e.target.value)}
                                placeholder="Contoh: GRM-1740004829102"
                                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-stone-600 px-4 py-3 text-lg font-mono tracking-wide"
                            />
                            <button
                                type="submit"
                                disabled={loading || !invoiceId}
                                className="bg-[var(--blood-red)] hover:bg-[var(--hell-fire)] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Lacak'}
                            </button>
                        </div>
                    </form>
                </motion.div>

                {/* Result Area */}
                <div className="mt-12 min-h-[300px]">
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-center"
                            >
                                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                                <h3 className="text-xl font-bold text-white mb-1">Transaksi Tidak Ditemukan</h3>
                                <p className="text-red-400 text-sm">{error}</p>
                            </motion.div>
                        )}

                        {result && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative"
                            >
                                {/* Header Status */}
                                <div className={`p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 ${getStatusParams(result.status).bg}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-full bg-black/20 ${getStatusParams(result.status).color}`}>
                                            {(() => {
                                                const Icon = getStatusParams(result.status).icon;
                                                return <Icon size={24} />;
                                            })()}
                                        </div>
                                        <div>
                                            <div className="text-xs text-stone-400 uppercase tracking-widest mb-1">Status Pesanan</div>
                                            <div className={`text-xl font-black uppercase ${getStatusParams(result.status).color}`}>
                                                {getStatusParams(result.status).text}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-stone-500 font-mono">{new Date(result.updatedAt || result.createdAt).toLocaleString('id-ID')}</div>
                                        <div className="font-mono font-bold text-white text-lg tracking-wider">{result.invoice}</div>
                                    </div>
                                </div>

                                {/* Body Details */}
                                <div className="p-6 md:p-8 space-y-6">
                                    {/* Product and ID */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-dashed border-white/10">
                                        <div>
                                            <label className="text-xs text-stone-500 uppercase tracking-wider block mb-2">Item</label>
                                            <div className="text-lg font-bold text-white">{result.product?.name || 'Unknown Item'}</div>
                                            <div className="text-sm text-stone-400 mt-1">{result.product?.category?.name}</div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-stone-500 uppercase tracking-wider block mb-2">Target ID (User ID)</label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl font-mono text-[var(--blood-red)] tracking-wider">{result.targetId}</span>
                                                {result.zoneId && <span className="text-xs bg-white/10 px-2 py-1 rounded text-stone-400">({result.zoneId})</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs text-stone-500 uppercase tracking-wider block mb-2">Metode Pembayaran</label>
                                            <div className="font-bold text-white">{result.paymentChannel || result.paymentMethod}</div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-stone-500 uppercase tracking-wider block mb-2">Total Bayar</label>
                                            <div className="text-2xl font-black text-[var(--blood-red)]">Rp {Number(result.amount).toLocaleString('id-ID')}</div>
                                        </div>
                                    </div>

                                    {/* Voucher / SN Info */}
                                    {(result.sn || result.note) && (
                                        <div className="bg-stone-900/50 p-4 rounded-lg border border-white/5 mt-4">
                                            <label className="text-[10px] text-stone-500 uppercase tracking-widest block mb-1">SN / Kode Voucher / Catatan</label>
                                            <div className="font-mono text-green-400 text-sm break-all">
                                                {result.sn || result.note}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Decor */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--blood-red)]/5 rounded-full blur-3xl pointer-events-none"></div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
            <Footer />
        </div>
    );
}
