'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { CheckCircle, XCircle, Clock, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundEffects from '@/components/BackgroundEffects';

function StatusContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [trx, setTrx] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        // Poll status every 5 seconds or just fetch once
        const fetchStatus = () => {
            api.get(`/check/${id}`)
                .then(res => {
                    if (res.data.success) {
                        setTrx(res.data.data);
                        // If pending, maybe keep polling? For now just show state.
                    }
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 5000); // Live poll
        return () => clearInterval(interval);

    }, [id]);

    if (!id) return <p className="text-white text-center mt-20">No Transaction ID provided.</p>;
    if (loading && !trx) return <div className="flex justify-center mt-20 text-white"><Loader2 className="animate-spin" /> Loading Transaction...</div>;

    if (!trx) return <p className="text-white text-center mt-20">Transaction Not Found</p>;

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-[#0a0a0a] border border-gray-800 rounded-2xl shadow-2xl relative overflow-hidden">
            {/* Status Header */}
            <div className="text-center mb-8">
                {trx.status === 'SUCCESS' && <CheckCircle className="mx-auto text-green-500 mb-2 w-16 h-16" />}
                {trx.status === 'FAILED' && <XCircle className="mx-auto text-red-500 mb-2 w-16 h-16" />}
                {trx.status === 'PENDING' && <Clock className="mx-auto text-yellow-500 mb-2 w-16 h-16 animate-pulse" />}

                <h1 className={`text-2xl font-bold ${trx.status === 'SUCCESS' ? 'text-green-500' :
                        trx.status === 'FAILED' ? 'text-red-500' : 'text-yellow-500'
                    }`}>
                    Payment {trx.status}
                </h1>
                <p className="text-gray-400 text-sm mt-1">Invoice: {trx.invoice}</p>
            </div>

            {/* Details Table */}
            <div className="space-y-4 text-sm text-gray-300">
                <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span>Product</span>
                    <span className="font-bold text-white">{trx.product?.name || 'Topup Item'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span>User ID</span>
                    <span className="font-mono">{trx.userId} {trx.zoneId ? `(${trx.zoneId})` : ''}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span>Payment Method</span>
                    <span className="uppercase">{trx.paymentMethod}</span>
                </div>

                {/* Financials */}
                <div className="bg-[#111] p-4 rounded-lg space-y-2 mt-4">
                    <div className="flex justify-between items-center">
                        <span>Price</span>
                        <span>Rp {(trx.amount - trx.adminFee).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-[var(--blood-red)]">
                        <span>Admin Fee</span>
                        <span>+ Rp {trx.adminFee.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-gray-700 my-2 pt-2 flex justify-between items-center text-lg font-bold text-white">
                        <span>Total Paid</span>
                        <span>Rp {trx.amount.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={16} /> Back to Home
                </Link>
            </div>

            {/* Background Glow */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${trx.status === 'SUCCESS' ? 'green' : trx.status === 'FAILED' ? 'red' : 'yellow'}-500 to-transparent opacity-50`}></div>
        </div>
    );
}

export default function StatusPage() {
    return (
        <div className="min-h-screen pb-20">
            <Navbar />
            <BackgroundEffects />
            <main className="container mx-auto px-4 pt-24">
                <Suspense fallback={<div className="text-center text-white">Loading...</div>}>
                    <StatusContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
