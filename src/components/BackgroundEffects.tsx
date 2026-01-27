'use client';

export default function BackgroundEffects() {
    return (
        <div className="fixed inset-0 z-[-1] bg-[var(--background)] overflow-hidden pointer-events-none">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>

            {/* Animated Blobs - Responsive Sizes */}
            <div className="absolute top-0 -left-4 w-64 h-64 md:w-96 md:h-96 bg-[var(--dark-blood)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob will-change-transform"></div>
            <div className="absolute top-0 -right-4 w-64 h-64 md:w-96 md:h-96 bg-[var(--blood-red)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 will-change-transform"></div>
            <div className="absolute -bottom-32 left-20 w-64 h-64 md:w-96 md:h-96 bg-[var(--void-black)] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 border border-[var(--dark-blood)]/20 will-change-transform"></div>

            {/* Center Glow */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[800px] md:h-[800px] bg-[radial-gradient(circle,rgba(60,4,11,0.2)_0%,transparent_70%)] pointer-events-none"></div>

            {/* Cinematic Vignette & Noise */}
            <div className="fixed inset-0 z-50 vignette"></div>
            <div className="fixed inset-0 z-0 opacity-[0.06] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>
    );
}
