'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Power, PowerOff, Loader2 } from 'lucide-react';

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
});

type PaymentMethod = {
    code: string;
    name: string;
    method: 'va' | 'qris' | 'cstore' | 'ewallet';
    group: 'Virtual Account' | 'Retail' | 'QRIS' | 'E-Wallet';
    active: boolean;
};

export default function PaymentMethodSettings() {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState<string | null>(null);

    useEffect(() => {
        fetchMethods();
    }, []);

    const fetchMethods = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await API.get('/admin/payment-methods', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMethods(res.data.data);
        } catch (error) {
            console.error('Failed to fetch payment methods', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleMethod = async (code: string, currentStatus: boolean) => {
        setToggling(code);
        try {
            const token = localStorage.getItem('token');
            await API.post('/admin/payment-methods/toggle',
                { code, active: !currentStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update local state
            setMethods(prev => prev.map(m =>
                m.code === code ? { ...m, active: !currentStatus } : m
            ));
        } catch (error) {
            console.error('Failed to toggle payment method', error);
            alert('Failed to toggle payment method');
        } finally {
            setToggling(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-red-600" size={32} />
            </div>
        );
    }

    // Group methods by category
    const grouped = methods.reduce((acc, method) => {
        if (!acc[method.group]) acc[method.group] = [];
        acc[method.group].push(method);
        return acc;
    }, {} as Record<string, PaymentMethod[]>);

    return (
        <div className="space-y-6">
            {Object.entries(grouped).map(([group, groupMethods]) => (
                <div key={group} className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-neutral-800 pb-2">
                        {group}
                    </h3>
                    <div className="space-y-3">
                        {groupMethods.map((method) => (
                            <div
                                key={method.code}
                                className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-neutral-800 rounded-lg hover:bg-neutral-750 transition-colors gap-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${method.active ? 'bg-green-500/20' : 'bg-red-500/20'
                                        }`}>
                                        {method.active ? (
                                            <Power className="text-green-500" size={20} />
                                        ) : (
                                            <PowerOff className="text-red-500" size={20} />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{method.name}</p>
                                        <p className="text-xs text-neutral-500 uppercase">{method.code}</p>
                                    </div>
                                </div>

                                <div className="flex justify-end md:block">
                                    <button
                                        onClick={() => toggleMethod(method.code, method.active)}
                                        disabled={toggling === method.code}
                                        className={`
                                            relative inline-flex h-8 w-16 items-center rounded-full transition-colors
                                            ${method.active ? 'bg-green-600' : 'bg-neutral-700'}
                                            ${toggling === method.code ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                        `}
                                    >
                                        <span
                                            className={`
                                                inline-block h-6 w-6 transform rounded-full bg-white transition-transform
                                                ${method.active ? 'translate-x-9' : 'translate-x-1'}
                                            `}
                                        />
                                        {toggling === method.code && (
                                            <Loader2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin text-white" size={14} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-sm text-yellow-200">
                    <strong>Note:</strong> Disabled payment methods will not appear on customer order pages.
                    Changes take effect immediately.
                </p>
            </div>
        </div>
    );
}
