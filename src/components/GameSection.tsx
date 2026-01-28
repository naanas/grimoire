import { motion } from 'framer-motion';
import GameCard, { GameData } from './GameCard';

interface GameSectionProps {
    title: string;
    icon?: string;
    games: GameData[];
    className?: string;
}

export default function GameSection({ title, icon, games, className = "", loading = false }: GameSectionProps & { loading?: boolean }) {
    if (!loading && (!games || games.length === 0)) return null;

    return (
        <section className={`w-full max-w-7xl px-4 md:px-0 ${className}`}>
            <div className="flex items-center gap-3 mb-6">
                {/* Title Decoration */}
                {icon && <span className="text-2xl">{icon}</span>}
                <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider">
                    {title}
                </h2>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-yellow-500/50 to-transparent ml-4"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {loading
                    ? Array.from({ length: 6 }).map((_, i) => (
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
