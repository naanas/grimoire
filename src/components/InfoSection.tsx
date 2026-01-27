'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
        <section className="w-full border-t border-gray-800 bg-[#0f0f0f] text-gray-300 py-12">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                {/* Brand & Info */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-2">
                        Grimoire Coins - Top Up Games & Voucher
                    </h2>
                    <p className="text-sm text-gray-400 leading-relaxed max-w-md">
                        Grimoire Coins adalah platform topup game terpercaya, cepat, dan aman.
                        Kami menyediakan berbagai jenis voucher game dengan harga termurah.
                        Nikmati kemudahan transaksi instan 24 jam.
                    </p>

                    <div className="flex gap-4 mt-4">
                        <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[var(--blood-red)] transition-all">📸</a>
                        <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[var(--blood-red)] transition-all">📘</a>
                        <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[var(--blood-red)] transition-all">🎵</a>
                    </div>

                    <div className="space-y-2 text-sm mt-6">
                        <div className="flex items-center gap-2">
                            <span>📍</span> <span>Indonesia, Jakarta Timur</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>📧</span> <a href="mailto:support@grimoire.com" className="hover:text-yellow-500">support@grimoire.com</a>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>📞</span> <a href="https://wa.me/6281234567890" className="hover:text-yellow-500">+62 821-3107-7460</a>
                        </div>
                    </div>
                </div>

                {/* Popular Games (Mini Grid) */}
                <div>
                    <h3 className="text-lg font-bold text-white mb-4">Games Populer</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {popularGames.map((game) => (
                            <Link href={`/order/${game.slug}`} key={game.id} className="block group relative h-16 rounded-md overflow-hidden border border-gray-800 hover:border-yellow-500 transition-colors">
                                <Image
                                    src={game.image}
                                    alt={game.name}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-110"
                                />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Payment Methods */}
                <div>
                    <h3 className="text-lg font-bold text-white mb-4">Metode Pembayaran</h3>
                    <div className="flex flex-wrap gap-2">
                        {['BCA', 'Mandiri', 'QRIS', 'Dana', 'OVO'].map((method) => (
                            <div key={method} className="bg-white text-black text-xs font-bold px-3 py-2 rounded shadow-sm">
                                {method}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
