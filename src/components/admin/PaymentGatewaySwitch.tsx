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
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <DollarSign size={20} className="text-emerald-500" />
                    Active Payment Gateway
                </h3>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex gap-4">
                    <button
                        onClick={() => handleSaveConfig('IPAYMU')}
                        disabled={isSaving}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${gateway === 'IPAYMU'
                            ? 'bg-blue-600 text-white'
                            : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:bg-neutral-800'
                            }`}
                    >
                        IPAYMU (Legacy)
                    </button>

                    <button
                        onClick={() => handleSaveConfig('TRIPAY')}
                        disabled={isSaving}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${gateway === 'TRIPAY'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:bg-neutral-800'
                            }`}
                    >
                        TRIPAY (Recommended)
                    </button>
                </div>
                {isSaving && <span className="text-xs text-neutral-500 animate-pulse">Switching...</span>}
            </div>
            <p className="text-xs text-neutral-500 mt-4">
                Switching this will immediately affect the checkout page for all users.
            </p>
        </div>
    );
}
