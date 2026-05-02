'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export type GameData = {
    id: string;
    name: string;
    slug: string;
    image: string;
    isActive: boolean;
};

interface GameCardProps {
    game: GameData;
    index: number;
}

export default function GameCard({ game, index }: GameCardProps) {
    return (
        <Link href={`/order/${game.slug}`} className="block group" aria-label={`Top up ${game.name}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.5, ease: 'easeOut' }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.97 }}
                className="relative aspect-3/4 sm:aspect-4/5 w-full rounded-2xl overflow-hidden glass-card border border-white/5 transition-all duration-500 group-hover:border-(--violet)/40 group-hover:shadow-[0_12px_40px_rgba(124,58,237,0.25)]"
            >
                {/* Animated gradient border on hover */}
                <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-30"
                    style={{
                        background:
                            'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(220,38,38,0.1)) border-box',
                        boxShadow:
                            'inset 0 0 0 1px rgba(167,139,250,0.4), 0 0 20px rgba(124,58,237,0.25)',
                    }}
                />

                {/* Background - blurred game art */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={game.image || 'https://placehold.co/400x500/1a0e2a/a78bfa?text=Grimoire'}
                        alt=""
                        aria-hidden
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                        className="object-cover blur-2xl scale-125 opacity-50 group-hover:opacity-70 transition-opacity duration-700"
                    />
                </div>

                {/* Foreground - main game art */}
                <div className="absolute inset-0 z-10 flex items-center justify-center p-4 sm:p-5">
                    <div className="relative w-full h-full">
                        <Image
                            src={game.image || 'https://placehold.co/300x400/1a0e2a/a78bfa?text=Grimoire'}
                            alt={game.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                            className="object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-rotate-1"
                        />
                    </div>
                </div>

                {/* Bottom gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-(--bg-void) via-(--bg-void)/80 to-transparent z-15 pointer-events-none" />

                {/* Top decorative tint */}
                <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-(--bg-void)/50 to-transparent z-15 pointer-events-none" />

                {/* TOP UP badge - visible on mobile, hover-only on desktop */}
                <div className="absolute top-2.5 right-2.5 z-30 transition-all duration-300 sm:opacity-0 sm:translate-y-1 sm:group-hover:opacity-100 sm:group-hover:translate-y-0">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-linear-to-r from-(--violet) to-(--crimson) text-white text-[8px] sm:text-[9px] font-black uppercase tracking-[0.18em] shadow-[0_4px_12px_rgba(124,58,237,0.4)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        Top Up
                    </div>
                </div>

                {/* Bottom content - title */}
                <div className="absolute inset-x-0 bottom-0 z-30 p-3 sm:p-4">
                    <h3 className="text-[11px] sm:text-sm font-black text-white uppercase tracking-wide leading-tight line-clamp-2 group-hover:gradient-text transition-all duration-500">
                        {game.name}
                    </h3>
                    <div className="mt-1.5 flex items-center gap-1.5">
                        <div className="h-[2px] w-6 sm:w-8 rounded-full bg-linear-to-r from-(--violet) to-(--crimson) group-hover:w-12 transition-all duration-500" />
                        <span className="text-[8px] sm:text-[9px] font-mono text-(--text-muted) uppercase tracking-[0.2em]">
                            Available
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
    );
}

