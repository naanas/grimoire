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
}

export default function GameSection({ title, icon, games, className = "", loading = false, viewAllLink }: GameSectionProps & { loading?: boolean }) {
    if (!loading && (!games || games.length === 0)) return null;

    return (
        <section className={`w-full max-w-7xl px-4 md:px-0 ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    {/* Title Decoration */}
                    {icon && <span className="text-2xl">{icon}</span>}
                    <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider">
                        {title}
                    </h2>
                </div>

                <div className="h-[2px] flex-1 bg-gradient-to-r from-yellow-500/50 to-transparent mx-4 hidden md:block"></div>

                {viewAllLink && (
                    <Link
                        href={viewAllLink}
                        className="flex items-center gap-2 text-xs md:text-sm font-bold text-[var(--blood-red)] hover:text-white uppercase tracking-widest transition-colors group"
                    >
                        Lihat Selengkapnya
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                )}
            </div>

            <div className={`grid gap-4 ${viewAllLink
                ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6' // 2 items per row on mobile (implied 2 rows total by limit)
                : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
                }`}>
                {loading
                    ? Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="aspect-[3/4] rounded-xl bg-white/5 animate-pulse border border-white/10" />
                    ))
                    : games.map((game, i) => (
                        <GameCard key={game.id} game={game} index={i} />
                    ))
                }
            </div>
        </section>
    );
}
