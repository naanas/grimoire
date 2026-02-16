'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const status = searchParams.get('status');
    const [message, setMessage] = useState('Verifying...');

    useEffect(() => {
        if (status === 'success') {
            setMessage('Your email has been successfully verified! You can now log in.');
        } else {
            setMessage('Verification failed or link expired.');
        }
    }, [status]);

    return (
        <div className="flex flex-col items-center justify-center text-center">
            {status === 'success' ? (
                <>
                    <CheckCircle2 className="text-green-500 mb-4" size={64} />
                    <h1 className="text-2xl font-bold text-white mb-2">Verification Successful</h1>
                    <p className="text-gray-400 mb-8">{message}</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="bg-[var(--blood-red)] hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(139,0,0,0.5)]"
                    >
                        Go to Login
                    </button>
                </>
            ) : (
                <>
                    <XCircle className="text-red-500 mb-4" size={64} />
                    <h1 className="text-2xl font-bold text-white mb-2">Verification Failed</h1>
                    <p className="text-gray-400 mb-8">{message}</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300"
                    >
                        Back to Login
                    </button>
                </>
            )}
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,0,0,0.2),transparent_70%)]"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8 relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
                <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
                    <VerifyEmailContent />
                </Suspense>
            </motion.div>
        </div>
    );
}
