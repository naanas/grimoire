'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Zap,
    ShieldCheck,
    Headphones,
    Sparkles,
    Search,
    ArrowRight,
    Clock,
    Users,
    Wallet,
    BadgeCheck,
} from 'lucide-react';
import api from '@/lib/api';
import BannerCarousel from '@/components/BannerCarousel';
import GameSection from '@/components/GameSection';
import { GameData } from '@/components/GameCard';
import InfoSection from '@/components/InfoSection';
import HomeFaq from '@/components/HomeFaq';

export type Category = GameData;

function TickerItem({ name, slug }: { name: string; slug: string }) {
    return (
        <Link href={`/order/${slug}`} className="flex items-center gap-3 group">
            <span className="text-(--violet-glow) text-xs opacity-60 group-hover:opacity-100 transition-opacity">
                *
            </span>
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-(--text-muted) group-hover:text-white transition-colors whitespace-nowrap">
                {name}
            </span>
        </Link>
    );
}

const trustStats = [
    { icon: Users, label: 'Pengguna Aktif', value: '120K+' },
    { icon: BadgeCheck, label: 'Transaksi Sukses', value: '2.5M+' },
    { icon: Clock, label: 'Rata-rata Proses', value: '< 1 mnt' },
    { icon: Wallet, label: 'Game Tersedia', value: '100+' },
];

const features = [
    {
        icon: Zap,
        title: 'Proses Instan',
        description: 'Pesanan diproses otomatis 24/7. Diamond, UC, dan voucher game langsung masuk ke akunmu.',
        gradient: 'from-(--gold) to-(--ember)',
    },
    {
        icon: ShieldCheck,
        title: 'Aman & Terpercaya',
        description: 'Enkripsi end-to-end dan integrasi pembayaran resmi. Data dan saldo kamu sepenuhnya terlindungi.',
        gradient: 'from-(--violet) to-[#4c1d95]',
    },
    {
        icon: Headphones,
        title: 'Support 24 Jam',
        description: 'Tim customer service standby setiap hari via live chat dan WhatsApp untuk membantu kamu.',
        gradient: 'from-(--crimson) to-(--crimson-deep)',
    },
];

const howItWorks = [
    {
        step: '01',
        title: 'Pilih Game',
        description: 'Cari dan pilih game favoritmu dari ratusan opsi yang tersedia.',
    },
    {
        step: '02',
        title: 'Isi Data & Nominal',
        description: 'Masukkan ID akun dan pilih nominal top-up yang kamu inginkan.',
    },
    {
        step: '03',
        title: 'Bayar & Selesai',
        description: 'Lakukan pembayaran, proses berjalan otomatis dan instan masuk ke akun.',
    },
];

