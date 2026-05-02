'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { CheckCircle, XCircle, Clock, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

function StatusContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [trx, setTrx] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!id) return;

        const fetchStatus = () => {
            api.get(`/check/${id}`)
                .then(res => {
                    if (res.data.success) {
                        setTrx(res.data.data);
                    }
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 5000);
        return () => clearInterval(interval);
    }, [id]);

    if (!id) return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <AlertCircle className="text-[#00f5ff]/40" size={48} />
            <p className="text-white/40 font-mono text-sm tracking-widest uppercase">No Transaction ID provided.</p>
        </div>
    );

    if (loading && !trx) return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-[#00f5ff]" size={36} />
            <p className="text-white/40 font-mono text-xs tracking-[0.3em] uppercase animate-pulse">Fetching Transaction...</p>
        </div>
    );

    if (!trx) return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <XCircle className="text-red-500/60" size={48} />
            <p className="text-white/40 font-mono text-sm tracking-widest uppercase">Transaction Not Found</p>
        </div>
    );

    const statusColor = trx.status === 'SUCCESS'
        ? { text: 'text-green-400', glow: 'shadow-[0_0_30px_rgba(34,197,94,0.15)]', border: 'border-green-500/20', bar: 'from-green-500/60', icon: <CheckCircle className="text-green-400 drop-shadow-[0_0_12px_rgba(34,197,94,0.9)]" size={52} /> }
        : trx.status === 'FAILED'
        ? { text: 'text-red-400', glow: 'shadow-[0_0_30px_rgba(239,68,68,0.15)]', border: 'border-red-500/20', bar: 'from-red-500/60', icon: <XCircle className="text-red-400 drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]" size={52} /> }
        : { text: 'text-amber-400', glow: 'shadow-[0_0_30px_rgba(251,191,36,0.1)]', border: 'border-amber-500/15', bar: 'from-amber-500/50', icon: <Clock className="text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] animate-pulse" size={52} /> };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto py-8 px-4"
        >
            {/* Status Icon */}
            <div className="flex justify-center mb-6">
                <div className={`relative w-24 h-24 flex items-center justify-center rounded-2xl bg-white/[0.03] border ${statusColor.border} ${statusColor.glow}`}>
                    {statusColor.icon}
                    {/* Scanline top */}
                    <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r ${statusColor.bar} to-transparent rounded-t-2xl`} />
                </div>
            </div>

            {/* Status Text */}
            <div className="text-center mb-8">
                <h1 className={`text-2xl md:text-3xl font-[family-name:var(--font-cinzel)] font-black uppercase tracking-widest ${statusColor.text}`}>
                    {trx.status === 'SUCCESS' ? 'Payment Confirmed' :
                        trx.status === 'FAILED' ? 'Payment Failed' :
                            'Awaiting Payment'}
                </h1>
                <p className="text-white/30 text-xs font-mono tracking-widest mt-2 uppercase">Invoice: {trx.invoice}</p>
            </div>

            {/* Details Card */}
            <div className={`rounded-xl bg-white/[0.02] border border-white/8 overflow-hidden ${statusColor.glow}`}>
                {/* Cyan top line */}
                <div className="h-px bg-gradient-to-r from-transparent via-[#00f5ff]/40 to-transparent" />

                <div className="p-6 space-y-0">
                    {[
                        { label: 'Product', value: trx.product?.name || 'Topup Item', mono: false },
                        { label: 'User ID', value: `${trx.userId}${trx.zoneId ? ` (${trx.zoneId})` : ''}`, mono: true },
                        { label: 'Payment Method', value: trx.paymentMethod, mono: true },
                    ].map((row, i) => (
                        <div key={i} className="flex justify-between items-center py-3.5 border-b border-white/5 last:border-0">
                            <span className="text-white/35 text-xs uppercase tracking-widest font-bold">{row.label}</span>
                            <span className={`text-white font-bold text-sm ${row.mono ? 'font-mono' : ''}`}>{row.value}</span>
                        </div>
                    ))}
                </div>

                {/* Financials */}
                <div className="mx-4 mb-4 rounded-lg bg-white/[0.03] border border-white/6 overflow-hidden">
                    <div className="h-px bg-gradient-to-r from-transparent via-[#00f5ff]/20 to-transparent" />
                    <div className="p-4 space-y-2.5">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-white/40">Price</span>
                            <span className="text-white font-mono">Rp {(trx.amount - trx.adminFee).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-white/40">Admin Fee</span>
                            <span className="text-[#00f5ff]/70 font-mono">+ Rp {trx.adminFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2.5 border-t border-white/8">
                            <span className="text-white font-bold uppercase tracking-wider text-xs">Total Paid</span>
                            <span className="text-white font-black text-lg font-mono">Rp {trx.amount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back Link */}
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
                <Suspense fallback={
                    <div className="flex items-center justify-center py-24 gap-3">
                        <Loader2 className="animate-spin text-[#00f5ff]" size={24} />
                        <span className="text-white/40 font-mono text-xs tracking-widest uppercase">Loading...</span>
                    </div>
                }>
                    <StatusContent />
                </Suspense>
            </main>
        </div>
    );
}
