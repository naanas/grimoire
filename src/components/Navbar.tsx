'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, User, LogOut, PlusCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, logout: handleLogout } = useAuth();

    // Efek mengecil saat di-scroll
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Games', href: '/games' },
        { name: 'Track', href: '/track' },
        { name: 'Leaderboard', href: '/leaderboard' },
    ];

    if (user) {
        navLinks.splice(1, 0, { name: 'History', href: '/history' });
    }

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`fixed left-0 right-0 z-50 flex justify-center transition-all duration-300 ${scrolled ? 'top-2' : 'top-4 md:top-6'
                    } px-4`}
            >
                <div
                    className={`
                        relative w-full max-w-6xl 
                        backdrop-blur-xl bg-[#050505]/80 
                        border border-white/10 
                        shadow-[0_8px_32px_-10px_rgba(0,0,0,0.8)]
                        flex items-center justify-between
                        transition-all duration-300 ease-in-out
                        ${scrolled ? 'py-3 px-5 rounded-2xl' : 'py-4 px-6 md:px-8 rounded-3xl'}
                    `}
                >
                    {/* --- Ambient Glow Effect (Red) --- */}
                    <div className="absolute inset-x-0 -bottom-px h-[1px] bg-gradient-to-r from-transparent via-[var(--blood-red)]/50 to-transparent blur-sm"></div>

                    {/* 1. LOGO SECTION */}
                    <Link href="/" className="flex items-center gap-3 group z-10" onClick={() => setIsOpen(false)}>
                        <div className="relative w-9 h-9 md:w-10 md:h-10 transition-transform group-hover:scale-110 duration-300">
                            <Image
                                src="/logo.png"
                                alt="Grimoire"
                                fill
                                className="object-contain drop-shadow-[0_0_15px_rgba(220,20,60,0.4)]"
                            />
                        </div>
                        <span className="font-[family-name:var(--font-cinzel)] font-bold text-lg md:text-xl tracking-widest text-white group-hover:text-red-500 transition-colors">
                            GRIMOIRE
                        </span>
                    </Link>

                    {/* 2. DESKTOP LINKS (Centered) */}
                    <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="relative px-4 py-2 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-white transition-colors group"
                            >
                                {link.name}
                                {/* Hover Indicator */}
                                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--blood-red)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center shadow-[0_0_10px_red]" />
                            </Link>
                        ))}
                    </div>

                    {/* 3. RIGHT SECTION (Auth) */}
                    <div className="hidden md:flex items-center gap-4 z-10">
                        {user ? (
                            <div className="flex items-center gap-4 bg-white/5 pr-2 pl-4 py-1.5 rounded-full border border-white/5 hover:border-white/20 transition-colors">
                                {/* Balance */}
                                <div className="flex flex-col items-end leading-none mr-2">
                                    <span className="text-[9px] text-stone-500 uppercase font-bold tracking-wider">Soul</span>
                                    <span className="text-sm font-mono text-[var(--blood-red)] font-bold">
                                        {user.balance?.toLocaleString()}
                                    </span>
                                </div>

                                <div className="w-[1px] h-6 bg-white/10"></div>

                                {/* User Name */}
                                <div className="text-xs font-bold text-white uppercase tracking-wide">
                                    {user.name}
                                </div>

                                {/* Topup Button (Small Icon) */}
                                <Link href="/topup" className="text-stone-400 hover:text-[var(--blood-red)] transition-colors" title="Top Up">
                                    <PlusCircle size={18} />
                                </Link>

                                {/* Logout (Small Icon) */}
                                <button onClick={handleLogout} className="text-stone-400 hover:text-red-500 transition-colors pl-1" title="Logout">
                                    <LogOut size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login" className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-white transition-colors">
                                    Login
                                </Link>
                                <Link href="/register" className="relative px-5 py-2 bg-[var(--blood-red)] text-black text-xs font-bold uppercase tracking-[0.15em] rounded-full overflow-hidden group hover:shadow-[0_0_20px_rgba(220,20,60,0.6)] transition-all">
                                    <span className="relative z-10 group-hover:text-white transition-colors">Join</span>
                                    <div className="absolute inset-0 bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></div>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* MOBILE TOGGLE */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors z-50"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </motion.nav>

            {/* --- MOBILE FULLSCREEN OVERLAY --- */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        className="fixed inset-0 z-40 bg-black/90 md:hidden flex flex-col pt-24 px-6"
                    >
                        <div className="flex flex-col space-y-6">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 + (i * 0.05) }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="text-2xl font-[family-name:var(--font-cinzel)] text-stone-400 hover:text-[var(--blood-red)] transition-colors block border-b border-white/10 pb-4"
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}

                            {user ? (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="mt-8 space-y-4"
                                >
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                        <div className="text-xs text-stone-500 uppercase tracking-widest mb-1">Balance</div>
                                        <div className="text-3xl font-mono text-[var(--blood-red)]">
                                            {user.balance?.toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Link href="/topup" onClick={() => setIsOpen(false)} className="bg-white text-black py-3 rounded-lg text-center font-bold uppercase tracking-widest text-sm">
                                            Top Up
                                        </Link>
                                        <button onClick={handleLogout} className="border border-red-900/50 text-red-500 py-3 rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-red-900/20">
                                            Logout
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex flex-col gap-4 mt-8"
                                >
                                    <Link href="/login" onClick={() => setIsOpen(false)} className="w-full text-center border border-white/20 text-white py-3 rounded-lg uppercase tracking-widest">
                                        Login
                                    </Link>
                                    <Link href="/register" onClick={() => setIsOpen(false)} className="w-full text-center bg-[var(--blood-red)] text-white py-3 rounded-lg uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(200,0,0,0.3)]">
                                        Join Us
                                    </Link>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}