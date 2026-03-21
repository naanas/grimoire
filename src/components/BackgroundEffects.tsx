'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { getGoogleDriveDirectLink } from '@/lib/driveHelper';

const RUNE_SYMBOLS = ['ᛟ', 'ᚷ', '✦', '❋', 'ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', '✧', '⟁'];

const runeParticles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    symbol: RUNE_SYMBOLS[i % RUNE_SYMBOLS.length],
    left: `${8 + (i * 8) % 90}%`,
    top: `${10 + (i * 13) % 80}%`,
    delay: `${(i * 0.7).toFixed(1)}s`,
    duration: `${6 + (i % 4)}s`,
    size: i % 3 === 0 ? 'text-lg' : 'text-xs',
}));

export default function BackgroundEffects() {
    const [config, setConfig] = useState({ type: 'CSS', url: '' });

    useEffect(() => {
        api.get('/config').then(res => {
            if (res.data.success) {
                setConfig({
                    type: res.data.data.BACKGROUND_TYPE || 'CSS',
                    url: res.data.data.BACKGROUND_URL || ''
                });
            }
        }).catch(err => console.error("Failed to load bg config", err));
    }, []);

    // 1. Video Background
    if (config.type === 'VIDEO' && config.url) {
        const videoUrl = getGoogleDriveDirectLink(config.url);
        return (
            <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-black">
                <video
                    src={videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="fixed inset-0 z-50 vignette"></div>
            </div>
        );
    }

    // 2. Image Background
    if (config.type === 'IMAGE' && config.url) {
        const imageUrl = getGoogleDriveDirectLink(config.url);
        return (
            <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-black">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-60"
                    style={{ backgroundImage: `url('${imageUrl}')` }}
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="fixed inset-0 z-50 vignette"></div>
            </div>
        );
    }

    // 3. Default CSS Background — Ritual Edition
    return (
        <div className="fixed inset-0 z-[-1] bg-[var(--background)] overflow-hidden pointer-events-none">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-30" />

            {/* Animated Blobs */}
            <div className="absolute top-0 -left-4 w-64 h-64 md:w-96 md:h-96 bg-[var(--dark-blood)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob will-change-transform" />
            <div className="absolute top-0 -right-4 w-64 h-64 md:w-96 md:h-96 bg-[var(--blood-red)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 will-change-transform" />
            <div className="absolute -bottom-32 left-20 w-64 h-64 md:w-96 md:h-96 bg-[var(--void-black)] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 border border-[var(--dark-blood)]/20 will-change-transform" />

            {/* Center Ritual Glow */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[800px] md:h-[800px] bg-[radial-gradient(circle,rgba(60,4,11,0.25)_0%,transparent_70%)] pointer-events-none" />

            {/* Faint Hexagram SVG at center */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.025]">
                <svg viewBox="0 0 200 200" className="w-[400px] h-[400px] md:w-[700px] md:h-[700px]" fill="none" stroke="#bb0a1e" strokeWidth="0.5">
                    {/* Outer circle */}
                    <circle cx="100" cy="100" r="95" />
                    {/* Star of David / Hexagram */}
                    <polygon points="100,10 127,55 173,55 146,90 163,135 100,110 37,135 54,90 27,55 73,55" />
                    {/* Inner pentagon */}
                    <circle cx="100" cy="100" r="45" />
                    {/* Rune lines */}
                    <line x1="100" y1="5" x2="100" y2="195" />
                    <line x1="5" y1="100" x2="195" y2="100" />
                    <line x1="20" y1="20" x2="180" y2="180" />
                    <line x1="180" y1="20" x2="20" y2="180" />
                </svg>
            </div>

            {/* Floating Rune Particles */}
            {runeParticles.map(p => (
                <div
                    key={p.id}
                    className={`absolute select-none font-mono ${p.size} text-[var(--blood-red)]`}
                    style={{
                        left: p.left,
                        top: p.top,
                        animation: `rune-float ${p.duration} ease-in-out ${p.delay} infinite`,
                        opacity: 0.15,
                        willChange: 'transform',
                    }}
                >
                    {p.symbol}
                </div>
            ))}

            {/* Cinematic Vignette & Noise */}
            <div className="fixed inset-0 z-50 vignette" />
            <div className="fixed inset-0 z-0 opacity-[0.06] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
}
