'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';
import api from '@/lib/api';

export default function PromoPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const checkPromo = async () => {
            try {
                // 1. Check LocalStorage (Frequency Cap)
                const lastShown = localStorage.getItem('promoPopupShown');
                if (lastShown) {
                    const lastShownDate = new Date(parseInt(lastShown));
                    const today = new Date();
                    // Show only once per day
                    if (lastShownDate.toDateString() === today.toDateString()) {
                        return;
                    }
                }

                // 2. Fetch Config
                const res = await api.get('/config');
                if (res.data.success) {
                    const cfg = res.data.data;
                    if (cfg.PROMO_POPUP_ACTIVE === 'true') {
                        setConfig(cfg);
                        // Delay slightly for better UX
                        setTimeout(() => setIsOpen(true), 1500);
                    }
                }
            } catch (error) {
                console.error("Failed to check promo popup", error);
            }
        };

        checkPromo();
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        // Save timestamp to localStorage
        localStorage.setItem('promoPopupShown', Date.now().toString());
    };

    const handleCopy = () => {
        if (config?.PROMO_POPUP_VOUCHER_CODE) {
            navigator.clipboard.writeText(config.PROMO_POPUP_VOUCHER_CODE);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!isOpen || !config) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-md bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl"
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white/80 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Image */}
                        {config.PROMO_POPUP_IMAGE && (
                            <div className="aspect-video w-full relative">
                                <img
                                    src={config.PROMO_POPUP_IMAGE}
                                    alt="Promo"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent"></div>
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-6 text-center space-y-4 relative">
                            {/* Glow Effect */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[var(--blood-red)] blur-[60px] opacity-20 -z-10"></div>

                            <h2 className="text-2xl font-bold text-white uppercase tracking-wide font-[family-name:var(--font-cinzel)]">
                                {config.PROMO_POPUP_TITLE || 'Special Offer!'}
                            </h2>

                            <p className="text-gray-400 text-sm leading-relaxed">
                                {config.PROMO_POPUP_DESC || 'Use this voucher code to get a discount on your next purchase.'}
                            </p>

                            {/* Voucher Code Box */}
                            {config.PROMO_POPUP_VOUCHER_CODE && (
                                <div className="bg-black/50 border border-dashed border-gray-700 rounded-xl p-4 mt-4 flex items-center justify-between gap-4 group hover:border-[var(--blood-red)] transition-colors">
                                    <div className="text-left">
                                        <p className="text-xs text-gray-500 uppercase tracking-widest">Voucher Code</p>
                                        <p className="text-xl font-mono font-bold text-[var(--blood-red)] tracking-wider">
                                            {config.PROMO_POPUP_VOUCHER_CODE}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleCopy}
                                        className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors relative"
                                        title="Copy Code"
                                    >
                                        {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                                    </button>
                                </div>
                            )}

                            {/* CTA Button */}
                            <button
                                onClick={handleClose}
                                className="w-full mt-4 bg-[var(--blood-red)] hover:bg-red-700 text-white font-bold py-3 rounded-xl uppercase tracking-widest shadow-lg shadow-red-900/20 transition-all hover:scale-[1.02]"
                            >
                                Claim Offer
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
