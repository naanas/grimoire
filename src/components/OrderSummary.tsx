'use client';

import { ShoppingCart, ChevronUp, ChevronDown, Ticket, CheckCircle, XCircle } from 'lucide-react';
import { useRef, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import type { User } from '@/types/user';

type SummaryProduct = {
    name: string;
    price_sell: number;
};

type VoucherStats = {
    isValid: boolean;
    discount: number;
    finalPrice: number;
    message: string;
};

type OrderSummaryProps = {
    selectedProduct: SummaryProduct | null;
    voucherStats: VoucherStats;
    dynamicFee: number | null;
    loadingFee: boolean;
    isProcessing: boolean;
    onCheckout: () => void;
    // WhatsApp Contact
    user: User | null;
    guestContact: string;
    onGuestContactChange: (value: string) => void;
    // Voucher
    voucherCode: string;
    onVoucherCodeChange: (value: string) => void;
    checkingVoucher: boolean;
    onApplyVoucher: () => void;
    shouldHighlightInput?: boolean;
};

export default function OrderSummary({
    selectedProduct,
    voucherStats,
    dynamicFee,
    loadingFee,
    isProcessing,
    onCheckout,
    user,
    guestContact,
    onGuestContactChange,
    voucherCode,
    onVoucherCodeChange,
    checkingVoucher,
    onApplyVoucher,
    shouldHighlightInput = false
}: OrderSummaryProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const basePrice = voucherStats.isValid ? voucherStats.finalPrice : (selectedProduct?.price_sell || 0);
    const totalFee = dynamicFee || 0;
    const totalPrice = basePrice + totalFee;

    useEffect(() => {
        if (shouldHighlightInput) {
            inputRef.current?.focus();
            inputRef.current?.classList.add('ring-4', 'ring-yellow-500', 'animate-pulse');
            const timer = setTimeout(() => {
                inputRef.current?.classList.remove('ring-4', 'ring-yellow-500', 'animate-pulse');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [shouldHighlightInput]);

    return (
        <div className="bg-black/90 border border-gray-800 p-6 rounded-lg space-y-6 h-fit">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-800">
                <div className="w-10 h-10 bg-red-950/30 border border-red-900 rounded-lg flex items-center justify-center">
                    <ShoppingCart size={20} className="text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Order Summary</h3>
            </div>

            {/* Selected Product */}
            {selectedProduct ? (
                <div className="space-y-3">
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Selected Item</p>
                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4">
                        <p className="text-white font-bold mb-1">{selectedProduct.name}</p>
                        <p suppressHydrationWarning className="text-red-500 font-mono text-sm">
                            Rp {selectedProduct.price_sell.toLocaleString('id-ID')}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="bg-neutral-900/30 border border-dashed border-neutral-800 rounded-lg p-8 text-center">
                    <p className="text-gray-600 text-sm">Select a product to continue</p>
                </div>
            )}

            {/* Price Breakdown */}
            {selectedProduct && (
                <div className="space-y-3 pt-4 border-t border-gray-800">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Product Price</span>
                        <span suppressHydrationWarning className="text-white font-mono">
                            Rp {selectedProduct.price_sell.toLocaleString('id-ID')}
                        </span>
                    </div>

                    {voucherStats.isValid && (
                        <div className="flex justify-between text-sm">
                            <span className="text-green-400">Discount</span>
                            <span suppressHydrationWarning className="text-green-400 font-mono">
                                - Rp {voucherStats.discount.toLocaleString('id-ID')}
                            </span>
                        </div>
                    )}

                    {totalFee > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Payment Fee</span>
                            <span suppressHydrationWarning className="text-white font-mono">
                                {loadingFee ? '...' : `+ Rp ${totalFee.toLocaleString('id-ID')}`}
                            </span>
                        </div>
                    )}

                    {/* Total */}
                    <div className="pt-3 border-t border-gray-800">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm uppercase tracking-wider">Total Payment</span>
                            <div className="text-right">
                                <p suppressHydrationWarning className="text-2xl font-black text-red-600">
                                    Rp {totalPrice.toLocaleString('id-ID')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* WhatsApp Contact (if guest or no phone) */}
            {(!user || !user.phoneNumber) && (
                <div className="space-y-3 pt-4 border-t border-gray-800">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500 uppercase tracking-widest">WhatsApp Number</p>
                        {user && <span className="text-yellow-500 text-[10px]">(Required)</span>}
                    </div>
                    <div className="relative group">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="08XXXXXXXXXX"
                            className="w-full bg-black border border-gray-800 p-3 rounded focus:border-red-600 outline-none text-white text-sm font-mono transition-all duration-300"
                            value={guestContact}
                            onChange={(e) => onGuestContactChange(e.target.value.replace(/\D/g, ''))}
                        />
                    </div>
                </div>
            )}

            {/* Voucher Code */}
            <div className="space-y-3 pt-4 border-t border-gray-800">
                <p className="text-xs text-gray-500 uppercase tracking-widest">Voucher Code</p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="ENTER CODE"
                        className="flex-1 min-w-0 bg-black border border-gray-800 px-3 py-3 text-white focus:border-red-600 outline-none uppercase text-sm font-bold tracking-widest placeholder:text-gray-700"
                        value={voucherCode}
                        onChange={(e) => onVoucherCodeChange(e.target.value.toUpperCase())}
                    />
                    <button
                        onClick={onApplyVoucher}
                        disabled={checkingVoucher || !selectedProduct}
                        className="bg-gray-900 border border-gray-800 hover:bg-gray-800 text-white px-4 py-3 rounded font-bold disabled:opacity-50 transition-colors"
                    >
                        {checkingVoucher ? '...' : <Ticket size={18} />}
                    </button>
                </div>
                {voucherStats.isValid && (
                    <div suppressHydrationWarning className="text-xs text-green-500 font-mono flex items-center gap-2">
                        <CheckCircle size={12} /> -Rp {voucherStats.discount.toLocaleString('id-ID')}
                    </div>
                )}
                {voucherStats.message && !voucherStats.isValid && (
                    <div className="text-xs text-red-500 font-mono flex items-center gap-2">
                        <XCircle size={12} /> {voucherStats.message}
                    </div>
                )}
            </div>

            {/* Checkout Button */}
            <button
                onClick={onCheckout}
                disabled={isProcessing || !selectedProduct}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg uppercase tracking-widest transition-colors shadow-lg"
            >
                {isProcessing ? 'Processing...' : 'Order Now'}
            </button>
        </div>
    );
}

type MobileSummaryBarProps = {
    selectedProduct: SummaryProduct | null;
    totalPrice: number;
    isExpanded: boolean;
    onToggle: () => void;
    onCheckout: () => void;
    isProcessing: boolean;
    voucherStats: VoucherStats;
    dynamicFee: number | null;
    loadingFee: boolean;
    guestContact: string;
    voucherCode: string;
    onGuestContactChange: (val: string) => void;
    onVoucherCodeChange: (val: string) => void;
    onApplyVoucher: () => void;
    checkingVoucher: boolean;
    user: User | null;
    shouldHighlightInput?: boolean;
};

// Mobile Summary Bar Component
export function MobileSummaryBar({
    selectedProduct,
    totalPrice,
    isExpanded,
    onToggle,
    onCheckout,
    isProcessing,
    voucherStats,
    dynamicFee,
    loadingFee,
    guestContact,
    voucherCode,
    onGuestContactChange,
    onVoucherCodeChange,
    onApplyVoucher,
    checkingVoucher,
    user,
    shouldHighlightInput
}: MobileSummaryBarProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const mounted = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false
    );

    useEffect(() => {
        if (shouldHighlightInput && isExpanded) {
            inputRef.current?.focus();
            inputRef.current?.classList.add('ring-4', 'ring-yellow-500', 'animate-pulse');
            setTimeout(() => {
                inputRef.current?.classList.remove('ring-4', 'ring-yellow-500', 'animate-pulse');
            }, 2000);
        }
    }, [shouldHighlightInput, isExpanded]);

    if (!mounted) return null;

    return createPortal(
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#050505]/95 backdrop-blur-xl border-t border-(--dark-blood)/50 shadow-[0_-10px_30px_rgba(187,10,30,0.15)] pb-safe">
            <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-red-700 to-transparent" />

            {/* Expanded View */}
            {isExpanded && selectedProduct && (
                <div className="p-4 border-b border-(--dark-blood)/40 space-y-4 animate-in slide-in-from-bottom-4 overflow-y-auto max-h-[60vh]">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400 font-mono text-[10px] tracking-widest uppercase">Product</span>
                        <span className="text-white font-bold">{selectedProduct.name}</span>
                    </div>

                    {/* INPUTS MOVED HERE */}
                    <div className="space-y-4 pt-4 border-t border-(--dark-blood)/30">
                        {/* WhatsApp Input */}
                        {(!user || !user.phoneNumber) && (
                            <div className="space-y-2">
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest flex justify-between font-mono">
                                    WhatsApp <span className="text-yellow-600 font-bold tracking-normal">(Required)</span>
                                </p>
                                <input
                                    type="text"
                                    placeholder="08XXXXXXXXXX"
                                    className="w-full bg-black/60 border border-(--dark-blood)/50 p-3 outline-none text-white text-sm font-mono transition-all duration-300 focus:border-red-500 focus:bg-black"
                                    value={guestContact}
                                    ref={inputRef}
                                    onChange={(e) => onGuestContactChange(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>
                        )}

                        {/* Voucher Input */}
                        <div className="space-y-2">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Voucher Code</p>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="CODE"
                                    className="flex-1 bg-black/60 border border-(--dark-blood)/50 px-3 py-3 text-white outline-none uppercase text-sm font-bold tracking-widest placeholder:text-gray-700 transition-all focus:border-red-500 focus:bg-black"
                                    value={voucherCode}
                                    onChange={(e) => onVoucherCodeChange(e.target.value.toUpperCase())}
                                />
                                <button
                                    onClick={onApplyVoucher}
                                    disabled={checkingVoucher}
                                    className="bg-stone-900 border border-(--dark-blood) hover:bg-red-950/30 text-white px-4 py-3 font-bold disabled:opacity-50 transition-colors"
                                >
                                    {checkingVoucher ? '...' : <Ticket size={18} className="text-red-500" />}
                                </button>
                            </div>
                            {voucherStats?.isValid && (
                                <div suppressHydrationWarning className="text-xs text-green-500 font-mono flex items-center gap-2">
                                    <CheckCircle size={12} /> -Rp {voucherStats.discount.toLocaleString('id-ID')}
                                </div>
                            )}
                            {voucherStats?.message && !voucherStats.isValid && voucherCode && (
                                <div className="text-xs text-red-500 font-mono flex items-center gap-2">
                                    <XCircle size={12} /> {voucherStats.message}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between text-sm border-t border-(--dark-blood)/30 pt-4 mt-2">
                        <span className="text-gray-400 font-mono text-[10px] tracking-widest uppercase">Price</span>
                        <span suppressHydrationWarning className="text-white font-mono">
                            Rp {selectedProduct.price_sell.toLocaleString('id-ID')}
                        </span>
                    </div>
                    {voucherStats?.isValid && (
                        <div className="flex justify-between text-sm">
                            <span className="text-green-500 font-mono text-[10px] tracking-widest uppercase">Discount</span>
                            <span suppressHydrationWarning className="text-green-500 font-mono">
                                - Rp {voucherStats.discount.toLocaleString('id-ID')}
                            </span>
                        </div>
                    )}
                    {dynamicFee !== null && dynamicFee > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400 font-mono text-[10px] tracking-widest uppercase">Fee</span>
                            <span suppressHydrationWarning className="text-(--blood-red) font-mono">
                                {loadingFee ? '...' : `+ Rp ${dynamicFee.toLocaleString('id-ID')}`}
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Collapsed / Main Bar */}
            <div className="p-4 py-3">
                <div className="flex items-center gap-4">
                    {/* Expand/Collapse Trigger (Clickable Area) */}
                    <div
                        onClick={() => selectedProduct && onToggle()}
                        className="flex-1 flex items-center gap-3 cursor-pointer group pl-2"
                    >
                        <div className={`transition-colors ${isExpanded ? 'text-red-500' : 'text-stone-500 group-hover:text-red-400'}`}>
                            {isExpanded ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
                        </div>

                        {/* Total */}
                        <div>
                            <p className="text-[10px] text-stone-500 uppercase flex items-center gap-2 tracking-[0.2em] font-mono leading-none mb-1">
                                Total <span className="text-[8px] text-stone-700 tracking-normal">(Click details)</span>
                            </p>
                            <p suppressHydrationWarning className="text-xl font-black text-(--blood-red) leading-none drop-shadow-[0_0_8px_rgba(187,10,30,0.5)]">
                                Rp {totalPrice.toLocaleString('id-ID')}
                            </p>
                        </div>
                    </div>

                    {/* Checkout Button (Separate) */}
                    <button
                        onClick={onCheckout}
                        disabled={isProcessing || !selectedProduct}
                        className="relative bg-red-700 hover:bg-red-600 disabled:bg-stone-900 disabled:border disabled:border-stone-800 disabled:text-stone-600 text-white font-black py-3 px-8 uppercase tracking-widest transition-all disabled:cursor-not-allowed text-sm clip-path-button overflow-hidden group"
                    >
                        <span className="relative z-10">{isProcessing ? 'Wait...' : 'Order'}</span>
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
