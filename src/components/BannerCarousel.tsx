'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import api from '@/lib/api';

type Banner = {
    id: string | number;
    imageUrl: string;
    title?: string;
    description?: string;
    linkUrl?: string;
};

export default function BannerCarousel() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/content/banners')
            .then((res) => {
                if (res.data.success) {
                    setBanners(res.data.data);
                }
            })
            .catch((err) => console.error('Failed to fetch banners:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="w-full max-w-6xl mx-auto px-4 md:px-0">
                <div className="relative h-[180px] sm:h-[240px] md:h-[380px] w-full rounded-2xl md:rounded-3xl bg-white/3 border border-white/5 overflow-hidden">
                    <div className="absolute inset-0 shimmer" />
                </div>
            </div>
        );
    }

    if (banners.length === 0) {
        // Show a default hero placeholder so the page never feels empty
        return (
            <div className="w-full max-w-6xl mx-auto px-4 md:px-0">
                <div className="relative h-[180px] sm:h-[240px] md:h-[380px] w-full rounded-2xl md:rounded-3xl overflow-hidden glass-card border border-(--violet)/20">
                    <div className="absolute inset-0 bg-linear-to-br from-(--violet-deep)/40 via-(--bg-deep) to-(--crimson-deep)/40" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                        <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.4em] text-(--gold-soft) mb-3">
                            * Welcome *
                        </p>
                        <h1 className="text-2xl sm:text-3xl md:text-5xl font-black gradient-text-mystic font-(family-name:--font-cinzel) tracking-tight mb-2">
                            Top Up Game Tercepat
                        </h1>
                        <p className="text-xs md:text-sm text-(--text-secondary) max-w-md">
                            Proses instan 24/7, harga termurah, dan keamanan terjamin.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-4 md:px-0">
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden ring-1 ring-(--border-subtle) shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                {/* Outer glow */}
                <div className="absolute -inset-1 bg-linear-to-r from-(--violet)/20 via-(--crimson)/15 to-(--gold)/20 rounded-2xl md:rounded-3xl blur-xl opacity-60 -z-10" />

                <Swiper
                    modules={[Autoplay, EffectFade, Pagination]}
                    effect="fade"
                    speed={1200}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    pagination={{
                        clickable: true,
                        bulletClass: 'banner-bullet',
                        bulletActiveClass: 'banner-bullet-active',
                    }}
                    loop={true}
                    className="rounded-2xl md:rounded-3xl overflow-hidden"
                >
                    {banners.map((banner) => (
                        <SwiperSlide key={banner.id}>
                            <div className="relative w-full h-[180px] sm:h-[240px] md:h-[400px]">
                                <Image
                                    src={banner.imageUrl}
                                    alt={banner.title || 'Promo Banner'}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 1200px"
                                    className="object-cover"
                                    priority
                                />
                                {/* Cinematic overlay */}
                                <div className="absolute inset-0 bg-linear-to-tr from-(--bg-void)/85 via-(--bg-void)/40 to-transparent" />
                                <div className="absolute inset-0 bg-linear-to-t from-(--bg-void) via-transparent to-transparent" />

                                {banner.title && (
                                    <div className="absolute bottom-5 sm:bottom-7 md:bottom-10 left-5 sm:left-7 md:left-12 right-5 sm:right-auto max-w-md md:max-w-lg">
                                        <p className="text-[9px] sm:text-[10px] md:text-xs font-mono uppercase tracking-[0.35em] text-(--gold-soft) mb-2 md:mb-3">
                                            * Featured
                                        </p>
                                        <h2 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-black text-white font-(family-name:--font-cinzel) tracking-tight leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                                            {banner.title}
                                        </h2>
                                        {banner.description && (
                                            <p className="hidden sm:block mt-2 text-xs md:text-sm text-(--text-secondary) max-w-sm">
                                                {banner.description}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Pagination dot styles */}
                <style jsx global>{`
                    .swiper-pagination {
                        bottom: 12px !important;
                        z-index: 20;
                    }
                    .banner-bullet {
                        display: inline-block;
                        width: 18px;
                        height: 4px;
                        margin: 0 3px !important;
                        border-radius: 2px;
                        background: rgba(255, 255, 255, 0.3);
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }
                    .banner-bullet-active {
                        width: 32px;
                        background: linear-gradient(90deg, #a78bfa, #ef4444);
                        box-shadow: 0 0 12px rgba(167, 139, 250, 0.6);
                    }
                `}</style>
            </div>
        </div>
    );
}

