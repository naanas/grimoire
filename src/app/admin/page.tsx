'use client';
import { useState, useEffect } from 'react';
import {
    Users,
    ShoppingCart,
    DollarSign,
    Activity,
    TrendingUp,
    Clock
} from 'lucide-react';
import api from '@/lib/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/stats');
            if (res.data.success) {
                setStats(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch stats', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="text-white">Loading stats...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`Rp ${stats?.totalRevenue?.toLocaleString() || 0}`}
                    icon={DollarSign}
                    className="bg-emerald-900/20 border-emerald-900/50 text-emerald-500"
                />
                <StatCard
                    title="Success Rate"
                    value={`${stats?.successRate || 0}%`}
                    icon={Activity}
                    className="bg-blue-900/20 border-blue-900/50 text-blue-500"
                />
                <StatCard
                    title="Today's Orders"
                    value={stats?.todayTransactions || 0}
                    icon={ShoppingCart}
                    className="bg-purple-900/20 border-purple-900/50 text-purple-500"
                />
                <StatCard
                    title="Pending Orders"
                    value={stats?.pendingCount || 0}
                    icon={Clock}
                    className="bg-orange-900/20 border-orange-900/50 text-orange-500"
                />
            </div>

            {/* Recent Transactions */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <TrendingUp size={20} className="text-red-500" />
                        Recent Activity
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-neutral-400">
                        <thead className="text-xs uppercase bg-neutral-950 text-neutral-500">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">User</th>
                                <th className="px-4 py-3">Product</th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 rounded-r-lg">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {stats?.recentTransactions?.map((trx: any) => (
                                <tr key={trx.id} className="hover:bg-neutral-800/30 transition-colors">
                                    <td className="px-4 py-3 font-medium text-white">
                                        {trx.user?.name || 'Guest'}
                                        <div className="text-xs text-neutral-500">{trx.user?.email || trx.guestContact}</div>
                                    </td>
                                    <td className="px-4 py-3">{trx.product?.name || 'Unknown Item'}</td>
                                    <td className="px-4 py-3 text-white">Rp {trx.amount.toLocaleString()}</td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={trx.status} />
                                    </td>
                                    <td className="px-4 py-3">{new Date(trx.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, className }: any) {
    return (
        <div className={`p-6 rounded-xl border ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium opacity-80">{title}</h3>
                <div className="p-2 bg-white/5 rounded-lg">
                    <Icon size={20} />
                </div>
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        SUCCESS: 'bg-emerald-900/20 text-emerald-500 border-emerald-900/50',
        PENDING: 'bg-orange-900/20 text-orange-500 border-orange-900/50',
        FAILED: 'bg-red-900/20 text-red-500 border-red-900/50',
        PROCESSING: 'bg-blue-900/20 text-blue-500 border-blue-900/50',
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'bg-neutral-800 text-neutral-400'}`}>
            {status}
        </span>
    );
}
