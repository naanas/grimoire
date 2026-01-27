import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/app/page'; // Need to export/move this type potentially, or redefine.

// Redefine for now to avoid circular dependency if I move it later.
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
        <Link href={`/order/${game.slug}`} className="block group">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5, ease: "easeOut" }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative h-[120px] md:h-[180px] w-full rounded-xl bg-[#1a1a1a] overflow-hidden transition-all duration-300 md:duration-500 hover:shadow-[0_0_20px_rgba(255,165,0,0.3)] border border-transparent hover:border-yellow-500/50"
            >
                {/* Simple Gradient Background for Card - Different from Main Page for variety? Or consistent? 
            User image shows meaningful backgrounds. Assuming images are full cover or transparent on colored bg.
            Let's keep it simple dark styling but "Premier" look.
        */}

                {/* Image Container */}
                <div className="absolute inset-0 z-0">
                    {/* Layer 1: Blurred Background (Fills the card) */}
                    <Image
                        src={game.image || 'https://via.placeholder.com/200?text=No+Image'}
                        alt={`${game.name} bg`}
                        fill
                        className="object-cover blur-xl scale-125 opacity-50 dark:opacity-40"
                    />

                    {/* Layer 2: Main Image (Contained - No cropping) */}
                    <div className="absolute inset-2 md:inset-4 z-10 flex items-center justify-center">
                        <div className="relative w-full h-full">
                            <Image
                                src={game.image || 'https://via.placeholder.com/200?text=No+Image'}
                                alt={game.name}
                                fill
                                sizes="(max-width: 768px) 50vw, 20vw"
                                className="object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                    </div>

                    {/* Gradient Overlay for Text Visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-90 z-20"></div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 inset-x-0 p-4 text-center">
                    <h3 className="text-sm md:text-base font-bold text-gray-200 group-hover:text-yellow-400 transition-colors uppercase tracking-wider">
                        {game.name}
                    </h3>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>

            </motion.div>
        </Link>
    );
}
