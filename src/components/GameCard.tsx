'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/app/page';

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
                whileHover={{ y: -8, scale: 1.03 }}
                className="relative h-[120px] md:h-[180px] w-full rounded-xl bg-[#111] overflow-hidden transition-all duration-500"
                style={{
                    border: '1px solid rgba(255,255,255,0.05)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                }}
            >
                {/* Molten border glow on hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-30"
                    style={{
                        boxShadow: 'inset 0 0 0 1px rgba(187,10,30,0.8), 0 0 20px rgba(187,10,30,0.4), 0 0 40px rgba(187,10,30,0.15)'
                    }}
                />

                {/* Image Container */}
                <div className="absolute inset-0 z-0">
                    {/* Layer 1: Blurred Background */}
                    <Image
                        src={game.image || 'https://via.placeholder.com/200?text=No+Image'}
                        alt={`${game.name} bg`}
                        fill
                        className="object-cover blur-xl scale-125 opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                    />

                    {/* Layer 2: Main Image */}
                    <div className="absolute inset-2 md:inset-4 z-10 flex items-center justify-center">
                        <div className="relative w-full h-full">
                            <Image
                                src={game.image || 'https://via.placeholder.com/200?text=No+Image'}
                                alt={game.name}
                                fill
                                sizes="(max-width: 768px) 50vw, 20vw"
                                className="object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent opacity-90 z-20" />

                    {/* Scan line rise effect on hover */}
                    <div className="absolute inset-0 z-20 overflow-hidden opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300">
                        <div
                            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent"
                            style={{ animation: 'scan-rise 1.5s ease-in-out infinite', bottom: 0 }}
                        />
                    </div>
                </div>

                {/* TOP UP Badge — top right corner */}
                <div className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                    <div className="bg-[var(--blood-red)] text-white text-[8px] font-black uppercase px-2 py-0.5 tracking-widest"
                        style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}>
                        TOP UP
                    </div>
                </div>

                {/* Corner rune — top left */}
                <div className="absolute top-1.5 left-2 z-30 text-[var(--rune-gold)] text-xs opacity-0 group-hover:opacity-60 transition-opacity duration-500 font-mono select-none">
                    ᛟ
                </div>

                {/* Content — Name */}
                <div className="absolute bottom-0 inset-x-0 p-2 md:p-3 text-center z-30">
                    <h3 className="text-xs md:text-sm font-black text-stone-300 group-hover:text-white transition-all duration-300 uppercase tracking-wider group-hover:text-shadow"
                        style={{ textShadow: 'none' }}
                    >
                        <span className="group-hover:drop-shadow-[0_0_8px_rgba(255,100,100,0.8)]">
                            {game.name}
                        </span>
                    </h3>
                </div>

            </motion.div>
        </Link>
    );
}
