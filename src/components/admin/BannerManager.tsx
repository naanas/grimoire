'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, EyeOff, X, Upload } from 'lucide-react';
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
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Banner Manager</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                >
                    <Plus size={16} /> Add Banner
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10 text-neutral-500">Loading banners...</div>
            ) : (
                <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                    {banners.length === 0 && (
                        <p className="text-center text-neutral-500 py-10">No banners found.</p>
                    )}
                    {banners.map((banner) => (
                        <div key={banner.id} className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 group hover:border-neutral-700 transition-colors">
                            <div className="relative w-full h-32 rounded-md overflow-hidden mb-3 bg-neutral-900">
                                <Image
                                    src={banner.imageUrl}
                                    alt={banner.title || 'Banner'}
                                    fill
                                    className="object-cover"
                                />
                                {!banner.isActive && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                                        <span className="text-white text-xs font-bold uppercase border border-white/50 px-2 py-1 rounded">Hidden</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-white font-medium text-sm truncate max-w-[150px]">{banner.title || 'Untitled'}</h3>
                                    <p className="text-neutral-500 text-xs truncate max-w-[150px]">{banner.linkUrl || 'No link'}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleToggle(banner.id)}
                                        className={`p-2 rounded-md transition-colors ${banner.isActive
                                                ? 'bg-green-900/20 text-green-500 hover:bg-green-900/40'
                                                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                                            }`}
                                        title={banner.isActive ? "Hide Banner" : "Show Banner"}
                                    >
                                        {banner.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(banner.id)}
                                        className="p-2 rounded-md bg-red-900/20 text-red-500 hover:bg-red-900/40 transition-colors"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Add New Banner</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-neutral-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Banner Image URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newImageUrl}
                                        onChange={(e) => setNewImageUrl(e.target.value)}
                                        placeholder="https://..."
                                        className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                                        required
                                    />
                                    <label className="cursor-pointer bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-2 rounded-lg flex items-center justify-center transition-colors">
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
                                {uploading && <p className="text-xs text-yellow-500 mt-1">Uploading...</p>}
                            </div>

                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Title (Optional)</label>
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="e.g. Special Event"
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Link URL (Optional)</label>
                                <input
                                    type="text"
                                    value={newLinkUrl}
                                    onChange={(e) => setNewLinkUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={creating || !newImageUrl}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {creating ? 'Creating...' : 'Create Banner'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
