export default function Footer() {
    return (
        <footer className="border-t border-[var(--dark-blood)] bg-[#030303] py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Grimoire Coins. All Souls Reserved.
                </p>
                <p className="text-xs text-gray-700 mt-2">
                    Made with <span className="text-red-900">bad intentions</span>.
                </p>
            </div>
        </footer>
    );
}
