'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { Loader2, CheckCircle, AlertCircle, XCircle, Clock, Zap, Wallet, CreditCard, Ticket, Globe, ChevronDown, ChevronUp, Store } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { PAYMENT_CHANNELS, PaymentChannel } from '@/lib/PaymentChannels';
import { io } from 'socket.io-client';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring' as const, stiffness: 50, damping: 20 }
    }
};

type Product = {
    id: string;
    sku_code: string;
    name: string;
    price_sell: number;
    group: string;
    category: {
        slug: string;
        name: string; // Added for grouping
        requiresZoneId?: boolean;
        requiresServerId?: boolean;
    };
};

export default function OrderForm({ gameSlug }: { gameSlug: string }) {
    const router = useRouter(); // Use Router for navigation
    const searchParams = useSearchParams();
    const urlTrxId = searchParams.get('id');

    const [products, setProducts] = useState<Product[]>([]);
    const [categoryConfig, setCategoryConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Form Inputs
    const [targetId, setTargetId] = useState('');
    const [zoneId, setZoneId] = useState('');
    const [serverId, setServerId] = useState('');
    const [guestContact, setGuestContact] = useState('');

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState(''); // 'va', 'qris', 'cstore', 'BALANCE'
    const [selectedChannel, setSelectedChannel] = useState<PaymentChannel | null>(null);

    // Voucher State
    const [voucherCode, setVoucherCode] = useState('');
    const [checkingVoucher, setCheckingVoucher] = useState(false);
    const [voucherStats, setVoucherStats] = useState({ isValid: false, discount: 0, finalPrice: 0, message: '' });

    useEffect(() => {
        setVoucherStats({ isValid: false, discount: 0, finalPrice: selectedProduct?.price_sell || 0, message: '' });
        setVoucherCode('');
    }, [selectedProduct]);

    const [expandedSections, setExpandedSections] = useState<string[]>([]);

    // Initialize expanded sections when products change
    useEffect(() => {
        if (products.length > 0) {
            const currentVarProducts = products.find(p => p.category.slug === gameSlug);
            const currentVarName = currentVarProducts?.category?.name || 'Standard';
            setExpandedSections(prev => prev.length === 0 ? [currentVarName] : prev);
        }
    }, [products, gameSlug]);

    const toggleSection = (name: string) => {
        setExpandedSections(prev =>
            prev.includes(name)
                ? prev.filter(s => s !== name)
                : [...prev, name]
        );
    };

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

    // Initialize Data & Handle Variations
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
        setLoading(true);
        Promise.all([
            // Update: Fetch products with variations included
            api.get(`/products?category=${gameSlug}&includeVariations=true`),
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

    // Active Config: Use Selected Product's category if available, else page default
    const activeConfig = selectedProduct?.category || categoryConfig;

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
                            paymentNo: trx.paymentNo,
                            paymentName: trx.paymentChannel || trx.paymentMethod,
                            status: trx.status || 'PENDING',
                            expired: trx.expired // Assuming backend sends this or we infer
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
            console.log("🔄 Polling Started for:", result.id, "Status:", result.status);
            interval = setInterval(async () => {
                try {
                    console.log("📡 Checking Status...");
                    const checkRes = await api.post(`/check-status/${result.id || urlTrxId}`);
                    console.log("📩 Status Response:", checkRes.data);
                    if (checkRes.data.success) {
                        const newStatus = checkRes.data.data.status;
                        if (newStatus !== result.status) {
                            console.log("✅ Status Changed!", newStatus);
                            setResult((prev: any) => ({ ...prev, status: newStatus }));
                        }
                        if (newStatus === 'SUCCESS' || newStatus === 'FAILED') {
                            clearInterval(interval);
                        }
                    }
                } catch (e) {
                    console.error("❌ Polling Error:", e);
                }
            }, 2000); // 2s Interval
        }
        return () => clearInterval(interval);
    }, [result?.status, urlTrxId]); // Depend on status string specifically to re-eval

    // ⚡ Real-Time Socket Update
    useEffect(() => {
        if (!result?.id) return;
        const socketUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace('/api', '');
        const socket = io(socketUrl);

        socket.on('connect', () => {
            console.log("🔌 Socket Connected for Order:", result.id);
            socket.emit('join_session', result.id); // Trx ID as Room
        });

        socket.on('transaction_update', (data: any) => {
            console.log("⚡ Socket Update Received:", data);
            if (data.status && data.status !== result.status) {
                setResult((prev: any) => ({ ...prev, status: data.status }));
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [result?.id]);

    const handleOrder = async () => {
        if (!targetId || !selectedProduct) {
            setError("Please fill in Game ID and select a product!");
            return;
        }
        if (!user && (!guestContact || guestContact.length < 9)) {
            setError("Please provide a valid WhatsApp number!");
            return;
        }
        if (!paymentMethod && !selectedChannel) {
            setError("Please select a payment method!");
            return;
        }

        setIsProcessing(true);
        setError('');

        const currentChannel = paymentMethod === 'BALANCE' ? null : selectedChannel;

        try {
            const res = await api.post('/create', {
                productId: selectedProduct.id,
                userId: targetId,
                zoneId: zoneId || serverId,
                paymentMethod: paymentMethod === 'BALANCE' ? 'BALANCE' : currentChannel?.method,
                paymentChannel: paymentMethod === 'BALANCE' ? undefined : currentChannel?.code,
                authUserId: user?.id,
                guestContact: user ? undefined : guestContact,
                voucherCode: voucherStats.isValid ? voucherCode : undefined
            });

            if (res.data.success) {
                // If Redirect (Url exists and no paymentNo), we might still want to auto-redirect?
                // But User requested Embedded. Direct Payment returns PaymentNo/QrString.
                // Redirect Payment returns Url.
                if (res.data.data.paymentUrl && !res.data.data.paymentNo) {
                    // Fallback to legacy behavior if backend returns URL only
                    window.location.href = res.data.data.paymentUrl;
                    return;
                }
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
                        ) : result.status === 'PROCESSING' ? (
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse"></div>
                                <Loader2 size={80} className="text-blue-500 relative z-10 animate-spin" />
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
                                    'WAITS FOR PAYMENT'}
                    </h2>

                    {/* Receipt Card */}
                    <div className="bg-black border border-gray-800 p-8 relative overflow-hidden group text-left" style={{ clipPath: "polygon(5% 0, 95% 0, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0 95%, 0 5%)" }}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-[var(--blood-red)] shadow-[0_0_10px_red]"></div>

                        <div className="flex justify-between items-center py-4 border-b border-gray-900 border-dashed">
                            <span className="text-gray-500 text-xs uppercase tracking-widest">Invoices</span>
                            <span className="font-mono text-white text-sm">{result.invoice}</span>
                        </div>
                        <div className="flex justify-between items-start py-4 border-b border-gray-900 border-dashed">
                            <span className="text-gray-500 text-xs uppercase tracking-widest">Item</span>
                            <span className="text-white font-bold text-sm text-right flex-1 ml-4">{result.productName}</span>
                        </div>

                        {/* PAYMENT DETAILS (EMBEDDED) - Show if PENDING or Undefined (Initial) */}
                        {(result.status === 'PENDING' || !result.status) && (
                            <div className="py-6 space-y-4">
                                {result.paymentNo ? (
                                    <div className="bg-gray-900/50 p-4 border border-gray-800 rounded text-center">
                                        <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">{result.paymentName || 'Payment Code'}</p>

                                        {/* QRIS Display Logic: Check name OR if content looks like a QR string (long) */}
                                        {(result.paymentName?.toLowerCase().includes('qris') || (result.paymentNo && result.paymentNo.length > 50)) ? (
                                            <div className="flex justify-center my-4 flex-col items-center">
                                                {/* Check if paymentNo is URL (Image) or String (Raw Data) */}
                                                {result.paymentNo.startsWith('http') ? (
                                                    <img src={result.paymentNo} className="w-48 h-48 bg-white p-2 rounded" alt="QRIS" />
                                                ) : (
                                                    <img
                                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(result.paymentNo)}`}
                                                        className="w-48 h-48 bg-white p-2 rounded"
                                                        alt="QRIS Code"
                                                    />
                                                )}
                                                <p className="text-[10px] text-gray-500 mt-2">Scan QRIS above to pay</p>
                                            </div>
                                        ) : (
                                            // VA / Retail Logic
                                            <div className="relative group cursor-pointer" onClick={() => {
                                                navigator.clipboard.writeText(result.paymentNo);
                                                alert('Copied!');
                                            }}>
                                                <p className="text-xl md:text-2xl font-mono font-bold text-white tracking-widest break-all">{result.paymentNo}</p>
                                                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-[var(--blood-red)] opacity-0 group-hover:opacity-100 transition-opacity">
                                                    CLICK TO COPY
                                                </span>
                                            </div>
                                        )}

                                        {result.expired && <p className="text-red-400 text-[10px] mt-2 font-mono">Expires in: {result.expired} hrs</p>}
                                    </div>
                                ) : (
                                    // Legacy / Fallback for non-direct or if PaymentNo missing
                                    result.paymentUrl && (
                                        <div className="text-center">
                                            <p className="text-xs text-gray-400 mb-2">Redirect Required</p>
                                            <a href={result.paymentUrl} target="_self" className="block w-full bg-[var(--blood-red)] hover:bg-red-700 text-black font-bold py-3 px-4 text-xs uppercase tracking-widest rounded transition-all">
                                                PAY NOW
                                            </a>
                                        </div>
                                    )
                                )}
                            </div>
                        )}

                        <div className="flex justify-between items-center py-4 border-t border-gray-900 border-dashed">
                            <span className="text-gray-500 text-xs uppercase tracking-widest">Total</span>
                            <span className="text-[var(--blood-red)] font-black text-xl tracking-wide">Rp {Math.floor(result.amount).toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">

                        <button
                            id="btn-check-status"
                            onClick={async (e) => {
                                const btn = e.currentTarget;
                                btn.innerText = 'SYNCING...';
                                try {
                                    const checkRes = await api.post(`/check-status/${urlTrxId || result.id}`);
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

                    <button onClick={() => window.location.href = '/'} className="text-xs text-gray-600 hover:text-[var(--blood-red)] uppercase tracking-widest transition-colors mt-8">
                        Return to Void
                    </button>
                </div>
            </div>
        );
    }

    // --- ORDER FORM UI ---
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="bg-black/80 backdrop-blur-md border border-gray-900 shadow-2xl relative overflow-hidden w-full max-w-5xl mx-auto"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 98%, 98% 100%, 2% 100%, 0 98%)" }}>

            {/* Top Red Line */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--blood-red)] to-transparent opacity-70"></div>

            <div className="p-4 md:p-8 space-y-8 relative z-10">

                {/* 1. Account Data */}
                <motion.section variants={sectionVariants}>
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

                        {activeConfig?.requiresZoneId && (
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

                        {activeConfig?.requiresServerId && (
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
                </motion.section>

                {/* 2. Select Nominal (Grouped by Variation) */}
                <motion.section variants={sectionVariants}>
                    <h3 className="text-base md:text-lg font-[family-name:var(--font-cinzel)] font-bold mb-6 flex items-center gap-3 text-white">
                        <span className="w-8 h-8 bg-red-950/50 border border-red-900 flex items-center justify-center text-[var(--blood-red)] text-sm font-mono shadow-[0_0_10px_rgba(187,10,30,0.2)]">02</span>
                        SELECT ITEM
                    </h3>

                    {loading ? (
                        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[var(--blood-red)]" size={32} /></div>
                    ) : (
                        <div className="space-y-6">
                            {/* Grouping Logic: Variation -> Product Group */}
                            {(() => {
                                const grouped = products.reduce((acc, product) => {
                                    const variationName = product.category?.name || 'Standard';
                                    if (!acc[variationName]) acc[variationName] = [];
                                    acc[variationName].push(product);
                                    return acc;
                                }, {} as Record<string, Product[]>);

                                const sortedEntries = Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0]));
                                const hasMultipleVariations = sortedEntries.length > 1;

                                return sortedEntries.map(([variationName, variationProducts]) => {
                                    const isExpanded = !hasMultipleVariations || expandedSections.includes(variationName);

                                    return (
                                        <div key={variationName} className={`rounded-xl border ${hasMultipleVariations ? 'border-gray-800' : 'border-transparent'}`}>

                                            {/* Variation Header (Clickable if multiple) */}
                                            {hasMultipleVariations && (
                                                <button
                                                    onClick={() => toggleSection(variationName)}
                                                    className="w-full flex items-center justify-between p-4 bg-gray-900/20 hover:bg-gray-900/30 transition-colors rounded-t-xl"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Globe size={16} className="text-[var(--blood-red)]" />
                                                        <span className="text-sm font-bold text-gray-200 uppercase tracking-widest">{variationName}</span>
                                                        <span className="text-xs text-gray-600 font-mono">({variationProducts.length} Items)</span>
                                                    </div>
                                                    {isExpanded ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                                                </button>
                                            )}

                                            {/* Products Content */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className={`${hasMultipleVariations ? 'p-4 pt-0 border-t border-gray-800/50' : ''}`}>
                                                            {/* Sub-Group by Product Field (Diamonds, etc) */}
                                                            {Object.entries(variationProducts.reduce((acc, product) => {
                                                                const group = product.group || 'Top Up';
                                                                if (!acc[group]) acc[group] = [];
                                                                acc[group].push(product);
                                                                return acc;
                                                            }, {} as Record<string, Product[]>)).map(([groupName, groupProducts]) => (
                                                                <div key={groupName} className="space-y-3 mt-4 first:mt-2">
                                                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                                                        {groupProducts.sort((a, b) => a.price_sell - b.price_sell).map(p => (
                                                                            <div
                                                                                key={p.id}
                                                                                onClick={() => setSelectedProduct(p)}
                                                                                className={`
                                                                                    cursor-pointer relative px-3 py-2 flex items-center justify-between border rounded-md transition-all duration-200
                                                                                    ${selectedProduct?.id === p.id
                                                                                        ? 'bg-[#2a0a0a] border-[var(--blood-red)] shadow-[0_0_10px_rgba(187,10,30,0.2)]'
                                                                                        : 'bg-[#0f0f0f] border-gray-800 hover:border-gray-600 hover:bg-[#1f1f1f]'}
                                                                                `}
                                                                            >
                                                                                <div className="flex flex-col">
                                                                                    <span className="text-[10px] sm:text-xs font-bold text-gray-300 leading-tight">
                                                                                        {p.name}
                                                                                    </span>
                                                                                </div>

                                                                                <div className="text-right">
                                                                                    <span className={`text-xs sm:text-sm font-bold font-mono ${selectedProduct?.id === p.id ? 'text-white' : 'text-[var(--blood-red)]'}`}>
                                                                                        {p.price_sell.toLocaleString()}
                                                                                    </span>
                                                                                </div>

                                                                                {selectedProduct?.id === p.id && (
                                                                                    <div className="absolute top-0 right-0 w-2 h-2 bg-[var(--blood-red)] rounded-bl-md shadow-[0_0_5px_red]"></div>
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                });
                            })()}

                            {products.length === 0 && (
                                <div className="text-center text-gray-500 py-8">No products available.</div>
                            )}
                        </div>
                    )}
                </motion.section>


                {/* 3. Select Payment (UPDATED for Direct Payment) */}
                <motion.section variants={sectionVariants}>
                    <h3 className="text-base md:text-lg font-[family-name:var(--font-cinzel)] font-bold mb-6 flex items-center gap-3 text-white">
                        <span className="w-8 h-8 bg-red-950/50 border border-red-900 flex items-center justify-center text-[var(--blood-red)] text-sm font-mono shadow-[0_0_10px_rgba(187,10,30,0.2)]">03</span>
                        PAYMENT
                    </h3>

                    {/* Balance First */}
                    <div className="mb-6">
                        <div
                            onClick={() => {
                                if (user && user.balance >= (selectedProduct?.price_sell || 0)) {
                                    setPaymentMethod('BALANCE');
                                    setSelectedChannel(null);
                                }
                            }}
                            className={`
                                cursor-pointer border p-4 flex items-center gap-4 transition-all relative rounded-lg
                                ${paymentMethod === 'BALANCE' ? 'bg-white text-black border-white' : 'bg-black border-gray-800 hover:border-gray-600'}
                                ${(!user || (selectedProduct && user.balance < selectedProduct?.price_sell)) ? 'opacity-50 grayscale cursor-not-allowed' : ''}
                            `}
                        >
                            <Wallet size={24} className={paymentMethod === 'BALANCE' ? 'text-black' : 'text-gray-500'} />
                            <div className="flex-1">
                                <p className="text-sm font-bold uppercase tracking-wider">My Balance</p>
                                {user ? (
                                    <p className="text-xs font-mono">Rp {user.balance.toLocaleString()}</p>
                                ) : (
                                    <p className="text-[10px] text-gray-500">Login to use balance</p>
                                )}
                            </div>
                            {paymentMethod === 'BALANCE' && <CheckCircle className="text-green-500" size={20} />}
                        </div>
                    </div>

                    {/* Direct Payment Channels */}
                    <div className="space-y-6">
                        {/* Group by Channel Group (QRIS, VA, Retail) */}
                        {Object.entries(PAYMENT_CHANNELS.reduce((acc, ch) => {
                            if (!acc[ch.group]) acc[ch.group] = [];
                            acc[ch.group].push(ch);
                            return acc;
                        }, {} as Record<string, PaymentChannel[]>)).map(([group, channels]) => (
                            <div key={group}>
                                <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3 pl-1 border-l-2 border-[var(--blood-red)]">{group}</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {channels.map((channel) => {
                                        const currentPrice = voucherStats.isValid ? voucherStats.finalPrice : (selectedProduct?.price_sell || 0);
                                        const isBelowMin = channel.minAmount && currentPrice < channel.minAmount;

                                        return (
                                            <div
                                                key={channel.code}
                                                onClick={() => {
                                                    if (!isBelowMin) {
                                                        setPaymentMethod(channel.method); // 'va', 'qris', etc
                                                        setSelectedChannel(channel);
                                                    }
                                                }}
                                                className={`
                                                    cursor-pointer border p-3 flex flex-col items-center justify-center gap-2 transition-all rounded text-center h-[100px] relative
                                                    ${selectedChannel?.code === channel.code ? 'bg-[#1a0505] border-[var(--blood-red)] ring-1 ring-[var(--blood-red)]' : 'bg-[#0a0a0a] border-gray-800 hover:border-gray-600 hover:bg-[#151515]'}
                                                    ${isBelowMin ? 'opacity-40 grayscale cursor-not-allowed' : ''}
                                                `}
                                            >
                                                {/* Logo Placeholder or Text */}
                                                {/* Since we don't have actual images yet, use text or icon fallback */}
                                                <div className="flex-1 flex items-center justify-center">
                                                    {channel.group === 'QRIS' ? <Zap size={24} className="text-white" /> :
                                                        channel.group === 'Retail' ? <Store size={24} className="text-blue-400" /> :
                                                            <CreditCard size={24} className="text-gray-400" />}
                                                </div>

                                                <span className={`text-[10px] font-bold uppercase tracking-wider ${selectedChannel?.code === channel.code ? 'text-[var(--blood-red)]' : 'text-gray-500'}`}>
                                                    {channel.name}
                                                </span>

                                                {isBelowMin && (
                                                    <span className="text-[8px] text-red-500 font-mono absolute bottom-1">
                                                        Min {channel.minAmount?.toLocaleString()}
                                                    </span>
                                                )}

                                                {selectedChannel?.code === channel.code && (
                                                    <div className="absolute top-2 right-2 w-2 h-2 bg-[var(--blood-red)] rounded-full animate-pulse"></div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* 4. Voucher & Contact */}
                <motion.section variants={sectionVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </motion.section>

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
        </motion.div>
    );
}
