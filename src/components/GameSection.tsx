import { motion } from 'framer-motion';
import GameCard, { GameData } from './GameCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface GameSectionProps {
    title: string;
    icon?: string;
    games: GameData[];
    className?: string;
    viewAllLink?: string;
    loading?: boolean;
}

export default function GameSection({ title, icon, games, className = "", loading = false, viewAllLink }: GameSectionProps) {
    if (!loading && (!games || games.length === 0)) return null;

    return (
        <section className={`w-full max-w-7xl px-4 md:px-0 ${className}`}>
            {/* Ritual Section Header */}
            <div className="flex items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-3 shrink-0">
                    {icon && (
                        <span className="text-2xl drop-shadow-[0_0_8px_rgba(255,165,0,0.5)]">
                            {icon}
                        </span>
                    )}
                    <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider font-[family-name:var(--font-cinzel)]">
                        {title}
                    </h2>
                </div>

                {/* Ritual divider line (blood red) */}
                <div className="flex-1 hidden md:flex items-center gap-2 min-w-0">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--blood-red)]/60 to-transparent" />
                    <span className="text-[var(--blood-red)]/40 text-xs font-mono select-none shrink-0">ᛟ</span>
                    <div className="h-[1px] w-6 bg-[var(--blood-red)]/20" />
                </div>

                {viewAllLink && (
                    <Link
                        href={viewAllLink}
                        className="group flex items-center gap-1.5 text-[10px] md:text-xs font-black text-stone-500 hover:text-[var(--blood-red)] uppercase tracking-[0.2em] transition-colors shrink-0"
                    >
                        Lihat Semua
                        <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                )}
            </div>

            <div className={`grid gap-3 md:gap-4 ${viewAllLink
                ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6'
                : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
                }`}>
                {loading
                    ? Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="h-[120px] md:h-[180px] rounded-xl bg-white/[0.03] animate-pulse border border-[var(--dark-blood)]/20" />
                    ))
                    : games.map((game, i) => (
                        <GameCard key={game.id} game={game} index={i} />
                    ))
                }
            </div>
        </section>
    );
}
