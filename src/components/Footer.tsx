export default function Footer() {
    return (
        <footer className="border-t border-[var(--dark-blood)] bg-[var(--void-black)] py-8 mt-auto relative z-50">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-stone-500 text-sm font-medium tracking-wide">
                    &copy; {new Date().getFullYear()} Grimoire Coins. All Souls Reserved.
                </p>
                <p className="text-xs text-stone-700 mt-2 tracking-widest uppercase">
                    Made with <span className="text-[var(--blood-red)] font-bold">bad intentions</span>.
                </p>
            </div>
        </footer>
    );
}
