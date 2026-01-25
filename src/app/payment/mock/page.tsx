'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import api from '@/lib/api';
import { Loader2, CheckCircle, Smartphone } from 'lucide-react';

function MockPaymentContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const trxId = searchParams.get('id');
    const [loading, setLoading] = useState(false);

    const handlePay = async () => {
        if (!trxId) return;
        setLoading(true);
        try {
            // Trigger Mock Callback in Backend
            await api.post('/dev/mock-callback', { id: trxId });

            // Redirect back to order page (which checks status on load) or history
            // Actually, we should redirect to the returnUrl if we knew it, but here we hardcode 
            // logic to go back to order result
            // Redirect back to home, user can check history or rely on WA
            router.push('/');
            // Wait, looking at file list, there IS a status folder?
            // "status" dir in app exists. Let's assume it works or use /order/[slug] logic?
            // Previous logic was /order/[slug]?id=...
            // Let's rely on backend returnUrl calculation usually, but here we are the "gateway".
            // The backend Mock Callback updates status to SUCCESS.

            // Let's redirect to a generic success page or back to home if unsure.
            // Best is to go back to where we came from.

        } catch (error) {
            alert('Payment Simulation Failed');
        } finally {
            setLoading(false);
        }
    };

    if (!trxId) return <div className="text-white text-center pt-20">Invalid Transaction ID</div>;

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-blue-500"></div>

                <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <Smartphone size={32} />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">Mock Payment Gateway</h1>
                <p className="text-gray-500 text-sm mb-8">Simulating a secure payment environment...</p>

                <div className="bg-gray-50 p-4 rounded-lg mb-8 text-left">
                    <p className="text-xs text-gray-400 uppercase font-bold mb-1">Transaction ID</p>
                    <p className="font-mono text-sm text-gray-800 truncate">{trxId}</p>
                </div>

                <button
                    onClick={handlePay}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" /> : 'CONFIRM PAYMENT'}
                </button>

                <p className="mt-4 text-xs text-gray-400">
                    Grimoire Dev Environment
                </p>
            </div>
        </div>
    );
}

export default function MockPaymentPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>}>
            <MockPaymentContent />
        </Suspense>
    );
}
