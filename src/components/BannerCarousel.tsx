'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import api from '@/lib/api';

export default function BannerCarousel() {
    const [banners, setBanners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/content/banners')
            .then(res => {
                if (res.data.success) {
                    setBanners(res.data.data);
                }
            })
            .catch(err => console.error("Failed to fetch banners:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="h-[200px] md:h-[350px] w-full bg-[var(--void-black)] animate-pulse rounded-xl border border-[var(--glass-border)]" />;

    if (banners.length === 0) {
        // Fallback if no banners
        return null;
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-4 md:px-0">
            <Swiper
                modules={[Autoplay, EffectFade, Navigation, Pagination]}
                effect="fade"
                speed={1000}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop={true}
                className="rounded-xl overflow-hidden shadow-[0_0_40px_rgba(187,10,30,0.3)] border border-[var(--glass-border)] group"
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner.id}>
                        <div className="relative w-full h-[200px] md:h-[380px]">
                            <Image
                                src={banner.imageUrl}
                                alt={banner.title || 'Banner'}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                            {banner.title && (
                                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 max-w-lg">
                                    <h2 className="text-xl md:text-4xl font-black text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] font-[family-name:var(--font-cinzel)] tracking-wider">{banner.title}</h2>
                                </div>
                            )}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
