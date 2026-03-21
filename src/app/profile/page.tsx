'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { User, Settings, Phone, Mail, ShieldCheck, Zap, Clock, CheckCircle, XCircle, TrendingUp, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface Transaction {
    id: string;
    invoice: string;
    type: 'PURCHASE' | 'DEPOSIT';
    status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
    amount: number;
    targetId?: string;
    zoneId?: string;
    paymentMethod: string;
    createdAt: string;
    product?: {
        name: string;
    };
}

interface TodayStats {
    totalTransactions: number;
    totalSales: number;
    pending: number;
    processing: number;
    success: number;
    failed: number;
}

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [todayStats, setTodayStats] = useState<TodayStats>({
        totalTransactions: 0,
        totalSales: 0,
        pending: 0,
        processing: 0,
        success: 0,
        failed: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            fetchTransactions();
        }
    }, [user]);

    const fetchTransactions = async () => {
        try {
            const res = await api.get('/history');
            if (res.data.success) {
                const txns = res.data.data;
                setTransactions(txns);
                calculateTodayStats(txns);
            }
        } catch (err) {
            console.error('Failed to fetch transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    const calculateTodayStats = (txns: Transaction[]) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayTxns = txns.filter(txn => {
            const txnDate = new Date(txn.createdAt);
            txnDate.setHours(0, 0, 0, 0);
            return txnDate.getTime() === today.getTime();
        });

        const stats: TodayStats = {
            totalTransactions: todayTxns.length,
            totalSales: todayTxns.reduce((sum, txn) => sum + (txn.status === 'SUCCESS' ? txn.amount : 0), 0),
            pending: todayTxns.filter(t => t.status === 'PENDING').length,
            processing: todayTxns.filter(t => t.status === 'PROCESSING').length,
            success: todayTxns.filter(t => t.status === 'SUCCESS').length,
            failed: todayTxns.filter(t => t.status === 'FAILED').length,
        };

        setTodayStats(stats);
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent pt-24 pb-20 px-4">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* User Profile Card */}
                <div className="bg-gradient-to-br from-[#1a0505] to-[#0a0a0a] border border-red-900/30 rounded-none p-6 relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-900/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        {/* User Info */}
                        <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div className="w-20 h-20 border-2 border-red-600/50 bg-black/50 flex items-center justify-center relative group">
                                <div className="absolute inset-0 bg-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <User size={32} className="text-red-500 relative z-10" />
                            </div>

                            {/* Details */}
                            <div>
                                <h1 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-white uppercase tracking-wider">
                                    {user.name}
                                </h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs uppercase tracking-widest text-red-500 font-bold border border-red-900/50 bg-red-950/30 px-2 py-1">
                                        {user.role === 'ADMIN' ? 'ADMIN' : 'MEMBER'}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1 mt-3 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <Mail size={14} className="text-red-600" />
                                        <span className="font-mono">{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone size={14} className="text-red-600" />
                                        <span className="font-mono">{user.phoneNumber}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Balance & Actions */}
                        <div className="flex flex-col items-start md:items-end gap-3">
                            <div className="text-right">
                                <div className="text-xs uppercase tracking-widest text-gray-500 font-mono mb-1">Credits</div>
                                <div className="text-3xl font-black text-red-500 font-mono tracking-tight glow-text">
                                    Rp {user.balance?.toLocaleString() || 0}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                {user.role === 'ADMIN' && (
                                    <Link
                                        href="/admin"
                                        className="px-6 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
                                    >
                                        <ShieldCheck size={14} />
                                        Admin
                                    </Link>
                                )}
                                <Link
                                    href="/topup"
                                    className="px-6 py-2 bg-red-700 hover:bg-red-600 text-white text-xs font-black uppercase tracking-widest transition-all clip-path-button flex items-center gap-2"
                                    style={{ clipPath: "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)" }}
                                >
                                    <Zap size={14} />
                                    Top Up
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Today's Stats Header */}
                <div className="border-l-4 border-red-600 pl-4">
                    <h2 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-white uppercase tracking-wider">
                        Transaksi Hari Ini
                    </h2>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Daily Performance Metrics</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Total Transactions */}
                    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 relative overflow-hidden group hover:border-gray-700 transition-colors">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gray-700/10 rounded-full blur-2xl group-hover:bg-gray-600/20 transition-all"></div>
                        <div className="relative z-10">
                            <div className="text-gray-400 text-xs uppercase tracking-widest mb-2">Total Transaksi</div>
                            <div className="text-5xl font-black text-white font-mono">{todayStats.totalTransactions}</div>
                        </div>
                    </div>

                    {/* Total Sales */}
                    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-6 relative overflow-hidden group hover:border-gray-700 transition-colors">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gray-700/10 rounded-full blur-2xl group-hover:bg-gray-600/20 transition-all"></div>
                        <div className="relative z-10">
                            <div className="text-gray-400 text-xs uppercase tracking-widest mb-2">Total Penjualan</div>
                            <div className="text-3xl font-black text-white font-mono">Rp {todayStats.totalSales.toLocaleString()}</div>
                        </div>
                    </div>

                    {/* Menunggu - Yellow/Gold */}
                    <div className="bg-gradient-to-br from-yellow-900/20 to-black border border-yellow-900/40 p-6 relative overflow-hidden group hover:border-yellow-700/60 transition-colors">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-600/10 rounded-full blur-2xl"></div>
                        <div className="relative z-10">
                            <div className="text-yellow-400 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Clock size={14} />
                                Menunggu
                            </div>
                            <div className="text-5xl font-black text-yellow-500 font-mono">{todayStats.pending}</div>
                        </div>
                    </div>

                    {/* Dalam Proses - Blue */}
                    <div className="bg-gradient-to-br from-blue-900/20 to-black border border-blue-900/40 p-6 relative overflow-hidden group hover:border-blue-700/60 transition-colors">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-600/10 rounded-full blur-2xl"></div>
                        <div className="relative z-10">
                            <div className="text-blue-400 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                                <TrendingUp size={14} />
                                Dalam Proses
                            </div>
                            <div className="text-5xl font-black text-blue-500 font-mono">{todayStats.processing}</div>
                        </div>
                    </div>

                    {/* Sukses - Green */}
                    <div className="bg-gradient-to-br from-green-900/20 to-black border border-green-900/40 p-6 relative overflow-hidden group hover:border-green-700/60 transition-colors">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-green-600/10 rounded-full blur-2xl"></div>
                        <div className="relative z-10">
                            <div className="text-green-400 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                                <CheckCircle size={14} />
                                Sukses
                            </div>
                            <div className="text-5xl font-black text-green-500 font-mono">{todayStats.success}</div>
                        </div>
                    </div>

                    {/* Gagal - Deep Red/Maroon */}
                    <div className="bg-gradient-to-br from-red-900/20 to-black border border-red-900/40 p-6 relative overflow-hidden group hover:border-red-700/60 transition-colors">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-red-600/10 rounded-full blur-2xl"></div>
                        <div className="relative z-10">
                            <div className="text-red-400 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                                <XCircle size={14} />
                                Gagal
                            </div>
                            <div className="text-5xl font-black text-red-500 font-mono">{todayStats.failed}</div>
                        </div>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="border-l-4 border-red-600 pl-4 mt-8">
                    <h2 className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-white uppercase tracking-wider">
                        Riwayat Transaksi Terbaru
                    </h2>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Recent Transaction History</p>
                </div>

                <div className="bg-[#0a0a0a] border border-gray-800 overflow-hidden">
                    {loading ? (
                        <div className="text-center py-12 text-gray-400">Loading transactions...</div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <p className="mb-4">Belum ada transaksi.</p>
                            <Link href="/" className="px-6 py-2 bg-red-700 text-white font-bold uppercase text-xs tracking-widest hover:bg-red-600 transition-all inline-block">
                                Mulai Belanja
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-400">
                                <thead className="bg-[#111] text-xs uppercase text-gray-200 font-mono">
                                    <tr>
                                        <th className="px-6 py-3">Nomor Invoice</th>
                                        <th className="px-6 py-3">Tanggal</th>
                                        <th className="px-6 py-3">Item</th>
                                        <th className="px-6 py-3">User Input</th>
                                        <th className="px-6 py-3">Harga</th>
                                        <th className="px-6 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.slice(0, 20).map((trx) => (
                                        <tr key={trx.id} className="border-b border-gray-800 hover:bg-[#111] transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-red-400">{trx.invoice}</td>
                                            <td className="px-6 py-4">{new Date(trx.createdAt).toLocaleString('id-ID')}</td>
                                            <td className="px-6 py-4 text-white font-medium">
                                                {trx.type === 'DEPOSIT' ? 'Wallet Deposit' : trx.product?.name || 'Unknown Item'}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs">
                                                {trx.targetId ? `${trx.targetId}${trx.zoneId ? ` (${trx.zoneId})` : ''}` : '-'}
                                            </td>
                                            <td className="px-6 py-4 font-mono">Rp {trx.amount.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider ${trx.status === 'SUCCESS' ? 'bg-green-900/30 text-green-400 border border-green-900/50' :
                                                    trx.status === 'PENDING' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-900/50' :
                                                        trx.status === 'PROCESSING' ? 'bg-blue-900/30 text-blue-400 border border-blue-900/50' :
                                                            'bg-red-900/30 text-red-400 border border-red-900/50'
                                                    }`}>
                                                    {trx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
