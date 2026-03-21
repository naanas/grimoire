'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import BannerCarousel from '@/components/BannerCarousel';
import GameSection from '@/components/GameSection';
import { GameData } from '@/components/GameCard';
import InfoSection from '@/components/InfoSection';

export type Category = GameData;

// Marquee ticker item
function TickerItem({ name, slug }: { name: string; slug: string }) {
    return (
        <a href={`/order/${slug}`} className="flex items-center gap-3 group">
            <span className="text-[var(--blood-red)] text-xs font-mono opacity-60 group-hover:opacity-100 transition-opacity">✦</span>
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.15em] text-stone-500 group-hover:text-[var(--blood-red)] transition-colors whitespace-nowrap">
                {name}
            </span>
        </a>
    );
}

export default function Home() {
    const [bestSelling, setBestSelling] = useState<GameData[]>([]);
    const [popular, setPopular] = useState<GameData[]>([]);
    const [loading, setLoading] = useState(true);

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
                console.error("Failed to fetch home data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Combine games for ticker (deduplicated by slug)
    const tickerGames = [...bestSelling, ...popular]
        .filter((g, i, arr) => arr.findIndex(x => x.slug === g.slug) === i)
        .slice(0, 16);

    return (
        <div className="flex flex-col items-center justify-start min-h-screen gap-12 overflow-hidden relative bg-[#0a0a0a]">

            {/* Background Ambience */}
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[#1a0505] to-transparent z-0 pointer-events-none" />

            {/* Hero Section */}
            <section className="text-center space-y-6 pt-4 md:pt-8 relative z-10 w-full flex justify-center mt-20 md:mt-24 px-4">
                <BannerCarousel />
            </section>

            {/* Game Ticker — Dark marquee scrolling bar showing available games */}
            {tickerGames.length > 0 && (
                <div className="w-full border-y border-[var(--dark-blood)]/30 bg-black/40 overflow-hidden relative z-10 py-2.5">
                    {/* Left fade */}
                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/80 to-transparent z-10 pointer-events-none" />
                    {/* Right fade */}
                    <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/80 to-transparent z-10 pointer-events-none" />

                    {/* GRIMOIRE label on left */}
                    <div className="absolute left-0 top-0 bottom-0 flex items-center z-20 pl-3">
                        <span className="text-[8px] md:text-[9px] font-black tracking-[0.4em] text-[var(--blood-red)] uppercase bg-black pr-2">
                            TOP UP
                        </span>
                    </div>

                    <div className="flex overflow-hidden pl-20">
                        <div className="animate-marquee flex gap-8 items-center">
                            {/* Double the items for seamless loop */}
                            {[...tickerGames, ...tickerGames].map((game, i) => (
                                <TickerItem key={`${game.slug}-${i}`} name={game.name} slug={game.slug} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Sections */}
            <div className="flex flex-col gap-12 w-full items-center z-10 px-4 md:px-0 mb-12">
                <GameSection title="Terlaris" icon="🔥" games={bestSelling} loading={loading} />

                <GameSection
                    title="Populer"
                    icon="👾"
                    games={popular.slice(0, 12)}
                    loading={loading}
                    viewAllLink="/games"
                />
            </div>

            {/* Footer Info Section */}
            <InfoSection />

        </div>
    );
}
