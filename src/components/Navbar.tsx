'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // 1. Load from LocalStorage first for speed
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Invalid user data in localStorage");
                    localStorage.removeItem('user');
                }
            }

            // 2. Fetch fresh data from API
            const token = localStorage.getItem('token');
            if (token) {
                import('@/lib/api').then((mod) => {
                    mod.default.get('/auth/me')
                        .then(res => {
                            if (res.data.success) {
                                setUser(res.data.data);
                                localStorage.setItem('user', JSON.stringify(res.data.data));
                            }
                        })
                        .catch(() => {
                            // If token invalid, maybe logout? Or just silent fail.
                        });
                });

                // 3. IDLE TIMER LOGIC
                let idleTimer: NodeJS.Timeout;
                const TIMEOUT = 10 * 60 * 1000; // 10 Minutes

                const resetTimer = () => {
                    clearTimeout(idleTimer);
                    idleTimer = setTimeout(() => {
                        alert("Session Expired due to inactivity.");
                        handleLogout();
                    }, TIMEOUT);
                };

                // Listeners for activity
                window.addEventListener('mousemove', resetTimer);
                window.addEventListener('keydown', resetTimer);
                window.addEventListener('click', resetTimer);
                window.addEventListener('scroll', resetTimer);

                // Start timer initially
                resetTimer();

                return () => {
                    clearTimeout(idleTimer);
                    window.removeEventListener('mousemove', resetTimer);
                    window.removeEventListener('keydown', resetTimer);
                    window.removeEventListener('click', resetTimer);
                    window.removeEventListener('scroll', resetTimer);
                };
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
        >
            <div className="w-full max-w-7xl relative">
                <div className="w-full glass-panel rounded-full px-6 py-4 flex items-center justify-between backdrop-blur-3xl bg-black/50 border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] z-50 relative">

                    {/* Logo */}
                    <Link href="/" className="flex items-center group">
                        <span className="text-lg md:text-2xl font-[family-name:var(--font-cinzel)] font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-200 to-red-500 bg-[length:200%_auto] animate-gradient group-hover:text-glow transition-all duration-300">
                            GRIMOIRE
                        </span>
                    </Link>

                    {/* Desktop Menu - User Only */}
                    {user && (
                        <div className="hidden md:flex items-center space-x-8">
                            {['Home', 'History', 'Games', 'Leaderboard'].map((item) => (
                                <Link
                                    key={item}
                                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                    className="relative text-sm font-medium text-gray-300 hover:text-white transition-colors group"
                                >
                                    {item}
                                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--blood-red)] group-hover:w-full transition-all duration-300"></span>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Desktop Action */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <>
                                <div className="flex flex-col items-end mr-4">
                                    <span className="text-xs text-gray-400">Balance</span>
                                    <span className="text-sm font-bold text-[var(--blood-red)]">Rp {user.balance?.toLocaleString() || 0}</span>
                                </div>
                                <Link href="/topup" className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full text-xs font-bold uppercase transition-all border border-gray-700">
                                    Topup
                                </Link>
                                <div className="h-6 w-[1px] bg-gray-700 mx-2"></div>
                                <span className="text-sm font-bold text-white">{user.name}</span>
                                <button onClick={handleLogout} className="text-xs text-red-500 hover:text-red-400 ml-2">LOGOUT</button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                                    Login
                                </Link>
                                <Link href="/register" className="bg-[var(--dark-blood)] hover:bg-[var(--blood-red)] text-white px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(187,10,30,0.3)] hover:shadow-[0_0_25px_rgba(255,31,31,0.6)] border border-[var(--glass-border)]">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white hover:text-red-400 transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Dropdown */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 mt-2 p-6 rounded-3xl glass-panel bg-black/90 border border-white/10 shadow-2xl flex flex-col space-y-4 md:hidden"
                    >
                        {user && ['Home', 'History', 'Games', 'Leaderboard'].map((item) => (
                            <Link
                                key={item}
                                href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                className="text-gray-300 hover:text-white text-center py-2 text-lg font-medium border-b border-white/5 last:border-0"
                                onClick={() => setIsOpen(false)}
                            >
                                {item}
                            </Link>
                        ))}

                        <div className="flex flex-col gap-3 mt-4 border-t border-white/10 pt-4">
                            {user ? (
                                <>
                                    <div className="flex justify-between items-center text-white px-2">
                                        <span>Balance</span>
                                        <span className="font-bold text-[var(--blood-red)]">Rp {user.balance?.toLocaleString() || 0}</span>
                                    </div>
                                    <Link href="/topup" onClick={() => setIsOpen(false)} className="w-full text-center bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-xl text-sm font-bold uppercase transition-all">
                                        Topup Balance
                                    </Link>
                                    <button onClick={handleLogout} className="w-full text-center text-red-500 hover:text-red-400 py-2">
                                        Logout ({user.name})
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" onClick={() => setIsOpen(false)} className="w-full text-center text-gray-300 hover:text-white py-2">
                                        Login
                                    </Link>
                                    <Link href="/register" onClick={() => setIsOpen(false)} className="w-full text-center bg-[var(--dark-blood)] hover:bg-[var(--blood-red)] text-white px-6 py-3 rounded-xl text-sm font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(187,10,30,0.3)] border border-[var(--glass-border)]">
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.nav>
    );
}
