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
        <div className="bg-neutral-950/50 border border-neutral-800 rounded-2xl p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Payment Methods</h3>
                <span className="text-xs text-neutral-500 bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                    {methods.length} Available
                </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6 max-h-[500px]">
                {Object.entries(grouped).map(([group, groupMethods]) => (
                    <div key={group}>
                        <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 sticky top-0 bg-neutral-950/95 backdrop-blur py-2 z-10">
                            {group}
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                            {groupMethods.map((method) => (
                                <div
                                    key={method.code}
                                    className="flex items-center justify-between p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg hover:border-neutral-700 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 transition-colors ${method.active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {method.active ? <Power size={14} /> : <PowerOff size={14} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white group-hover:text-[var(--blood-red)] transition-colors">{method.name}</p>
                                            <p className="text-[10px] text-neutral-500 font-mono uppercase">{method.code}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => toggleMethod(method.code, method.active)}
                                        disabled={toggling === method.code}
                                        className={`relative w-9 h-5 rounded-full transition-colors flex items-center flex-shrink-0 ${method.active ? 'bg-green-600' : 'bg-neutral-700'}`}
                                    >
                                        <span className={`block w-3 h-3 bg-white rounded-full shadow transition-transform ${method.active ? 'translate-x-[18px]' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
