export default function Footer() {
    return (
        <footer className="relative z-30 bg-(--bg-void) border-t border-white/5 overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-(--violet)/50 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                    <p className="text-xs text-(--text-muted) font-medium tracking-wide">
                        © {new Date().getFullYear()}{' '}
                        <span className="text-white font-black">Grimoire Coins</span>. All rights
                        reserved.
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-(--text-faint) tracking-[0.3em] uppercase font-bold">
                        <span>Forged with</span>
                        <span className="bg-linear-to-r from-(--violet-glow) via-(--crimson-glow) to-(--gold-soft) bg-clip-text text-transparent">
                            magic
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

