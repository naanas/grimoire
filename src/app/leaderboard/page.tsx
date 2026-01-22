'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Trophy, Medal, Crown } from 'lucide-react';

type LeaderboardEntry = {
    userId: string;
    name: string;
    totalSpent: number;
};

export default function LeaderboardPage() {
    const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/content/leaderboard')
            .then(res => {
                if (res.data.success) {
                    setLeaders(res.data.data);
                }
            })
            .catch(err => console.error("Failed to fetch leaderboard", err))
            .finally(() => setLoading(false));
    }, []);

    const getRankIcon = (index: number) => {
        if (index === 0) return <Crown size={32} className="text-yellow-400 animate-pulse drop-shadow-lg" />;
        if (index === 1) return <Medal size={28} className="text-gray-300" />;
        if (index === 2) return <Medal size={28} className="text-amber-700" />;
        return <span className="text-gray-500 font-bold font-mono text-xl">#{index + 1}</span>;
    };

    const getRowStyle = (index: number) => {
        if (index === 0) return "bg-gradient-to-r from-yellow-900/40 to-black border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)] scale-[1.02]";
        if (index === 1) return "bg-gradient-to-r from-gray-900/40 to-black border-gray-500/50";
        if (index === 2) return "bg-gradient-to-r from-amber-900/40 to-black border-amber-700/50";
        return "bg-[#0a0a0a] border-gray-800 hover:border-gray-600";
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <Navbar />
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--blood-red)]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center pt-32 pb-20 px-4 relative overflow-hidden">
            <Navbar />

            {/* Background Ambience */}
            <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-[var(--void)] to-transparent z-0 pointer-events-none"></div>

            <div className="max-w-4xl w-full z-10 space-y-12">

                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="flex justify-center mb-4"
                    >
                        <Trophy size={64} className="text-[var(--blood-red)] drop-shadow-[0_0_15px_rgba(187,10,30,0.8)]" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-[family-name:var(--font-cinzel)] font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-500 to-yellow-200 animate-gradient bg-[length:200%_auto]"
                    >
                        HALL OF GLORY
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 tracking-widest uppercase text-sm"
                    >
                        Top spenders who dominate the realm
                    </motion.p>
                </div>

                {/* Leaderboard List */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                >
                    {leaders.length > 0 ? leaders.map((leader, i) => (
                        <motion.div
                            key={leader.userId}
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className={`flex items-center justify-between p-4 md:p-6 rounded-xl border transition-all ${getRowStyle(i)}`}
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-12 flex justify-center">{getRankIcon(i)}</div>
                                <div>
                                    <h3 className={`font-bold text-lg md:text-xl ${i === 0 ? 'text-yellow-400' : 'text-white'}`}>
                                        {leader.name}
                                    </h3>
                                    {i === 0 && <span className="text-[10px] bg-yellow-900/50 text-yellow-200 px-2 py-0.5 rounded border border-yellow-700">Top Spender</span>}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase">Total Spent</p>
                                <p className="font-mono font-bold text-[var(--blood-red)] text-lg md:text-2xl">
                                    Rp {leader.totalSpent.toLocaleString()}
                                </p>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="text-center py-20 bg-[#0a0a0a] rounded-xl border border-gray-800">
                            <p className="text-gray-500">The realm is quiet... No top spenders yet.</p>
                            <Link href="/games" className="inline-block mt-4 text-[var(--blood-red)] hover:underline">Be the first to conquer!</Link>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
