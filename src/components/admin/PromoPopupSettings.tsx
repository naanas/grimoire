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
        <div className="bg-neutral-950/50 border border-neutral-800 rounded-2xl p-6 relative h-fit">
            {/* Background Decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--blood-red)]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-6 z-10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Ticket className="text-[var(--blood-red)]" size={20} />
                    Promo Popup
                </h3>
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase ${isActive ? 'text-green-500' : 'text-neutral-500'}`}>
                        {isActive ? 'ON' : 'OFF'}
                    </span>
                    <button
                        onClick={() => setIsActive(!isActive)}
                        className={`w-10 h-5 rounded-full transition-colors relative ${isActive ? 'bg-green-600' : 'bg-neutral-700'}`}
                    >
                        <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                </div>
            </div>

            <div className="space-y-4 z-10">
                <div className="space-y-1">
                    <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--blood-red)] outline-none"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Image URL</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={image}
                            onChange={e => setImage(e.target.value)}
                            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--blood-red)] outline-none truncate"
                        />
                        {image && (
                            <div className="w-10 h-9 rounded bg-neutral-800 border border-neutral-700 overflow-hidden shrink-0">
                                <img src={image} alt="" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Voucher</label>
                    <input
                        type="text"
                        value={voucher}
                        onChange={e => setVoucher(e.target.value)}
                        placeholder="OPTIONAL"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-[var(--blood-red)] outline-none"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Description</label>
                    <textarea
                        value={desc}
                        onChange={e => setDesc(e.target.value)}
                        rows={2}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--blood-red)] outline-none resize-none"
                    />
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
<<<<<<<<< Temporary merge branch 1
                    className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-900/20 relative z-20"
=========
                    className="w-full flex items-center justify-center gap-2 bg-[var(--blood-red)] hover:bg-red-700 text-white py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-red-900/20"
>>>>>>>>> Temporary merge branch 2
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Save Popup
                </button>
            </div>
        </div>
    );
}
