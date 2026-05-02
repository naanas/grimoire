'use client';

import { motion } from 'framer-motion';
import GameCard, { GameData } from './GameCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface GameSectionProps {
    title: string;
    subtitle?: string;
    icon?: string;
    games: GameData[];
    className?: string;
    viewAllLink?: string;
    loading?: boolean;
}

export default function GameSection({
    title,
    subtitle,
    icon,
    games,
    className = '',
    loading = false,
    viewAllLink,
}: GameSectionProps) {
    if (!loading && (!games || games.length === 0)) return null;

    return (
        <section className={`w-full max-w-7xl mx-auto px-4 md:px-6 ${className}`}>
            {/* Section header */}
            <div className="flex items-end justify-between mb-5 md:mb-7 gap-3">
                <div className="min-w-0">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="flex items-center gap-2.5"
                    >
                        {icon && (
                            <span className="text-2xl drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]">
                                {icon}
                            </span>
                        )}
                        <div className="min-w-0">
                            <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight font-(family-name:--font-cinzel) truncate">
                                {title}
                            </h2>
                            {subtitle && (
                                <p className="text-[11px] md:text-xs text-(--text-muted) mt-0.5 font-medium truncate">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </motion.div>
                    {/* Underline accent */}
                    <div className="mt-2 flex items-center gap-1.5">
                        <div className="h-[2px] w-10 rounded-full bg-linear-to-r from-(--violet) to-(--crimson)" />
                        <div className="h-[2px] w-3 rounded-full bg-(--violet)/30" />
                        <div className="h-[2px] w-1.5 rounded-full bg-(--crimson)/30" />
                    </div>
                </div>

                {viewAllLink && (
                    <Link
                        href={viewAllLink}
                        className="group flex items-center gap-1.5 text-[10px] md:text-xs font-black text-(--text-secondary) hover:text-white uppercase tracking-[0.2em] transition-colors shrink-0 px-3 py-2 md:px-4 md:py-2.5 rounded-full glass-panel hover:border-(--violet)/40"
                    >
                        Lihat Semua
                        <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                )}
            </div>

            {/* Grid */}
            <div
                className={`grid gap-3 md:gap-4 ${
                    viewAllLink
                        ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
                        : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
                }`}
            >
                {loading
                    ? Array.from({ length: 12 }).map((_, i) => (
                          <div
                              key={i}
                              className="aspect-3/4 sm:aspect-4/5 rounded-2xl bg-white/3 border border-white/5 overflow-hidden relative"
                          >
                              <div className="absolute inset-0 shimmer" />
                          </div>
                      ))
                    : games.map((game, i) => <GameCard key={game.id} game={game} index={i} />)}
            </div>
        </section>
    );
}

