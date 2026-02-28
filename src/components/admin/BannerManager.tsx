'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, EyeOff, X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import api from '@/lib/api';

export default function BannerManager() {
    const [banners, setBanners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    // New Banner Form
    const [newTitle, setNewTitle] = useState('');
    const [newImageUrl, setNewImageUrl] = useState('');
    const [newLinkUrl, setNewLinkUrl] = useState('');
    const [creating, setCreating] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const res = await api.get('/content/banners');
            if (res.data.success) {
                setBanners(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch banners:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this banner?')) return;
        try {
            await api.delete(`/content/banners/${id}`);
            setBanners(banners.filter(b => b.id !== id));
        } catch (error) {
            alert('Failed to delete banner');
        }
    };

    const handleToggle = async (id: string) => {
        try {
            const res = await api.patch(`/content/banners/${id}/toggle`);
            if (res.data.success) {
                setBanners(banners.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b));
            }
        } catch (error) {
            alert('Failed to toggle banner');
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                setNewImageUrl(res.data.data.url);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            const res = await api.post('/content/banners', {
                title: newTitle,
                imageUrl: newImageUrl,
                linkUrl: newLinkUrl
            });
            if (res.data.success) {
                setBanners([res.data.data, ...banners]);
                setShowAddModal(false);
                setNewTitle('');
                setNewImageUrl('');
                setNewLinkUrl('');
            }
        } catch (error) {
            alert('Failed to create banner');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="bg-neutral-950/40 border border-neutral-800/50 rounded-2xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col">
            {/* Subtle glow effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px] -z-10 pointer-events-none" />

            <div className="flex justify-between items-center mb-6 relative z-10">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <ImageIcon size={20} className="text-red-500" />
                    </div>
                    Banner Manager
                </h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-900/20 hover:-translate-y-0.5"
                >
                    <Plus size={16} /> <span className="hidden sm:inline">Add Banner</span>
                </button>
            </div>

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 space-y-4">
                    <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                    <p>Loading banners...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-4">
                    {banners.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-neutral-500 bg-neutral-900/30 rounded-xl border border-neutral-800/50 border-dashed">
                            <ImageIcon size={48} className="mb-4 text-neutral-600" />
                            <p className="font-medium text-neutral-400">No banners found</p>
                            <p className="text-xs text-neutral-600 mt-1">Click "Add Banner" to create one.</p>
                        </div>
                    )}
                    {banners.map((banner) => (
                        <div key={banner.id} className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-3 flex flex-col gap-3 group hover:border-neutral-700 hover:bg-neutral-800/50 transition-all shadow-sm">
                            <div className="relative w-full aspect-[21/9] rounded-lg overflow-hidden bg-black/50 border border-neutral-800/50">
                                <img
                                    src={banner.imageUrl}
                                    alt={banner.title || 'Banner'}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {!banner.isActive && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                                        <span className="text-white text-xs font-bold uppercase tracking-widest bg-black/80 border border-white/20 px-3 py-1.5 rounded-lg">Hidden</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-medium text-sm truncate" title={banner.title || 'Untitled'}>{banner.title || 'Untitled'}</h3>
                                    <p className="text-neutral-500 text-xs truncate" title={banner.linkUrl || 'No link'}>{banner.linkUrl || 'No link'}</p>
                                </div>
                                <div className="flex items-center gap-2 self-start xl:self-auto shrink-0">
                                    <button
                                        onClick={() => handleToggle(banner.id)}
                                        className={`p-2 rounded-lg transition-colors border ${banner.isActive
                                            ? 'bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20'
                                            : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700'
                                            }`}
                                        title={banner.isActive ? "Hide Banner" : "Show Banner"}
                                    >
                                        {banner.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(banner.id)}
                                        className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-colors"
                                        title="Delete Banner"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Banner Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
                    <div className="relative bg-[#1a1a1a] border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[60px] -z-10 pointer-events-none" />

                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Plus className="text-red-500" size={20} /> Add Banner
                            </h3>
                            <button onClick={() => setShowAddModal(false)} className="p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold ml-1">Banner Image URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newImageUrl}
                                        onChange={(e) => setNewImageUrl(e.target.value)}
                                        placeholder="https://..."
                                        className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all placeholder:text-neutral-600"
                                        required
                                    />
                                    <label className="cursor-pointer bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2.5 rounded-xl flex items-center justify-center transition-colors shadow-inner">
                                        <Upload size={18} />
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>
                                {uploading && <p className="text-xs text-yellow-500 mt-1 ml-1 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" /> Uploading...</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold ml-1">Title (Optional)</label>
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="e.g. Special Event"
                                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all placeholder:text-neutral-600"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold ml-1">Link URL (Optional)</label>
                                <input
                                    type="text"
                                    value={newLinkUrl}
                                    onChange={(e) => setNewLinkUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all placeholder:text-neutral-600"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={creating || !newImageUrl}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl mt-6 flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                            >
                                {creating ? <Loader2 size={18} className="animate-spin" /> : 'Create Banner'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
