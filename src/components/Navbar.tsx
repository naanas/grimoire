'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X, Flame } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const loadUser = () => {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    try {
                        setUser(JSON.parse(storedUser));
                    } catch (e) {
                        localStorage.removeItem('user');
                    }
                }
            };

            // Initial Load
            loadUser();

            // Fetch fresh data
            const fetchFresh = () => {
                const token = localStorage.getItem('token');
                if (token) {
                    import('@/lib/api').then((mod) => {
                        mod.default.get('/auth/me').then(res => {
                            if (res.data.success) {
                                setUser(res.data.data);
                                localStorage.setItem('user', JSON.stringify(res.data.data));
                            }
                        }).catch(() => { });
                    });
                }
            };
            fetchFresh();

            // LISTENERS FOR BALANCE UPDATES
            // 1. Storage Event (Cross-tab)
            window.addEventListener('storage', loadUser);
            // 2. Focus Event (Tab switch)
            window.addEventListener('focus', fetchFresh);
            // 3. Custom Event (Same tab)
            window.addEventListener('balance_updated', loadUser);

            return () => {
                window.removeEventListener('storage', loadUser);
                window.removeEventListener('focus', fetchFresh);
                window.removeEventListener('balance_updated', loadUser);
            };
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-2 px-4 pointer-events-none"
        >
            <div className="w-full max-w-7xl relative pointer-events-auto">
                {/* 
                  SATANIC SHAPE NAV 
                  Using clip-path for "Demon Blade" aesthetic
                */}
                <div
                    className="w-full bg-[var(--void-black)]/95 backdrop-blur-md border-b-2 border-[var(--glass-border)] relative shadow-[0_10px_40px_rgba(0,0,0,0.9)]"
                    style={{
                        clipPath: "polygon(2% 0, 98% 0, 100% 100%, 80% 100%, 75% 85%, 25% 85%, 20% 100%, 0 100%)",
                        paddingBottom: "1.5rem" // Space for the cutouts
                    }}
                >
                    {/* Top Glow Line */}
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--blood-red)] to-transparent opacity-60"></div>

                    <div className="px-8 py-3 flex items-center justify-between relative z-50">

                        {/* LEFT WING: Logo */}
                        <Link href="/" className="flex items-center group relative">
                            <div className="absolute -inset-4 bg-[var(--blood-red)]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <Flame className="text-[var(--blood-red)] mr-2 animate-pulse" size={24} />
                            <span className="text-xl md:text-2xl font-[family-name:var(--font-cinzel)] font-black text-white tracking-[0.2em] group-hover:text-[var(--blood-red)] transition-colors uppercase">
                                Grimoire
                            </span>
                        </Link>

                        {/* CENTER EYE (Decorative) */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-0 md:top-2 w-32 h-10 flex justify-center pointer-events-none opacity-20 md:opacity-100">
                            <div className="w-[1px] h-full bg-gradient-to-b from-[var(--blood-red)] to-transparent"></div>
                        </div>

                        {/* DESKTOP MENU */}
                        <div className="hidden md:flex items-center space-x-12">
                            {(user
                                ? ['Home', 'History', 'Games', 'Leaderboard']
                                : ['Home', 'Games', 'Leaderboard']
                            ).map((item) => (
                                <Link
                                    key={item}
                                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                    className="relative text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-white transition-all group"
                                >
                                    <span className="relative z-10">{item}</span>
                                    <span className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-1 h-1 bg-[var(--blood-red)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    <span className="absolute -inset-2 bg-[var(--dark-blood)]/20 scale-0 group-hover:scale-100 transition-transform duration-300 -skew-x-12"></span>
                                </Link>
                            ))}
                            {user?.role === 'ADMIN' && (
                                <Link
                                    href="/admin"
                                    className="text-xs font-bold uppercase tracking-widest text-[var(--blood-red)] hover:text-red-400 transition-colors relative"
                                >
                                    Dashboard
                                    <span className="absolute -top-1 -right-2 w-2 h-2 bg-[var(--blood-red)] rounded-full animate-ping"></span>
                                </Link>
                            )}
                        </div>

                        {/* RIGHT WING: Auth / Profile */}
                        <div className="hidden md:flex items-center">
                            {user ? (
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-[10px] text-stone-500 uppercase tracking-wider">Soul Balance</div>
                                        <div className="text-sm font-bold text-[var(--blood-red)] font-mono text-glow">Rp {user.balance?.toLocaleString() || 0}</div>
                                    </div>

                                    <div className="h-8 w-[1px] bg-white/10 mx-2"></div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-white tracking-wide uppercase">{user.name}</span>
                                        <button onClick={handleLogout} className="text-[10px] bg-[var(--dark-blood)]/30 hover:bg-[var(--dark-blood)] border border-[var(--dark-blood)]/50 text-red-500 px-2 py-1 uppercase tracking-widest transition-all">
                                            Exile
                                        </button>
                                    </div>
                                    <Link href="/topup" className="bg-white text-black hover:bg-[var(--blood-red)] hover:text-white px-4 py-2 font-black text-xs uppercase tracking-widest transition-all clip-path-slant relative overflow-hidden group">
                                        <span className="relative z-10">Topup</span>
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center gap-6">
                                    <Link href="/login" className="text-stone-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
                                        Login
                                    </Link>
                                    <Link href="/register" className="bg-[var(--blood-red)] hover:bg-[var(--hell-fire)] text-black px-6 py-2 rounded-none font-black text-xs tracking-[0.2em] uppercase transition-all shadow-[0_0_20px_rgba(187,10,30,0.4)] clip-path-button">
                                        Join Us
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-white hover:text-[var(--blood-red)] transition-colors"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* DECORATIVE BOTTOM PIECE (The downward sharp point) */}
                <div className="absolute top-[calc(100%-1.6rem)] left-1/2 -translate-x-1/2 w-40 h-8 bg-[var(--void-black)]/95 border-b border-r border-l border-[var(--glass-border)] text-center flex items-center justify-center pointer-events-auto"
                    style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}>
                    <div className="w-1.5 h-1.5 bg-[var(--blood-red)] rounded-full shadow-[0_0_10px_red]"></div>
                </div>


                {/* Mobile Dropdown */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, scaleY: 0 }}
                        className="absolute top-full left-0 right-0 mt-4 bg-[var(--void-black)] border border-[var(--dark-blood)] p-6 flex flex-col space-y-4 md:hidden z-40 origin-top shadow-2xl"
                    >
                        {/* Mobile Menu Items */}
                        {(user ? ['Home', 'History', 'Games', 'Leaderboard'] : ['Home', 'Games', 'Leaderboard']).map((item) => (
                            <Link key={item} href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-stone-400 hover:text-white uppercase tracking-widest text-sm py-2 border-b border-white/5 font-bold" onClick={() => setIsOpen(false)}>{item}</Link>
                        ))}

                        {/* Auth actions for mobile */}
                        {user ? (
                            <div className="pt-4 border-t border-[var(--dark-blood)]/30 space-y-4">
                                {/* Balance Info */}
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-stone-500 uppercase tracking-widest text-xs">Soul Balance</span>
                                    <span className="text-[var(--blood-red)] font-black text-lg font-mono">Rp {user.balance?.toLocaleString() || 0}</span>
                                </div>

                                <Link
                                    href="/topup"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full text-center bg-white text-black font-black py-3 uppercase tracking-widest clip-path-slant"
                                >
                                    Topup
                                </Link>

                                <button onClick={handleLogout} className="w-full text-left text-red-500 uppercase tracking-widest text-sm py-2 hover:text-red-400">
                                    Exile (Logout)
                                </button>
                            </div>
                        ) : (
                            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                                <Link href="/login" onClick={() => setIsOpen(false)} className="text-white uppercase tracking-widest text-center text-sm py-2">Login</Link>
                                <Link href="/register" onClick={() => setIsOpen(false)} className="bg-[var(--blood-red)] text-black font-bold uppercase tracking-widest text-center py-3 clip-path-slant">Join Us</Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>

            {/* Global Styles for Clip Path if not in CSS */}
            <style jsx global>{`
                .clip-path-slant {
                    clip-path: polygon(10% 0, 100% 0, 90% 100%, 0% 100%);
                }
                .clip-path-button {
                    clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
                }
            `}</style>
        </motion.nav>
    );
}
