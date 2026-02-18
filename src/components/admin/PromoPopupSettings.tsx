'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Image as ImageIcon, Ticket, Type, Eye } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function PromoPopupSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [isActive, setIsActive] = useState(false);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [image, setImage] = useState('');
    const [voucher, setVoucher] = useState('');

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        setLoading(true);
        try {
            const res = await api.get('/config/all'); // Use Admin endpoint for all keys
            if (res.data.success) {
                const cfg = res.data.data;
                setIsActive(cfg.PROMO_POPUP_ACTIVE === 'true');
                setTitle(cfg.PROMO_POPUP_TITLE || '');
                setDesc(cfg.PROMO_POPUP_DESC || '');
                setImage(cfg.PROMO_POPUP_IMAGE || '');
                setVoucher(cfg.PROMO_POPUP_VOUCHER_CODE || '');
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Save each key sequentially
            await api.put('/config', { key: 'PROMO_POPUP_ACTIVE', value: isActive.toString() });
            await api.put('/config', { key: 'PROMO_POPUP_TITLE', value: title });
            await api.put('/config', { key: 'PROMO_POPUP_DESC', value: desc });
            await api.put('/config', { key: 'PROMO_POPUP_IMAGE', value: image });
            await api.put('/config', { key: 'PROMO_POPUP_VOUCHER_CODE', value: voucher });

            toast.success("Promo Popup settings saved!");
        } catch (error) {
            console.error("Save failed", error);
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-400">Loading settings...</div>;

    return (
        <div className="bg-black/40 border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-800 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Ticket className="text-[var(--blood-red)]" size={20} />
                        Promo Popup Configuration
                    </h3>
                    <p className="text-sm text-gray-400">Manage the promotional popup shown to users.</p>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center gap-3">
                    <span className={`text-sm ${isActive ? 'text-green-500' : 'text-gray-500'}`}>
                        {isActive ? 'Active' : 'Inactive'}
                    </span>
                    <button
                        onClick={() => setIsActive(!isActive)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${isActive ? 'bg-green-600' : 'bg-gray-700'}`}
                    >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>
            </div>

            <div className="p-4 md:p-6 space-y-6">
                {/* Preview Hint */}
                <div className="bg-blue-900/20 border border-blue-900/50 rounded-lg p-4 flex gap-3 text-sm text-blue-300">
                    <Eye size={18} className="shrink-0 mt-0.5" />
                    <p>The popup will appear once per day for each user when they visit the site.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Col */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Title</label>
                            <div className="relative">
                                <Type className="absolute left-3 top-3 text-gray-500" size={16} />
                                <input
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="e.g. Special Offer!"
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:border-[var(--blood-red)] outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Description</label>
                            <textarea
                                value={desc}
                                onChange={e => setDesc(e.target.value)}
                                placeholder="Enter description..."
                                rows={3}
                                className="w-full bg-black/50 border border-gray-700 rounded-lg p-4 text-white text-sm focus:border-[var(--blood-red)] outline-none resize-none"
                            />
                        </div>
                    </div>

                    {/* Right Col */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Image URL</label>
                            <div className="relative">
                                <ImageIcon className="absolute left-3 top-3 text-gray-500" size={16} />
                                <input
                                    type="text"
                                    value={image}
                                    onChange={e => setImage(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:border-[var(--blood-red)] outline-none"
                                />
                            </div>
                            {image && (
                                <div className="mt-2 h-32 w-full rounded-lg overflow-hidden border border-gray-800 bg-black">
                                    <img src={image} alt="Preview" className="w-full h-full object-cover opacity-50" />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Voucher Code</label>
                            <div className="relative">
                                <Ticket className="absolute left-3 top-3 text-gray-500" size={16} />
                                <input
                                    type="text"
                                    value={voucher}
                                    onChange={e => setVoucher(e.target.value)}
                                    placeholder="e.g. DISCOUNT50"
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white font-mono font-bold text-sm focus:border-[var(--blood-red)] outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-800 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-[var(--blood-red)] hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-bold transition-all disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );
}
