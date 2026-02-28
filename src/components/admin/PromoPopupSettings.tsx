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
        <div className="bg-neutral-950/40 border border-neutral-800/50 rounded-2xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-neutral-700/50 transition-colors h-fit">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px] -z-10 pointer-events-none group-hover:bg-red-500/10 transition-colors duration-700" />

            <div className="flex items-center justify-between mb-6 z-10 relative">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <Ticket className="text-red-500" size={20} />
                    </div>
                    Promo Popup
                </h3>
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase ${isActive ? 'text-green-500' : 'text-neutral-500'}`}>
                        {isActive ? 'ON' : 'OFF'}
                    </span>
                    <button
                        onClick={() => setIsActive(!isActive)}
                        className={`w-12 h-6 rounded-full transition-colors relative shadow-inner ${isActive ? 'bg-red-600' : 'bg-neutral-800'}`}
                    >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>
            </div>

            <div className="space-y-5 z-10 relative">
                <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold ml-1">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all placeholder:text-neutral-600"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold ml-1">Image URL</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={image}
                            onChange={e => setImage(e.target.value)}
                            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all truncate placeholder:text-neutral-600"
                        />
                        {image && (
                            <div className="w-11 h-10 rounded-xl bg-black border border-neutral-700 overflow-hidden shrink-0 shadow-inner group-hover/img">
                                <img src={image} alt="" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold ml-1">Voucher Code</label>
                    <input
                        type="text"
                        value={voucher}
                        onChange={e => setVoucher(e.target.value)}
                        placeholder="OPTIONAL"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all placeholder:text-neutral-600"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold ml-1">Description</label>
                    <textarea
                        value={desc}
                        onChange={e => setDesc(e.target.value)}
                        rows={3}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all resize-none placeholder:text-neutral-600"
                    />
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-900/20 mt-2 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Save Popup Settings
                </button>
            </div>
        </div>
    );
}
