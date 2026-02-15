'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, logout: handleLogout } = useAuth();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        // Disable scroll when menu is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Games', href: '/games' },
        { name: 'Track', href: '/track' },
        { name: 'Leaderboard', href: '/leaderboard' },
    ];

    if (user) {
        navLinks.splice(1, 0, { name: 'History', href: '/history' });
    }

    // Animation Variants
    const menuVariants = {
        closed: { opacity: 0, scale: 0.95, filter: "blur(10px)" },
        open: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } }
    };

    const linkVariants = {
        closed: { x: -20, opacity: 0 },
        open: (i: number) => ({ x: 0, opacity: 1, transition: { delay: 0.1 + (i * 0.05), duration: 0.3 } })
    };

    return (
        <>
            {/* --- DESKTOP & NAV BAR STRIP --- */}
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`fixed left-0 right-0 z-50 flex justify-center transition-all duration-300 ${scrolled ? 'top-2' : 'top-4 md:top-6'
                    } px-4`}
            >
                <div className={`
                    relative w-full max-w-6xl 
                    backdrop-blur-xl bg-[#050505]/80 
                    border border-white/10 
                    shadow-[0_8px_32px_-10px_rgba(0,0,0,0.8)]
                    flex items-center justify-between
                    transition-all duration-300 ease-in-out
                    z-50
                    ${scrolled ? 'py-3 px-5 rounded-2xl' : 'py-4 px-6 md:px-8 rounded-3xl'}
                `}>
                    {/* Glow Line */}
                    <div className="absolute inset-x-0 -bottom-px h-[1px] bg-gradient-to-r from-transparent via-red-900/50 to-transparent blur-sm"></div>

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 z-50" onClick={() => setIsOpen(false)}>
                        <div className="relative w-8 h-8 md:w-10 md:h-10">
                            <Image src="/logo.png" alt="Grimoire" fill className="object-contain drop-shadow-[0_0_10px_rgba(220,20,60,0.5)]" />
                        </div>
                        <span className="font-[family-name:var(--font-cinzel)] font-bold text-lg md:text-xl tracking-widest text-white hidden xs:block">
                            GRIMOIRE
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                        {navLinks.map((link) => (
                            <Link key={link.name} href={link.href} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-white transition-colors relative group">
                                {link.name}
                                <span className="absolute inset-x-2 bottom-1 h-px bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-center"></span>
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Right / Mobile Toggle */}
                    <div className="flex items-center gap-4">
                        {/* Mobile Toggle Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors z-50 focus:outline-none"
                            aria-label="Toggle Menu"
                        >
                            <AnimatePresence mode="wait">
                                {isOpen ? (
                                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                                        <X size={24} />
                                    </motion.div>
                                ) : (
                                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                                        <Menu size={24} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>

                        {/* Desktop Auth */}
                        <div className="hidden md:flex items-center gap-4">
                            {user ? (
                                <div className="flex items-center gap-4 bg-white/5 pr-2 pl-4 py-1.5 rounded-full border border-white/5">
                                    <div className="text-right leading-none">
                                        <div className="text-[9px] text-stone-500 uppercase font-bold">Balance</div>
                                        <div className="text-sm font-mono text-red-500 font-bold">{user.balance?.toLocaleString()}</div>
                                    </div>
                                    <div className="w-px h-6 bg-white/10"></div>
                                    <div className="text-xs font-bold text-white uppercase">{user.name}</div>
                                    <button onClick={handleLogout} className="text-stone-400 hover:text-red-500 pl-2"><LogOut size={16} /></button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link href="/login" className="text-xs font-bold uppercase text-stone-400 hover:text-white">Login</Link>
                                    <Link href="/register" className="bg-red-700 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-colors shadow-[0_0_15px_rgba(180,0,0,0.4)]">Join</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* --- MOBILE FULLSCREEN MENU --- */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="fixed inset-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-2xl flex flex-col md:hidden"
                    >
                        {/* Decorative Background Blob */}
                        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-900/20 rounded-full blur-[100px] pointer-events-none"></div>

                        {/* Spacer for Header */}
                        <div className="h-24"></div>

                        {/* Menu Content */}
                        <div className="flex-1 flex flex-col px-8 py-4 overflow-y-auto">

                            {/* Navigation Links */}
                            <div className="flex flex-col space-y-6 mb-12">
                                {navLinks.map((link, i) => (
                                    <motion.div custom={i} variants={linkVariants} key={link.name}>
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className="group flex items-center justify-between text-3xl font-[family-name:var(--font-cinzel)] font-medium text-stone-400 hover:text-white transition-colors border-b border-white/5 pb-4"
                                        >
                                            {link.name}
                                            <ChevronRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-red-500" />
                                        </Link>
                                    </motion.div>
                                ))}

                                {/* Admin Link */}
                                {user?.role === 'ADMIN' && (
                                    <motion.div custom={navLinks.length} variants={linkVariants}>
                                        <Link href="/admin" onClick={() => setIsOpen(false)} className="text-red-500 font-bold uppercase tracking-widest text-sm py-2">
                                            Admin Dashboard
                                        </Link>
                                    </motion.div>
                                )}
                            </div>

                            {/* Mobile Auth Actions */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="mt-auto mb-8 space-y-4"
                            >
                                {user ? (
                                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-900 to-black flex items-center justify-center border border-white/10">
                                                <User className="text-white" size={20} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white uppercase tracking-wide">{user.name}</div>
                                                <div className="text-xs text-stone-500 uppercase tracking-widest">Wanderer</div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-end border-t border-white/10 pt-4 mb-4">
                                            <span className="text-xs text-stone-500 uppercase tracking-widest">Soul Balance</span>
                                            <span className="text-xl font-mono font-bold text-red-500">Rp {user.balance?.toLocaleString() || 0}</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <Link href="/topup" onClick={() => setIsOpen(false)} className="bg-white text-black py-3 rounded-lg text-center font-bold uppercase text-xs tracking-widest hover:bg-stone-200">
                                                Topup
                                            </Link>
                                            <button onClick={handleLogout} className="border border-red-900/40 text-red-500 py-3 rounded-lg text-center font-bold uppercase text-xs tracking-widest hover:bg-red-900/10">
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <Link href="/login" onClick={() => setIsOpen(false)} className="w-full text-center border border-white/20 text-white py-3.5 rounded-xl uppercase font-bold text-xs tracking-[0.2em] hover:bg-white/5 transition-colors">
                                            Login Account
                                        </Link>
                                        <Link href="/register" onClick={() => setIsOpen(false)} className="w-full text-center bg-red-700 text-white py-3.5 rounded-xl uppercase font-bold text-xs tracking-[0.2em] shadow-[0_0_20px_rgba(200,0,0,0.4)] hover:bg-red-600 transition-colors">
                                            Join Us
                                        </Link>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}