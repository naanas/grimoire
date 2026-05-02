'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Gamepad2, Ticket, X, SlidersHorizontal, Grid3x3 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';

type Category = {
    id: string;
    name: string;
    slug: string;
    image: string;
    isActive: boolean;
};

type Filter = 'all' | 'topup' | 'voucher';

function GamesContent() {
    const params = useSearchParams();
    const initialQuery = params?.get('q') || '';

    const [games, setGames] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [activeFilter, setActiveFilter] = useState<Filter>('all');

    useEffect(() => {
        api.get('/categories')
            .then((res) => {
                if (res.data.success) {
                    setGames(res.data.data);
                }
            })
            .catch((err) => console.error('Failed to fetch games:', err))
            .finally(() => setLoading(false));
    }, []);

    const filteredGames = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        return games.filter((g) => {
            const matchesSearch = !q || g.name.toLowerCase().includes(q);
            const isVoucher =
                g.name.toLowerCase().includes('voucher') ||
                g.slug.toLowerCase().includes('voucher');
            const matchesFilter =
                activeFilter === 'all' ? true : activeFilter === 'voucher' ? isVoucher : !isVoucher;
            return matchesSearch && matchesFilter;
        });
    }, [games, searchQuery, activeFilter]);

    const filters: { id: Filter; label: string; icon: typeof Grid3x3; count?: number }[] = [
        { id: 'all', label: 'Semua', icon: Grid3x3, count: games.length },
        {
            id: 'topup',
            label: 'Top Up',
            icon: Gamepad2,
            count: games.filter(
                (g) =>
                    !g.name.toLowerCase().includes('voucher') &&
                    !g.slug.toLowerCase().includes('voucher')
            ).length,
        },
        {
            id: 'voucher',
            label: 'Voucher',
            icon: Ticket,
            count: games.filter(
                (g) =>
                    g.name.toLowerCase().includes('voucher') ||
                    g.slug.toLowerCase().includes('voucher')
            ).length,
        },
    ];

    return (
        <div className="min-h-screen text-white pt-4 md:pt-10 pb-12 px-4 md:px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto w-full space-y-6 md:space-y-10">
                {/* Header */}
                <div className="text-center space-y-3 md:space-y-4 pt-2">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel"
                    >
                        <span className="text-(--gold-soft) text-xs">*</span>
                        <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.3em] text-(--text-secondary)">
                            Katalog Game
                        </span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl md:text-5xl font-(family-name:--font-cinzel) font-black tracking-tight"
                    >
                        <span className="text-white">Pilih</span>{' '}
                        <span className="gradient-text-mystic">Realm-mu</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-(--text-secondary) text-sm md:text-base max-w-md mx-auto"
                    >
                        Ratusan game siap di-top-up dengan harga termurah dan proses instan.
                    </motion.p>
                </div>

                {/* Search & Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="space-y-3"
                >
                    {/* Search bar */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 rounded-2xl bg-linear-to-r from-(--violet)/20 to-(--crimson)/20 opacity-0 group-focus-within:opacity-100 blur-md transition-opacity" />
                        <div className="relative flex items-center glass-panel rounded-2xl pl-3 pr-2 py-2 ring-1 ring-white/5 focus-within:ring-(--violet)/40 transition-all">
                            <Search size={18} className="text-(--text-muted) mr-2 shrink-0" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari game..."
                                className="flex-1 bg-transparent outline-none text-sm md:text-base text-white placeholder:text-(--text-muted) font-medium py-2 min-w-0"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-(--text-muted) hover:text-white transition-colors"
                                    aria-label="Clear search"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filter chips */}
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
                        <SlidersHorizontal
                            size={14}
                            className="text-(--text-muted) shrink-0 ml-1 hidden sm:block"
                        />
                        {filters.map((f) => {
                            const Icon = f.icon;
                            const active = activeFilter === f.id;
                            return (
                                <button
                                    key={f.id}
                                    onClick={() => setActiveFilter(f.id)}
                                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-[0.12em] transition-all whitespace-nowrap ${
                                        active
                                            ? 'btn-mystic text-white'
                                            : 'glass-panel text-(--text-secondary) hover:text-white hover:border-(--violet)/30'
                                    }`}
                                >
                                    <Icon size={13} />
                                    {f.label}
                                    {typeof f.count === 'number' && (
                                        <span
                                            className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono ${
                                                active
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-white/5 text-(--text-muted)'
                                            }`}
                                        >
                                            {f.count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}

                        <div className="ml-auto text-[10px] font-mono text-(--text-muted) uppercase tracking-[0.2em] shrink-0">
                            {filteredGames.length} hasil
                        </div>
                    </div>
                </motion.div>

                {/* Game Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                        {Array.from({ length: 15 }).map((_, i) => (
                            <div
                                key={i}
                                className="aspect-3/4 rounded-2xl bg-white/3 border border-white/5 overflow-hidden relative"
                            >
                                <div className="absolute inset-0 shimmer" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filteredGames.length > 0 ? (
                            <motion.div
                                layout
                                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4"
                            >
                                {filteredGames.map((game, i) => (
                                    <motion.div
                                        layout
                                        key={game.id}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{
                                            duration: 0.35,
                                            delay: Math.min(i * 0.025, 0.4),
                                        }}
                                    >
                                        <Link href={`/order/${game.slug}`} className="block group">
                                            <motion.div
                                                whileHover={{ y: -6 }}
                                                whileTap={{ scale: 0.97 }}
                                                className="relative aspect-3/4 rounded-2xl overflow-hidden glass-card border border-white/5 group-hover:border-(--violet)/40 transition-all duration-500 group-hover:shadow-[0_12px_40px_rgba(124,58,237,0.25)]"
                                            >
                                                {/* Blurred background */}
                                                <div className="absolute inset-0 z-0">
                                                    <Image
                                                        src={
                                                            game.image ||
                                                            'https://placehold.co/300x400/1a0e2a/a78bfa?text=Grimoire'
                                                        }
                                                        alt=""
                                                        aria-hidden
                                                        fill
                                                        sizes="(max-width: 768px) 50vw, 20vw"
                                                        className="object-cover blur-2xl scale-125 opacity-50"
                                                    />
                                                </div>

                                                {/* Foreground game art */}
                                                <div className="absolute inset-0 z-10 flex items-center justify-center p-4 sm:p-6">
                                                    <div className="relative w-full h-[70%]">
                                                        <Image
                                                            src={
                                                                game.image ||
                                                                'https://placehold.co/300x400/1a0e2a/a78bfa?text=Grimoire'
                                                            }
                                                            alt={game.name}
                                                            fill
                                                            sizes="(max-width: 768px) 50vw, 20vw"
                                                            className="object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)] transition-transform duration-700 ease-out group-hover:scale-110"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Gradient overlay */}
                                                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-(--bg-void) via-(--bg-void)/85 to-transparent z-15 pointer-events-none" />

                                                {/* Title */}
                                                <div className="absolute inset-x-0 bottom-0 z-30 p-3 md:p-4">
                                                    <h3 className="text-xs md:text-sm font-black text-white uppercase tracking-wide leading-tight line-clamp-2 group-hover:gradient-text transition-all duration-500">
                                                        {game.name}
                                                    </h3>
                                                    <div className="mt-1.5 flex items-center gap-1.5">
                                                        <div className="h-[2px] w-6 rounded-full bg-linear-to-r from-(--violet) to-(--crimson) group-hover:w-12 transition-all duration-500" />
                                                        <span className="text-[8px] md:text-[9px] font-mono text-(--text-muted) uppercase tracking-[0.2em]">
                                                            Top Up
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Hover spotlight */}
                                                <div
                                                    className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                                    style={{
                                                        background:
                                                            'radial-gradient(circle at 50% 30%, rgba(167,139,250,0.18) 0%, transparent 60%)',
                                                    }}
                                                />
                                            </motion.div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-16 md:py-24 text-center glass-panel rounded-3xl"
                            >
                                <div className="text-5xl mb-4">ðŸ”</div>
                                <p className="text-lg md:text-xl font-bold text-white mb-2">
                                    Tidak ada game ditemukan
                                </p>
                                <p className="text-sm text-(--text-muted)">
                                    Coba kata kunci lain atau ubah filter pencarian
                                </p>
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-(--violet-glow) hover:text-white transition-colors"
                                    >
                                        <X size={13} /> Hapus pencarian
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}

export default function GamesPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-2 border-(--violet)/30 border-t-(--violet-glow) animate-spin" />
                </div>
            }
        >
            <GamesContent />
        </Suspense>
    );
}

