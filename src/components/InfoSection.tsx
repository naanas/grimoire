'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Instagram, Youtube, Send, ShieldCheck, Zap, Headphones } from 'lucide-react';
import api from '@/lib/api';
import { GameData } from './GameCard';

const PAYMENT_METHODS = [
    'BCA',
    'Mandiri',
    'BRI',
    'BNI',
    'QRIS',
    'GoPay',
    'OVO',
    'Dana',
    'ShopeePay',
];

const QUICK_LINKS = [
    { label: 'Lacak Pesanan', href: '/track' },
    { label: 'Top Up Saldo', href: '/topup' },
    { label: 'Leaderboard', href: '/leaderboard' },
    { label: 'About Us', href: '/about-us' },
];

const TRUST_BADGES = [
    { icon: ShieldCheck, label: 'SSL Secured' },
    { icon: Zap, label: 'Auto Process' },
    { icon: Headphones, label: '24/7 Support' },
];

export default function InfoSection() {
    const [popularGames, setPopularGames] = useState<GameData[]>([]);

    useEffect(() => {
        api.get('/categories/popular')
            .then((res) => {
                if (res.data.success) {
                    setPopularGames(res.data.data.slice(0, 4));
                }
            })
            .catch((err) => console.error(err));
    }, []);

    return (
        <section className="w-full relative overflow-hidden bg-linear-to-b from-transparent to-(--bg-deep) pt-12 md:pt-20">
            {/* Top gradient line */}
            <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-(--violet)/40 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
                {/* Decorative corners */}
                <div className="absolute -top-6 left-4 text-(--violet)/20 text-3xl md:text-4xl font-mono select-none pointer-events-none">
                    *
                </div>
                <div className="absolute -top-6 right-4 text-(--crimson)/20 text-3xl md:text-4xl font-mono select-none pointer-events-none">
                    *
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                    {/* === Brand & Info === */}
                    <div className="lg:col-span-2 space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-(--violet-deep) to-(--crimson-deep) p-[1.5px]">
                                <div className="w-full h-full rounded-[10px] bg-(--bg-void) flex items-center justify-center overflow-hidden">
                                    <div className="relative w-8 h-8">
                                        <Image
                                            src="/logo.png"
                                            alt="Grimoire"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-[0.18em] font-(family-name:--font-cinzel) leading-none">
                                    Grimoire Coins
                                </h2>
                                <p className="text-[10px] text-(--gold-soft) uppercase tracking-[0.3em] font-mono mt-1.5">
                                    Est. MMXXIV
                                </p>
                            </div>
                        </div>

                        <p className="text-sm text-(--text-secondary) leading-relaxed max-w-md">
                            Platform top-up game terpercaya di Indonesia. Proses instan 24/7,
                            harga termurah, dan keamanan terjamin untuk seluruh transaksimu.
                        </p>

                        {/* Trust badges */}
                        <div className="flex flex-wrap gap-2 pt-1">
                            {TRUST_BADGES.map(({ icon: Icon, label }) => (
                                <div
                                    key={label}
                                    className="flex items-center gap-1.5 text-[10px] text-(--text-secondary) glass-panel rounded-full px-3 py-1.5 font-bold uppercase tracking-[0.15em]"
                                >
                                    <Icon size={11} className="text-(--violet-glow)" />
                                    {label}
                                </div>
                            ))}
                        </div>

                        {/* Contact */}
                        <div className="space-y-2.5 text-sm pt-2">
                            <div className="flex items-center gap-2.5 text-(--text-secondary) hover:text-white transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                    <MapPin size={13} className="text-(--violet-glow)" />
                                </div>
                                <span className="text-xs">Jakarta Timur, Indonesia</span>
                            </div>
                            <a
                                href="mailto:pact.support@grimoirecoins.store"
                                className="flex items-center gap-2.5 text-(--text-secondary) hover:text-white transition-colors"
                            >
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                    <Mail size={13} className="text-(--violet-glow)" />
                                </div>
                                <span className="text-xs truncate">
                                    pact.support@grimoirecoins.store
                                </span>
                            </a>
                            <a
                                href="https://wa.me/6282131077460"
                                className="flex items-center gap-2.5 text-(--text-secondary) hover:text-white transition-colors"
                            >
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                    <Phone size={13} className="text-(--violet-glow)" />
                                </div>
                                <span className="text-xs">+62 821-3107-7460</span>
                            </a>
                        </div>

                        {/* Social */}
                        <div className="flex gap-2.5 pt-1">
                            {[
                                { icon: Instagram, href: '#', label: 'Instagram' },
                                { icon: Youtube, href: '#', label: 'YouTube' },
                                { icon: Send, href: '#', label: 'Telegram' },
                            ].map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="w-9 h-9 flex items-center justify-center rounded-lg glass-panel text-(--text-secondary) hover:text-white hover:border-(--violet)/40 transition-all"
                                >
                                    <Icon size={14} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* === Popular Games === */}
                    <div>
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.22em] mb-4 flex items-center gap-2">
                            <span className="w-6 h-[2px] rounded-full bg-linear-to-r from-(--violet) to-(--crimson)" />
                            Populer
                        </h3>
                        {popularGames.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                                {popularGames.map((game) => (
                                    <Link
                                        href={`/order/${game.slug}`}
                                        key={game.id}
                                        className="block group relative h-16 overflow-hidden rounded-lg glass-panel border-white/5 hover:border-(--violet)/40 transition-all duration-300"
                                    >
                                        <Image
                                            src={game.image}
                                            alt={game.name}
                                            fill
                                            sizes="200px"
                                            className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-90"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-(--bg-void) via-(--bg-void)/40 to-transparent" />
                                        <span className="absolute bottom-1.5 left-2 right-2 text-[9px] font-black text-white uppercase tracking-wide truncate drop-shadow-md">
                                            {game.name}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-16 rounded-lg bg-white/3 border border-white/5"
                                    />
                                ))}
                            </div>
                        )}

                        <h4 className="mt-6 text-[10px] font-black text-(--text-muted) uppercase tracking-[0.25em] mb-2.5">
                            Quick Links
                        </h4>
                        <ul className="space-y-1.5">
                            {QUICK_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="flex items-center gap-2 text-xs text-(--text-secondary) hover:text-white transition-colors group"
                                    >
                                        <span className="text-[8px] text-(--violet)/50 group-hover:text-(--violet-glow) transition-colors">
                                            &gt;
                                        </span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* === Payment === */}
                    <div>
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.22em] mb-4 flex items-center gap-2">
                            <span className="w-6 h-[2px] rounded-full bg-linear-to-r from-(--gold) to-(--ember)" />
                            Pembayaran
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                            {PAYMENT_METHODS.map((method) => (
                                <div
                                    key={method}
                                    className="glass-panel text-(--text-secondary) text-[10px] font-black px-2.5 py-1.5 uppercase tracking-widest rounded-md border-white/5 hover:border-(--gold)/40 hover:text-(--gold-soft) transition-all cursor-default"
                                >
                                    {method}
                                </div>
                            ))}
                        </div>

                        <h4 className="mt-6 text-[10px] font-black text-(--text-muted) uppercase tracking-[0.25em] mb-2.5">
                            Legal
                        </h4>
                        <ul className="space-y-1.5">
                            {[
                                { label: 'Privacy Policy', href: '/privacy-policy' },
                                { label: 'Terms of Service', href: '/terms-of-service' },
                                { label: 'Refund Policy', href: '/refund-policy' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="flex items-center gap-2 text-xs text-(--text-secondary) hover:text-white transition-colors group"
                                    >
                                        <span className="text-[8px] text-(--violet)/50 group-hover:text-(--violet-glow) transition-colors">
                                            &gt;
                                        </span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 md:mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="text-[11px] text-(--text-muted) tracking-wider">
                        © {new Date().getFullYear()} Grimoire Coins. All rights reserved.
                    </p>
                    <p className="text-[10px] text-(--text-faint) tracking-[0.3em] uppercase">
                        Forged with{' '}
                        <span className="bg-linear-to-r from-(--violet-glow) to-(--crimson-glow) bg-clip-text text-transparent font-bold">
                            magic
                        </span>{' '}
                        in Indonesia
                    </p>
                </div>
            </div>
        </section>
    );
}

