export default function Footer() {
    return (
        <footer className="border-t border-[var(--dark-blood)] bg-[var(--void-black)] py-8 mt-auto relative z-50 overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--blood-red)] to-transparent opacity-50"></div>
            <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-stone-500 text-sm font-medium tracking-wide">
                    &copy; {new Date().getFullYear()} Grimoire Coins. All Souls Reserved.
                </p>
                <p className="text-xs text-stone-700 mt-2 tracking-widest uppercase group cursor-default">
                    Made with <span className="text-[var(--blood-red)] font-bold group-hover:text-red-500 group-hover:shadow-[0_0_10px_red] transition-all duration-300">bad intentions</span>.
                </p>
            </div>
        </footer>
    );
}
