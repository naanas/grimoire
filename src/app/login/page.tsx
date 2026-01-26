'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Mail, Lock, Skull, Flame } from 'lucide-react';
import api from '@/lib/api';

// --- VISUAL EFFECTS COMPONENTS ---

const EmberParticles = () => {
    // Generate random particles client-side
    const [particles, setParticles] = useState<{ id: number; x: number; delay: number; duration: number }[]>([]);

    useEffect(() => {
        const p = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // %
            delay: Math.random() * 5,
            duration: 3 + Math.random() * 5
        }));
        setParticles(p);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ y: '110%', x: `${p.x}%`, opacity: 0 }}
                    animate={{
                        y: '-10%',
                        opacity: [0, 0.8, 0],
                        scale: [0.5, 1.5, 0]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "linear"
                    }}
                    className="absolute w-1 h-1 bg-red-500 rounded-full blur-[1px] shadow-[0_0_5px_#ff0000]"
                />
            ))}
        </div>
    );
};

const RunicCircle = () => {
    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] border-[1px] border-red-900/10 rounded-full flex items-center justify-center pointer-events-none z-0 opacity-30"
        >
            <div className="absolute inset-0 border border-red-900/10 rounded-full scale-75"></div>
            <div className="absolute inset-0 border border-red-900/5 rounded-full scale-50 rotate-45"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-red-900/20 font-[family-name:var(--font-cinzel)] text-xs tracking-[1em]">NON SERVIAM</div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 text-red-900/20 font-[family-name:var(--font-cinzel)] text-xs tracking-[1em]">ABYSSUS ABYSSUM</div>
        </motion.div>
    );
}

// --- MAIN LOGIN COMPONENT ---

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
            setError(err.response?.data?.message || 'The Abyss Rejects You');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "circOut" }}
            className="w-full max-w-md relative z-10 p-4"
        >
            {/* CONTAINER WITH DROP SHADOW (Parent of clipped element) */}
            <div className="relative filter drop-shadow-[0_0_20px_rgba(187,10,30,0.3)]">

                {/* BACKING LAYER (Border) */}
                <div
                    className="absolute inset-0 bg-gradient-to-b from-red-900 to-black"
                    style={{
                        clipPath: "polygon(10% 0, 90% 0, 100% 15%, 100% 85%, 90% 100%, 10% 100%, 0 85%, 0 15%)",
                        transform: "scale(1.02)"
                    }}
                ></div>

                {/* MAIN CONTENT LAYER */}
                <div
                    className="bg-black relative overflow-hidden"
                    style={{ clipPath: "polygon(10% 0, 90% 0, 100% 15%, 100% 85%, 90% 100%, 10% 100%, 0 85%, 0 15%)" }}
                >
                    {/* Inner Texture */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(50,0,0,0.5),transparent)]"></div>

                    <div className="relative p-8 md:p-12 z-10 flex flex-col items-center">

                        {/* Header */}
                        <div className="text-center mb-8 relative w-full">
                            <motion.div
                                animate={{
                                    y: [-5, 5, -5],
                                    filter: ["drop-shadow(0 0 5px rgba(187,10,30,0.3))", "drop-shadow(0 0 15px rgba(187,10,30,0.6))", "drop-shadow(0 0 5px rgba(187,10,30,0.3))"]
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="inline-block mb-4 relative"
                            >
                                <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center border-2 border-red-900 shadow-2xl relative z-10">
                                    <Skull className="text-gray-200 w-10 h-10" strokeWidth={1.5} />
                                </div>
                            </motion.div>

                            <h1 className="text-4xl font-[family-name:var(--font-cinzel)] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 tracking-widest uppercase mb-2 drop-shadow-md">
                                Grimoire
                            </h1>
                            <div className="flex items-center justify-center gap-2 text-[var(--blood-red)] opacity-80">
                                <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-red-500"></div>
                                <p className="text-[10px] tracking-[0.4em] uppercase font-bold text-nowrap">Gate Access</p>
                                <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-red-500"></div>
                            </div>
                        </div>

                        {registered && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                className="w-full bg-green-950/20 border border-green-900/50 text-green-500 text-xs font-bold p-3 mb-6 text-center tracking-wide uppercase"
                            >
                                Registered. Enter.
                            </motion.div>
                        )}

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="w-full bg-red-950/30 border border-red-900/50 text-red-500 text-xs font-bold p-3 mb-6 text-center tracking-wide uppercase"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <Skull size={12} /> {error}
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleLogin} className="w-full space-y-6">
                            <div className="relative group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder=" "
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="peer w-full bg-transparent border-b border-gray-800 py-3 text-center text-white focus:border-[var(--blood-red)] outline-none transition-all placeholder:text-transparent text-sm font-[family-name:var(--font-cinzel)] tracking-widest group-hover:border-gray-600"
                                />
                                <label className="absolute left-0 right-0 top-3 text-gray-600 text-[10px] uppercase tracking-[0.2em] transition-all duration-300 peer-focus:-top-3 peer-focus:text-[var(--blood-red)] peer-[&:not(:placeholder-shown)]:-top-3 peer-[&:not(:placeholder-shown)]:text-[var(--blood-red)] pointer-events-none text-center">
                                    Identity (Email)
                                </label>
                            </div>

                            <div className="relative group">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder=" "
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="peer w-full bg-transparent border-b border-gray-800 py-3 text-center text-white focus:border-[var(--blood-red)] outline-none transition-all placeholder:text-transparent text-sm font-[family-name:var(--font-cinzel)] tracking-widest group-hover:border-gray-600"
                                />
                                <label className="absolute left-0 right-0 top-3 text-gray-600 text-[10px] uppercase tracking-[0.2em] transition-all duration-300 peer-focus:-top-3 peer-focus:text-[var(--blood-red)] peer-[&:not(:placeholder-shown)]:-top-3 peer-[&:not(:placeholder-shown)]:text-[var(--blood-red)] pointer-events-none text-center">
                                    Secret Key
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-6 bg-red-900/20 hover:bg-red-900/40 border border-red-900 text-red-100 font-bold py-4 text-xs tracking-[0.3em] uppercase transition-all hover:shadow-[0_0_20px_rgba(187,10,30,0.2)] disabled:opacity-50 disabled:cursor-not-allowed group"
                                style={{ clipPath: "polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0% 50%)" }}
                            >
                                <span className="relative z-10 flex justify-center items-center gap-2 group-hover:text-white transition-colors">
                                    {isLoading ? <Loader2 className="animate-spin" /> : 'UNSEAL'}
                                </span>
                            </button>
                        </form>

                        <div className="mt-8 text-center opacity-50 hover:opacity-100 transition-opacity">
                            <Link href="/register" className="text-[9px] text-gray-500 font-bold tracking-[0.3em] uppercase hover:text-red-500">
                                Have no identity?
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Mystic Text */}
            <p className="text-center text-red-900/30 text-[9px] tracking-[0.5em] mt-8 uppercase font-[family-name:var(--font-cinzel)]">
                Omne Initium Est Difficile
            </p>
        </motion.div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-black selection:bg-[var(--blood-red)] selection:text-white">

            {/* Global Effects */}
            <RunicCircle />
            <EmberParticles />

            {/* Red Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] z-0 pointer-events-none opacity-80"></div>

            <Suspense fallback={<div className="text-[var(--blood-red)] animate-pulse font-[family-name:var(--font-cinzel)] tracking-widest">OPENING GATE...</div>}>
                <LoginContent />
            </Suspense>
        </div>
    );
}
