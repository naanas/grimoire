'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
    Menu,
    X,
    ChevronRight,
    LogOut,
    User,
    Wallet,
    Shield,
    Search,
    Trophy,
    Activity,
    Home,
    Gamepad2,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Games', href: '/games', icon: Gamepad2 },
    { name: 'Lacak', href: '/track', icon: Activity },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
];

function rupiah(amount: number | undefined | null): string {
    if (!amount) return '0';
    return new Intl.NumberFormat('id-ID').format(amount);
}

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, logout: handleLogout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 16);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when drawer open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/games?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname?.startsWith(href);
    };

    return (
        <>
            {/* === DESKTOP & MOBILE NAV BAR === */}
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? 'bg-(--bg-void)/85 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
                        : 'bg-linear-to-b from-(--bg-void)/70 via-(--bg-void)/40 to-transparent backdrop-blur-md border-b border-transparent'
                }`}
            >
                {/* Subtle gradient line at top */}
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-(--violet)/50 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 h-16 md:h-20">
                    {/* LEFT: LOGO */}
                    <Link
                        href="/"
                        className="flex items-center gap-3 group shrink-0"
                        onClick={() => setIsOpen(false)}
                    >
                        <div className="relative w-10 h-10 md:w-11 md:h-11 rounded-xl bg-linear-to-br from-(--violet-deep) via-(--bg-elevated) to-(--crimson-deep) p-[1.5px] group-hover:shadow-[0_0_24px_rgba(167,139,250,0.4)] transition-all duration-500">
                            <div className="w-full h-full rounded-[10px] bg-(--bg-void) flex items-center justify-center overflow-hidden relative">
                                <div className="relative w-7 h-7 md:w-8 md:h-8">
                                    <Image
                                        src="/logo.png"
                                        alt="Grimoire"
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                                <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            </div>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-(family-name:--font-cinzel) font-black text-lg md:text-xl tracking-[0.18em] text-white group-hover:gradient-text transition-all duration-500">
                                GRIMOIRE
                            </span>
                            <span className="text-[9px] md:text-[10px] text-(--text-muted) uppercase tracking-[0.32em] font-mono mt-1">
                                Coins
                            </span>
                        </div>
                    </Link>

                    {/* CENTER: NAV LINKS (Desktop) */}
                    <div className="hidden lg:flex items-center gap-1 glass-panel rounded-full px-2 py-1.5">
                        {navLinks.map((link) => {
                            const active = isActive(link.href);
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`relative px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                                        active
                                            ? 'text-white bg-linear-to-r from-(--violet)/20 to-(--crimson)/20'
                                            : 'text-(--text-secondary) hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <span className="relative z-10 flex items-center gap-1.5">
                                        {link.name}
                                    </span>
                                    {active && (
                                        <motion.span
                                            layoutId="navActiveDot"
                                            className="absolute inset-0 rounded-full ring-1 ring-(--violet)/30"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* RIGHT: ACTIONS */}
                    <div className="flex items-center gap-2 md:gap-3 shrink-0">
                        {/* Search */}
                        <button
                            onClick={() => setSearchOpen(true)}
                            aria-label="Search"
                            className="w-10 h-10 md:w-11 md:h-11 rounded-xl glass-panel flex items-center justify-center text-(--text-secondary) hover:text-white hover:border-(--violet)/40 transition-all active:scale-95"
                        >
                            <Search size={17} />
                        </button>

                        {user ? (
                            <>
                                {/* Balance pill */}
                                <Link
                                    href="/topup"
                                    className="hidden sm:flex items-center gap-2 h-11 pl-3 pr-4 rounded-xl glass-panel hover:border-(--gold)/40 transition-all group"
                                >
                                    <div className="w-7 h-7 rounded-lg bg-linear-to-br from-(--gold) to-(--ember) flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Wallet size={14} className="text-black" />
                                    </div>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[9px] text-(--text-muted) font-mono uppercase tracking-wider">
                                            Saldo
                                        </span>
                                        <span className="text-sm font-bold text-(--gold-soft) font-mono">
                                            Rp {rupiah(user.balance)}
                                        </span>
                                    </div>
                                </Link>

                                {/* Profile dropdown (Desktop) */}
                                <div className="hidden md:block relative group">
                                    <button className="flex items-center gap-2 h-11 px-2 pr-3 rounded-xl glass-panel hover:border-(--violet)/40 transition-all">
                                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-(--violet) to-(--crimson) flex items-center justify-center text-white font-black text-sm">
                                            {user.name?.[0]?.toUpperCase() || <User size={14} />}
                                        </div>
                                        <span className="hidden xl:block text-xs font-bold text-white max-w-[100px] truncate">
                                            {user.name}
                                        </span>
                                    </button>

                                    {/* Dropdown */}
                                    <div className="absolute top-full right-0 mt-2 w-56 glass-panel rounded-xl p-1.5 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 origin-top-right z-50 transform group-hover:translate-y-0 translate-y-2">
                                        <div className="px-3 py-3 border-b border-white/5 mb-1.5">
                                            <div className="text-sm font-bold text-white truncate">
                                                {user.name}
                                            </div>
                                            <div className="text-[10px] text-(--text-muted) font-mono uppercase tracking-wider mt-0.5">
                                                {user.email}
                                            </div>
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-(--text-secondary) hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                                        >
                                            <User size={14} className="text-(--violet-glow)" />
                                            Profile
                                        </Link>
                                        <Link
                                            href="/topup"
                                            className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-(--text-secondary) hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                                        >
                                            <Wallet size={14} className="text-(--gold-soft)" />
                                            Top Up Saldo
                                        </Link>
                                        <Link
                                            href="/history"
                                            className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-(--text-secondary) hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                                        >
                                            <Activity size={14} className="text-(--crimson-glow)" />
                                            Riwayat
                                        </Link>
                                        {user.role === 'ADMIN' && (
                                            <Link
                                                href="/admin"
                                                className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-(--gold-soft) hover:bg-(--gold)/10 rounded-lg transition-colors"
                                            >
                                                <Shield size={14} />
                                                Admin Panel
                                            </Link>
                                        )}
                                        <div className="border-t border-white/5 my-1.5" />
                                        <button
                                            onClick={() => handleLogout()}
                                            className="w-full text-left flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-(--crimson-glow) hover:bg-(--crimson)/10 rounded-lg transition-colors"
                                        >
                                            <LogOut size={14} />
                                            Keluar
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="hidden md:flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="text-xs font-bold uppercase text-(--text-secondary) hover:text-white tracking-[0.15em] px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    className="btn-mystic text-white text-xs font-black uppercase tracking-[0.18em] px-5 py-3 rounded-xl"
                                >
                                    Daftar
                                </Link>
                            </div>
                        )}

                        {/* MOBILE MENU TOGGLE */}
                        <button
                            onClick={() => setIsOpen(true)}
                            aria-label="Open menu"
                            className="lg:hidden w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-white hover:border-(--violet)/40 transition-all active:scale-95"
                        >
                            <Menu size={18} />
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* === SEARCH OVERLAY === */}
            <AnimatePresence>
                {searchOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSearchOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-70"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="fixed top-20 md:top-28 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-71"
                        >
                            <form
                                onSubmit={handleSearchSubmit}
                                className="glass-panel rounded-2xl p-2 flex items-center gap-2 ring-1 ring-(--violet)/30 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
                            >
                                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-(--violet)/30 to-(--crimson)/30 flex items-center justify-center">
                                    <Search size={20} className="text-white" />
                                </div>
                                <input
                                    autoFocus
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari game (Mobile Legends, PUBG, Genshin...)"
                                    className="flex-1 bg-transparent text-white placeholder:text-(--text-muted) outline-none px-2 text-sm md:text-base font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => setSearchOpen(false)}
                                    className="w-10 h-10 rounded-lg hover:bg-white/5 text-(--text-muted) hover:text-white flex items-center justify-center transition-colors"
                                    aria-label="Close search"
                                >
                                    <X size={18} />
                                </button>
                            </form>
                            <p className="text-[10px] text-(--text-muted) mt-3 text-center font-mono uppercase tracking-[0.2em]">
                                Tekan Enter untuk mencari
                            </p>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* === MOBILE DRAWER === */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-60 lg:hidden"
                        />

                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                            className="fixed inset-y-0 right-0 w-[88%] max-w-sm bg-(--bg-deep) border-l border-white/5 z-60 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.7)] lg:hidden safe-top safe-bottom"
                        >
                            {/* Ritual top border */}
                            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-700 to-transparent" />

                            {/* Drawer Header */}
                            <div className="px-5 py-5 border-b border-white/5 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-(--crimson-glow) blood-pulse" />
                                    <span className="text-[10px] font-bold text-(--text-muted) uppercase tracking-[0.3em]">
                                        Menu
                                    </span>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    aria-label="Close menu"
                                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors active:scale-95"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* User card */}
                            {user ? (
                                <div className="p-5 border-b border-white/5">
                                    <div className="glass-card rounded-2xl p-4 relative overflow-hidden">
                                        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-(--violet)/15 blur-2xl" />
                                        <div className="relative flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-(--violet) to-(--crimson) flex items-center justify-center text-white font-black text-lg shrink-0">
                                                {user.name?.[0]?.toUpperCase() || <User />}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="text-sm font-bold text-white truncate">
                                                    {user.name}
                                                </div>
                                                <div className="text-[10px] text-(--text-muted) truncate font-mono">
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                        <Link
                                            href="/topup"
                                            onClick={() => setIsOpen(false)}
                                            className="relative mt-4 flex items-center justify-between rounded-xl bg-linear-to-r from-(--gold)/15 to-(--ember)/10 border border-(--gold)/20 px-3 py-2.5"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Wallet size={14} className="text-(--gold-soft)" />
                                                <span className="text-[10px] uppercase tracking-[0.18em] text-(--text-muted) font-bold">
                                                    Saldo
                                                </span>
                                            </div>
                                            <span className="text-sm font-bold font-mono text-(--gold-soft)">
                                                Rp {rupiah(user.balance)}
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-5 border-b border-white/5 grid grid-cols-2 gap-2">
                                    <Link
                                        href="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="text-center rounded-xl border border-white/10 py-3 text-xs font-black uppercase tracking-[0.15em] text-white hover:bg-white/5 active:scale-95 transition-all"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setIsOpen(false)}
                                        className="btn-mystic text-center text-white py-3 rounded-xl text-xs font-black uppercase tracking-[0.15em]"
                                    >
                                        Daftar
                                    </Link>
                                </div>
                            )}

                            {/* Links */}
                            <div className="flex-1 overflow-y-auto py-3 px-3 flex flex-col gap-1">
                                {navLinks.map((link, i) => {
                                    const Icon = link.icon;
                                    const active = isActive(link.href);
                                    return (
                                        <motion.div
                                            key={link.name}
                                            initial={{ opacity: 0, x: 16 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.05 + i * 0.04 }}
                                        >
                                            <Link
                                                href={link.href}
                                                onClick={() => setIsOpen(false)}
                                                className={`group flex items-center justify-between p-4 rounded-xl transition-all ${
                                                    active
                                                        ? 'bg-linear-to-r from-(--violet)/15 to-(--crimson)/10 border border-(--violet)/25'
                                                        : 'border border-transparent hover:bg-white/5'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                            active
                                                                ? 'bg-linear-to-br from-(--violet) to-(--crimson) text-white'
                                                                : 'bg-white/5 text-(--text-secondary) group-hover:text-white'
                                                        }`}
                                                    >
                                                        <Icon size={16} />
                                                    </div>
                                                    <span className="font-bold text-base text-white">
                                                        {link.name}
                                                    </span>
                                                </div>
                                                <ChevronRight
                                                    size={16}
                                                    className="text-(--text-muted) group-hover:text-white group-hover:translate-x-1 transition-all"
                                                />
                                            </Link>
                                        </motion.div>
                                    );
                                })}

                                {user && (
                                    <>
                                        <div className="my-2 px-2 text-[10px] font-bold text-(--text-faint) uppercase tracking-[0.3em]">
                                            Akun
                                        </div>
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 p-4 rounded-xl border border-transparent hover:bg-white/5 transition-all"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-(--violet-glow)">
                                                <User size={16} />
                                            </div>
                                            <span className="font-bold text-white">Profile</span>
                                        </Link>
                                        <Link
                                            href="/history"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 p-4 rounded-xl border border-transparent hover:bg-white/5 transition-all"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-(--crimson-glow)">
                                                <Activity size={16} />
                                            </div>
                                            <span className="font-bold text-white">Riwayat</span>
                                        </Link>

                                        {user.role === 'ADMIN' && (
                                            <Link
                                                href="/admin"
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-3 p-4 rounded-xl border border-(--gold)/20 bg-(--gold)/5 transition-all"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-(--gold)/15 flex items-center justify-center text-(--gold-soft)">
                                                    <Shield size={16} />
                                                </div>
                                                <span className="font-bold text-(--gold-soft)">
                                                    Admin Panel
                                                </span>
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Footer */}
                            {user && (
                                <div className="p-4 border-t border-white/5">
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsOpen(false);
                                        }}
                                        className="w-full flex items-center justify-center gap-2 rounded-xl border border-(--crimson)/30 text-(--crimson-glow) py-3 text-xs font-black uppercase tracking-[0.18em] hover:bg-(--crimson)/10 active:scale-95 transition-all"
                                    >
                                        <LogOut size={14} />
                                        Keluar
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

