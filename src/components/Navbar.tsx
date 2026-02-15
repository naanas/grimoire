'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, LogOut, User, Zap, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, logout: handleLogout } = useAuth();

    // Handle scroll
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

    return (
        <>
            {/* --- DESKTOP NAVBAR --- */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${scrolled
                    ? 'bg-black/95 border-red-900/50 py-3 backdrop-blur-md'
                    : 'bg-gradient-to-b from-black/80 to-transparent border-white/5 py-5 backdrop-blur-sm'
                    }`}
            >
                {/* Decorative Top Line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">

                    {/* LEFT: LOGO */}
                    <Link href="/" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
                        <div className="relative w-10 h-10 border border-white/10 bg-black/50 rotate-45 flex items-center justify-center group-hover:border-red-500 transition-colors overflow-hidden">
                            <div className="-rotate-45 relative w-8 h-8">
                                <Image
                                    src="/logo.png"
                                    alt="Grimoire"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-[family-name:var(--font-cinzel)] font-black text-xl tracking-[0.15em] text-white leading-none group-hover:text-red-500 transition-colors">
                                GRIMOIRE
                            </span>
                            <span className="text-[9px] text-stone-500 uppercase tracking-[0.3em] font-mono leading-none mt-1">
                                System Online
                            </span>
                        </div>
                    </Link>

                    {/* CENTER: NAVIGATION (Cyber Style) */}
                    <div className="hidden md:flex items-center bg-white/5 border border-white/5 skew-x-[-10deg] px-6 py-1">
                        <div className="flex items-center gap-8 skew-x-[10deg]">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="relative text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-white transition-all py-2 group"
                                >
                                    <span className="relative z-10">{link.name}</span>
                                    {/* Hover Glitch Effect */}
                                    <span className="absolute left-0 bottom-0 w-full h-[2px] bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
                                    <span className="absolute -top-1 -right-2 text-[8px] text-red-500 opacity-0 group-hover:opacity-100 transition-opacity font-mono">01</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: AUTH HUD */}
                    <div className="hidden md:flex items-center gap-5">
                        {user ? (
                            <div className="flex items-center gap-4">
                                {/* Balance Display */}
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-stone-500 font-mono uppercase">Credits</span>
                                    <span className="text-sm font-bold text-red-500 font-mono tracking-tight glow-text">
                                        Rp {user.balance?.toLocaleString() || 0}
                                    </span>
                                </div>

                                {/* Divider */}
                                <div className="h-8 w-[1px] bg-white/10 rotate-12"></div>

                                {/* User Profile */}
                                <div className="group relative flex items-center gap-3 cursor-pointer">
                                    <div className="text-right hidden lg:block">
                                        <div className="text-xs font-bold text-white uppercase">{user.name}</div>
                                        <div className="text-[9px] text-stone-500 uppercase">Class: User</div>
                                    </div>
                                    <div className="w-9 h-9 border border-white/20 bg-stone-900 flex items-center justify-center hover:border-red-500 transition-colors">
                                        <User size={16} className="text-stone-300" />
                                    </div>

                                    {/* Dropdown Mini (Actions) */}
                                    <div className="absolute top-full right-0 mt-2 w-32 bg-black border border-white/10 p-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all transform origin-top-right z-50">
                                        <Link href="/profile" className="block px-3 py-2 text-[10px] uppercase font-bold text-stone-300 hover:bg-red-900/30 hover:text-white transition-colors">
                                            Profile
                                        </Link>
                                        <Link href="/topup" className="block px-3 py-2 text-[10px] uppercase font-bold text-stone-300 hover:bg-red-900/30 hover:text-white transition-colors">
                                            Top Up
                                        </Link>
                                        <button onClick={handleLogout} className="w-full text-left block px-3 py-2 text-[10px] uppercase font-bold text-red-500 hover:bg-red-900/30 transition-colors">
                                            Disconnect
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login" className="text-xs font-bold uppercase text-stone-400 hover:text-white tracking-widest px-2">
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="relative px-6 py-2 bg-red-700 hover:bg-red-600 transition-colors text-white text-xs font-black uppercase tracking-widest clip-path-button"
                                    style={{ clipPath: "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)" }}
                                >
                                    Initialize
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* MOBILE TOGGLE */}
                    <button
                        onClick={() => setIsOpen(true)}
                        className="md:hidden text-white p-2 border border-white/10 hover:bg-white/5 active:scale-95 transition-all"
                    >
                        <Menu size={20} />
                    </button>
                </div>
            </motion.nav>

            {/* --- MOBILE SIDE DRAWER (SLIDE FROM RIGHT) --- */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 right-0 w-[80%] max-w-sm bg-[#050505] border-l border-white/10 z-50 flex flex-col shadow-2xl md:hidden"
                        >
                            {/* Drawer Header */}
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-stone-950/50">
                                <span className="text-sm font-bold text-stone-500 uppercase tracking-widest">Navigation</span>
                                <button onClick={() => setIsOpen(false)} className="text-white hover:text-red-500 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Links */}
                            <div className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-2">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + (i * 0.05) }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className="group flex items-center justify-between p-4 border border-white/5 hover:border-red-900/50 hover:bg-white/5 transition-all"
                                        >
                                            <span className="font-[family-name:var(--font-cinzel)] text-lg text-stone-300 group-hover:text-white uppercase font-bold">
                                                {link.name}
                                            </span>
                                            <ChevronRight size={16} className="text-stone-600 group-hover:text-red-500 transition-colors" />
                                        </Link>
                                    </motion.div>
                                ))}

                                {user?.role === 'ADMIN' && (
                                    <Link
                                        href="/admin"
                                        onClick={() => setIsOpen(false)}
                                        className="mt-4 flex items-center gap-2 text-red-500 font-bold uppercase text-xs tracking-widest p-4 border border-red-900/20 bg-red-950/10"
                                    >
                                        <Shield size={14} /> Admin Panel
                                    </Link>
                                )}
                            </div>

                            {/* Drawer Footer (Auth) */}
                            <div className="p-6 border-t border-white/10 bg-stone-950/80">
                                {user ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-stone-900 border border-white/10 flex items-center justify-center">
                                                <User className="text-white" />
                                            </div>
                                            <div>
                                                <div className="text-white font-bold uppercase">{user.name}</div>
                                                <div className="text-red-500 font-mono text-sm">Rp {user.balance?.toLocaleString()}</div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Link href="/profile" onClick={() => setIsOpen(false)} className="bg-white text-black text-center py-3 text-xs font-black uppercase tracking-widest hover:bg-stone-200">
                                                Profile
                                            </Link>
                                            <Link href="/topup" onClick={() => setIsOpen(false)} className="bg-white text-black text-center py-3 text-xs font-black uppercase tracking-widest hover:bg-stone-200">
                                                Top Up
                                            </Link>
                                        </div>
                                        <button onClick={handleLogout} className="w-full border border-red-900 text-red-500 text-center py-3 text-xs font-black uppercase tracking-widest hover:bg-red-950/30">
                                            Log Out
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <Link href="/login" onClick={() => setIsOpen(false)} className="text-center text-stone-400 hover:text-white uppercase text-xs font-bold tracking-widest py-2">
                                            Access Terminal
                                        </Link>
                                        <Link href="/register" onClick={() => setIsOpen(false)} className="bg-red-700 text-white text-center py-3 text-xs font-black uppercase tracking-widest hover:bg-red-600">
                                            Join System
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}