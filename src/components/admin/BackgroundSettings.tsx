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
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Film size={24} className="text-red-500" />
                Background Settings
            </h2>

            <div className="space-y-6">
                {/* Type Selection */}
                <div className="grid grid-cols-3 gap-3">
                    {['CSS', 'IMAGE', 'VIDEO'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setBgType(type)}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${bgType === type
                                ? 'bg-red-900/20 border-red-500 text-red-500'
                                : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                                }`}
                        >
                            {type === 'CSS' && <Type size={20} className="mb-1" />}
                            {type === 'IMAGE' && <ImageIcon size={20} className="mb-1" />}
                            {type === 'VIDEO' && <Film size={20} className="mb-1" />}
                            <span className="text-xs font-medium">{type}</span>
                        </button>
                    ))}
                </div>

                {/* URL Input / Upload */}
                {bgType !== 'CSS' && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                        <div>
                            <label className="block text-sm text-neutral-400 mb-1">
                                Media URL (Upload or Enter Direct Link)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={bgUrl}
                                    onChange={(e) => setBgUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                                />
                                <label className="cursor-pointer bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors">
                                    <Upload size={18} />
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept={bgType === 'VIDEO' ? 'video/*' : 'image/*'}
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                    />
                                </label>
                            </div>
                            {uploading && <p className="text-xs text-yellow-500 mt-1">Uploading...</p>}
                        </div>

                        {/* Preview */}
                        {bgUrl && (
                            <div className="mt-4 rounded-lg overflow-hidden border border-neutral-800 aspect-video bg-black relative">
                                {bgType === 'VIDEO' ? (
                                    <video src={getGoogleDriveDirectLink(bgUrl)} className="w-full h-full object-cover" autoPlay loop muted />
                                ) : (
                                    <img src={bgUrl} alt="Preview" className="w-full h-full object-cover" />
                                )}
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
                                    <span className="text-white text-xs font-mono uppercase bg-black/80 px-2 py-1 rounded">Preview</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Save size={18} />
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
