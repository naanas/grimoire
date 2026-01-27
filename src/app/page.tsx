'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import BannerCarousel from '@/components/BannerCarousel';
import GameSection from '@/components/GameSection';
import { GameData } from '@/components/GameCard';
import InfoSection from '@/components/InfoSection';

export type Category = GameData; // Mapping for compatibility if needed

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white" suppressHydrationWarning>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen gap-12 overflow-hidden relative bg-[#0a0a0a]">

      {/* Background Ambience */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[#1a0505] to-transparent z-0 pointer-events-none"></div>

      {/* Hero Section */}
      <section className="text-center space-y-6 pt-4 md:pt-8 relative z-10 w-full flex justify-center mt-20 md:mt-24 px-4">
        <BannerCarousel />
      </section>

      {/* Sections */}
      <div className="flex flex-col gap-12 w-full items-center z-10 px-4 md:px-0 mb-12">
        <GameSection title="Terlaris" icon="🔥" games={bestSelling} />

        <GameSection title="Populer" icon="👾" games={popular} />
      </div>

      {/* Footer Info Section */}
      <InfoSection />

    </div>
  );
}
