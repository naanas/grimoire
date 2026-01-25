'use client';
import { useState, useEffect } from 'react';
import { Search, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import api from '@/lib/api';

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset to page 1 on new search
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchTransactions();
    }, [page, debouncedSearch]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/transactions?page=${page}&limit=20&search=${debouncedSearch}`);
            const data = res.data;
            if (data.success) {
                setTransactions(data.data.transactions);
                setTotalPages(data.data.pagination.pages);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-white">Transactions</h1>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-2.5 text-neutral-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search invoice, user, or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-sm"
                    />
                </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
                        <Loader2 className="animate-spin mb-3 text-red-600" size={32} />
                        <p>Loading transactions...</p>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
                        <p>No transactions found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        {/* Desktop Table View */}
                        <table className="w-full text-left text-sm text-neutral-400 hidden md:table">
                            <thead className="bg-neutral-950 text-neutral-500 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Invoice</th>
                                    <th className="px-6 py-4 font-medium">User</th>
                                    <th className="px-6 py-4 font-medium">Product</th>
                                    <th className="px-6 py-4 font-medium">Amount</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                {transactions.map((trx: any) => (
                                    <tr key={trx.id} className="hover:bg-neutral-800/30 transition-colors">
                                        <td className="px-6 py-4 font-mono text-white text-xs">{trx.invoice}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-neutral-200">{trx.user?.name || 'Guest'}</div>
                                            <div className="text-xs text-neutral-500">{trx.user?.email || trx.guestContact}</div>
                                        </td>
                                        <td className="px-6 py-4 text-neutral-300">{trx.product?.name || 'Unknown'}</td>
                                        <td className="px-6 py-4 font-medium text-white">Rp {trx.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={trx.status} />
                                        </td>
                                        <td className="px-6 py-4 text-xs">{new Date(trx.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Mobile Card View */}
                        <div className="space-y-3 md:hidden p-4">
                            {transactions.map((trx: any) => (
                                <div key={trx.id} className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-800 space-y-3 shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">
                                                {trx.invoice}
                                            </span>
                                            <div className="font-semibold text-white mt-2">{trx.product?.name || 'Unknown'}</div>
                                        </div>
                                        <StatusBadge status={trx.status} />
                                    </div>

                                    <div className="flex justify-between items-end pt-2 border-t border-neutral-700/50">
                                        <div className="text-sm">
                                            <div className="text-neutral-300">{trx.user?.name || 'Guest'}</div>
                                            <div className="text-[10px] text-neutral-500">{new Date(trx.createdAt).toLocaleString()}</div>
                                        </div>
                                        <div className="text-white font-bold text-lg">Rp {trx.amount.toLocaleString()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-500">
                    Showing page <span className="text-white font-medium">{page}</span> of <span className="text-white font-medium">{totalPages}</span>
                </p>
                <div className="flex gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white hover:border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        SUCCESS: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        PENDING: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
        FAILED: 'bg-red-500/10 text-red-500 border-red-500/20',
        PROCESSING: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    };

    return (
        <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider border ${styles[status] || 'bg-neutral-800 text-neutral-400'}`}>
            {status}
        </span>
    );
}
