'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import api from '@/lib/api';

type Banner = {
    id: string;
    title?: string;
    imageUrl: string;
    linkUrl?: string;
};

export default function BannerCarousel() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        api.get('/content/banners')
            .then(res => {
                if (res.data.success && res.data.data.length > 0) {
                    setBanners(res.data.data);
                } else {
                    // Fallback to default static look if no banners
                    setBanners([]);
                }
            })
            .catch(err => console.error("Failed to fetch banners", err));
    }, []);

    useEffect(() => {
        if (banners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners]);

    if (banners.length === 0) {
        // Fallback: The Original Grimoire Text
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "circOut" }}
                className="relative text-center"
            >
                <h1 className="text-[5rem] md:text-[12rem] leading-none font-[family-name:var(--font-cinzel)] font-black text-[#111] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap opacity-40 select-none pointer-events-none blur-[2px]">
                    GRIMOIRE
                </h1>
                <div className="relative z-20 px-4">
                    <h1 className="text-5xl md:text-9xl font-[family-name:var(--font-cinzel)] font-black text-transparent bg-clip-text bg-gradient-to-b from-gray-200 via-gray-500 to-black drop-shadow-[0_10px_30px_rgba(0,0,0,1)] tracking-tighter">
                        GRIMOIRE
                    </h1>
                    <p className="text-sm md:text-2xl text-[var(--blood-red)] font-bold tracking-[0.5em] md:tracking-[1em] uppercase mt-4 text-glow opacity-90">
                        Resurrect Your Game
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="relative w-full max-w-7xl h-[250px] md:h-[500px] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(187,10,30,0.2)] border border-[#222]">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={banners[currentIndex].imageUrl}
                        alt={banners[currentIndex].title || 'Banner'}
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent" />

                    {/* Text Overlay */}
                    {banners[currentIndex].title && (
                        <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-10">
                            <h2 className="text-3xl md:text-5xl font-[family-name:var(--font-cinzel)] font-bold text-white drop-shadow-md">
                                {banners[currentIndex].title}
                            </h2>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                {banners.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-[var(--blood-red)] w-6' : 'bg-gray-500'}`}
                    />
                ))}
            </div>
        </div>
    );
}
