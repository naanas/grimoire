import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, CreditCard, Zap, Store, ChevronUp, ChevronDown, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PaymentChannel } from '@/lib/PaymentChannels';

type Props = {
    user: any;
    targetId: string;
    selectedProduct: any;
    voucherStats: any;
    paymentMethod: string;
    setPaymentMethod: (val: string) => void;
    selectedChannel: PaymentChannel | null;
    setSelectedChannel: (val: PaymentChannel | null) => void;
    channels: PaymentChannel[];
    sectionVariants?: any;
};

export default function PaymentChannelsGrid({
    user,
    targetId,
    selectedProduct,
    voucherStats,
    paymentMethod,
    setPaymentMethod,
    selectedChannel,
    setSelectedChannel,
    channels,
    sectionVariants
}: Props) {
    const router = useRouter();
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

    return (
        <motion.section variants={sectionVariants}>
            {/* Section Header */}
            <h3 className="text-base md:text-lg font-[family-name:var(--font-cinzel)] font-bold mb-6 flex items-center gap-3 text-white">
                <span className="w-8 h-8 rounded-md bg-[#00f5ff]/10 border border-[#00f5ff]/30 flex items-center justify-center text-[#00f5ff] text-xs font-mono shadow-[0_0_10px_rgba(0,245,255,0.2)]">
                    03
                </span>
                <span className="text-white tracking-widest">PAYMENT</span>
                <span className="flex-1 h-px bg-gradient-to-r from-[#00f5ff]/20 to-transparent" />
            </h3>

            {/* Balance Option */}
            <div className="mb-6">
                <div
                    onClick={() => {
                        if (!targetId) {
                            toast.error("Mohon lengkapi ID terlebih dahulu!");
                            document.getElementById('target-id-input')?.focus();
                            return;
                        }
                        if (!selectedProduct) {
                            toast.error("Pilih nominal topup terlebih dahulu!");
                            return;
                        }
                        if (!user) {
                            toast('Mengarahkan ke halaman Login...', { icon: '🔑', style: { borderLeft: '4px solid #3b82f6', background: '#0a0a0a', color: '#d6d3d1' } });
                            router.push('/login?returnUrl=' + encodeURIComponent(window.location.pathname));
                            return;
                        }
                        if (user.balance < selectedProduct.price_sell) {
                            toast.error("Saldo tidak mencukupi! Dialihkan ke Topup Saldo...");
                            router.push('/topup');
                            return;
                        }
                        setPaymentMethod('BALANCE');
                        setSelectedChannel(null);
                    }}
                    className={`
                        cursor-pointer rounded-lg border p-4 flex items-center gap-4 transition-all duration-300 relative overflow-hidden group
                        ${paymentMethod === 'BALANCE'
                            ? 'bg-[#00f5ff]/5 border-[#00f5ff]/60 shadow-[0_0_20px_rgba(0,245,255,0.15)]'
                            : 'bg-white/[0.02] border-white/8 hover:border-[#00f5ff]/30 hover:bg-[#00f5ff]/5 hover:shadow-[0_0_12px_rgba(0,245,255,0.08)]'}
                    `}
                >
                    {paymentMethod === 'BALANCE' && (
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00f5ff]/8 to-transparent pointer-events-none" />
                    )}

                    <div className={`relative z-10 w-10 h-10 rounded-lg flex items-center justify-center transition-all
                        ${paymentMethod === 'BALANCE' ? 'bg-[#00f5ff]/15 text-[#00f5ff]' : 'bg-white/5 text-white/40 group-hover:bg-[#00f5ff]/10 group-hover:text-[#00f5ff]/70'}`}>
                        <Wallet size={18} />
                    </div>

                    <div className="flex-1 relative z-10">
                        <p className={`text-sm font-bold uppercase tracking-wider transition-colors ${paymentMethod === 'BALANCE' ? 'text-[#00f5ff]' : 'text-white/70 group-hover:text-white'}`}>
                            My Balance
                        </p>
                        {user ? (
                            <p className={`text-xs font-mono mt-0.5 transition-colors ${paymentMethod === 'BALANCE' ? 'text-[#00f5ff]/70' : 'text-white/30'}`}>
                                Rp {user.balance.toLocaleString('id-ID')}
                            </p>
                        ) : (
                            <p className="text-[10px] text-white/25 font-mono tracking-widest mt-0.5">Login to use balance</p>
                        )}
                    </div>

                    {paymentMethod === 'BALANCE' && (
                        <div className="relative z-10">
                            <CheckCircle className="text-[#00f5ff] drop-shadow-[0_0_8px_rgba(0,245,255,0.8)]" size={20} />
                        </div>
                    )}
                </div>
            </div>

            {/* Direct Payment Channels */}
            <div className="space-y-6">
                {Object.entries(channels.reduce((acc, ch) => {
                    if (!acc[ch.group]) acc[ch.group] = [];
                    acc[ch.group].push(ch);
                    return acc;
                }, {} as Record<string, PaymentChannel[]>)).map(([group, channels]) => {
                    const isExpanded = expandedGroups[group] ?? true;
                    return (
                        <div key={group} className="space-y-3">
                            {/* Group Header */}
                            <button
                                onClick={() => setExpandedGroups(prev => ({ ...prev, [group]: !isExpanded }))}
                                className="w-full flex items-center justify-between group hover:opacity-80 transition-opacity"
                            >
                                <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-[0.25em] pl-2 border-l-2 border-[#00f5ff]/50">
                                    {group}
                                </h4>
                                <div className="flex items-center gap-1.5 text-white/25">
                                    <span className="text-[10px] font-mono">{isExpanded ? 'hide' : 'show'}</span>
                                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                </div>
                            </button>

                            {/* Channel Grid */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
                                            {channels.map((channel) => {
                                                const currentPrice = voucherStats?.isValid ? voucherStats.finalPrice : (selectedProduct?.price_sell || 0);
                                                const isGlobalRestricted = currentPrice < 10000 && channel.group !== 'QRIS';
                                                const isBelowMin = (channel.minAmount && currentPrice < channel.minAmount) || isGlobalRestricted;
                                                const isSelected = selectedChannel?.code === channel.code;

                                                return (
                                                    <div
                                                        key={channel.code}
                                                        onClick={() => {
                                                            if (!targetId) {
                                                                toast.error("Mohon isi User ID terlebih dahulu sebelum memilih pembayaran!");
                                                                document.getElementById('target-id-input')?.focus();
                                                                return;
                                                            }
                                                            if (!isBelowMin) {
                                                                setPaymentMethod(channel.method);
                                                                setSelectedChannel(channel);
                                                            }
                                                        }}
                                                        className={`
                                                            cursor-pointer rounded-lg border p-3 flex flex-col items-center justify-center gap-2
                                                            transition-all duration-300 text-center min-h-[100px] relative overflow-hidden group
                                                            ${isSelected
                                                                ? 'bg-[#00f5ff]/5 border-[#00f5ff]/60 shadow-[0_0_20px_rgba(0,245,255,0.15)]'
                                                                : 'bg-white/[0.02] border-white/8 hover:border-[#00f5ff]/25 hover:bg-[#00f5ff]/[0.03]'}
                                                            ${isBelowMin ? 'opacity-35 grayscale cursor-not-allowed' : ''}
                                                        `}
                                                    >
                                                        {isSelected && (
                                                            <div className="absolute inset-0 bg-gradient-to-t from-[#00f5ff]/6 to-transparent pointer-events-none" />
                                                        )}

                                                        <div className={`relative z-10 w-9 h-9 rounded-md flex items-center justify-center transition-all
                                                            ${isSelected ? 'bg-[#00f5ff]/15 text-[#00f5ff]' : 'bg-white/5 text-white/35 group-hover:bg-[#00f5ff]/10 group-hover:text-[#00f5ff]/60'}`}>
                                                            {channel.group === 'QRIS' ? <Zap size={16} /> :
                                                                channel.group === 'Retail' ? <Store size={16} /> :
                                                                    <CreditCard size={16} />}
                                                        </div>

                                                        <span className={`text-[10px] font-bold uppercase tracking-wider relative z-10 transition-colors
                                                            ${isSelected ? 'text-[#00f5ff]' : 'text-white/40 group-hover:text-white/70'}`}>
                                                            {channel.name}
                                                        </span>

                                                        {/* Min amount overlay */}
                                                        {isBelowMin && (
                                                            <div className="absolute inset-0 bg-black/90 flex items-center justify-center backdrop-blur-[2px] z-20">
                                                                <span className="text-[9px] text-[#00f5ff]/60 font-bold text-center px-2 leading-tight tracking-widest border border-[#00f5ff]/20 bg-[#00f5ff]/5 py-1 rounded w-[85%] font-mono">
                                                                    {isGlobalRestricted ? 'MIN: RP 10.000' : `MIN: RP ${channel.minAmount?.toLocaleString('id-ID')}`}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* Selected pulse dot */}
                                                        {isSelected && (
                                                            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#00f5ff] rounded-full animate-pulse shadow-[0_0_8px_rgba(0,245,255,0.9)] z-10" />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </motion.section>
    );
}
