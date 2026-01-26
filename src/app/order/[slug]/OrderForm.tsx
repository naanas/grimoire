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
    category: {
        slug: string;
        requiresZoneId?: boolean;
        requiresServerId?: boolean;
    };
};

export default function OrderForm({ gameSlug }: { gameSlug: string }) {
    const searchParams = useSearchParams();
    const urlTrxId = searchParams.get('id');

    const [products, setProducts] = useState<Product[]>([]);
    const [categoryConfig, setCategoryConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [targetId, setTargetId] = useState(''); // Game User ID
    const [zoneId, setZoneId] = useState('');
    const [serverId, setServerId] = useState('');
    const [guestContact, setGuestContact] = useState(''); // WA/Email for Guest

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [paymentMethod, setPaymentMethod] = useState('QRIS');

    // Voucher State
    const [voucherCode, setVoucherCode] = useState('');
    const [checkingVoucher, setCheckingVoucher] = useState(false);
    const [voucherStats, setVoucherStats] = useState({ isValid: false, discount: 0, finalPrice: 0, message: '' });

    // Reset voucher when product changes
    useEffect(() => {
        setVoucherStats({ isValid: false, discount: 0, finalPrice: selectedProduct?.price_sell || 0, message: '' });
        setVoucherCode('');
    }, [selectedProduct]);

    // Handle Voucher Apply
    const handleApplyVoucher = async () => {
        if (!voucherCode || !selectedProduct) return;
        setCheckingVoucher(true);
        try {
            const res = await api.post('/voucher/check', { code: voucherCode, amount: selectedProduct.price_sell });
            if (res.data.success) {
                setVoucherStats({
                    isValid: true,
                    discount: res.data.data.discount,
                    finalPrice: res.data.data.finalPrice,
                    message: 'Voucher Applied! 🎉'
                });
            } else {
                setVoucherStats({ isValid: false, discount: 0, finalPrice: selectedProduct.price_sell, message: res.data.message || 'Invalid Voucher' });
            }
        } catch (error: any) {
            setVoucherStats({ isValid: false, discount: 0, finalPrice: selectedProduct.price_sell, message: error.response?.data?.message || 'Error checking voucher' });
        } finally {
            setCheckingVoucher(false);
        }
    };

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

            // Dynamic Requirement Check
            if (categoryConfig?.requiresZoneId && (!zoneId || zoneId.length < 3)) return;
            if (categoryConfig?.requiresServerId && (!serverId || serverId.length < 3)) return;

            setNickCheckLoading(true);
            try {
                const res = await api.post('/check-id', {
                    gameCode: categoryConfig?.code || gameSlug, // Send Code preferred
                    userId: targetId,
                    zoneId: zoneId || serverId // Some games use Server ID as Zone ID in provider
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
        // 1. Fetch Products & Category Config
        setLoading(true);
        Promise.all([
            api.get(`/products?category=${gameSlug}`),
            api.get(`/categories/${gameSlug}`)
        ])
            .then(([resProducts, resCat]) => {
                if (resProducts.data.success) {
                    setProducts(resProducts.data.data);
                }
                if (resCat.data.success) {
                    setCategoryConfig(resCat.data.data);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [gameSlug]);

    // If URL has ID, fetch transaction details (Redirect from Ipaymu)
    useEffect(() => {
        if (urlTrxId) {
            setIsProcessing(true);
            api.get(`/check/${urlTrxId}`)
                .then(res => {
                    if (res.data.success) {
                        const trx = res.data.data;
                        setResult({
                            id: trx.id, // Ensure ID is saved
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

    // Auto-Poll Status if Pending/Processing
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (result && (result.status === 'PENDING' || result.status === 'PROCESSING')) {
            interval = setInterval(async () => {
                try {
                    // Use the dedicated check-status endpoint (or simple get check)
                    const checkRes = await api.post(`/check-status/${result.id || urlTrxId}`);
                    if (checkRes.data.success) {
                        const newStatus = checkRes.data.data.status;
                        if (newStatus !== result.status) {
                            setResult((prev: any) => ({ ...prev, status: newStatus }));
                        }
                        // Stop polling if final state
                        if (newStatus === 'SUCCESS' || newStatus === 'FAILED') {
                            clearInterval(interval);
                        }
                    }
                } catch (e) {
                    // Ignore errors during poll
                }
            }, 5000); // 5 Seconds
        }

        return () => clearInterval(interval);
    }, [result, urlTrxId]);

    // Check Mock Mode from Env
    const [isMockMode, setIsMockMode] = useState(false);
    useEffect(() => {
        // Simple check for dev environment
        if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
            setIsMockMode(true);
        }
    }, []);

    const handleOrder = async () => {
        // Validation
        if (!targetId || !selectedProduct) {
            setError("Please fill in Game ID and select a product!");
            return;
        }

        // Guest Contact Validation
        // Guest Contact Validation
        if (!user && (!guestContact || guestContact.length < 9)) {
            setError("Please provide a valid WhatsApp number!");
            return;
        }

        setIsProcessing(true);
        setError('');

        try {
            const res = await api.post('/create', {
                productId: selectedProduct.id,
                userId: targetId, // Target Game ID
                zoneId: zoneId || serverId, // Use Zone or Server ID
                paymentMethod,
                authUserId: user?.id, // Real DB User ID for tracking & Balance
                guestContact: user ? undefined : guestContact, // Send guest contact only if not logged in
                voucherCode: voucherStats.isValid ? voucherCode : undefined // Send voucher if valid
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
            <div className="min-h-[60vh] pt-4 pb-12 px-4 flex items-start justify-center relative">
                {/* Background Pattern included in Layout, but we can add overlay if needed */}

                <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500 max-w-md w-full">

                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        {result.status === 'SUCCESS' ? (
                            <div className="rounded-full border-[6px] border-[#00ff4c] p-2">
                                <CheckCircle size={80} className="text-[#00ff4c] fill-none stroke-[3px]" />
                            </div>
                        ) : result.status === 'FAILED' ? (
                            <div className="rounded-full border-[6px] border-red-500 p-2">
                                <XCircle size={80} className="text-red-500 fill-none stroke-[3px]" />
                            </div>
                        ) : (
                            <div className="rounded-full border-[6px] border-yellow-500 p-2">
                                <Clock size={80} className="text-yellow-500 fill-none stroke-[3px] animate-pulse" />
                            </div>
                        )}
                    </div>

                    <h2 className="text-4xl font-bold text-white tracking-wide drop-shadow-lg">
                        {result.status === 'SUCCESS' ? 'Topup Successful!' :
                            result.status === 'PROCESSING' ? 'Order Processing!' :
                                result.status === 'FAILED' ? 'Transaction Failed' :
                                    'Order Created!'}
                    </h2>

                    {/* Card */}
                    <div className="bg-[#0a0a0a] p-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-[#222]">
                        <div className="flex justify-between items-center py-4 border-b border-gray-800">
                            <span className="text-gray-400 text-lg">Invoice</span>
                            <span className="font-mono text-white text-lg tracking-wider">{result.invoice}</span>
                        </div>
                        <div className="flex justify-between items-start py-4 border-b border-gray-800">
                            <span className="text-gray-400 text-lg">Item</span>
                            <span className="text-white font-bold text-lg text-right flex-1 ml-4">{result.productName}</span>
                        </div>
                        <div className="flex justify-between items-center py-4">
                            <span className="text-gray-400 text-lg">Amount</span>
                            <span className="text-[#ff1f1f] font-bold text-xl tracking-wide">Rp {Math.floor(result.amount).toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Pay Button / Status */}
                    {!result.status || result.status === 'PENDING' ? (
                        <div className="space-y-4">
                            <a href={result.paymentUrl} target="_self"
                                className="block w-full bg-[#8a0000] hover:bg-[#a30000] text-white font-bold py-4 rounded-xl text-lg uppercase tracking-widest shadow-[0_5px_20px_rgba(138,0,0,0.4)] transition-all transform hover:scale-[1.02]">
                                PAY NOW via {paymentMethod}
                            </a>

                            {/* Manual Check Status Button */}
                            <button
                                onClick={async () => {
                                    const btn = document.getElementById('btn-check-status');
                                    if (btn) btn.innerHTML = 'Checking...';
                                    try {
                                        const checkRes = await api.post(`/check-status/${urlTrxId}`);
                                        if (checkRes.data.success && checkRes.data.data.status) {
                                            // Update Local Result State directly
                                            setResult((prev: any) => ({
                                                ...prev,
                                                status: checkRes.data.data.status
                                            }));
                                        } else {
                                            alert('Status Unchanged');
                                        }
                                    } catch (e) {
                                        alert('Failed to check status');
                                    } finally {
                                        if (btn) btn.innerHTML = 'Sync Provider Status';
                                    }
                                }}
                                id="btn-check-status"
                                className="block w-full text-xs text-[#ff1f1f] border border-[#ff1f1f] rounded py-2 hover:bg-[#ff1f1f] hover:text-white transition-all uppercase tracking-wider"
                            >
                                Sync Provider Status
                            </button>
                        </div>
                    ) : (
                        <div className="w-full bg-[#1a4d2e] border border-[#00ff4c] text-[#00ff4c] font-bold py-4 rounded-xl text-lg uppercase tracking-widest shadow-lg">
                            Transaction {result.status}
                        </div>
                    )}

                    {/* Make Another Order */}
                    <button onClick={() => window.location.href = '/'} className="block mx-auto text-gray-400 hover:text-white underline underline-offset-4 text-sm tracking-wide transition-colors">
                        back to home
                    </button>


                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#111] border border-[#222] rounded-xl p-6 shadow-2xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--blood-red)]/20 blur-3xl rounded-full pointer-events-none"></div>

            <div className="space-y-8 relative z-10">
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
                                { /* Loading Indicator (Inside) */}
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {nickCheckLoading && <Loader2 className="animate-spin text-gray-400" size={18} />}
                                </div>
                            </div>
                            { /* Nickname Result (Below) */}
                            {!nickCheckLoading && nickResult && (
                                <div className="flex items-center gap-2 text-xs font-bold text-green-500 bg-green-900/10 border border-green-900/30 px-3 py-2 rounded animate-in fade-in slide-in-from-top-1">
                                    <CheckCircle size={14} />
                                    <span>{nickResult}</span>
                                </div>
                            )}
                        </div>

                        {categoryConfig?.requiresZoneId && (
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

                        {categoryConfig?.requiresServerId && (
                            <div className="space-y-2">
                                <label className="text-xs text-gray-400 ml-1">Server ID</label>
                                <input
                                    type="text"
                                    placeholder="Type Server ID"
                                    className="bg-[#050505] border border-gray-800 p-3 rounded-lg focus:border-[var(--blood-red)] outline-none text-white w-full transition-colors"
                                    value={serverId}
                                    onChange={(e) => setServerId(e.target.value)}
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
                                <label className="text-xs text-gray-400 ml-1">WhatsApp Number <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    placeholder="08xxxxxxxxxx"
                                    className="bg-[#050505] border border-gray-800 p-3 rounded-lg focus:border-[var(--blood-red)] outline-none text-white w-full transition-colors"
                                    value={guestContact}
                                    onChange={(e) => setGuestContact(e.target.value.replace(/\D/g, ''))} // Only numbers
                                />
                                <p className="text-[10px] text-gray-600 ml-1">*Required for Invoice & Notification</p>
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

                        {/* Payment Options */}
                        {[
                            { code: 'QRIS', label: 'QRIS (All E-Wallet)' },
                            { code: 'VA', label: 'Virtual Account (Bank)' }
                        ].map(method => (
                            <div
                                key={method.code}
                                onClick={() => setPaymentMethod(method.code)}
                                className={`cursor-pointer border rounded-lg p-3 text-center transition-all flex items-center justify-center ${paymentMethod === method.code ? 'bg-white text-black font-bold' : 'bg-[#0a0a0a] border-gray-800'}`}
                            >
                                {method.label}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Voucher Section */}
                <section>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span className="bg-[var(--blood-red)] w-6 h-6 flex items-center justify-center rounded-full text-xs">4</span>
                        Voucher (Optional)
                    </h3>
                    <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[var(--glass-border)] space-y-3">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Enter Code (e.g. DISKON10)"
                                className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[var(--blood-red)] outline-none uppercase"
                                value={voucherCode}
                                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                            />
                            <button
                                onClick={handleApplyVoucher}
                                disabled={checkingVoucher || !selectedProduct}
                                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-bold transition-all border border-gray-600 disabled:opacity-50"
                            >
                                {checkingVoucher ? '...' : 'APPLY'}
                            </button>
                        </div>
                        {voucherStats.message && (
                            <p className={`text-xs ${voucherStats.isValid ? 'text-green-400' : 'text-red-400'}`}>
                                {voucherStats.message}
                            </p>
                        )}

                        {voucherStats.isValid && (
                            <div className="flex justify-between items-center text-sm bg-green-900/10 p-2 rounded border border-green-900/50">
                                <span className="text-green-400">Discount Applied:</span>
                                <span className="font-bold text-green-400">- Rp {voucherStats.discount.toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                </section>

                {/* Submit */}
                <div className="pt-4">
                    {/* Price Summary before Button */}
                    <div className="mb-4 text-right">
                        <p className="text-gray-400 text-sm">Total Payment</p>
                        <p className="text-3xl font-bold text-[var(--blood-red)]">
                            Rp {(voucherStats.isValid ? voucherStats.finalPrice : (selectedProduct?.price_sell || 0)).toLocaleString()}
                        </p>
                    </div>
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
            </div >
        </div >
    );
}
