'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, Mail, Lock } from 'lucide-react';
import api from '@/lib/api';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const registered = searchParams.get('registered');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await api.post('/auth/login', {
                email: formData.email,
                password: formData.password
            });

            if (res.data.success) {
                // Save Token
                localStorage.setItem('token', res.data.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.data.user));

                // Redirect based on Role
                if (res.data.data.user.role === 'ADMIN') {
                    window.location.href = '/admin';
                } else {
                    window.location.href = '/';
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login Failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8 relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
        >
            <div className="text-center mb-8">
                <h1 className="text-3xl font-[family-name:var(--font-cinzel)] font-bold text-white mb-2">Welcome Back</h1>
                <p className="text-gray-400 text-sm">Enter the realm of Grimoire.</p>
            </div>

            {registered && (
                <div className="bg-green-900/30 border border-green-500/50 text-green-200 text-sm p-3 rounded-lg mb-6 text-center animate-in fade-in slide-in-from-top-2">
                    Registration successful! Please login.
                </div>
            )}

            {error && (
                <div className="bg-red-900/30 border border-red-500/50 text-red-200 text-sm p-3 rounded-lg mb-6 text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
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

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[var(--blood-red)] to-red-900 hover:to-[var(--hell-fire)] text-white font-bold py-3 rounded-xl shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Enter Grimoire'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <Link href="/register" className="text-[var(--blood-red)] hover:underline">
                    Create one
                </Link>
            </div>
        </motion.div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[var(--void)] to-transparent z-0 pointer-events-none"></div>

            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <LoginContent />
            </Suspense>
        </div>
    );
}
