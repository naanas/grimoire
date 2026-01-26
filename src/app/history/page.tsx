'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { CheckCircle, XCircle, Clock, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundEffects from '@/components/BackgroundEffects';

const HistoryList = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/history')
            .then(res => {
                if (res.data.success) {
                    setTransactions(res.data.data);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center mt-20 text-white space-y-4">
            <Loader2 className="animate-spin w-10 h-10 text-[var(--blood-red)]" />
            <p>Loading History...</p>
        </div>
    );

    if (transactions.length === 0) return (
        <div className="text-center mt-20 text-gray-400">
            <p className="mb-4">No transactions found.</p>
            <Link href="/" className="px-6 py-2 bg-[var(--blood-red)] text-white rounded-full font-bold hover:bg-red-700 transition-all">
                Start Shopping
            </Link>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold text-white mb-6">Transaction History</h1>

            <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="bg-[#111] text-xs uppercase text-gray-200">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Invoice</th>
                                <th className="px-6 py-3">Item</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((trx) => (
                                <tr key={trx.id} className="border-b border-gray-800 hover:bg-[#111] transition-colors">
                                    <td className="px-6 py-4">{new Date(trx.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-mono text-xs">{trx.invoice}</td>
                                    <td className="px-6 py-4 text-white font-medium">
                                        {trx.type === 'DEPOSIT' ? 'Wallet Deposit' : trx.product?.name || 'Unknown Item'}
                                    </td>
                                    <td className="px-6 py-4">Rp {trx.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${trx.status === 'SUCCESS' ? 'bg-green-900 text-green-300' :
                                            trx.status === 'PENDING' ? 'bg-yellow-900 text-yellow-300' :
                                                'bg-red-900 text-red-300'
                                            }`}>
                                            {trx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/history?id=${trx.id}`} className="text-[var(--blood-red)] hover:text-white transition-colors">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const TransactionDetail = ({ id }: { id: string }) => {
    const [trx, setTrx] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchStatus = () => {
        setLoading(true);
        api.get(`/check/${id}`)
            .then(res => {
                if (res.data.success) {
                    setTrx(res.data.data);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchStatus();
    }, [id]);

    // Initial loading state
    if (loading && !trx) return (
        <div className="flex flex-col items-center justify-center mt-20 text-white space-y-4">
            <Loader2 className="animate-spin w-10 h-10 text-[var(--blood-red)]" />
            <p>Retrieving Transaction Status...</p>
        </div>
    );

    if (!trx) return <p className="text-white text-center mt-20">Transaction Not Found</p>;

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-[#0a0a0a] border border-gray-800 rounded-2xl shadow-2xl relative overflow-hidden">
            {/* Status Header */}
            <div className="text-center mb-8">
                {trx.status === 'SUCCESS' && <CheckCircle className="mx-auto text-green-500 mb-2 w-16 h-16" />}
                {trx.status === 'FAILED' && <XCircle className="mx-auto text-red-500 mb-2 w-16 h-16" />}
                {(trx.status === 'PENDING' || trx.status === 'PROCESSING') && <Clock className="mx-auto text-yellow-500 mb-2 w-16 h-16 animate-pulse" />}

                <h1 className={`text-2xl font-bold ${trx.status === 'SUCCESS' ? 'text-green-500' :
                    trx.status === 'FAILED' ? 'text-red-500' : 'text-yellow-500'
                    }`}>
                    {trx.status === 'SUCCESS' ? (trx.type === 'DEPOSIT' ? 'Deposit Successful!' : 'Topup Successful!') :
                        trx.status === 'PROCESSING' ? 'Order Processing...' :
                            trx.status === 'FAILED' ? 'Transaction Failed' :
                                'Waiting for Payment'}
                </h1>
                <p className="text-gray-400 text-sm mt-1 mb-4">Invoice: {trx.invoice}</p>

                {/* SN / Provider Message */}
                {trx.sn && (
                    <div className="bg-gray-900/50 border border-gray-700 p-3 rounded-lg mb-4 text-left max-w-sm mx-auto">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">SN / Status Info</p>
                        <p className="text-sm font-mono text-white break-all">{trx.sn}</p>
                    </div>
                )}

                {/* Refresh Button */}
                <button
                    onClick={fetchStatus}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-700 hover:bg-gray-800 rounded-full text-xs text-white transition-all disabled:opacity-50"
                >
                    <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                    {loading ? 'Refreshing...' : 'Refresh Status'}
                </button>
            </div>

            {/* Details Table */}
            <div className="space-y-4 text-sm text-gray-300">
                <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span>Type</span>
                    <span className="font-bold text-white">{trx.type === 'DEPOSIT' ? 'Wallet Deposit' : 'Game Topup'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span>Product</span>
                    <span className="font-bold text-white">{trx.product?.name || (trx.type === 'DEPOSIT' ? `Deposit Rp ${trx.amount}` : 'Unknown Item')}</span>
                </div>
                {trx.targetId && (
                    <div className="flex justify-between border-b border-gray-800 pb-2">
                        <span>Target ID</span>
                        <span className="font-mono">{trx.targetId} {trx.zoneId ? `(${trx.zoneId})` : ''}</span>
                    </div>
                )}

                <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span>Payment Method</span>
                    <span className="uppercase">{trx.paymentMethod}</span>
                </div>

                {/* Financials */}
                <div className="bg-[#111] p-4 rounded-lg space-y-2 mt-4">
                    <div className="flex justify-between items-center text-lg font-bold text-white">
                        <span>Total Paid</span>
                        <span>Rp {trx.amount.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <Link href="/history" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={16} /> Back to History
                </Link>
            </div>

            {/* Background Glow */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${trx.status === 'SUCCESS' ? 'green' : trx.status === 'FAILED' ? 'red' : 'yellow'}-500 to-transparent opacity-50`}></div>
        </div>
    );
};

function HistoryContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    if (id) {
        return <TransactionDetail id={id} />;
    }

    return <HistoryList />;
}

export default function HistoryPage() {
    return (
        <div className="container mx-auto px-4 pt-10 pb-20 flex-grow">
            <Suspense fallback={<div className="text-center text-white">Loading...</div>}>
                <HistoryContent />
            </Suspense>
        </div>
    );
}
