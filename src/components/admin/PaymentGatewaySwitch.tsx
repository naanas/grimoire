'use client';
import { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function PaymentGatewaySwitch() {
    const [gateway, setGateway] = useState<string>('IPAYMU');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await api.get('/config');
            if (res.data.success) {
                setGateway(res.data.data.PAYMENT_GATEWAY || 'IPAYMU');
            }
        } catch (error) {
            console.error('Failed to fetch config', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveConfig = async (newGateway: string) => {
        if (newGateway === gateway) return;
        if (!confirm(`Switch Payment Gateway to ${newGateway}?`)) return;

        setIsSaving(true);
        try {
            const res = await api.put('/config', { key: 'PAYMENT_GATEWAY', value: newGateway });
            if (res.data.success) {
                setGateway(newGateway);
                toast.success(`Payment Gateway switched to ${newGateway}`);
            }
        } catch (error) {
            console.error('Failed to update config', error);
            toast.error('Failed to update configuration');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="animate-pulse bg-neutral-900 h-24 rounded-xl"></div>;

    return (
        <div className="relative group overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/50 p-6 transition-all hover:border-[var(--blood-red)/50]">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--blood-red)/10] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <DollarSign className="text-[var(--blood-red)]" size={24} />
                        Active Payment Gateway
                    </h3>
                    <p className="text-sm text-neutral-400 mt-1">
                        Select which provider handles all customer transactions.
                    </p>
                </div>

                <div className="flex bg-black/50 p-1.5 rounded-xl border border-neutral-800">
                    <button
                        onClick={() => handleSaveConfig('IPAYMU')}
                        disabled={isSaving}
                        className={`relative px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${gateway === 'IPAYMU'
                            ? 'bg-blue-600/20 text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.3)] border border-blue-500/50'
                            : 'text-neutral-500 hover:text-white hover:bg-neutral-800'
                            }`}
                    >
                        {gateway === 'IPAYMU' && <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping" />}
                        IPAYMU
                    </button>

                    <button
                        onClick={() => handleSaveConfig('TRIPAY')}
                        disabled={isSaving}
                        className={`relative px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${gateway === 'TRIPAY'
                            ? 'bg-emerald-600/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-emerald-500/50'
                            : 'text-neutral-500 hover:text-white hover:bg-neutral-800'
                            }`}
                    >
                        {gateway === 'TRIPAY' && <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />}
                        TRIPAY
                    </button>
                </div>
            </div>

            {isSaving && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20">
                    <div className="bg-neutral-900 border border-neutral-800 px-6 py-3 rounded-full flex items-center gap-3 text-white text-sm">
                        <div className="w-2 h-2 bg-[var(--blood-red)] rounded-full animate-ping" />
                        Switching Gateway...
                    </div>
                </div>
            )}
        </div>
    );
}
