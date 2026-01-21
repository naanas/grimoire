'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import api from '@/lib/api';

export type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  isActive: boolean;
};

export default function Home() {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white" suppressHydrationWarning>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--blood-red)]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 min-h-screen gap-16 md:gap-24 overflow-hidden relative">

      {/* Background Ambience */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[var(--void)] to-transparent z-0 pointer-events-none"></div>

      {/* Hero Section */}
      <section className="text-center space-y-6 pt-24 md:pt-32 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="relative"
        >
          {/* Massive Background Text - Responsive Size */}
          <h1 className="text-[5rem] md:text-[12rem] leading-none font-[family-name:var(--font-cinzel)] font-black text-[#111] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap opacity-40 select-none pointer-events-none blur-[2px]">
            GRIMOIRE
          </h1>

          <div className="relative z-20 px-4" style={{ willChange: "transform, opacity" }}>
            <h1 className="text-5xl md:text-9xl font-[family-name:var(--font-cinzel)] font-black text-transparent bg-clip-text bg-gradient-to-b from-gray-200 via-gray-500 to-black drop-shadow-[0_10px_30px_rgba(0,0,0,1)] tracking-tighter">
              GRIMOIRE
            </h1>
            <p className="text-sm md:text-2xl text-[var(--blood-red)] font-bold tracking-[0.5em] md:tracking-[1em] uppercase mt-4 text-glow opacity-90">
              Resurrect Your Game
            </p>
          </div>
        </motion.div>
      </section>

      {/* Game Grid */}
      <section className="w-full max-w-7xl px-2 md:px-4 z-10 pb-20">
        <div className="flex items-center gap-4 mb-8 md:mb-12 justify-center md:justify-start">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 48 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hidden md:block h-[2px] bg-[var(--blood-red)]"
          ></motion.div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl font-[family-name:var(--font-cinzel)] font-bold text-gray-400 uppercase tracking-widest text-center md:text-left"
          >
            Popular Game ✨
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 0.3 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="hidden md:block h-[1px] flex-1 bg-gradient-to-r from-[var(--blood-red)] to-transparent origin-left"
          ></motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {games.filter(g => g.name && g.slug).map((game, i) => (
            <Link href={`/order/${game.slug}`} key={game.id} className="block group">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
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
                        priority={i < 4}
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
          ))}
        </motion.div>
      </section>
    </div>
  );
}
