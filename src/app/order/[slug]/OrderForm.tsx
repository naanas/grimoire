'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { Loader2, CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';

type Product = {
    id: string;
    sku_code: string;
    name: string;
    price_sell: number;
    category: { slug: string };
};

export default function OrderForm({ gameSlug }: { gameSlug: string }) {
    const searchParams = useSearchParams();
    const urlTrxId = searchParams.get('id');

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const [targetId, setTargetId] = useState(''); // Game User ID
    const [zoneId, setZoneId] = useState('');
    const [guestContact, setGuestContact] = useState(''); // WA/Email for Guest

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [paymentMethod, setPaymentMethod] = useState('QRIS');

    // Prevent Flash: Initialize based on URL
    const [isProcessing, setIsProcessing] = useState(!!urlTrxId);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const [user, setUser] = useState<any>(null);

    // Nick Checking State
    const [nickCheckLoading, setNickCheckLoading] = useState(false);
    const [nickResult, setNickResult] = useState<string | null>(null);

    // Debounce Check ID
    useEffect(() => {
        const checkId = async () => {
            if (!targetId || targetId.length < 4) {
                setNickResult(null);
                return;
            }

            // For MLBB require Zone ID before checking
            if (gameSlug === 'mobile-legends' && (!zoneId || zoneId.length < 3)) return;

            setNickCheckLoading(true);
            try {
                const res = await api.post('/check-id', {
                    gameSlug,
                    userId: targetId,
                    zoneId
                });
                if (res.data.success) {
                    setNickResult(res.data.data.username || "Valid User");
                } else {
                    setNickResult(null);
                }
            } catch (e) {
                setNickResult(null);
            } finally {
                setNickCheckLoading(false);
            }
        };

        const timer = setTimeout(() => {
            checkId();
        }, 1000); // 1s Debounce

        return () => clearTimeout(timer);
    }, [targetId, zoneId, gameSlug]);

    // Load User & Check Redirect
    useEffect(() => {
        // Load User
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));

        // 1. Fetch Products
        api.get('/products')
            .then(res => {
                if (res.data.success) {
                    const allProducts = res.data.data;
                    const filtered = allProducts.filter((p: Product) => p.category?.slug === gameSlug);
                    setProducts(filtered.length > 0 ? filtered : allProducts);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));

        // 2. If URL has ID, fetch transaction details (Redirect from Ipaymu)
        if (urlTrxId) {
            setIsProcessing(true);
            api.get(`/check/${urlTrxId}`)
                .then(res => {
                    if (res.data.success) {
                        const trx = res.data.data;
                        setResult({
                            invoice: trx.invoice,
                            productName: trx.product?.name,
                            amount: trx.amount,
                            paymentUrl: trx.paymentUrl,
                            status: trx.status
                        });
                    }
                })
                .catch(err => console.error("Failed to fetch trx", err))
                .finally(() => setIsProcessing(false));
        }
    }, [gameSlug, urlTrxId]);

    const handleOrder = async () => {
        // Validation
        if (!targetId || !selectedProduct) {
            setError("Please fill in Game ID and select a product!");
            return;
        }

        // Guest Contact Validation
        if (!user && !guestContact) {
            setError("Please provide a WhatsApp number or Email!");
            return;
        }

        setIsProcessing(true);
        setError('');

        try {
            const res = await api.post('/create', {
                productId: selectedProduct.id,
                userId: targetId, // Target Game ID
                zoneId,
                paymentMethod,
                authUserId: user?.id, // Real DB User ID for tracking & Balance
                guestContact: user ? undefined : guestContact // Send guest contact only if not logged in
            });

            if (res.data.success) {
                setResult(res.data.data);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Transaction Failed');
        } finally {
            setIsProcessing(false);
        }
    };

    // Prevent Flash: Show Loader if Redirecting and Checking
    if (urlTrxId && isProcessing && !result) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="animate-spin text-[var(--blood-red)]" size={48} />
                <p className="text-gray-400">Verifying Transaction...</p>
            </div>
        );
    }

    if (result) {
        return (
            <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500 py-10">
                <div className="flex justify-center">
                    {result.status === 'SUCCESS' ? <CheckCircle size={80} className="text-green-500" /> :
                        result.status === 'FAILED' ? <XCircle size={80} className="text-red-500" /> :
                            <CheckCircle size={80} className="text-yellow-500 animate-pulse" />}
                </div>

                <h2 className="text-3xl font-bold text-white">
                    {result.status === 'SUCCESS' ? 'Topup Successful!' :
                        result.status === 'FAILED' ? 'Transaction Failed' :
                            'Order Created!'}
                </h2>

                <div className="bg-[#0a0a0a] p-6 rounded-xl border border-[var(--dark-blood)] text-left space-y-3 max-w-md mx-auto shadow-2xl">
                    <p className="flex justify-between"><span className="text-gray-500">Invoice</span> <span className="font-mono text-white">{result.invoice}</span></p>
                    <p className="flex justify-between"><span className="text-gray-500">Item</span> <span className="text-white font-bold">{result.productName}</span></p>
                    <div className="border-t border-gray-800 my-2 pt-2 flex justify-between text-lg">
                        <span className="text-gray-400">Total</span>
                        <span className="text-[var(--blood-red)] font-bold">Rp {result.amount.toLocaleString()}</span>
                    </div>
                    {/* Status Display */}
                    <div className="flex justify-between items-center mt-2 bg-gray-900/50 p-2 rounded">
                        <span className="text-gray-500">Status</span>
                        <span className={`font-bold px-3 py-1 rounded text-sm ${result.status === 'SUCCESS' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                            {result.status || 'PENDING'}
                        </span>
                    </div>
                </div>

                {!result.status || result.status === 'PENDING' ? (
                    <div className="space-y-4">
                        <a href={result.paymentUrl} target="_self"
                            className="inline-block w-full max-w-md bg-[var(--blood-red)] hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg animate-pulse text-lg">
                            PAY NOW via {paymentMethod}
                        </a>
                        {/* Auto Refresh Hint */}
                        <p className="text-xs text-gray-500 animate-pulse">Waiting for payment...</p>
                        <button onClick={() => window.location.reload()} className="text-sm text-gray-400 underline hover:text-white">Refresh Status</button>
                    </div>
                ) : (
                    <button onClick={() => window.location.href = '/'} className="inline-block w-full max-w-md bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-xl transition-all">
                        Make Another Order
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* 1. Account Data */}
            <section>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="bg-[var(--blood-red)] w-6 h-6 flex items-center justify-center rounded-full text-xs">1</span>
                    Account Info
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 ml-1">Game User ID</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Type User ID here..."
                                className={`bg-[#050505] border p-3 rounded-lg outline-none text-white w-full transition-colors ${nickResult ? 'border-green-500/50' : 'border-gray-800 focus:border-[var(--blood-red)]'
                                    }`}
                                value={targetId}
                                onChange={(e) => setTargetId(e.target.value)}
                            />
                            {/* Loading / Result Indicator */}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {nickCheckLoading && <Loader2 className="animate-spin text-gray-400" size={18} />}
                                {!nickCheckLoading && nickResult && (
                                    <span className="text-xs font-bold text-green-500 bg-green-900/20 px-2 py-1 rounded animate-in fade-in">
                                        {nickResult}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    {gameSlug === 'mobile-legends' && (
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 ml-1">Zone ID</label>
                            <input
                                type="text"
                                placeholder="Type Zone ID"
                                className="bg-[#050505] border border-gray-800 p-3 rounded-lg focus:border-[var(--blood-red)] outline-none text-white w-full transition-colors"
                                value={zoneId}
                                onChange={(e) => setZoneId(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                {/* Buyer Info - Auto Filled if User */}
                <div className="mt-4">
                    {user ? (
                        <div className="bg-[#0a0a0a] border border-green-900/30 p-4 rounded-xl flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-900/20 flex items-center justify-center text-green-500 font-bold">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Buying as</p>
                                <p className="font-bold text-white">{user.name} <span className="text-green-500 text-xs">(Verified)</span></p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <label className="text-xs text-gray-400 ml-1">Contact Info (For Invoice)</label>
                            <input
                                type="text"
                                placeholder="Your WhatsApp / Email"
                                className="bg-[#050505] border border-gray-800 p-3 rounded-lg focus:border-[var(--blood-red)] outline-none text-white w-full transition-colors"
                                value={guestContact}
                                onChange={(e) => setGuestContact(e.target.value)}
                            />
                            <p className="text-[10px] text-gray-600 ml-1">*Login to skip this step & get points!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* 2. Select Nominal */}
            <section>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="bg-[var(--blood-red)] w-6 h-6 flex items-center justify-center rounded-full text-xs">2</span>
                    Select Nominal
                </h3>
                {loading ? (
                    <div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {products.map(p => (
                            <div
                                key={p.id}
                                onClick={() => setSelectedProduct(p)}
                                className={`cursor-pointer border rounded-lg p-4 transition-all relative overflow-hidden ${selectedProduct?.id === p.id ? 'bg-[var(--dark-blood)] border-[var(--hell-fire)]' : 'bg-[#0a0a0a] border-gray-800 hover:border-gray-600'}`}
                            >
                                <p className="font-bold text-sm">{p.name}</p>
                                <p className="text-[var(--blood-red)] font-mono mt-1">Rp {p.price_sell.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* 3. Payment */}
            <section>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="bg-[var(--blood-red)] w-6 h-6 flex items-center justify-center rounded-full text-xs">3</span>
                    Select Payment
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Balance Option */}
                    <div
                        onClick={() => {
                            if (user && user.balance >= (selectedProduct?.price_sell || 0)) {
                                setPaymentMethod('BALANCE');
                            }
                        }}
                        className={`cursor-pointer border rounded-lg p-3 text-center transition-all flex flex-col justify-center items-center relative overflow-hidden
                            ${paymentMethod === 'BALANCE' ? 'bg-white text-black font-bold border-white' : 'bg-[#0a0a0a] border-gray-800'}
                            ${(!user || (selectedProduct && user.balance < selectedProduct.price_sell)) ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        <span>BALANCE</span>
                        {user ? (
                            <span className={`text-xs ${paymentMethod === 'BALANCE' ? 'text-gray-800' : 'text-[var(--blood-red)]'}`}>
                                (Rp {user.balance?.toLocaleString()})
                            </span>
                        ) : (
                            <span className="text-[10px] text-gray-500">(Login Required)</span>
                        )}
                    </div>

                    {['QRIS', 'VA_BCA', 'VA_MANDIRI'].map(method => (
                        <div
                            key={method}
                            onClick={() => setPaymentMethod(method)}
                            className={`cursor-pointer border rounded-lg p-3 text-center transition-all flex items-center justify-center ${paymentMethod === method ? 'bg-white text-black font-bold' : 'bg-[#0a0a0a] border-gray-800'}`}
                        >
                            {method.replace('_', ' ')}
                        </div>
                    ))}
                </div>
            </section>

            {/* Submit */}
            <div className="pt-4">
                {error && (
                    <div className="bg-red-900/50 border border-red-500 p-3 rounded mb-4 flex items-center gap-2 text-red-200 text-sm">
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                <button
                    onClick={handleOrder}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-[var(--blood-red)] to-red-900 hover:to-[var(--hell-fire)] text-white font-black py-4 rounded-xl text-lg shadow-[0_0_20px_rgba(138,0,0,0.5)] transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isProcessing ? 'Summoning Invoice...' : 'ORDER NOW 🩸'}
                </button>
            </div>
        </div>
    );
}
