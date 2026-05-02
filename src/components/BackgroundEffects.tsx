'use client';

import { useState, useEffect, useMemo } from 'react';
import api from '@/lib/api';
import { getGoogleDriveDirectLink } from '@/lib/driveHelper';

const RUNE_SYMBOLS = ['*', '+', '*', 'x', '#', '^', 'o', '~'];

export default function BackgroundEffects() {
    const [config, setConfig] = useState({ type: 'CSS', url: '' });

    useEffect(() => {
        api.get('/config')
            .then((res) => {
                if (res.data.success) {
                    setConfig({
                        type: res.data.data.BACKGROUND_TYPE || 'CSS',
                        url: res.data.data.BACKGROUND_URL || '',
                    });
                }
            })
            .catch((err) => console.error('Failed to load bg config', err));
    }, []);

    // Pre-compute rune particles deterministically (fewer + more refined)
    const runeParticles = useMemo(
        () =>
            Array.from({ length: 8 }, (_, i) => ({
                id: i,
                symbol: RUNE_SYMBOLS[i % RUNE_SYMBOLS.length],
                left: `${10 + ((i * 11) % 80)}%`,
                top: `${15 + ((i * 17) % 70)}%`,
                delay: `${(i * 0.9).toFixed(1)}s`,
                duration: `${10 + (i % 4) * 2}s`,
                size: i % 3 === 0 ? 'text-2xl' : 'text-base',
                tone: i % 2 === 0 ? 'text-(--violet)/30' : 'text-(--crimson)/25',
            })),
        []
    );

    // 1. Video Background
    if (config.type === 'VIDEO' && config.url) {
        const videoUrl = getGoogleDriveDirectLink(config.url);
        return (
            <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-(--bg-void)">
                <video
                    src={videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-linear-to-b from-(--bg-void)/50 via-transparent to-(--bg-void)/80" />
                <div className="fixed inset-0 z-50 vignette" />
            </div>
        );
    }

    // 2. Image Background
    if (config.type === 'IMAGE' && config.url) {
        const imageUrl = getGoogleDriveDirectLink(config.url);
        return (
            <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-(--bg-void)">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-50"
                    style={{ backgroundImage: `url(${config.url})` }}
                />
                <div className="absolute inset-0 bg-linear-to-b from-(--bg-void)/40 via-transparent to-(--bg-void)/85" />
                <div className="fixed inset-0 z-50 vignette" />
            </div>
        );
    }

    // 3. Default - Refined Mystic CSS Background
    return (
        <div className="fixed inset-0 z-[-1] bg-(--bg-void) overflow-hidden pointer-events-none">
            {/* Aurora gradient - subtle violet/crimson glows */}
            <div className="absolute inset-0">
                <div className="absolute -top-32 -left-32 w-[420px] h-[420px] md:w-[640px] md:h-[640px] rounded-full bg-(--violet-deep)/30 blur-[120px] animate-blob will-change-transform" />
                <div className="absolute top-1/4 -right-32 w-[380px] h-[380px] md:w-[560px] md:h-[560px] rounded-full bg-(--crimson-deep)/25 blur-[120px] animate-blob animation-delay-2000 will-change-transform" />
                <div className="absolute bottom-0 left-1/3 w-[360px] h-[360px] md:w-[520px] md:h-[520px] rounded-full bg-[#1e1b4b]/40 blur-[140px] animate-blob animation-delay-4000 will-change-transform" />
            </div>

            {/* Soft grid */}
            <div className="absolute inset-0 bg-grid-pattern opacity-40" />

            {/* Faint sigil - only on larger screens */}
            <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none opacity-[0.04]">
                <svg
                    viewBox="0 0 200 200"
                    className="w-[700px] h-[700px]"
                    fill="none"
                    stroke="#a78bfa"
                    strokeWidth="0.4"
                >
                    <circle cx="100" cy="100" r="95" />
                    <circle cx="100" cy="100" r="70" strokeDasharray="2 4" />
                    <polygon points="100,15 127,55 173,55 146,90 163,135 100,110 37,135 54,90 27,55 73,55" />
                    <circle cx="100" cy="100" r="40" />
                    <line x1="100" y1="5" x2="100" y2="195" strokeOpacity="0.5" />
                    <line x1="5" y1="100" x2="195" y2="100" strokeOpacity="0.5" />
                </svg>
            </div>

            {/* Floating rune particles */}
            {runeParticles.map((p) => (
                <div
                    key={p.id}
                    className={`absolute select-none font-mono ${p.size} ${p.tone}`}
                    style={{
                        left: p.left,
                        top: p.top,
                        animation: `rune-float ${p.duration} ease-in-out ${p.delay} infinite`,
                        opacity: 0.18,
                        willChange: 'transform',
                    }}
                >
                    {p.symbol}
                </div>
            ))}

            {/* Top warm glow band */}
            <div className="absolute top-0 inset-x-0 h-[300px] bg-linear-to-b from-(--crimson-deep)/15 via-(--violet-deep)/8 to-transparent" />

            {/* Cinematic vignette */}
            <div className="fixed inset-0 z-50 vignette" />

            {/* Subtle film grain */}
            <div className="fixed inset-0 z-0 opacity-[0.035] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
}

