'use client';
import { useState, useEffect } from 'react';
import { Save, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

export default function TripaySettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState<Record<string, string>>({});
    const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await api.get('/config/all'); // Admin endpoint
            if (res.data.success) {
                setConfig(res.data.data);
            }
        } catch (error) {
            toast.error('Gagal mengambil konfigurasi');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (key: string, value: string) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        let errorCount = 0;
        try {
            const keysToSave = [
                'TRIPAY_MODE',
                'TRIPAY_SB_API_KEY', 'TRIPAY_SB_PRIVATE_KEY', 'TRIPAY_SB_MERCHANT_CODE',
                'TRIPAY_PROD_API_KEY', 'TRIPAY_PROD_PRIVATE_KEY', 'TRIPAY_PROD_MERCHANT_CODE'
            ];

            for (const key of keysToSave) {
                // Allow saving empty strings (backend now supports it)
                if (config[key] !== undefined) {
                    try {
                        await api.put('/config', { key, value: config[key] });
                    } catch (e) {
                        console.error(`Failed to save ${key}`, e);
                        errorCount++;
                    }
                }
            }

            if (errorCount === 0) {
                toast.success('Konfigurasi berhasil disimpan!');
            } else if (errorCount < keysToSave.length) {
                toast.success(`Disimpan dengan ${errorCount} peringatan.`);
            } else {
                toast.error('Gagal menyimpan semua konfigurasi.');
            }

            // Refresh to ensure state is synced
            fetchConfig();
        } catch (error) {
            toast.error('Terjadi kesalahan sistem.');
        } finally {
            setSaving(false);
        }
    };

    const toggleSecret = (key: string) => {
        setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (loading) return <div className="p-8 text-center text-white"><Loader2 className="animate-spin inline mr-2" /> Loading settings...</div>;

    const InputField = ({ label, confKey, type = 'text', placeholder = '' }: { label: string, confKey: string, type?: string, placeholder?: string }) => (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">{label}</label>
            <div className="relative">
                <input
                    type={type === 'password' && showSecrets[confKey] ? 'text' : type}
                    value={config[confKey] || ''}
                    onChange={(e) => handleChange(confKey, e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-red-900 focus:border-red-500 transition-all font-mono text-sm"
                />
                {type === 'password' && (
                    <button
                        type="button"
                        onClick={() => toggleSecret(confKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                    >
                        {showSecrets[confKey] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="bg-neutral-950/40 border border-neutral-800/50 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse my-auto" />
                    Tripay Configuration
                </h2>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-neutral-800 hover:bg-[var(--blood-red)] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Save Changes
                </button>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {/* Mode Selector */}
                <div className="grid grid-cols-2 gap-3 bg-black/50 p-1.5 rounded-xl border border-neutral-800">
                    {['SANDBOX', 'PRODUCTION'].map((mode) => (
                        <button
                            key={mode}
                            onClick={() => handleChange('TRIPAY_MODE', mode)}
                            className={`py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${config['TRIPAY_MODE'] === mode
                                ? mode === 'PRODUCTION' ? 'bg-green-600/20 text-green-400 border border-green-500/50' : 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/50'
                                : 'text-neutral-500 hover:text-white'
                                }`}
                        >
                            {config['TRIPAY_MODE'] === mode && <span className={`w-1.5 h-1.5 rounded-full ${mode === 'PRODUCTION' ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />}
                            {mode}
                        </button>
                    ))}
                </div>

                {/* Credentials based on Mode */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-widest font-bold">
                        <AlertCircle size={12} />
                        {config['TRIPAY_MODE']} Credentials
                    </div>

                    {config['TRIPAY_MODE'] === 'SANDBOX' ? (
                        <>
                            <InputField label="Sandbox API Key" confKey="TRIPAY_SB_API_KEY" type="password" />
                            <InputField label="Sandbox Private Key" confKey="TRIPAY_SB_PRIVATE_KEY" type="password" />
                            <InputField label="Sandbox Merchant Code" confKey="TRIPAY_SB_MERCHANT_CODE" />
                        </>
                    ) : (
                        <>
                            <InputField label="Production API Key" confKey="TRIPAY_PROD_API_KEY" type="password" />
                            <InputField label="Production Private Key" confKey="TRIPAY_PROD_PRIVATE_KEY" type="password" />
                            <InputField label="Production Merchant Code" confKey="TRIPAY_PROD_MERCHANT_CODE" />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
