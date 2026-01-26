'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { Loader2, CheckCircle, AlertCircle, XCircle, Clock, Zap, Wallet, CreditCard, Ticket } from 'lucide-react';

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

    const [targetId, setTargetId] = useState('');
    const [zoneId, setZoneId] = useState('');
    const [serverId, setServerId] = useState('');
    const [guestContact, setGuestContact] = useState('');

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [paymentMethod, setPaymentMethod] = useState('QRIS');

    // Voucher State
    const [voucherCode, setVoucherCode] = useState('');
    const [checkingVoucher, setCheckingVoucher] = useState(false);
    const [voucherStats, setVoucherStats] = useState({ isValid: false, discount: 0, finalPrice: 0, message: '' });

    useEffect(() => {
        setVoucherStats({ isValid: false, discount: 0, finalPrice: selectedProduct?.price_sell || 0, message: '' });
        setVoucherCode('');
    }, [selectedProduct]);

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

    const [isProcessing, setIsProcessing] = useState(!!urlTrxId);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');
    const [user, setUser] = useState<any>(null);

    const [nickCheckLoading, setNickCheckLoading] = useState(false);
    const [nickResult, setNickResult] = useState<string | null>(null);
    const [nickError, setNickError] = useState<string | null>(null);

    // ID Checking Logic
    useEffect(() => {
        const checkId = async () => {
            if (!targetId || targetId.length < 4) {
                setNickResult(null);
                setNickError(null);
                return;
            }
            if (categoryConfig?.requiresZoneId && (!zoneId || zoneId.length < 3)) return;
            if (categoryConfig?.requiresServerId && (!serverId || serverId.length < 3)) return;

            setNickCheckLoading(true);
            setNickError(null);
            setNickResult(null);

            try {
                const res = await api.post('/check-id', {
                    gameCode: categoryConfig?.code || gameSlug,
                    userId: targetId,
                    zoneId: zoneId || serverId
                });
                if (res.data.success) {
                    setNickResult(res.data.data.username || "Valid User");
                } else {
                    setNickResult(null);
                    setNickError("Account Not Found / Invalid Server");
                }
            } catch (e) {
                setNickResult(null);
                setNickError("Account Not Found");
            } finally {
                setNickCheckLoading(false);
            }
        };

        const timer = setTimeout(() => {
            checkId();
        }, 1000);

        return () => clearTimeout(timer);
    }, [targetId, zoneId, gameSlug, categoryConfig, serverId]);

    // Initialize Data
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
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

    // Check Transaction from URL
    useEffect(() => {
        if (urlTrxId) {
            setIsProcessing(true);
            api.get(`/check/${urlTrxId}`)
                .then(res => {
                    if (res.data.success) {
                        const trx = res.data.data;
                        setResult({
                            id: trx.id,
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

    // Poll Status
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (result && (result.status === 'PENDING' || result.status === 'PROCESSING')) {
            interval = setInterval(async () => {
                try {
                    const checkRes = await api.post(`/check-status/${result.id || urlTrxId}`);
                    if (checkRes.data.success) {
                        const newStatus = checkRes.data.data.status;
                        if (newStatus !== result.status) {
                            setResult((prev: any) => ({ ...prev, status: newStatus }));
                        }
                        if (newStatus === 'SUCCESS' || newStatus === 'FAILED') {
                            clearInterval(interval);
                        }
                    }
                } catch (e) { }
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [result, urlTrxId]);

    const handleOrder = async () => {
        if (!targetId || !selectedProduct) {
            setError("Please fill in Game ID and select a product!");
            return;
        }
        if (!user && (!guestContact || guestContact.length < 9)) {
            setError("Please provide a valid WhatsApp number!");
            return;
        }

        setIsProcessing(true);
        setError('');

        try {
            const res = await api.post('/create', {
                productId: selectedProduct.id,
                userId: targetId,
                zoneId: zoneId || serverId,
                paymentMethod,
                authUserId: user?.id,
                guestContact: user ? undefined : guestContact,
                voucherCode: voucherStats.isValid ? voucherCode : undefined
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

    if (urlTrxId && isProcessing && !result) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="animate-spin text-[var(--blood-red)]" size={48} />
                <p className="text-gray-400 font-mono animate-pulse">VERIFYING TRANSACTION...</p>
            </div>
        );
    }

    if (result) {
        return (
            <div className="min-h-[60vh] pt-4 pb-12 px-4 flex items-start justify-center relative">
                <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500 max-w-md w-full relative z-10">
                    {/* Status Icon */}
                    <div className="flex justify-center mb-6">
                        {result.status === 'SUCCESS' ? (
                            <div className="relative">
                                <div className="absolute inset-0 bg-[#00ff4c] blur-2xl opacity-20 animate-pulse"></div>
                                <CheckCircle size={80} className="text-[#00ff4c] relative z-10" />
                            </div>
                        ) : result.status === 'FAILED' ? (
                            <XCircle size={80} className="text-red-500" />
                        ) : (
                            <Clock size={80} className="text-yellow-500 animate-pulse" />
                        )}
                    </div>

                    <h2 className="text-3xl font-[family-name:var(--font-cinzel)] font-bold text-white uppercase tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                        {result.status === 'SUCCESS' ? 'Topup Complete' :
                            result.status === 'PROCESSING' ? 'Processing...' :
                                result.status === 'FAILED' ? 'Transaction Failed' :
                                    'Order Created'}
                    </h2>

                    {/* Receipt Card */}
                    <div className="bg-black border border-gray-800 p-8 relative overflow-hidden group" style={{ clipPath: "polygon(5% 0, 95% 0, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0 95%, 0 5%)" }}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-[var(--blood-red)] shadow-[0_0_10px_red]"></div>

                        <div className="flex justify-between items-center py-4 border-b border-gray-900 border-dashed">
                            <span className="text-gray-500 text-xs uppercase tracking-widest">Invoices</span>
                            <span className="font-mono text-white text-sm">{result.invoice}</span>
                        </div>
                        <div className="flex justify-between items-start py-4 border-b border-gray-900 border-dashed">
                            <span className="text-gray-500 text-xs uppercase tracking-widest">Item</span>
                            <span className="text-white font-bold text-sm text-right flex-1 ml-4">{result.productName}</span>
                        </div>
                        <div className="flex justify-between items-center py-4">
                            <span className="text-gray-500 text-xs uppercase tracking-widest">Total</span>
                            <span className="text-[var(--blood-red)] font-black text-xl tracking-wide">Rp {Math.floor(result.amount).toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    {!result.status || result.status === 'PENDING' ? (
                        <div className="space-y-4">
                            <a href={result.paymentUrl} target="_self"
                                className="block w-full bg-[var(--blood-red)] hover:bg-red-700 text-black font-black py-4 text-sm uppercase tracking-[0.2em] transition-all clip-path-button shadow-[0_0_20px_rgba(187,10,30,0.4)]">
                                PROCEED TO PAYMENT
                            </a>
                            <button
                                id="btn-check-status"
                                onClick={async (e) => {
                                    const btn = e.currentTarget;
                                    btn.innerText = 'SYNCING...';
                                    try {
                                        const checkRes = await api.post(`/check-status/${urlTrxId}`);
                                        if (checkRes.data.success && checkRes.data.data.status) {
                                            setResult((prev: any) => ({ ...prev, status: checkRes.data.data.status }));
                                        } else {
                                            alert('Status Unchanged');
                                        }
                                    } catch (e) {
                                        alert('Failed to check');
                                    } finally {
                                        btn.innerText = 'SYNC STATUS';
                                    }
                                }}
                                className="block w-full border border-gray-800 text-gray-500 hover:text-white hover:border-gray-500 py-3 text-xs uppercase tracking-widest transition-all"
                            >
                                SYNC STATUS
                            </button>
                        </div>
                    ) : (
                        <div className={`w-full border py-4 text-sm font-bold uppercase tracking-widest ${result.status === 'SUCCESS' ? 'border-green-500 text-green-500 bg-green-950/20' : 'border-red-500 text-red-500 bg-red-950/20'}`}>
                            TRANSACTION {result.status}
                        </div>
                    )}

                    <button onClick={() => window.location.href = '/'} className="text-xs text-gray-600 hover:text-[var(--blood-red)] uppercase tracking-widest transition-colors mt-8">
                        Return to Void
                    </button>
                </div>
            </div>
        );
    }

    // --- ORDER FORM UI ---
    return (
        <div className="bg-black/80 backdrop-blur-md border border-gray-900 shadow-2xl relative overflow-hidden w-full max-w-4xl mx-auto"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 98%, 98% 100%, 2% 100%, 0 98%)" }}>

            {/* Top Red Line */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--blood-red)] to-transparent opacity-70"></div>

            <div className="p-4 md:p-8 space-y-8 relative z-10">

                {/* 1. Account Data */}
                <section>
                    <h3 className="text-base md:text-lg font-[family-name:var(--font-cinzel)] font-bold mb-6 flex items-center gap-3 text-white">
                        <span className="w-8 h-8 bg-red-950/50 border border-red-900 flex items-center justify-center text-[var(--blood-red)] text-sm font-mono shadow-[0_0_10px_rgba(187,10,30,0.2)]">01</span>
                        ACCOUNT DATA
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder=" "
                                className="peer w-full bg-black border border-gray-800 p-4 pt-5 rounded-none focus:border-[var(--blood-red)] outline-none text-white transition-all text-sm font-bold tracking-wider"
                                value={targetId}
                                onChange={(e) => setTargetId(e.target.value)}
                            />
                            <label className="absolute left-4 top-4 text-gray-600 text-xs uppercase tracking-widest transition-all duration-300 peer-focus:-top-2 peer-focus:left-2 peer-focus:bg-black peer-focus:px-2 peer-focus:text-[var(--blood-red)] peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:left-2 peer-[&:not(:placeholder-shown)]:bg-black peer-[&:not(:placeholder-shown)]:px-2 peer-[&:not(:placeholder-shown)]:text-[var(--blood-red)] pointer-events-none">
                                User ID
                            </label>
                        </div>

                        {categoryConfig?.requiresZoneId && (
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder=" "
                                    className="peer w-full bg-black border border-gray-800 p-4 pt-5 rounded-none focus:border-[var(--blood-red)] outline-none text-white transition-all text-sm font-bold tracking-wider"
                                    value={zoneId}
                                    onChange={(e) => setZoneId(e.target.value)}
                                />
                                <label className="absolute left-4 top-4 text-gray-600 text-xs uppercase tracking-widest transition-all duration-300 peer-focus:-top-2 peer-focus:left-2 peer-focus:bg-black peer-focus:px-2 peer-focus:text-[var(--blood-red)] peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:left-2 peer-[&:not(:placeholder-shown)]:bg-black peer-[&:not(:placeholder-shown)]:px-2 peer-[&:not(:placeholder-shown)]:text-[var(--blood-red)] pointer-events-none">
                                    Zone ID
                                </label>
                            </div>
                        )}

                        {categoryConfig?.requiresServerId && (
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder=" "
                                    className="peer w-full bg-black border border-gray-800 p-4 pt-5 rounded-none focus:border-[var(--blood-red)] outline-none text-white transition-all text-sm font-bold tracking-wider"
                                    value={serverId}
                                    onChange={(e) => setServerId(e.target.value)}
                                />
                                <label className="absolute left-4 top-4 text-gray-600 text-xs uppercase tracking-widest transition-all duration-300 peer-focus:-top-2 peer-focus:left-2 peer-focus:bg-black peer-focus:px-2 peer-focus:text-[var(--blood-red)] peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:left-2 peer-[&:not(:placeholder-shown)]:bg-black peer-[&:not(:placeholder-shown)]:px-2 peer-[&:not(:placeholder-shown)]:text-[var(--blood-red)] pointer-events-none">
                                    Server ID
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Nickname Check Result / Error Display */}
                    <div className="mt-4 min-h-[40px]">
                        {nickCheckLoading && (
                            <div className="flex items-center gap-3 text-gray-400 animate-pulse">
                                <Loader2 className="animate-spin text-[var(--blood-red)]" size={18} />
                                <span className="text-xs uppercase tracking-widest font-bold">Summoning Identity...</span>
                            </div>
                        )}

                        {!nickCheckLoading && nickResult && (
                            <div className="flex items-center gap-3 bg-green-950/20 border border-green-900/50 p-3 animate-in fade-in slide-in-from-left-2 clip-path-slant"
                                style={{ clipPath: "polygon(0 0, 100% 0, 98% 100%, 0 100%)" }}>
                                <div className="bg-green-900/40 p-1 rounded-sm">
                                    <CheckCircle size={16} className="text-green-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-green-700 uppercase tracking-widest font-bold leading-none mb-1">Target Acquired</p>
                                    <p className="text-green-400 font-bold text-sm tracking-wide font-mono">{nickResult}</p>
                                </div>
                            </div>
                        )}

                        {!nickCheckLoading && nickError && (
                            <div className="flex items-center gap-3 bg-red-950/20 border border-red-900/50 p-3 animate-in fade-in slide-in-from-left-2 clip-path-slant"
                                style={{ clipPath: "polygon(0 0, 100% 0, 98% 100%, 0 100%)" }}>
                                <div className="bg-red-900/40 p-1 rounded-sm">
                                    <XCircle size={16} className="text-red-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-red-700 uppercase tracking-widest font-bold leading-none mb-1">Target Unknown</p>
                                    <p className="text-red-400 font-bold text-sm tracking-wide font-mono">{nickError}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* 2. Select Nominal */}
                <section>
                    <h3 className="text-base md:text-lg font-[family-name:var(--font-cinzel)] font-bold mb-6 flex items-center gap-3 text-white">
                        <span className="w-8 h-8 bg-red-950/50 border border-red-900 flex items-center justify-center text-[var(--blood-red)] text-sm font-mono shadow-[0_0_10px_rgba(187,10,30,0.2)]">02</span>
                        SELECT ITEM
                    </h3>

                    {loading ? (
                        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[var(--blood-red)]" size={32} /></div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                            {products.map(p => (
                                <div
                                    key={p.id}
                                    onClick={() => setSelectedProduct(p)}
                                    className={`
                                        cursor-pointer relative p-4 flex flex-col justify-between min-h-[100px] group transition-all duration-300
                                        ${selectedProduct?.id === p.id
                                            ? 'bg-red-950/30 border border-[var(--blood-red)] shadow-[0_0_20px_rgba(187,10,30,0.2)]'
                                            : 'bg-black border border-gray-900 hover:border-gray-700 hover:bg-gray-900/50'}
                                    `}
                                    style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)" }}
                                >
                                    <div className="absolute top-0 right-0 p-1">
                                        <div className={`w-2 h-2 rounded-full ${selectedProduct?.id === p.id ? 'bg-[var(--blood-red)]' : 'bg-gray-800 group-hover:bg-gray-600'}`}></div>
                                    </div>

                                    <p className="font-bold text-xs md:text-sm text-gray-200 group-hover:text-white mb-2 leading-tight">{p.name}</p>
                                    <p className="text-[var(--blood-red)] font-mono text-sm font-bold">Rp {p.price_sell.toLocaleString()}</p>

                                    {/* Selection Glow */}
                                    {selectedProduct?.id === p.id && (
                                        <div className="absolute inset-0 bg-[var(--blood-red)] opacity-5 pointer-events-none"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* 3. Select Payment */}
                <section>
                    <h3 className="text-base md:text-lg font-[family-name:var(--font-cinzel)] font-bold mb-6 flex items-center gap-3 text-white">
                        <span className="w-8 h-8 bg-red-950/50 border border-red-900 flex items-center justify-center text-[var(--blood-red)] text-sm font-mono shadow-[0_0_10px_rgba(187,10,30,0.2)]">03</span>
                        PAYMENT
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {/* Balance Option */}
                        <div
                            onClick={() => {
                                if (user && user.balance >= (selectedProduct?.price_sell || 0)) {
                                    setPaymentMethod('BALANCE');
                                }
                            }}
                            className={`
                                cursor-pointer border p-4 flex flex-col items-center justify-center gap-2 transition-all relative
                                ${paymentMethod === 'BALANCE' ? 'bg-white text-black border-white' : 'bg-black border-gray-800 hover:border-gray-600'}
                                ${(!user || (selectedProduct && user.balance < selectedProduct?.price_sell)) ? 'opacity-50 grayscale cursor-not-allowed' : ''}
                            `}
                        >
                            <Wallet size={20} className={paymentMethod === 'BALANCE' ? 'text-black' : 'text-gray-500'} />
                            <span className="text-xs font-bold uppercase tracking-wider">Balance</span>
                            {user && <span className="text-[10px] font-mono">Rp {user.balance.toLocaleString()}</span>}
                        </div>

                        {/* Other Options */}
                        {[
                            { code: 'QRIS', label: 'QRIS', icon: Zap },
                            { code: 'VA', label: 'Virtual Acc', icon: CreditCard }
                        ].map(method => (
                            <div
                                key={method.code}
                                onClick={() => setPaymentMethod(method.code)}
                                className={`
                                    cursor-pointer border p-4 flex flex-col items-center justify-center gap-2 transition-all
                                    ${paymentMethod === method.code ? 'bg-white text-black border-white' : 'bg-black border-gray-800 hover:border-gray-600 text-gray-500 hover:text-white'}
                                `}
                            >
                                <method.icon size={20} />
                                <span className="text-xs font-bold uppercase tracking-wider">{method.label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. Voucher & Contact */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Guest Contact */}
                    {!user && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-[family-name:var(--font-cinzel)] font-bold text-gray-400">CONTACT INFO</h3>
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder=" "
                                    className="peer w-full bg-black border border-gray-800 p-4 pt-5 rounded-none focus:border-[var(--blood-red)] outline-none text-white transition-all text-sm font-bold tracking-wider"
                                    value={guestContact}
                                    onChange={(e) => setGuestContact(e.target.value.replace(/\D/g, ''))}
                                />
                                <label className="absolute left-4 top-4 text-gray-600 text-xs uppercase tracking-widest transition-all duration-300 peer-focus:-top-2 peer-focus:left-2 peer-focus:bg-black peer-focus:px-2 peer-focus:text-[var(--blood-red)] peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:left-2 peer-[&:not(:placeholder-shown)]:bg-black peer-[&:not(:placeholder-shown)]:px-2 peer-[&:not(:placeholder-shown)]:text-[var(--blood-red)] pointer-events-none">
                                    WhatsApp Number
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Voucher */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-[family-name:var(--font-cinzel)] font-bold text-gray-400">VOUCHER CODE</h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="ENTER CODE"
                                className="flex-1 bg-black border border-gray-800 px-4 py-3 text-white focus:border-[var(--blood-red)] outline-none uppercase text-sm font-bold tracking-widest placeholder:text-gray-800"
                                value={voucherCode}
                                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                            />
                            <button
                                onClick={handleApplyVoucher}
                                disabled={checkingVoucher || !selectedProduct}
                                className="bg-gray-900 border border-gray-800 hover:bg-gray-800 text-white px-6 font-bold disabled:opacity-50 transition-colors"
                            >
                                {checkingVoucher ? '...' : <Ticket size={18} />}
                            </button>
                        </div>
                        {voucherStats.isValid && (
                            <div className="text-xs text-green-500 font-mono flex items-center gap-2">
                                <CheckCircle size={12} /> Discount Applied: -Rp {voucherStats.discount.toLocaleString()}
                            </div>
                        )}
                        {voucherStats.message && !voucherStats.isValid && (
                            <div className="text-xs text-red-500 font-mono flex items-center gap-2">
                                <XCircle size={12} /> {voucherStats.message}
                            </div>
                        )}
                    </div>
                </section>

                {/* Footer / Submit */}
                <div className="border-t border-dashed border-gray-800 pt-6 mt-8">
                    <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-6">
                        <div className="text-right w-full md:w-auto md:text-left">
                            <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Total Payment</p>
                            <p className="text-4xl font-black text-[var(--blood-red)] font-[family-name:var(--font-cinzel)]">
                                Rp {(voucherStats.isValid ? voucherStats.finalPrice : (selectedProduct?.price_sell || 0)).toLocaleString()}
                            </p>
                        </div>

                        <button
                            onClick={handleOrder}
                            disabled={isProcessing}
                            className="w-full md:w-auto flex-1 bg-[var(--blood-red)] hover:bg-red-700 text-black font-black py-5 px-8 text-sm uppercase tracking-[0.2em] transition-all clip-path-button shadow-[0_0_25px_rgba(187,10,30,0.4)] disabled:opacity-50 disabled:grayscale"
                        >
                            {isProcessing ? 'SUMMONING...' : 'INITIATE ORDER'}
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-950/20 border border-red-900/50 p-4 text-center text-red-500 text-xs font-bold tracking-wide uppercase animate-pulse">
                            ⚠️ {error}
                        </div>
                    )}
                </div>
            </div>

            {/* Styles for Clip Path if not in global */}
            <style jsx>{`
                .clip-path-button {
                    clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
                }
            `}</style>
        </div>
    );
}
