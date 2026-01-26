'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Wallet, CreditCard, CheckCircle, XCircle, Zap, ShieldAlert, ArrowLeft } from 'lucide-react';
import api from '@/lib/api';


const DEPOSIT_AMOUNTS = [10000, 25000, 50000, 100000, 250000, 500000];

// --- VISUAL COMPONENTS ---
const RunicCircle = () => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center opacity-20">
        <div className="w-[800px] h-[800px] border border-red-900/20 rounded-full animate-[spin_60s_linear_infinite] relative">
            <div className="absolute inset-0 border border-red-900/10 rounded-full scale-75"></div>
            <div className="absolute inset-4 border border-red-900/5 rounded-full rotate-45"></div>
        </div>
    </div>
);

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

        api.get('/auth/me')
            .then(res => {
                if (res.data.success) {
                    setUser(res.data.data);
                    localStorage.setItem('user', JSON.stringify(res.data.data));
                }
            })
            .catch(() => {
                // Silent fail or redirect
            })
            .finally(() => setLoading(false));
    }, [router]);

    // Poll for status update
    useEffect(() => {
        if (result?.invoice) {
            const interval = setInterval(() => {
                api.get('/auth/me').then(res => {
                    if (res.data.success) {
                        const freshUser = res.data.data;
                        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                        if (freshUser.balance > currentUser.balance) {
                            localStorage.setItem('user', JSON.stringify(freshUser));
                            setUser(freshUser);
                            window.location.reload();
                        }
                    }
                }).catch(() => { });
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [result]);

    const handleDeposit = async () => {
        if (!amount || amount < 10000) {
            setError("Minimum deposit is Rp 10.000");
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
                setResult(res.data.data);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Summoning Failed');
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black gap-4">
                <Loader2 className="animate-spin text-[var(--blood-red)]" size={40} />
                <p className="text-[var(--blood-red)] font-[family-name:var(--font-cinzel)] tracking-widest animate-pulse">PREPARING ALTAR...</p>
            </div>
        );
    }

    // --- RECEIPT VIEW ---
    if (result) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center relative bg-black overflow-hidden">
                <RunicCircle />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_90%)] z-0"></div>

                <div className="relative z-10 text-center space-y-8 animate-in fade-in zoom-in duration-500 max-w-md w-full">
                    {/* Status Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#00ff4c] blur-2xl opacity-20 animate-pulse"></div>
                            <CheckCircle size={80} className="text-[#00ff4c] relative z-10" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-[family-name:var(--font-cinzel)] font-bold text-white uppercase tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                        Ritual Prepared
                    </h2>

                    {/* Receipt Card */}
                    <div className="bg-black border border-gray-800 p-8 relative overflow-hidden group" style={{ clipPath: "polygon(5% 0, 95% 0, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0 95%, 0 5%)" }}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-[var(--blood-red)] shadow-[0_0_10px_red]"></div>

                        <div className="flex justify-between items-center py-4 border-b border-gray-900 border-dashed">
                            <span className="text-gray-500 text-xs uppercase tracking-widest">Oracle Invoice</span>
                            <span className="font-mono text-white text-sm">{result.invoice}</span>
                        </div>
                        <div className="flex justify-between items-center py-4">
                            <span className="text-gray-500 text-xs uppercase tracking-widest">Offering</span>
                            <span className="text-[var(--blood-red)] font-black text-xl tracking-wide">Rp {result.amount.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    {!result.paymentUrl && result.invoice ? (
                        <div className="w-full bg-[#1a4d2e] border border-[#00ff4c] text-[#00ff4c] font-bold py-4 text-lg uppercase tracking-widest shadow-lg">
                            Offering Accepted
                        </div>
                    ) : (
                        <a href={result.paymentUrl} target="_self"
                            className="block w-full bg-[var(--blood-red)] hover:bg-red-700 text-black font-black py-4 text-base uppercase tracking-[0.2em] transition-all clip-path-button shadow-[0_0_20px_rgba(187,10,30,0.4)] relative overflow-hidden group">
                            <span className="relative z-10">Proceed to Altar</span>
                        </a>
                    )}

                    <button onClick={() => window.location.href = '/history'} className="text-xs text-gray-600 hover:text-[var(--blood-red)] uppercase tracking-widest transition-colors mt-8">
                        View Compendium (History)
                    </button>
                </div>

                <style jsx>{`
                    .clip-path-button {
                        clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
                    }
                `}</style>
            </div>
        );
    }

    // --- TOPUP FORM VIEW ---
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-black relative overflow-hidden selection:bg-[var(--blood-red)] selection:text-white">
            <RunicCircle />
            {/* Red Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] z-0 pointer-events-none opacity-80"></div>

            <div className="max-w-4xl mx-auto space-y-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-12 relative flex flex-col items-center md:block">
                    <button onClick={() => router.back()} className="relative self-start mb-4 md:mb-0 md:absolute md:left-0 md:top-1 text-gray-500 hover:text-white flex items-center gap-2 text-xs uppercase tracking-widest z-20 transition-colors">
                        <ArrowLeft size={14} /> Return
                    </button>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block relative z-10"
                    >
                        <h1 className="text-3xl md:text-5xl font-[family-name:var(--font-cinzel)] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 mb-2 drop-shadow-lg uppercase tracking-widest break-words max-w-[90vw]">
                            Soul Infusion
                        </h1>
                        <div className="h-[2px] w-24 bg-[var(--blood-red)] mx-auto shadow-[0_0_10px_red]"></div>
                    </motion.div>
                </div>

                <div className="bg-black/80 backdrop-blur-xl border border-gray-900 shadow-2xl relative overflow-hidden group p-1"
                    style={{ clipPath: "polygon(0 0, 100% 0, 100% 98%, 98% 100%, 2% 100%, 0 98%)" }}>

                    {/* Top Red Gradient Line */}
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--blood-red)] to-transparent opacity-70"></div>

                    <div className="p-6 md:p-10">

                        {/* Current Balance */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 bg-black border border-gray-800 p-6 relative overflow-hidden group-hover:border-red-900/30 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Wallet size={100} className="text-[var(--blood-red)] rotate-12" />
                            </div>

                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-14 h-14 bg-red-950/30 border border-red-900/50 rounded-full flex items-center justify-center text-[var(--blood-red)] shadow-[0_0_15px_rgba(187,10,30,0.2)]">
                                    <Wallet size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Current Soul Balance</p>
                                    <p className="text-3xl font-black text-white font-[family-name:var(--font-cinzel)]">Rp {user?.balance?.toLocaleString() || 0}</p>
                                </div>
                            </div>

                            <div className="text-right hidden md:block z-10">
                                <p className="text-[10px] text-gray-600 font-mono">ACCOUNT: {user?.email}</p>
                                <p className="text-[10px] text-[var(--blood-red)] font-bold">VERIFIED ENTITY</p>
                            </div>
                        </div>

                        {/* 1. Select Amount */}
                        <section className="mb-10">
                            <h3 className="text-sm font-[family-name:var(--font-cinzel)] font-bold mb-6 flex items-center gap-3 text-white">
                                <span className="w-8 h-8 bg-red-950/50 border border-red-900 flex items-center justify-center text-[var(--blood-red)] text-sm font-mono shadow-[0_0_10px_rgba(187,10,30,0.2)]">I</span>
                                CHOOSE OFFERING SIZE
                            </h3>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6">
                                {DEPOSIT_AMOUNTS.map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => setAmount(val)}
                                        className={`
                                            relative p-4 md:p-6 transition-all font-bold text-lg md:text-xl group overflow-hidden
                                            ${amount === val
                                                ? 'bg-red-950/40 border-[var(--blood-red)] text-white shadow-[0_0_20px_rgba(187,10,30,0.3)]'
                                                : 'bg-black border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300'}
                                            border
                                        `}
                                        style={{ clipPath: "polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)" }}
                                    >
                                        <span className="relative z-10">Rp {val.toLocaleString()}</span>
                                        {/* Hover Glint */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                                    </button>
                                ))}
                            </div>

                            {/* Custom Input */}
                            <div className="relative group">
                                <input
                                    type="number"
                                    placeholder=" "
                                    className="peer w-full bg-black border border-gray-800 p-4 pl-12 rounded-none focus:border-[var(--blood-red)] outline-none text-white transition-all text-lg font-bold tracking-wider"
                                    value={amount || ''}
                                    onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : null)}
                                    min={10000}
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--blood-red)] transition-colors">Rp</span>
                                <label className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-600 text-sm uppercase tracking-widest transition-all duration-300 peer-focus:-top-3 peer-focus:left-0 peer-focus:text-[var(--blood-red)] peer-focus:text-xs peer-[&:not(:placeholder-shown)]:-top-3 peer-[&:not(:placeholder-shown)]:left-0 peer-[&:not(:placeholder-shown)]:text-[var(--blood-red)] peer-[&:not(:placeholder-shown)]:text-xs pointer-events-none">
                                    Or Enter Custom Amount (Min 10.000)
                                </label>
                            </div>
                        </section>

                        {/* 2. Payment Method */}
                        <section className="mb-10">
                            <h3 className="text-sm font-[family-name:var(--font-cinzel)] font-bold mb-6 flex items-center gap-3 text-white">
                                <span className="w-8 h-8 bg-red-950/50 border border-red-900 flex items-center justify-center text-[var(--blood-red)] text-sm font-mono shadow-[0_0_10px_rgba(187,10,30,0.2)]">II</span>
                                SELECT CHANNEL
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {[
                                    { id: 'QRIS', label: 'QRIS', icon: Zap },
                                    { id: 'VA_BCA', label: 'BCA VA', icon: CreditCard },
                                    { id: 'VA_MANDIRI', label: 'Mandiri VA', icon: CreditCard }
                                ].map(method => (
                                    <div
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`
                                            cursor-pointer border p-4 flex flex-col items-center justify-center gap-2 transition-all
                                            ${paymentMethod === method.id
                                                ? 'bg-white text-black border-white'
                                                : 'bg-black border-gray-800 hover:border-gray-600 text-gray-500 hover:text-white'}
                                        `}
                                    >
                                        <method.icon size={20} />
                                        <span className="text-xs font-bold uppercase tracking-wider">{method.label}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Submit */}
                        {error && (
                            <div className="bg-red-950/20 border border-red-900/50 p-4 text-center text-red-500 text-xs font-bold tracking-wide uppercase animate-pulse mb-6 flex items-center justify-center gap-2">
                                <ShieldAlert size={16} /> {error}
                            </div>
                        )}

                        <button
                            onClick={handleDeposit}
                            disabled={isProcessing}
                            className="w-full bg-[var(--blood-red)] hover:bg-red-700 text-black font-black py-5 text-lg uppercase tracking-[0.2em] transition-all clip-path-button shadow-[0_0_30px_rgba(187,10,30,0.4)] hover:shadow-[0_0_50px_rgba(187,10,30,0.6)] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isProcessing ? <Loader2 className="animate-spin" /> : 'INITIATE RITUAL (TOPUP)'}
                            </span>
                            {/* Button Shine */}
                            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                        </button>

                    </div>
                </div>
            </div>

            <style jsx>{`
                .clip-path-button {
                    clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
                }
                .clip-path-corner {
                     clip-path: polygon(0 0, 100% 0, 100% 100%);
                }
            `}</style>
        </div>
    );
}
