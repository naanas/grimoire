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
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white">Tripay Connection</h2>
                    <p className="text-neutral-400 mt-1 text-sm">Manage Sandbox and Production credentials.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Simpan
                </button>
            </div>

            {/* Environment Mode */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 md:p-6 space-y-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Environment</h3>

                <div className="grid md:grid-cols-2 gap-4">
                    <button
                        onClick={() => handleChange('TRIPAY_MODE', 'SANDBOX')}
                        className={`p-4 rounded-xl border-2 transition-all text-left space-y-2 ${config['TRIPAY_MODE'] === 'SANDBOX'
                            ? 'border-yellow-500 bg-yellow-500/10'
                            : 'border-neutral-800 hover:border-neutral-700'}`}
                    >
                        <div className="flex items-center justify-between">
                            <span className={`font-bold ${config['TRIPAY_MODE'] === 'SANDBOX' ? 'text-yellow-500' : 'text-white'}`}>SANDBOX</span>
                            {config['TRIPAY_MODE'] === 'SANDBOX' && <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>}
                        </div>
                        <p className="text-xs text-neutral-400">Environment for testing. Uses Sandbox credentials. No real money deducted.</p>
                    </button>

                    <button
                        onClick={() => handleChange('TRIPAY_MODE', 'PRODUCTION')}
                        className={`p-4 rounded-xl border-2 transition-all text-left space-y-2 ${config['TRIPAY_MODE'] === 'PRODUCTION'
                            ? 'border-green-500 bg-green-500/10'
                            : 'border-neutral-800 hover:border-neutral-700'}`}
                    >
                        <div className="flex items-center justify-between">
                            <span className={`font-bold ${config['TRIPAY_MODE'] === 'PRODUCTION' ? 'text-green-500' : 'text-white'}`}>PRODUCTION</span>
                            {config['TRIPAY_MODE'] === 'PRODUCTION' && <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>}
                        </div>
                        <p className="text-xs text-neutral-400">Live environment. Valid transactions. Real money involved.</p>
                    </button>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-900/10 border border-blue-900/30 rounded-lg text-blue-400 text-xs">
                    <AlertCircle size={16} className="shrink-0" />
                    <p>Current Active Mode: <b className="text-white">{config['TRIPAY_MODE'] || 'NOT SET (System Default)'}</b></p>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Sandbox Credentials */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 md:p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider border-b border-neutral-800 pb-2">
                        Sandbox Credentials
                    </h3>
                    <div className="space-y-4 pt-2">
                        <InputField label="API Key" confKey="TRIPAY_SB_API_KEY" type="password" />
                        <InputField label="Private Key" confKey="TRIPAY_SB_PRIVATE_KEY" type="password" />
                        <InputField label="Merchant Code" confKey="TRIPAY_SB_MERCHANT_CODE" />
                    </div>
                </div>

                {/* Production Credentials */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider border-b border-neutral-800 pb-2">
                        Production Credentials
                    </h3>
                    <div className="space-y-4 pt-2">
                        <InputField label="API Key" confKey="TRIPAY_PROD_API_KEY" type="password" />
                        <InputField label="Private Key" confKey="TRIPAY_PROD_PRIVATE_KEY" type="password" />
                        <InputField label="Merchant Code" confKey="TRIPAY_PROD_MERCHANT_CODE" />
                    </div>
                </div>
            </div>
        </div>
    );
}
