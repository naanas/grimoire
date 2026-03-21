'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Instagram, Youtube, Send } from 'lucide-react';
import api from '@/lib/api';
import { GameData } from './GameCard';

export default function InfoSection() {
    const [popularGames, setPopularGames] = useState<GameData[]>([]);

    useEffect(() => {
        api.get('/categories/popular')
            .then(res => {
                if (res.data.success) {
                    setPopularGames(res.data.data.slice(0, 4));
                }
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <section className="w-full relative overflow-hidden">
            {/* Blood drip SVG top border */}
            <div className="absolute top-0 left-0 right-0 pointer-events-none z-10">
                <svg viewBox="0 0 1200 30" preserveAspectRatio="none" className="w-full h-[20px] md:h-[30px]" fill="#0a0a0a">
                    <path d="M0,0 L0,10 Q30,30 60,10 Q90,0 120,15 Q150,30 180,10 Q210,0 240,12 Q270,28 300,8 Q330,0 360,14 Q390,28 420,6 Q450,0 480,16 Q510,30 540,8 Q570,0 600,18 Q630,30 660,10 Q690,0 720,14 Q750,28 780,6 Q810,0 840,16 Q870,30 900,8 Q930,0 960,18 Q990,30 1020,10 Q1050,0 1080,14 Q1110,28 1140,8 Q1170,0 1200,12 L1200,0 Z" />
                </svg>
            </div>

            <div className="bg-[#080808] border-t border-[var(--dark-blood)]/50 text-stone-300 pt-10 pb-8 relative">
                {/* Decorative top line */}
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--blood-red)] to-transparent opacity-60" />

                {/* Ritual corner decorations */}
                <div className="absolute top-4 left-4 text-[var(--blood-red)] opacity-20 text-4xl font-mono select-none">ᛟ</div>
                <div className="absolute top-4 right-4 text-[var(--blood-red)] opacity-20 text-4xl font-mono select-none rotate-180">ᛟ</div>

                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Brand & Info */}
                    <div className="lg:col-span-2 space-y-5">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="h-[1px] w-6 bg-[var(--blood-red)]" />
                                <span className="text-[var(--blood-red)] text-[10px] uppercase tracking-[0.3em] font-bold">Est. MMXXIV</span>
                            </div>
                            <h2 className="text-xl font-black text-white uppercase tracking-wider font-[family-name:var(--font-cinzel)]">
                                Grimoire Coins
                            </h2>
                        </div>
                        <p className="text-sm text-stone-500 leading-relaxed max-w-md">
                            Platform top-up game termurah di Indonesia. Proses instan 24/7,
                            ditenagai oleh <span className="text-[var(--blood-red)]">kekuatan gelap</span> dan diproteksi enkripsi militer.
                        </p>

                        {/* Social Icons */}
                        <div className="flex gap-3 pt-1">
                            {[
                                { icon: Instagram, href: '#', label: 'Instagram' },
                                { icon: Youtube, href: '#', label: 'YouTube' },
                                { icon: Send, href: '#', label: 'Telegram' },
                            ].map(({ icon: Icon, href, label }) => (
                                <a key={label} href={href} aria-label={label}
                                    className="w-9 h-9 flex items-center justify-center border border-stone-800 text-stone-500 hover:border-[var(--blood-red)] hover:text-[var(--blood-red)] hover:shadow-[0_0_10px_rgba(187,10,30,0.3)] transition-all duration-300 rounded-sm">
                                    <Icon size={14} />
                                </a>
                            ))}
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2 text-sm text-stone-500 pt-2">
                            <div className="flex items-center gap-2.5 hover:text-stone-300 transition-colors">
                                <MapPin size={13} className="text-[var(--blood-red)] shrink-0" />
                                <span>Indonesia, Jakarta Timur</span>
                            </div>
                            <div className="flex items-center gap-2.5 hover:text-stone-300 transition-colors">
                                <Mail size={13} className="text-[var(--blood-red)] shrink-0" />
                                <a href="mailto:pact.support@grimoirecoins.store" className="hover:text-red-400 transition-colors truncate">
                                    pact.support@grimoirecoins.store
                                </a>
                            </div>
                            <div className="flex items-center gap-2.5 hover:text-stone-300 transition-colors">
                                <Phone size={13} className="text-[var(--blood-red)] shrink-0" />
                                <a href="https://wa.me/6282131077460" className="hover:text-red-400 transition-colors">
                                    +62 821-3107-7460
                                </a>
                            </div>
                        </div>

                        {/* Dark arts badge */}
                        <div className="flex gap-2 pt-2 flex-wrap">
                            {['🔒 SSL Secured', '⚡ Auto Process', '24/7 Support'].map(badge => (
                                <span key={badge} className="text-[10px] text-stone-600 border border-stone-800/50 px-2 py-1 uppercase tracking-widest">
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Popular Games Grid */}
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <span className="text-[var(--blood-red)] font-mono">ᚷ</span>
                            Games Populer
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {popularGames.map((game) => (
                                <Link href={`/order/${game.slug}`} key={game.id}
                                    className="block group relative h-14 overflow-hidden border border-stone-900 hover:border-[var(--blood-red)]/60 transition-colors duration-300"
                                    style={{ borderRadius: 2 }}>
                                    <Image
                                        src={game.image}
                                        alt={game.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                    <span className="absolute bottom-1 left-1.5 right-1.5 text-[8px] font-bold text-white uppercase tracking-wide truncate">
                                        {game.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <span className="text-[var(--blood-red)] font-mono">ᚠ</span>
                            Pembayaran
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                            {['BCA', 'Mandiri', 'BRI', 'BNI', 'QRIS', 'GoPay', 'OVO', 'Dana', 'ShopeePay'].map((method) => (
                                <div key={method}
                                    className="border border-stone-800 text-stone-400 text-[9px] font-bold px-2.5 py-1.5 uppercase tracking-wider hover:border-[var(--blood-red)]/50 hover:text-stone-200 transition-all cursor-default">
                                    {method}
                                </div>
                            ))}
                        </div>

                        {/* Quick links */}
                        <div className="mt-6 space-y-1.5">
                            <h4 className="text-xs font-bold text-stone-600 uppercase tracking-widest mb-2">Quick Links</h4>
                            {[
                                { label: 'Lacak Pesanan', href: '/track' },
                                { label: 'Topup Balance', href: '/topup' },
                                { label: 'Leaderboard', href: '/leaderboard' },
                                { label: 'About Us', href: '/about-us' },
                            ].map(link => (
                                <Link key={link.href} href={link.href}
                                    className="block text-xs text-stone-600 hover:text-[var(--blood-red)] transition-colors flex items-center gap-1.5">
                                    <span className="text-[8px] text-[var(--blood-red)]/50">▸</span>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Bottom bar */}
                <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-stone-900/50 flex flex-col md:flex-row justify-between items-center gap-3">
                    <p className="text-xs text-stone-700 tracking-wider">
                        © {new Date().getFullYear()} Grimoire Coins. All Souls Reserved.
                    </p>
                    <p className="text-[10px] text-stone-800 tracking-[0.3em] uppercase">
                        Forged with <span className="text-[var(--blood-red)]">bad intentions</span>
                    </p>
                </div>
            </div>
        </section>
    );
}
