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
            <h3 className="text-base md:text-lg font-[family-name:var(--font-cinzel)] font-bold mb-6 flex items-center gap-3 text-white">
                <span className="w-8 h-8 bg-red-950/50 border border-red-900 flex items-center justify-center text-[var(--blood-red)] text-sm font-mono shadow-[0_0_10px_rgba(187,10,30,0.2)]">03</span>
                PAYMENT
            </h3>

            {/* Balance First */}
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

                        // All criteria pass
                        setPaymentMethod('BALANCE');
                        setSelectedChannel(null);
                    }}
                    className={`
                        cursor-pointer border p-4 flex items-center gap-4 transition-all duration-500 relative rounded-sm group overflow-hidden
                        ${paymentMethod === 'BALANCE' ? 'bg-[#150202] border-red-600 shadow-[0_0_20px_rgba(187,10,30,0.4)] scale-[1.02] z-10' : 'bg-[#050505] border-gray-900/80 hover:border-red-900/50 hover:bg-[#0a0202] hover:shadow-[0_0_15px_rgba(187,10,30,0.15)]'}
                    `}
                >
                    {/* Subtle Glow */}
                    {paymentMethod === 'BALANCE' && (
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--blood-red)]/20 to-transparent"></div>
                    )}

                    <div className="relative z-10">
                        <Wallet size={24} className={paymentMethod === 'BALANCE' ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]' : 'text-gray-500 group-hover:text-red-400 transition-colors'} />
                    </div>
                    <div className="flex-1 relative z-10">
                        <p className={`text-sm font-bold uppercase tracking-wider transition-colors ${paymentMethod === 'BALANCE' ? 'text-white' : 'text-gray-300'}`}>My Balance</p>
                        {user ? (
                            <p className={`text-xs font-mono transition-colors ${paymentMethod === 'BALANCE' ? 'text-red-400' : 'text-gray-500'}`}>Rp {user.balance.toLocaleString('id-ID')}</p>
                        ) : (
                            <p className="text-[10px] text-gray-500 font-mono tracking-widest">Login to use balance</p>
                        )}
                    </div>
                    {paymentMethod === 'BALANCE' && (
                        <div className="relative z-10">
                            <CheckCircle className="text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" size={24} />
                        </div>
                    )}
                </div>
            </div>

            {/* Direct Payment Channels */}
            <div className="space-y-6">
                {/* Group by Channel Group (QRIS, VA, Retail) */}
                {Object.entries(channels.reduce((acc, ch) => {
                    if (!acc[ch.group]) acc[ch.group] = [];
                    acc[ch.group].push(ch);
                    return acc;
                }, {} as Record<string, PaymentChannel[]>)).map(([group, channels]) => {
                    const isExpanded = expandedGroups[group] ?? true; // Default: expanded
                    return (
                        <div key={group} className="space-y-3">
                            {/* Category Header with Toggle */}
                            <button
                                onClick={() => setExpandedGroups(prev => ({ ...prev, [group]: !isExpanded }))}
                                className="w-full flex items-center justify-between group hover:opacity-80 transition-opacity"
                            >
                                <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest pl-1 border-l-2 border-[var(--blood-red)]">
                                    {group}
                                </h4>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <span className="text-[10px]">{isExpanded ? 'Hide' : 'Show'}</span>
                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </div>
                            </button>

                            {/* Payment Channel Grid with Animation */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                            {channels.map((channel) => {
                                                const currentPrice = voucherStats?.isValid ? voucherStats.finalPrice : (selectedProduct?.price_sell || 0);
                                                const isGlobalRestricted = currentPrice < 10000 && channel.group !== 'QRIS';
                                                const isBelowMin = (channel.minAmount && currentPrice < channel.minAmount) || isGlobalRestricted;

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
                                                                setPaymentMethod(channel.method); // 'va', 'qris', etc
                                                                setSelectedChannel(channel);
                                                            }
                                                        }}
                                                        className={`
                                                            cursor-pointer border p-4 flex flex-col items-center justify-center gap-2 transition-all duration-500 rounded-sm text-center min-h-[110px] relative overflow-hidden group
                                                            ${selectedChannel?.code === channel.code ? 'bg-[#150202] border-red-600 shadow-[0_0_20px_rgba(187,10,30,0.4)] scale-[1.02] z-10' : 'bg-[#050505] border-gray-900/80 hover:border-red-900/50 hover:bg-[#0a0202] hover:shadow-[0_0_15px_rgba(187,10,30,0.15)]'}
                                                            ${isBelowMin ? 'opacity-40 grayscale cursor-not-allowed' : ''}
                                                        `}
                                                    >
                                                        {/* Subtle Glow Background for Selected */}
                                                        {selectedChannel?.code === channel.code && (
                                                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--blood-red)]/20 to-transparent"></div>
                                                        )}

                                                        {/* Logo Placeholder or Text */}
                                                        <div className="flex-1 flex items-center justify-center relative z-10">
                                                            {channel.group === 'QRIS' ? <Zap size={24} className={selectedChannel?.code === channel.code ? 'text-white' : 'text-gray-400 group-hover:text-red-400 transition-colors'} /> :
                                                                channel.group === 'Retail' ? <Store size={24} className={selectedChannel?.code === channel.code ? 'text-white' : 'text-gray-400 group-hover:text-red-400 transition-colors'} /> :
                                                                    <CreditCard size={24} className={selectedChannel?.code === channel.code ? 'text-white' : 'text-gray-400 group-hover:text-red-400 transition-colors'} />}
                                                        </div>

                                                        <span className={`text-xs font-bold uppercase tracking-wider relative z-10 transition-colors ${selectedChannel?.code === channel.code ? 'text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                                            {channel.name}
                                                        </span>

                                                        {/* Minimum Amount Warning - More Prominent */}
                                                        {isBelowMin && (
                                                            <div className="absolute inset-0 bg-black/95 flex items-center justify-center backdrop-blur-sm z-20 transition-all">
                                                                <span suppressHydrationWarning className="text-[10px] text-red-500 font-bold text-center px-1 leading-tight tracking-widest border border-red-900/50 bg-red-950/20 py-1 rounded-sm w-[90%] font-mono">
                                                                    {isGlobalRestricted ? 'MIN: RP 10.000' : `MIN: RP ${channel.minAmount?.toLocaleString('id-ID')}`}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {selectedChannel?.code === channel.code && (
                                                            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(255,0,0,0.8)] z-10"></div>
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
