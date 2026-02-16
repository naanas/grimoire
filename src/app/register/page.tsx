'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, User, Mail, Lock, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';
import GoogleButton from '@/components/GoogleButton';

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    });

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            setIsLoading(false);
            return;
        }

        try {
            const res = await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                password: formData.password
            });

            if (res.data.success) {
                setShowSuccessModal(true);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration Failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[var(--void)] to-transparent z-0 pointer-events-none"></div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#0a0a0a] border border-gray-700 rounded-2xl p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(0,128,0,0.2)]"
                    >
                        <ShieldCheck className="text-green-500 mx-auto mb-4" size={64} />
                        <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
                        <p className="text-gray-400 mb-6">
                            A verification email has been sent to <strong>{formData.email}</strong>.
                            Please check your inbox and verify your account to continue.
                        </p>
                        <button
                            onClick={() => router.push('/login')}
                            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300"
                        >
                            Back to Login
                        </button>
                    </motion.div>
                </div>
            )}

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8 relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
                {isLoading && (
                    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
                        <Loader2 className="animate-spin text-[var(--blood-red)] mb-4" size={48} />
                        <span className="text-white font-[family-name:var(--font-cinzel)] tracking-widest animate-pulse">
                            AUTHENTICATING...
                        </span>
                    </div>
                )}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-[family-name:var(--font-cinzel)] font-bold text-white mb-2">Join the Coven</h1>
                    <p className="text-gray-400 text-sm">Create your Grimoire ID to track transactions.</p>
                </div>

                {error && (
                    <div className="bg-red-900/30 border border-red-500/50 text-red-200 text-sm p-3 rounded-lg mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="relative group">
                        <User className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-[var(--blood-red)] transition-colors" size={20} />
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#050505] border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-[var(--blood-red)] outline-none transition-all placeholder:text-gray-600"
                        />
                    </div>

                    <div className="relative group">
                        <Mail className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-[var(--blood-red)] transition-colors" size={20} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#050505] border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-[var(--blood-red)] outline-none transition-all placeholder:text-gray-600"
                        />
                    </div>

                    <div className="relative group">
                        <span className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-[var(--blood-red)] transition-colors">📞</span>
                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="WhatsApp Number (08xx / 62xx)"
                            value={(formData as any).phoneNumber || ''}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#050505] border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-[var(--blood-red)] outline-none transition-all placeholder:text-gray-600"
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-[var(--blood-red)] transition-colors" size={20} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#050505] border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-[var(--blood-red)] outline-none transition-all placeholder:text-gray-600"
                        />
                    </div>

                    <div className="relative group">
                        <ShieldCheck className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-[var(--blood-red)] transition-colors" size={20} />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#050505] border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-[var(--blood-red)] outline-none transition-all placeholder:text-gray-600"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-[var(--blood-red)] to-red-900 hover:to-[var(--hell-fire)] text-white font-bold py-3 rounded-xl shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[var(--blood-red)] hover:underline" suppressHydrationWarning>
                        Sign In
                    </Link>
                </div>

                <div className="w-full border-t border-gray-800 my-6"></div>
                <GoogleButton text="Sign up with Google" onLoading={setIsLoading} />
            </motion.div>
        </div>
    );
}
