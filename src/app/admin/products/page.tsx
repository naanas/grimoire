'use client';
import { useState, useEffect } from 'react';
import { Search, Loader2, Edit2, Check, X, Tag, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/lib/api';
import { io } from 'socket.io-client';

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]); // For Filter Dropdown
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<any>({});

    const [syncing, setSyncing] = useState(false);
    const [syncProgress, setSyncProgress] = useState(0);

    // Filters & Pagination
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset page on search
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        setPage(1); // Reset page on category filter
    }, [selectedCategory]);

    useEffect(() => {
        fetchProducts();
    }, [debouncedSearch, selectedCategory, page]);

    // Socket Listener for Sync Progress
    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');

        socket.on('admin_sync_progress', (data: any) => {
            if (data && typeof data.percentage === 'number') {
                setSyncProgress(data.percentage);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/admin/categories?limit=all');
            if (res.data.success) setCategories(res.data.data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let query = `/admin/products?page=${page}&limit=10&search=${debouncedSearch}`;
            if (selectedCategory !== 'all') {
                query += `&categoryId=${selectedCategory}`;
            }

            const res = await api.get(query);
            if (res.data.success) {
                setProducts(res.data.data.products);
                setTotalPages(res.data.data.pagination.pages);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        if (!confirm('Sync products from Provider? This will update prices.')) return;
        setSyncing(true);
        setSyncProgress(0);
        try {
            const res = await api.post('/admin/products/sync', {}, { timeout: 600000 });
            if (res.data.success) {
                alert(`Sync Complete! Updated: ${res.data.data.updatedCount || res.data.data.updated}, Created: ${res.data.data.createdCount || res.data.data.created}`);
                fetchProducts(); // Refresh list
            } else {
                alert('Sync Failed: ' + res.data.message);
            }
        } catch (error: any) {
            alert('Sync Error: ' + error.message);
        } finally {
            setSyncing(false);
        }
    };

    const handleEdit = (product: any) => {
        setEditingId(product.id);
        setEditForm({ price_sell: product.price_sell, isActive: product.isActive });
    };

    const handleSave = async (id: string) => {
        try {
            const res = await api.patch(`/admin/products/${id}/price`, editForm);

            if (res.status === 200) {
                setProducts(products.map(p => p.id === id ? { ...p, ...editForm } : p));
                setEditingId(null);
            }
        } catch (error) {
            console.error("Failed to update", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-white">Product Inventory</h1>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSync}
                        disabled={syncing}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50 whitespace-nowrap"
                    >
                        {syncing ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
                        {syncing ? `Syncing... ${syncProgress}%` : 'Sync Products'}
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search product name or SKU..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-red-600 transition-colors"
                    />
                    <Search className="absolute left-3 top-2.5 text-neutral-500" size={18} />
                </div>

                {/* Category Filter */}
                <div className="relative w-full md:w-64">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-red-600 appearance-none"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <Filter className="absolute left-3 top-2.5 text-neutral-500" size={18} />
                </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-red-600" size={32} /></div>
                    ) : (
                        <>
                            <table className="w-full text-left text-sm text-neutral-400 hidden md:table">
                                <thead className="bg-neutral-950 text-neutral-500 text-xs uppercase">
                                    <tr>
                                        <th className="px-6 py-4">SKU Code</th>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Provider Price</th>
                                        <th className="px-6 py-4">Selling Price (Rp)</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-800">
                                    {products.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-neutral-500">
                                                No products match your filters.
                                            </td>
                                        </tr>
                                    ) : products.map((p) => (
                                        <tr key={p.id} className="hover:bg-neutral-800/30 group">
                                            <td className="px-6 py-4 font-mono text-xs">{p.sku_code}</td>
                                            <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                                            <td className="px-6 py-4 text-xs">
                                                <span className="bg-neutral-800 px-2 py-1 rounded text-neutral-300">
                                                    {p.category.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-neutral-500">Rp {p.price_provider.toLocaleString()}</td>

                                            {/* Editable Selling Price */}
                                            <td className="px-6 py-4">
                                                {editingId === p.id ? (
                                                    <input
                                                        type="number"
                                                        value={editForm.price_sell}
                                                        onChange={(e) => setEditForm({ ...editForm, price_sell: Number(e.target.value) })}
                                                        className="w-24 bg-neutral-950 border border-red-900 text-white px-2 py-1 rounded text-sm focus:outline-none"
                                                    />
                                                ) : (
                                                    <span className="text-emerald-400 font-bold">Rp {p.price_sell.toLocaleString()}</span>
                                                )}
                                            </td>

                                            {/* Editable Status */}
                                            <td className="px-6 py-4">
                                                {editingId === p.id ? (
                                                    <select
                                                        value={editForm.isActive ? 'true' : 'false'}
                                                        onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === 'true' })}
                                                        className="bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-xs"
                                                    >
                                                        <option value="true">Active</option>
                                                        <option value="false">Inactive</option>
                                                    </select>
                                                ) : (
                                                    <span className={`w-2 h-2 rounded-full inline-block mr-2 ${p.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                )}
                                            </td>

                                            <td className="px-6 py-4">
                                                {editingId === p.id ? (
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleSave(p.id)} className="p-1.5 bg-emerald-900/30 text-emerald-500 rounded hover:bg-emerald-900/50">
                                                            <Check size={16} />
                                                        </button>
                                                        <button onClick={() => setEditingId(null)} className="p-1.5 bg-red-900/30 text-red-500 rounded hover:bg-red-900/50">
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleEdit(p)}
                                                        className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-all"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Mobile Card View */}
                            <div className="md:hidden space-y-4 p-4">
                                {products.length === 0 && <div className="text-center text-neutral-500 py-8">No products found.</div>}
                                {products.map((p) => (
                                    <div key={p.id} className="bg-neutral-800/30 p-4 rounded-lg border border-neutral-800 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="text-xs font-mono text-neutral-500 mb-1">{p.sku_code}</div>
                                                <div className="font-medium text-white">{p.name}</div>
                                                <div className="text-xs text-neutral-400 mt-1">{p.category.name}</div>
                                            </div>
                                            <div className={`w-2 h-2 rounded-full ${p.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                        </div>

                                        <div className="flex justify-between items-center pt-2 border-t border-neutral-800">
                                            {editingId === p.id ? (
                                                <div className="flex w-full gap-2 items-center">
                                                    <input
                                                        type="number"
                                                        value={editForm.price_sell}
                                                        onChange={(e) => setEditForm({ ...editForm, price_sell: Number(e.target.value) })}
                                                        className="flex-1 bg-neutral-950 border border-red-900 text-white px-2 py-1 rounded text-sm focus:outline-none"
                                                    />
                                                    <button onClick={() => handleSave(p.id)} className="p-1.5 bg-emerald-900/30 text-emerald-500 rounded">
                                                        <Check size={16} />
                                                    </button>
                                                    <button onClick={() => setEditingId(null)} className="p-1.5 bg-red-900/30 text-red-500 rounded">
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-neutral-500">Selling Price</span>
                                                        <span className="text-emerald-400 font-bold">Rp {p.price_sell.toLocaleString()}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleEdit(p)}
                                                        className="p-2 text-neutral-500 hover:text-white bg-neutral-800 rounded"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="p-4 border-t border-neutral-800 flex items-center justify-between">
                                <span className="text-sm text-neutral-500">Page {page} of {totalPages}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="p-2 bg-neutral-800 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-700"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="p-2 bg-neutral-800 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-700"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
