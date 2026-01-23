'use client';
import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchTransactions();
    }, [page]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/transactions?page=${page}&limit=20`);
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
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Transactions Management</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-neutral-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search invoice..."
                        className="bg-neutral-900 border border-neutral-800 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-red-600"
                    />
                </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-neutral-500 flex flex-col items-center">
                        <Loader2 className="animate-spin mb-2" />
                        Loading data...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-neutral-400">
                            <thead className="bg-neutral-950 text-neutral-500 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-4">Invoice</th>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Type</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                {transactions.map((trx: any) => (
                                    <tr key={trx.id} className="hover:bg-neutral-800/30">
                                        <td className="px-6 py-4 font-mono text-white">{trx.invoice}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-neutral-300">{trx.user?.name || 'Guest'}</div>
                                            <div className="text-xs">{trx.user?.email || trx.guestContact}</div>
                                        </td>
                                        <td className="px-6 py-4">{trx.product?.name || 'Unknown'}</td>
                                        <td className="px-6 py-4 font-medium text-white">Rp {trx.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-xs font-bold ${trx.status === 'SUCCESS' ? 'bg-emerald-900/30 text-emerald-500' :
                                                    trx.status === 'PENDING' ? 'bg-orange-900/30 text-orange-500' :
                                                        'bg-red-900/30 text-red-500'
                                                }`}>
                                                {trx.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs">{trx.paymentMethod}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-end gap-2">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-4 py-2 bg-neutral-900 rounded-lg text-neutral-400 hover:text-white disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="px-4 py-2 text-neutral-500">Page {page} of {totalPages}</span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 bg-neutral-900 rounded-lg text-neutral-400 hover:text-white disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
