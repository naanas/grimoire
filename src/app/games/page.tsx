'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';

type Category = {
    id: string;
    name: string;
    slug: string;
    image: string;
    isActive: boolean;
};

export default function GamesPage() {
    const [games, setGames] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/categories')
            .then(res => {
                if (res.data.success) {
                    setGames(res.data.data);
                }
            })
            .catch(err => console.error("Failed to fetch games:", err))
            .finally(() => setLoading(false));
    }, []);

    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    // Simple filter logic (Tag data not real yet, but prepared)
    const filteredGames = games.filter(g => {
        const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'All' || g.name.toLowerCase().includes(activeFilter.toLowerCase()); // Primitive tag matching for now
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <Navbar />
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--blood-red)]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center pt-32 pb-20 px-4 relative overflow-hidden">
            <Navbar />

            {/* Background Ambience */}
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[var(--void)] to-transparent z-0 pointer-events-none"></div>

            <div className="max-w-7xl w-full z-10 space-y-8">

                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-[family-name:var(--font-cinzel)] font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-white to-gray-400"
                    >
                        SELECT YOUR REALM
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 tracking-widest uppercase text-sm"
                    >
                        Choose a game to begin your topup journey
                    </motion.p>
                </div>

                {/* Search & Filter Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0a0a0a]/80 backdrop-blur-md p-4 rounded-2xl border border-white/10"
                >
                    {/* Search Bar */}
                    <div className="relative w-full md:max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search games..."
                            className="bg-black/50 border border-gray-700 text-white text-sm rounded-xl focus:ring-[var(--blood-red)] focus:border-[var(--blood-red)] block w-full pl-10 p-3 placeholder-gray-500 transition-all outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Filter Tags */}
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
                        {['All', 'Mobile', 'PC', 'FPS', 'RPG'].map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setActiveFilter(tag)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap
                                    ${activeFilter === tag
                                        ? 'bg-[var(--blood-red)] text-white shadow-[0_0_10px_rgba(187,10,30,0.5)]'
                                        : 'bg-black/50 text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Game Grid */}
                <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
                >
                    {filteredGames.length > 0 ? (
                        filteredGames.map((game, i) => (
                            <Link href={`/order/${game.slug}`} key={game.id} className="block group">
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    className="relative h-[320px] md:h-[420px] rounded-sm obsidian-panel overflow-hidden transition-all duration-300 md:duration-500 hover:shadow-[0_0_30px_rgba(187,10,30,0.3)] hover:border-[var(--blood-red)]"
                                >
                                    {/* Dark Vignette Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80 z-10"></div>

                                    {/* Red Glow on Hover */}
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--blood-red)] to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-700 z-10"></div>

                                    <div className="relative z-20 h-full flex flex-col items-center justify-end pb-8 p-4 md:pb-12 md:p-6">
                                        {/* Game Image */}
                                        <div className="absolute top-8 md:top-10 inset-x-0 flex justify-center items-center h-[180px] md:h-[200px]" style={{ willChange: "transform" }}>
                                            <div className="relative w-[70%] md:w-[80%] h-[70%] md:h-[80%] transition-transform duration-500 group-hover:scale-110">
                                                <Image
                                                    src={game.image || 'https://via.placeholder.com/200?text=No+Image'}
                                                    alt={game.name}
                                                    fill
                                                    sizes="(max-width: 768px) 70vw, 30vw"
                                                    className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] grayscale group-hover:grayscale-0 transition-all duration-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <div className="relative z-30 text-center">
                                            <h3 className="text-xl md:text-2xl font-[family-name:var(--font-cinzel)] font-black text-gray-400 group-hover:text-white transition-colors tracking-wide uppercase border-b-2 border-transparent group-hover:border-[var(--blood-red)] pb-2" style={{ willChange: "color, border-color" }}>
                                                {game.name}
                                            </h3>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-gray-500">
                            <p className="text-xl">No games found matching your search.</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
