'use client';

import { useState, useEffect } from 'react';
import { Save, Upload, Type, Image as ImageIcon, Film } from 'lucide-react';
import api from '@/lib/api';
import { getGoogleDriveDirectLink } from '@/lib/driveHelper';

export default function BackgroundSettings() {
    const [bgType, setBgType] = useState('CSS'); // CSS, IMAGE, VIDEO
    const [bgUrl, setBgUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await api.get('/config');
            if (res.data.success) {
                const config = res.data.data;
                setBgType(config.BACKGROUND_TYPE || 'CSS');
                setBgUrl(config.BACKGROUND_URL || '');
            }
        } catch (error) {
            console.error('Failed to fetch config:', error);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await api.put('/config', { key: 'BACKGROUND_TYPE', value: bgType });
            await api.put('/config', { key: 'BACKGROUND_URL', value: bgUrl });
            alert('Background settings saved!');
        } catch (error) {
            console.error('Failed to save settings:', error);
            alert('Failed to save settings');
        } finally {
            setLoading(false);
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
                setBgUrl(res.data.data.url);
                // Auto-set type based on file
                if (file.type.startsWith('video/')) setBgType('VIDEO');
                else if (file.type.startsWith('image/')) setBgType('IMAGE');
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-neutral-950/40 border border-neutral-800/50 rounded-2xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-neutral-700/50 transition-colors">
            {/* Subtle glow effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px] -z-10 pointer-events-none group-hover:bg-red-500/10 transition-colors duration-700" />

            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <Film size={20} className="text-red-500" />
                </div>
                Background
            </h2>

            <div className="space-y-6 relative z-10">
                {/* Type Selection */}
                <div className="bg-neutral-900/50 p-1.5 rounded-xl border border-neutral-800/50 flex">
                    {['CSS', 'IMAGE', 'VIDEO'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setBgType(type)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${bgType === type
                                ? 'bg-neutral-800 text-white shadow-md'
                                : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50'
                                }`}
                        >
                            {type === 'CSS' && <Type size={16} />}
                            {type === 'IMAGE' && <ImageIcon size={16} />}
                            {type === 'VIDEO' && <Film size={16} />}
                            {type}
                        </button>
                    ))}
                </div>

                {/* URL Input / Upload */}
                {bgType !== 'CSS' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="space-y-1.5">
                            <label className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold ml-1">
                                Media URL (Upload or Enter Direct Link)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={bgUrl}
                                    onChange={(e) => setBgUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all placeholder:text-neutral-600"
                                />
                                <label className="cursor-pointer bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2.5 rounded-xl flex items-center justify-center transition-colors group">
                                    <Upload size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept={bgType === 'VIDEO' ? 'video/*' : 'image/*'}
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                    />
                                </label>
                            </div>
                            {uploading && <p className="text-xs text-yellow-500 mt-1 ml-1 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" /> Uploading...</p>}
                        </div>

                        {/* Preview */}
                        {bgUrl && (
                            <div className="mt-4 rounded-xl overflow-hidden border border-neutral-800 aspect-video bg-black/50 relative group shadow-inner">
                                {bgType === 'VIDEO' ? (
                                    <video src={getGoogleDriveDirectLink(bgUrl)} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" autoPlay loop muted />
                                ) : (
                                    <img src={bgUrl} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                )}
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white/70 font-mono uppercase border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">Preview</div>
                            </div>
                        )}
                    </div>
                )}

                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Save size={18} />
                            Save Settings
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
