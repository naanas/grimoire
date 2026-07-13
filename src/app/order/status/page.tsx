'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Clock, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransactionRealtime } from '@/hooks/useTransactionRealtime';

function getStatusDisplay(status: string) {
    switch (status) {
        case 'SUCCESS':
            return {
                title: 'Topup Berhasil',
                color: 'text-green-400',
                glow: 'shadow-[0_0_30px_rgba(34,197,94,0.15)]',
                border: 'border-green-500/20',
                bar: 'from-green-500/60',
                icon: <CheckCircle className="text-green-400 drop-shadow-[0_0_12px_rgba(34,197,94,0.9)]" size={52} />,
            };
        case 'FAILED':
        case 'EXPIRED':
            return {
                title: status === 'EXPIRED' ? 'Pembayaran Kadaluarsa' : 'Pembayaran Gagal',
                color: 'text-red-400',
                glow: 'shadow-[0_0_30px_rgba(239,68,68,0.15)]',
                border: 'border-red-500/20',
                bar: 'from-red-500/60',
                icon: <XCircle className="text-red-400 drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]" size={52} />,
            };
        case 'PROVIDER_FAILED':
            return {
                title: 'Butuh Bantuan Admin',
                color: 'text-purple-400',
                glow: 'shadow-[0_0_30px_rgba(168,85,247,0.15)]',
                border: 'border-purple-500/20',
                bar: 'from-purple-500/60',
                icon: <AlertCircle className="text-purple-400 drop-shadow-[0_0_12px_rgba(168,85,247,0.9)]" size={52} />,
            };
        case 'PROCESSING':
            return {
                title: 'Sedang Diproses',
                color: 'text-blue-400',
                glow: 'shadow-[0_0_30px_rgba(59,130,246,0.12)]',
                border: 'border-blue-500/20',
                bar: 'from-blue-500/60',
                icon: <Loader2 className="text-blue-400 animate-spin" size={52} />,
            };
        default:
            return {
                title: 'Menunggu Pembayaran',
                color: 'text-amber-400',
                glow: 'shadow-[0_0_30px_rgba(251,191,36,0.1)]',
                border: 'border-amber-500/15',
                bar: 'from-amber-500/50',
                icon: <Clock className="text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] animate-pulse" size={52} />,
            };
    }
}

function StatusContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const { trx, loading } = useTransactionRealtime(id);

    if (!id) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <AlertCircle className="text-[#00f5ff]/40" size={48} />
                <p className="text-white/40 font-mono text-sm tracking-widest uppercase">No Transaction ID provided.</p>
            </div>
        );
    }

    if (loading && !trx) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="animate-spin text-[#00f5ff]" size={36} />
                <p className="text-white/40 font-mono text-xs tracking-[0.3em] uppercase animate-pulse">Fetching Transaction...</p>
            </div>
        );
    }

    if (!trx) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <XCircle className="text-red-500/60" size={48} />
                <p className="text-white/40 font-mono text-sm tracking-widest uppercase">Transaction Not Found</p>
            </div>
        );
    }

    const statusStyle = getStatusDisplay(trx.status);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto py-8 px-4"
        >
            <div className="flex justify-center mb-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={trx.status}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`relative w-24 h-24 flex items-center justify-center rounded-2xl bg-white/3 border ${statusStyle.border} ${statusStyle.glow}`}
                    >
                        {statusStyle.icon}
                        <div className={`absolute top-0 inset-x-0 h-px bg-linear-to-r ${statusStyle.bar} to-transparent rounded-t-2xl`} />
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="text-center mb-8">
                <AnimatePresence mode="wait">
                    <motion.h1
                        key={trx.status}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-2xl md:text-3xl font-(family-name:--font-cinzel) font-black uppercase tracking-widest ${statusStyle.color}`}
                    >
                        {statusStyle.title}
                    </motion.h1>
                </AnimatePresence>
                <p className="text-white/30 text-xs font-mono tracking-widest mt-2 uppercase">Invoice: {trx.invoice}</p>
            </div>

            <div className={`rounded-xl bg-white/2 border border-white/8 overflow-hidden ${statusStyle.glow}`}>
                <div className="h-px bg-linear-to-r from-transparent via-[#00f5ff]/40 to-transparent" />

                <div className="p-6 space-y-0">
                    {[
                        { label: 'Product', value: trx.product?.name || 'Topup Item', mono: false },
                        {
                            label: 'User ID',
                            value: `${trx.targetId || '-'}${trx.zoneId ? ` (${trx.zoneId})` : ''}`,
                            mono: true,
                        },
                        { label: 'Payment Method', value: trx.paymentChannel || trx.paymentMethod, mono: true },
                    ].map((row, i) => (
                        <div key={i} className="flex justify-between items-center py-3.5 border-b border-white/5 last:border-0">
                            <span className="text-white/35 text-xs uppercase tracking-widest font-bold">{row.label}</span>
                            <span className={`text-white font-bold text-sm ${row.mono ? 'font-mono' : ''}`}>{row.value}</span>
                        </div>
                    ))}
                </div>

                {trx.sn && (
                    <div className="mx-4 mb-4 rounded-lg bg-green-500/5 border border-green-500/20 p-4">
                        <span className="text-[10px] text-green-400/70 uppercase tracking-widest font-bold">SN / Kode</span>
                        <p className="text-green-400 font-mono text-sm mt-1 break-all">{trx.sn}</p>
                    </div>
                )}

                <div className="mx-4 mb-4 rounded-lg bg-white/3 border border-white/6 overflow-hidden">
                    <div className="h-px bg-linear-to-r from-transparent via-[#00f5ff]/20 to-transparent" />
                    <div className="p-4 space-y-2.5">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-white/40">Price</span>
                            <span className="text-white font-mono">Rp {((trx.amount || 0) - (trx.adminFee || 0)).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-white/40">Admin Fee</span>
                            <span className="text-[#00f5ff]/70 font-mono">+ Rp {(trx.adminFee || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2.5 border-t border-white/8">
                            <span className="text-white font-bold uppercase tracking-wider text-xs">Total Paid</span>
                            <span className="text-white font-black text-lg font-mono">Rp {(trx.amount || 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-white/30 hover:text-[#00f5ff] transition-colors text-sm font-mono tracking-widest"
                >
                    <ArrowLeft size={14} />
                    Back to Home
                </Link>
            </div>
        </motion.div>
    );
}

export default function StatusPage() {
    return (
        <div className="min-h-screen pb-20">
            <main className="container mx-auto px-4 pt-8">
                <Suspense
                    fallback={
                        <div className="flex items-center justify-center py-24 gap-3">
                            <Loader2 className="animate-spin text-[#00f5ff]" size={24} />
                            <span className="text-white/40 font-mono text-xs tracking-widest uppercase">Loading...</span>
                        </div>
                    }
                >
                    <StatusContent />
                </Suspense>
            </main>
        </div>
    );
}
