'use client';
import { useState, useEffect } from 'react';
import { Loader2, Edit2, Check, X, Tag, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/lib/api';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<any>({});

    // Filters & Pagination
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset page on search change
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        setPage(1); // Reset page on filter change
    }, [statusFilter]);

    useEffect(() => {
        fetchCategories();
    }, [debouncedSearch, statusFilter, page]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            let query = `/admin/categories?page=${page}&limit=10&search=${debouncedSearch}`;
            if (statusFilter !== 'all') {
                query += `&isActive=${statusFilter}`;
            }

            const res = await api.get(query);
            if (res.data.success) {
                setCategories(res.data.data.categories);
                setTotalPages(res.data.data.pagination.pages);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (category: any) => {
        setEditingId(category.id);
        setEditForm({
            profitMargin: category.profitMargin,
            isActive: category.isActive,
            name: category.name
        });
    };

    const handleSave = async (id: string) => {
        try {
            const res = await api.patch(`/admin/categories/${id}`, editForm);

            if (res.status === 200) {
                setCategories(categories.map(c => c.id === id ? { ...c, ...editForm } : c));
                setEditingId(null);
                alert("Category updated! Products prices recalculated instantly via SQL.");
            }
        } catch (error: any) {
            console.error("Failed to update", error);
            const msg = error.response?.data?.message || error.message || "Failed to update category";
            alert(`Error: ${msg}`);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-white">Categories & Profit Margins</h1>

                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search category..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-neutral-900 border border-neutral-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-red-600 transition-colors w-full md:w-64"
                        />
                        <Search className="absolute left-3 top-2.5 text-neutral-500" size={18} />
                    </div>

                    {/* Filter */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-neutral-900 border border-neutral-800 text-white pl-10 pr-8 py-2 rounded-lg focus:outline-none focus:border-red-600 appearance-none w-full md:w-40"
                        >
                            <option value="all">All Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                        <Filter className="absolute left-3 top-2.5 text-neutral-500" size={18} />
                    </div>
                </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-red-600" size={32} /></div>
                    ) : (
                        <>
                            <table className="w-full text-left text-sm text-neutral-400">
                                <thead className="bg-neutral-950 text-neutral-500 text-xs uppercase">
                                    <tr>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Slug / Code</th>
                                        <th className="px-6 py-4">Products</th>
                                        <th className="px-6 py-4">Profit Margin (%)</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-800">
                                    {categories.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">
                                                No categories found matching your filters.
                                            </td>
                                        </tr>
                                    ) : categories.map((c) => (
                                        <tr key={c.id} className="hover:bg-neutral-800/30">
                                            <td className="px-6 py-4 font-medium text-white">
                                                {editingId === c.id ? (
                                                    <input
                                                        value={editForm.name}
                                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                        className="bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-white w-full"
                                                    />
                                                ) : c.name}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs">{c.slug}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <Tag size={12} />
                                                    {c._count?.products || 0}
                                                </div>
                                            </td>

                                            {/* Profit Margin */}
                                            <td className="px-6 py-4">
                                                {editingId === c.id ? (
                                                    <div className="flex items-center gap-1">
                                                        <input
                                                            type="number"
                                                            value={editForm.profitMargin}
                                                            onChange={(e) => setEditForm({ ...editForm, profitMargin: Number(e.target.value) })}
                                                            className="w-16 bg-neutral-950 border border-red-900 text-white px-2 py-1 rounded text-sm focus:outline-none"
                                                        />
                                                        <span className="text-neutral-500">%</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-emerald-400 font-bold">{c.profitMargin}%</span>
                                                )}
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                {editingId === c.id ? (
                                                    <select
                                                        value={editForm.isActive ? 'true' : 'false'}
                                                        onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === 'true' })}
                                                        className="bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-xs"
                                                    >
                                                        <option value="true">Active</option>
                                                        <option value="false">Inactive</option>
                                                    </select>
                                                ) : (
                                                    <span className={`px-2 py-1 rounded text-xs ${c.isActive ? 'bg-emerald-900/30 text-emerald-500' : 'bg-red-900/30 text-red-500'}`}>
                                                        {c.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4">
                                                {editingId === c.id ? (
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleSave(c.id)} className="p-1.5 bg-emerald-900/30 text-emerald-500 rounded hover:bg-emerald-900/50">
                                                            <Check size={16} />
                                                        </button>
                                                        <button onClick={() => setEditingId(null)} className="p-1.5 bg-red-900/30 text-red-500 rounded hover:bg-red-900/50">
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleEdit(c)}
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

                            {/* Simple Pagination */}
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
