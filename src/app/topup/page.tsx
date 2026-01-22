'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Wallet, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import api from '@/lib/api';

const DEPOSIT_AMOUNTS = [10000, 25000, 50000, 100000, 250000, 500000];

export default function TopupPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [amount, setAmount] = useState<number | null>(null);
    const [paymentMethod, setPaymentMethod] = useState('QRIS');
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            router.push('/login');
            return;
        }
        setUser(JSON.parse(storedUser));

        // Fetch fresh balance
        api.get('/auth/me')
            .then(res => {
                if (res.data.success) {
                    setUser(res.data.data);
                    localStorage.setItem('user', JSON.stringify(res.data.data));
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));

    }, [router]);

    // Auto-Refresh Balance if Invoice Exists (User returned from payment)
    useEffect(() => {
        if (result?.invoice) {
            const interval = setInterval(() => {
                // Check if user balance updated
                api.get('/auth/me').then(res => {
                    if (res.data.success) {
                        const freshUser = res.data.data;
                        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

                        // If balance increased, update and stop
                        if (freshUser.balance > currentUser.balance) {
                            localStorage.setItem('user', JSON.stringify(freshUser));
                            setUser(freshUser);
                            // Force reload to update Navbar
                            window.location.reload();
                        }
                    }
                }).catch(() => { });
            }, 5000); // Poll every 5s

            return () => clearInterval(interval);
        }
    }, [result]);

    const handleDeposit = async () => {
        if (!amount) {
            setError("Select an amount!");
            return;
        }

        setIsProcessing(true);
        setError('');

        try {
            const res = await api.post('/deposit', {
                userId: user.id,
                amount,
                paymentMethod
            });

            if (res.data.success) {
                setResult(res.data.data); // { invoice, paymentUrl, amount }
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Deposit Failed');
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-black"><Loader2 className="animate-spin text-red-500" /></div>;

    if (result) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center relative">
                {/* Background Pattern/Glow */}
                <div className="absolute inset-0 bg-[#3a0505] opacity-40 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--blood-red)_0%,_transparent_70%)] opacity-20"></div>
                </div>

                <div className="relative z-10 text-center space-y-8 animate-in fade-in zoom-in duration-500 max-w-md w-full">

                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="rounded-full border-[6px] border-[#00ff4c] p-2">
                            <CheckCircle size={80} className="text-[#00ff4c] fill-none stroke-[3px]" />
                        </div>
                    </div>

                    <h2 className="text-4xl font-bold text-white tracking-wide drop-shadow-lg">Deposit Created!</h2>

                    {/* Card */}
                    <div className="bg-[#0a0a0a] p-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-[#222]">
                        <div className="flex justify-between items-center py-4 border-b border-gray-800">
                            <span className="text-gray-400 text-lg">Invoice</span>
                            <span className="font-mono text-white text-lg tracking-wider">{result.invoice}</span>
                        </div>
                        <div className="flex justify-between items-center py-4">
                            <span className="text-gray-400 text-lg">Amount</span>
                            <span className="text-[#ff1f1f] font-bold text-xl tracking-wide">Rp {result.amount.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Pay Button */}
                    {!result.paymentUrl && result.invoice ? (
                        <div className="w-full bg-[#1a4d2e] border border-[#00ff4c] text-[#00ff4c] font-bold py-4 rounded-xl text-lg uppercase tracking-widest shadow-lg">
                            Payment Confirmed
                        </div>
                    ) : (
                        <a href={result.paymentUrl} target="_self"
                            className="block w-full bg-[#8a0000] hover:bg-[#a30000] text-white font-bold py-4 rounded-xl text-lg uppercase tracking-widest shadow-[0_5px_20px_rgba(138,0,0,0.4)] transition-all transform hover:scale-[1.02]">
                            PAY NOW via {paymentMethod}
                        </a>
                    )}

                    {/* History Link */}
                    <button onClick={() => window.location.href = '/history'} className="block mx-auto text-gray-400 hover:text-white underline underline-offset-4 text-sm tracking-wide transition-colors">
                        Check Status in History
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-[family-name:var(--font-cinzel)] font-bold text-white mb-2">Topup Balance</h1>
                    <p className="text-gray-400">Add funds to your Grimoire Wallet for faster checkout.</p>
                </div>

                <div className="bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl border border-gray-800 p-6 md:p-8 shadow-2xl">

                    {/* Current Balance */}
                    <div className="flex items-center gap-4 mb-8 bg-black/40 p-4 rounded-xl border border-white/5">
                        <div className="w-12 h-12 bg-[var(--dark-blood)] rounded-full flex items-center justify-center text-white">
                            <Wallet />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Current Balance</p>
                            <p className="text-2xl font-bold text-white">Rp {user?.balance?.toLocaleString() || 0}</p>
                        </div>
                    </div>

                    {/* 1. Select Amount */}
                    <section className="mb-8">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <span className="bg-[var(--blood-red)] w-6 h-6 flex items-center justify-center rounded-full text-xs text-white">1</span>
                            Select Amount
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                            {DEPOSIT_AMOUNTS.map((val) => (
                                <button
                                    key={val}
                                    onClick={() => setAmount(val)}
                                    className={`p-4 rounded-xl border transition-all font-bold text-lg ${amount === val
                                        ? 'bg-[var(--dark-blood)] border-[var(--blood-red)] text-white shadow-[0_0_15px_rgba(187,10,30,0.4)]'
                                        : 'bg-black/50 border-gray-800 text-gray-400 hover:border-gray-600 hover:bg-black'}`}
                                >
                                    Rp {val.toLocaleString()}
                                </button>
                            ))}
                        </div>

                        {/* Custom Input */}
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">Rp</span>
                            <input
                                type="number"
                                placeholder="Or enter custom amount (Min. 10.000)"
                                className="w-full bg-black/50 border border-gray-800 p-4 pl-12 rounded-xl text-white outline-none focus:border-[var(--blood-red)] transition-colors"
                                value={amount || ''}
                                onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : null)}
                                min={10000}
                            />
                        </div>
                    </section>

                    {/* 2. Payment Method */}
                    <section className="mb-8">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <span className="bg-[var(--blood-red)] w-6 h-6 flex items-center justify-center rounded-full text-xs text-white">2</span>
                            Payment Method
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {['QRIS', 'VA_BCA', 'VA_MANDIRI'].map(method => (
                                <button
                                    key={method}
                                    onClick={() => setPaymentMethod(method)}
                                    className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${paymentMethod === method
                                        ? 'bg-white text-black font-bold'
                                        : 'bg-black/50 border-gray-800 text-gray-400 hover:border-gray-600'}`}
                                >
                                    <CreditCard size={20} />
                                    {method.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Submit */}
                    {error && (
                        <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-3 rounded-lg mb-4 text-center text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleDeposit}
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-[var(--blood-red)] to-red-900 hover:to-[var(--hell-fire)] text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(138,0,0,0.4)] transform transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                        {isProcessing ? <Loader2 className="animate-spin mx-auto" /> : 'TOPUP NOW'}
                    </button>

                </div>
            </div>
        </div>
    );
}