export default function Home() {
    const [bestSelling, setBestSelling] = useState<GameData[]>([]);
    const [popular, setPopular] = useState<GameData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bestRes, popRes] = await Promise.all([
                    api.get('/categories/best-selling'),
                    api.get('/categories/popular'),
                ]);

                if (bestRes.data.success) setBestSelling(bestRes.data.data);
                if (popRes.data.success) setPopular(popRes.data.data);
            } catch (err) {
                console.error('Failed to fetch home data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const tickerGames = [...bestSelling, ...popular]
        .filter((g, i, arr) => arr.findIndex((x) => x.slug === g.slug) === i)
        .slice(0, 18);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/games?q=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    return (
        <div className="flex flex-col items-stretch min-h-screen overflow-hidden relative">
            {/* === HERO SECTION === */}
            <section className="relative w-full pt-2 md:pt-6 pb-8 md:pb-12">
                {/* Hero text */}
                <div className="max-w-6xl mx-auto px-4 md:px-6 mb-6 md:mb-10 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-center text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel mb-4 md:mb-5">
                            <Sparkles size={12} className="text-(--gold-soft)" />
                            <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.3em] text-(--text-secondary)">
                                Top Up Termurah & Tercepat
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black font-(family-name:--font-cinzel) tracking-tight leading-[1.05] mb-3 md:mb-4">
                            <span className="block text-white">Buka Pintu</span>
                            <span className="block gradient-text-mystic">Petualanganmu.</span>
                        </h1>
                        <p className="max-w-xl text-sm md:text-base text-(--text-secondary) leading-relaxed">
                            Top up game favorit dengan harga termurah, proses instan,
                            dan dukungan 24/7. Diamond, UC, voucher - semua di satu tempat.
                        </p>
                    </motion.div>

                    {/* Quick Search */}
                    <motion.form
                        onSubmit={handleSearch}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="mt-6 md:mt-8 max-w-2xl mx-auto"
                    >
                        <div className="relative group">
                            <div className="absolute -inset-0.5 rounded-2xl bg-linear-to-r from-(--violet)/30 via-(--crimson)/30 to-(--gold)/30 opacity-60 group-focus-within:opacity-100 blur-md transition-opacity" />
                            <div className="relative flex items-center glass-panel rounded-2xl pl-3 pr-2 py-2 ring-1 ring-white/5 focus-within:ring-(--violet)/40 transition-all">
                                <Search size={18} className="text-(--text-muted) mr-2 shrink-0" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari game (Mobile Legends, PUBG, Genshin...)"
                                    className="flex-1 bg-transparent outline-none text-sm md:text-base text-white placeholder:text-(--text-muted) font-medium py-2 min-w-0"
                                />
                                <button
                                    type="submit"
                                    className="btn-mystic shrink-0 text-white text-[11px] md:text-xs font-black uppercase tracking-[0.15em] px-3 md:px-5 py-2.5 rounded-xl flex items-center gap-1.5"
                                >
                                    <span className="hidden sm:inline">Cari</span>
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </motion.form>
                </div>

                {/* Banner Carousel */}
                <div className="relative z-10">
                    <BannerCarousel />
                </div>
            </section>

            {/* === TRUST STATS === */}
            <section className="w-full max-w-6xl mx-auto px-4 md:px-6 pb-8 md:pb-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4">
                    {trustStats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.06, duration: 0.4 }}
                                className="relative glass-panel rounded-xl md:rounded-2xl p-3 md:p-5 group hover:border-(--violet)/30 transition-all"
                            >
                                <div className="flex items-center gap-2.5 md:gap-3">
                                    <div className="w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-linear-to-br from-(--violet)/15 to-(--crimson)/10 border border-(--violet)/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <Icon size={16} className="text-(--violet-glow)" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-base md:text-2xl font-black text-white leading-none">
                                            {stat.value}
                                        </div>
                                        <div className="text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-(--text-muted) font-bold mt-1 truncate">
                                            {stat.label}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* === GAME TICKER === */}
            {tickerGames.length > 0 && (
                <div className="relative z-10 w-full border-y border-(--border-subtle) bg-(--bg-deep)/80 backdrop-blur-md py-2.5 overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-12 md:w-16 bg-linear-to-r from-(--bg-deep) to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-12 md:w-16 bg-linear-to-l from-(--bg-deep) to-transparent z-10 pointer-events-none" />

                    <div className="absolute left-0 top-0 bottom-0 flex items-center z-20 pl-3">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-linear-to-r from-(--violet) to-(--crimson)">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span className="text-[8px] md:text-[9px] font-black tracking-[0.3em] text-white uppercase">
                                Live
                            </span>
                        </div>
                    </div>

                    <div className="flex overflow-hidden pl-24 md:pl-28">
                        <div className="animate-marquee flex gap-7 md:gap-10 items-center">
                            {[...tickerGames, ...tickerGames].map((game, i) => (
                                <TickerItem key={`${game.slug}-${i}`} name={game.name} slug={game.slug} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* === FEATURES === */}
            <section className="w-full max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
                <div className="text-center mb-8 md:mb-12">
                    <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.35em] text-(--violet-glow) mb-2">
                        * Why Grimoire
                    </p>
                    <h2 className="text-2xl md:text-4xl font-black text-white font-(family-name:--font-cinzel) tracking-tight">
                        Kenapa <span className="gradient-text-mystic">Grimoire?</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
                    {features.map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="group relative glass-panel rounded-2xl p-5 md:p-6 hover:border-(--violet)/30 transition-all overflow-hidden"
                            >
                                <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-(--violet)/10 blur-2xl group-hover:bg-(--violet)/20 transition-colors" />
                                <div
                                    className={`relative w-12 h-12 md:w-14 md:h-14 rounded-xl bg-linear-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_8px_24px_rgba(0,0,0,0.4)]`}
                                >
                                    <Icon size={22} className="text-white" />
                                </div>
                                <h3 className="relative text-lg md:text-xl font-black text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="relative text-sm text-(--text-secondary) leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* === GAME SECTIONS === */}
            <div className="flex flex-col gap-10 md:gap-16 w-full mb-10 md:mb-16">
                <GameSection
                    title="Terlaris"
                    subtitle="Game paling banyak di-top-up minggu ini"
                    icon="ðŸ”¥"
                    games={bestSelling}
                    loading={loading}
                />

                <GameSection
                    title="Populer"
                    subtitle="Pilihan favorit komunitas Grimoire"
                    icon="ðŸŽ®"
                    games={popular.slice(0, 12)}
                    loading={loading}
                    viewAllLink="/games"
                />
            </div>

            {/* === HOW IT WORKS === */}
            <section className="w-full max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
                <div className="text-center mb-8 md:mb-12">
                    <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.35em] text-(--gold-soft) mb-2">
                        * Cara Kerja
                    </p>
                    <h2 className="text-2xl md:text-4xl font-black text-white font-(family-name:--font-cinzel) tracking-tight">
                        Tiga Langkah <span className="gradient-text-mystic">Cepat</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5 relative">
                    {/* Connecting line on desktop */}
                    <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-[2px] bg-linear-to-r from-(--violet)/30 via-(--crimson)/30 to-(--gold)/30 z-0" />

                    {howItWorks.map((step, i) => (
                        <motion.div
                            key={step.step}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.12 }}
                            className="relative glass-panel rounded-2xl p-5 md:p-6 z-10"
                        >
                            <div className="flex items-start gap-4">
                                <div className="relative shrink-0">
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-linear-to-br from-(--violet) via-(--crimson) to-(--ember) flex items-center justify-center font-black text-2xl md:text-3xl text-white font-(family-name:--font-cinzel) shadow-[0_8px_24px_rgba(124,58,237,0.35)]">
                                        {step.step}
                                    </div>
                                    <div className="absolute -inset-1 rounded-2xl bg-linear-to-br from-(--violet)/30 to-(--crimson)/30 blur-md -z-10" />
                                </div>
                                <div className="min-w-0 pt-1">
                                    <h3 className="text-base md:text-lg font-black text-white mb-1.5">
                                        {step.title}
                                    </h3>
                                    <p className="text-xs md:text-sm text-(--text-secondary) leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-8 md:mt-12">
                    <Link
                        href="/games"
                        className="btn-mystic inline-flex items-center gap-2 text-white text-sm font-black uppercase tracking-[0.2em] px-6 md:px-8 py-3.5 md:py-4 rounded-2xl"
                    >
                        Mulai Top Up Sekarang
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            <HomeFaq />

            {/* === FOOTER INFO === */}
            <InfoSection />
        </div>
    );
}

