'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { Loader2, CheckCircle, AlertCircle, XCircle, Clock, Zap, Wallet, CreditCard, Ticket, Globe, ChevronDown, ChevronUp, Store, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { PaymentChannel } from '@/lib/PaymentChannels';
import OrderSummary, { MobileSummaryBar } from '@/components/OrderSummary';
import { useTransactionRealtime, mapTrxToCheckoutResult } from '@/hooks/useTransactionRealtime';
import { useUIStore } from '@/lib/uiStore';
import CheckoutResultScreen, { CheckoutResult } from './components/CheckoutResultScreen';
import PaymentChannelsGrid from './components/PaymentChannelsGrid';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: 'tween', ease: 'easeOut', duration: 0.3 }
    }
};

const productGridVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.03
        }
    }
};

const productItemVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        scale: 1,
        transition: { type: 'tween', ease: 'easeOut', duration: 0.2 }
    }
};

type Product = {
    id: string;
    name: string;
    price_sell: number;
    group: string;
    category: {
        slug: string;
        name: string;
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
    const [channels, setChannels] = useState<PaymentChannel[]>([]);
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

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Dynamic Fee Sync
    const [dynamicFee, setDynamicFee] = useState<number | null>(null);
    const [loadingFee, setLoadingFee] = useState(false);

    useEffect(() => {
        const fetchFee = async () => {
            if (!selectedProduct || !selectedChannel) {
                setDynamicFee(null);
                return;
            }

            // [FIX] Abort fee calc if < 10k and not QRIS (wait for reset effect)
            const currentPrice = voucherStats.isValid ? voucherStats.finalPrice : selectedProduct.price_sell;
            if (currentPrice < 10000 && selectedChannel.group !== 'QRIS') {
                setDynamicFee(null);
                return;
            }

            // Only sync for TRX/Tripay channels (or implement general if needed)
            // For now, let's hit our proxy whenever a channel is selected
            setLoadingFee(true);
            try {
                const amount = voucherStats.isValid ? voucherStats.finalPrice : selectedProduct.price_sell;
                const res = await api.get(`/calculate-fee`, {
                    params: { code: selectedChannel.code, amount }
                });

                if (res.data.success) {
                    const realFee = res.data.data.total_fee.customer;
                    setDynamicFee(realFee);
                    console.log(`📡 [DYNAMIC-FEE] Sync: Rp${realFee}`);
                }
            } catch (err) {
                console.error("Fee Sync Failed, using local fallback");
                // Fallback to local calculation if proxy fails
                const price = voucherStats.isValid ? voucherStats.finalPrice : selectedProduct.price_sell;
                const fallback = Math.floor((selectedChannel.flatFee || 0) + ((selectedChannel.percentFee || 0) / 100 * price));
                setDynamicFee(fallback);
            } finally {
                setLoadingFee(false);
            }
        };

        fetchFee();
    }, [selectedProduct, selectedChannel, voucherStats.isValid, voucherStats.finalPrice]);

    // Enforce < 10k Rule: Reset payment if product changes to < 10k and method is not QRIS
    useEffect(() => {
        const currentPrice = voucherStats.isValid ? voucherStats.finalPrice : (selectedProduct?.price_sell || 0);
        if (currentPrice > 0 && currentPrice < 10000 && selectedChannel && selectedChannel.group !== 'QRIS') {
            setPaymentMethod('');
            setSelectedChannel(null);
        }
    }, [selectedProduct, voucherStats, selectedChannel]);

    const [expandedSections, setExpandedSections] = useState<string[]>([]);

    // Initialize expanded sections when products change
    // Initialize expanded sections when products change
    // useEffect(() => {
    //     if (products.length > 0) {
    //         const currentVarProducts = products.find(p => p.category.slug === gameSlug);
    //         const currentVarName = currentVarProducts?.category?.name || 'Standard';
    //         setExpandedSections(prev => prev.length === 0 ? [currentVarName] : prev);
    //     }
    // }, [products, gameSlug]);

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

    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<any>(null);

    const activeTrxId = useMemo(() => urlTrxId || result?.id || null, [urlTrxId, result?.id]);
    const { trx: liveTrx, loading: trxLoading, refresh: refreshTrx } = useTransactionRealtime(activeTrxId);

    useEffect(() => {
        if (!liveTrx) return;
        setResult((prev: any) => mapTrxToCheckoutResult(liveTrx, prev));
    }, [liveTrx]);
    const [error, setError] = useState('');
    const [user, setUser] = useState<any>(null);

    const [nickCheckLoading, setNickCheckLoading] = useState(false);
    const [nickResult, setNickResult] = useState<string | null>(null);
    const [nickError, setNickError] = useState<string | null>(null);
    const [summaryExpanded, setSummaryExpanded] = useState(false);
    const { setMobileSummaryExpanded } = useUIStore();
    const [highlightGuestInput, setHighlightGuestInput] = useState(false); // For blinking effect

    // Sync local summary state with global store
    useEffect(() => {
        setMobileSummaryExpanded(summaryExpanded);
    }, [summaryExpanded, setMobileSummaryExpanded]);

    // Popup Validation State
    const [showValidationModal, setShowValidationModal] = useState(false);
    const [missingFields, setMissingFields] = useState<string[]>([]);

    // ID Checking Logic
    useEffect(() => {
        const checkId = async () => {
            // Skip check for PUBG
            if (gameSlug.toLowerCase().includes('pubg')) return;

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
            api.get(`/categories/${gameSlug}`),
            api.get('/config'), // Fetch Payment Gateway Config
            api.get('/payment/methods') // Fetch Active Payment Methods
        ])
            .then(([resProducts, resCat, resConfig, resMethods]) => {
                if (resProducts.data.success) {
                    setProducts(resProducts.data.data);
                }
                if (resCat.data.success) {
                    setCategoryConfig(resCat.data.data);
                }
                if (resConfig.data.success) {
                    console.log("💳 Payment Gateway:", resConfig.data.data.PAYMENT_GATEWAY);
                    // We can store this in a state if needed for UI adjustments
                    // setGateway(resConfig.data.data.PAYMENT_GATEWAY);
                }
                if (resMethods.data.success) {
                    setChannels(resMethods.data.data);
                    console.log("💰 Active Payment Methods:", resMethods.data.data.length);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [gameSlug]);

    // Active Config: Use Selected Product's category if available, else page default
    const activeConfig = selectedProduct?.category || categoryConfig;

    const handleOrder = async () => {
        const missing = [];
        if (!targetId) missing.push("User ID");
        if (!selectedProduct) missing.push("Product Item");
        if (!paymentMethod && !selectedChannel) missing.push("Payment Method");

        if (missing.length > 0) {
            setMissingFields(missing);
            setShowValidationModal(true);
            return;
        }

        // Require phone for guest OR logged-in user without phone (except BALANCE payment)
        // Require phone for guest OR logged-in user without phone (except BALANCE payment)
        if (paymentMethod !== 'BALANCE' && (!user || !user.phoneNumber)) {
            if (!guestContact || guestContact.length < 9) {
                // Auto-expand mobile summary and highlight input
                setSummaryExpanded(true);
                setHighlightGuestInput(true);
                setTimeout(() => setHighlightGuestInput(false), 2000); // Reset after animation

                setError("Please provide a valid WhatsApp number!");
                return;
            }
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
                productId: selectedProduct!.id,
                userId: targetId,
                zoneId: zoneId || serverId,
                paymentMethod: paymentMethod === 'BALANCE' ? 'BALANCE' : currentChannel?.method,
                paymentChannel: paymentMethod === 'BALANCE' ? undefined : currentChannel?.code,
                authUserId: user?.id,
                guestContact: guestContact || user?.phoneNumber || undefined,
                voucherCode: voucherStats.isValid ? voucherCode : undefined
            });

            if (res.data.success) {
                const trx = res.data.data;
                router.replace(`?id=${trx.id}`, { scroll: false });
                setResult(mapTrxToCheckoutResult(trx));
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Transaction Failed');
        } finally {
            setIsProcessing(false);
        }
    };

    if (urlTrxId && trxLoading && !result) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="animate-spin text-(--blood-red)" size={48} />
                <p className="text-gray-400 font-mono animate-pulse">VERIFYING TRANSACTION...</p>
            </div>
        );
    }

    if (result) {
        return (
            <CheckoutResultScreen 
                result={result as CheckoutResult} 
                urlTrxId={urlTrxId || undefined}
                onRefresh={refreshTrx}
                onUpdateResult={(newResult) => setResult(newResult)}
            />
        );
    }

    // --- ORDER FORM UI ---
    const basePrice = voucherStats.isValid ? voucherStats.finalPrice : (selectedProduct?.price_sell || 0);
    const totalPrice = basePrice + (dynamicFee || 0);

    return (
        <>
            {/* Desktop: Two Column Layout */}
            <div className="grid lg:grid-cols-[1fr_320px] gap-6 max-w-[1400px] mx-auto pb-32 lg:pb-0">
                {/* LEFT: Main Order Form */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="bg-[#05050f]/90 backdrop-blur-xl border border-[#00f5ff]/10 shadow-[0_0_60px_rgba(0,245,255,0.04)] rounded-xl relative overflow-hidden w-full">

                    {/* Neon Scanline */}
                    <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[#00f5ff]/50 to-transparent" />

                    <div className="p-4 md:p-8 space-y-8 relative z-10">

                        {/* 1. Account Data */}
                        <motion.section variants={sectionVariants}>
                            <h3 className="text-base md:text-lg font-(family-name:--font-cinzel) font-bold mb-6 flex items-center gap-3 text-white">
                                <span className="w-8 h-8 rounded-md bg-[#00f5ff]/10 border border-[#00f5ff]/30 flex items-center justify-center text-[#00f5ff] text-xs font-mono shadow-[0_0_10px_rgba(0,245,255,0.2)]">01</span>
                                ACCOUNT DATA
                                <span className="flex-1 h-px bg-linear-to-r from-[#00f5ff]/20 to-transparent" />
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative group">
                                    <input
                                        id="target-id-input"
                                        type="text"
                                        placeholder=" "
                                        className="peer w-full bg-white/3 border border-white/10 rounded-lg p-4 pt-5 focus:border-[#00f5ff]/50 focus:ring-1 focus:ring-[#00f5ff]/15 outline-none text-white transition-all text-sm font-bold tracking-wider"
                                        value={targetId}
                                        onChange={(e) => setTargetId(e.target.value)}
                                    />
                                    <label className="absolute left-4 top-4 text-white/25 text-xs uppercase tracking-widest transition-all duration-300 peer-focus:-top-2 peer-focus:left-3 peer-focus:bg-[#08081a] peer-focus:px-1.5 peer-focus:text-[#00f5ff] peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:left-3 peer-not-placeholder-shown:bg-[#08081a] peer-not-placeholder-shown:px-1.5 peer-not-placeholder-shown:text-[#00f5ff]/70 pointer-events-none">
                                        User ID
                                    </label>
                                </div>

                                {activeConfig?.requiresZoneId && (
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            placeholder=" "
                                            className="peer w-full bg-white/3 border border-white/10 rounded-lg p-4 pt-5 focus:border-[#00f5ff]/50 focus:ring-1 focus:ring-[#00f5ff]/15 outline-none text-white transition-all text-sm font-bold tracking-wider"
                                            value={zoneId}
                                            onChange={(e) => setZoneId(e.target.value)}
                                        />
                                        <label className="absolute left-4 top-4 text-white/25 text-xs uppercase tracking-widest transition-all duration-300 peer-focus:-top-2 peer-focus:left-3 peer-focus:bg-[#08081a] peer-focus:px-1.5 peer-focus:text-[#00f5ff] peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:left-3 peer-not-placeholder-shown:bg-[#08081a] peer-not-placeholder-shown:px-1.5 peer-not-placeholder-shown:text-[#00f5ff]/70 pointer-events-none">
                                            Zone ID
                                        </label>
                                    </div>
                                )}

                                {activeConfig?.requiresServerId && (
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            placeholder=" "
                                            className="peer w-full bg-white/3 border border-white/10 rounded-lg p-4 pt-5 focus:border-[#00f5ff]/50 focus:ring-1 focus:ring-[#00f5ff]/15 outline-none text-white transition-all text-sm font-bold tracking-wider"
                                            value={serverId}
                                            onChange={(e) => setServerId(e.target.value)}
                                        />
                                        <label className="absolute left-4 top-4 text-white/25 text-xs uppercase tracking-widest transition-all duration-300 peer-focus:-top-2 peer-focus:left-3 peer-focus:bg-[#08081a] peer-focus:px-1.5 peer-focus:text-[#00f5ff] peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:left-3 peer-not-placeholder-shown:bg-[#08081a] peer-not-placeholder-shown:px-1.5 peer-not-placeholder-shown:text-[#00f5ff]/70 pointer-events-none">
                                            Server ID
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Nickname Check Result / Error Display */}
                            <div className="mt-4 min-h-[40px]">
                                {nickCheckLoading && (
                                    <div className="flex items-center gap-3 text-gray-400 animate-pulse">
                                        <Loader2 className="animate-spin text-(--blood-red)" size={18} />
                                        <span className="text-xs uppercase tracking-widest font-bold">Summoning Identity...</span>
                                    </div>
                                )}

                                {!nickCheckLoading && nickResult && (
                                    <div className="flex items-center gap-3 bg-green-500/5 border border-green-500/25 p-3 rounded-lg animate-in fade-in slide-in-from-left-2">
                                        <div className="bg-green-500/10 p-1.5 rounded-md">
                                            <CheckCircle size={15} className="text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-green-500/60 uppercase tracking-widest font-bold leading-none mb-1">Target Acquired</p>
                                            <p className="text-green-400 font-bold text-sm tracking-wide font-mono">{nickResult}</p>
                                        </div>
                                    </div>
                                )}

                                {!nickCheckLoading && nickError && (
                                    <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/25 p-3 rounded-lg animate-in fade-in slide-in-from-left-2">
                                        <div className="bg-red-500/10 p-1.5 rounded-md">
                                            <XCircle size={15} className="text-red-400" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-red-500/60 uppercase tracking-widest font-bold leading-none mb-1">Target Unknown</p>
                                            <p className="text-red-400 font-bold text-sm tracking-wide font-mono">{nickError}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.section>

                        {/* 2. Select Nominal (Grouped by Variation) */}
                        <motion.section variants={sectionVariants}>
                            <h3 className="text-base md:text-lg font-(family-name:--font-cinzel) font-bold mb-6 flex items-center gap-3 text-white">
                                <span className="w-8 h-8 rounded-md bg-[#00f5ff]/10 border border-[#00f5ff]/30 flex items-center justify-center text-[#00f5ff] text-xs font-mono shadow-[0_0_10px_rgba(0,245,255,0.2)]">02</span>
                                SELECT ITEM
                                <span className="flex-1 h-px bg-linear-to-r from-[#00f5ff]/20 to-transparent" />
                            </h3>

                            {loading ? (
                                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-(--blood-red)" size={32} /></div>
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
                                                <div key={variationName} className={`rounded-xl border ${hasMultipleVariations ? 'border-white/6' : 'border-transparent'}`}>

                                                    {/* Variation Header (Clickable if multiple) */}
                                                    {hasMultipleVariations && (
                                                        <button
                                                            onClick={() => toggleSection(variationName)}
                                                            className="w-full flex items-center justify-between p-4 bg-white/2 hover:bg-white/4 transition-colors rounded-t-xl"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <Globe size={16} className="text-(--blood-red)" />
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
                                                                            <motion.div
                                                                                variants={productGridVariants}
                                                                                initial="hidden"
                                                                                animate="show"
                                                                                className="grid grid-cols-2 lg:grid-cols-3 gap-3"
                                                                            >
                                                                                {groupProducts.sort((a, b) => a.price_sell - b.price_sell).map(p => (
                                                                                    <motion.div
                                                                                        key={p.id}
                                                                                        variants={productItemVariants}
                                                                                        onClick={() => {
                                                                                            if (!targetId) {
                                                                                                toast.error("Mohon isi User ID terlebih dahulu sebelum memilih produk!");
                                                                                                document.getElementById('target-id-input')?.focus();
                                                                                                return;
                                                                                            }
                                                                                            setSelectedProduct(p);
                                                                                        }}
                                                                                        className={`
                                                                                    cursor-pointer relative px-4 py-4 flex flex-col items-center justify-center border transition-all duration-300 overflow-hidden group/item rounded-lg
                                                                                    ${selectedProduct?.id === p.id
                                                                                                ? 'bg-[#00f5ff]/5 border-[#00f5ff]/60 shadow-[0_0_20px_rgba(0,245,255,0.15)] scale-[1.02] z-10'
                                                                                                : 'bg-white/2 border-white/8 hover:border-[#00f5ff]/25 hover:bg-[#00f5ff]/3'}
                                                                                `}
                                                                                    >
                                                                                        {/* Subtle Glow Background for Selected */}
                                                                                        {selectedProduct?.id === p.id && (
                                                                                            <div className="absolute inset-0 bg-linear-to-t from-[#00f5ff]/8 to-transparent pointer-events-none" />
                                                                                        )}

                                                                                        <div className="flex flex-col items-center z-10 text-center gap-1">
                                                                                            <span className={`text-xs sm:text-sm font-bold leading-tight transition-colors ${selectedProduct?.id === p.id ? 'text-white' : 'text-white/40 group-hover/item:text-white/70'}`}>
                                                                                                {p.name}
                                                                                            </span>
                                                                                            <span className={`text-sm sm:text-base font-mono font-bold transition-all ${selectedProduct?.id === p.id ? 'text-[#00f5ff] drop-shadow-[0_0_8px_rgba(0,245,255,0.6)]' : 'text-white/25 group-hover/item:text-[#00f5ff]/50'}`}>
                                                                                                {p.price_sell.toLocaleString()}
                                                                                            </span>
                                                                                        </div>
                                                                                    </motion.div>
                                                                                ))}
                                                                            </motion.div>
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


                        {/* 3. MOBILE ONLY: Contact & Promo (MOVED TO STICKY SUMMARY) */}

                        {/* 3. Select Payment (UPDATED for Direct Payment) */}
                        <PaymentChannelsGrid
                            user={user}
                            targetId={targetId}
                            selectedProduct={selectedProduct}
                            voucherStats={voucherStats}
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                            selectedChannel={selectedChannel}
                            setSelectedChannel={setSelectedChannel}
                            channels={channels}
                            sectionVariants={sectionVariants}
                        />

                    </div>



                </motion.div>

                {/* RIGHT: Sticky Order Summary (Desktop Only) */}
                <div className="hidden lg:block">
                    <div className="sticky top-6">
                        <OrderSummary
                            selectedProduct={selectedProduct}
                            voucherStats={voucherStats}
                            dynamicFee={dynamicFee}
                            loadingFee={loadingFee}
                            isProcessing={isProcessing}
                            onCheckout={handleOrder}
                            user={user}
                            guestContact={guestContact}
                            onGuestContactChange={setGuestContact}
                            voucherCode={voucherCode}
                            onVoucherCodeChange={setVoucherCode}
                            checkingVoucher={checkingVoucher}
                            onApplyVoucher={handleApplyVoucher}
                            shouldHighlightInput={highlightGuestInput}
                        />
                    </div>
                </div>
            </div>

            {/* Mobile: Sticky Bottom Bar */}
            <MobileSummaryBar
                selectedProduct={selectedProduct}
                totalPrice={totalPrice}
                isExpanded={summaryExpanded}
                onToggle={() => setSummaryExpanded(!summaryExpanded)}
                onCheckout={handleOrder}
                isProcessing={isProcessing}
                voucherStats={voucherStats}
                dynamicFee={dynamicFee}
                loadingFee={loadingFee}
                guestContact={guestContact}
                onGuestContactChange={setGuestContact}
                voucherCode={voucherCode}
                onVoucherCodeChange={setVoucherCode}
                onApplyVoucher={handleApplyVoucher}
                checkingVoucher={checkingVoucher}
                user={user}
                shouldHighlightInput={highlightGuestInput}
            />

            {/* Validation Modal Popup */}
            <AnimatePresence>
                {showValidationModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-999 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setShowValidationModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#05050f] border border-[#00f5ff]/20 rounded-2xl p-8 max-w-sm w-full shadow-[0_0_50px_rgba(0,245,255,0.08)] text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[#00f5ff]/50 to-transparent" />

                            <div className="w-16 h-16 bg-[#00f5ff]/10 rounded-xl flex items-center justify-center mx-auto mb-6 ring-1 ring-[#00f5ff]/25">
                                <AlertTriangle size={30} className="text-[#00f5ff]" />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 font-(family-name:--font-cinzel) uppercase tracking-widest">
                                Data Belum Lengkap
                            </h3>
                            <p className="text-white/40 text-sm mb-6">
                                Mohon lengkapi data berikut untuk melanjutkan pesanan Anda:
                            </p>

                            <div className="space-y-2 mb-8 text-left bg-white/3 p-4 rounded-lg border border-white/8">
                                {missingFields.map((field, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-[#00f5ff]/80 text-sm font-bold">
                                        <XCircle size={13} className="text-[#00f5ff]/60" />
                                        <span>{field}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setShowValidationModal(false)}
                                className="w-full bg-[#00f5ff]/10 hover:bg-[#00f5ff]/20 border border-[#00f5ff]/40 hover:border-[#00f5ff]/70 text-[#00f5ff] font-bold py-3 px-6 rounded-lg transition-all uppercase tracking-widest text-sm shadow-[0_0_15px_rgba(0,245,255,0.1)]"
                            >
                                Lengkapi Data
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
