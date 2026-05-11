'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';
import GoogleButton from '@/components/GoogleButton';
import ReCAPTCHA from 'react-google-recaptcha';

// --- VISUAL EFFECTS ---

const GridParticles = () => {
    const [particles] = useState<{ id: number; x: number; delay: number; duration: number; size: number }[]>(
        () => Array.from({ length: 18 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            delay: Math.random() * 6,
            duration: 4 + Math.random() * 6,
            size: Math.random() > 0.6 ? 2 : 1,
        }))
    );

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ y: '110%', x: `${p.x}%`, opacity: 0 }}
                    animate={{ y: '-10%', opacity: [0, 0.7, 0] }}
                    transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' }}
                    className="absolute rounded-full"
                    style={{
                        width: p.size,
                        height: p.size * 6,
                        background: p.id % 3 === 0
                            ? 'rgba(0,245,255,0.6)'
                            : p.id % 3 === 1
                                ? 'rgba(240,0,255,0.4)'
                                : 'rgba(255,255,255,0.2)',
                        boxShadow: p.id % 3 === 0
                            ? '0 0 6px rgba(0,245,255,0.8)'
                            : p.id % 3 === 1
                                ? '0 0 6px rgba(240,0,255,0.6)'
                                : 'none',
                    }}
                />
            ))}
        </div>
    );
};

const CyberRings = () => (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        {/* Outer slow ring */}
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="w-[700px] h-[700px] rounded-full border border-[#00f5ff]/6 flex items-center justify-center"
        >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00f5ff]/40 shadow-[0_0_8px_rgba(0,245,255,0.8)]" />
        </motion.div>
        {/* Mid ring counter-rotate */}
        <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full border border-[#f000ff]/5 flex items-center justify-center"
        >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#f000ff]/50 shadow-[0_0_6px_rgba(240,0,255,0.8)]" />
        </motion.div>
        {/* Inner pulse ring */}
        <motion.div
            animate={{ scale: [1, 1.04, 1], opacity: [0.04, 0.08, 0.04] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full border border-[#00f5ff]/20"
        />
    </div>
);

// --- MAIN LOGIN FORM ---

function LoginContent() {
    const searchParams = useSearchParams();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

    const registered = searchParams.get('registered');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCaptchaChange = (token: string | null) => {
        setRecaptchaToken(token);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!recaptchaToken) {
            setError('Please verify that you are not a robot.');
            return;
        }

        setIsLoading(true);

        try {
            const res = await api.post('/auth/login', {
                email: formData.email,
                password: formData.password,
                recaptchaToken,
            });

            if (res.data.success) {
                localStorage.setItem('token', res.data.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.data.user));

                if (res.data.data.user.role === 'ADMIN') {
                    window.location.href = '/admin';
                } else {
                    window.location.href = '/';
                }
            }
        } catch (err: unknown) {
            const message =
                typeof err === 'object' &&
                    err !== null &&
                    'response' in err
                    ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
                    : undefined;
            setError(message || 'Authentication failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full max-w-md relative z-10 px-4"
        >
            {/* Card */}
            <div className="relative">
                {/* Outer glow */}
                <div className="absolute -inset-px rounded-2xl bg-linear-to-b from-[#00f5ff]/20 via-transparent to-[#f000ff]/10 opacity-60 blur-sm pointer-events-none" />

                <div className="relative bg-[#05050f]/95 backdrop-blur-xl border border-[#00f5ff]/12 rounded-2xl overflow-hidden">
                    {/* Neon top scanline */}
                    <div className="h-px bg-linear-to-r from-transparent via-[#00f5ff]/70 to-transparent" />

                    {/* Loading overlay */}
                    {isLoading && (
                        <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
                            <Loader2 className="animate-spin text-[#00f5ff] mb-3" size={36} />
                            <span className="text-[#00f5ff]/70 text-xs font-mono tracking-[0.3em] uppercase animate-pulse">
                                Authenticating...
                            </span>
                        </div>
                    )}

                    <div className="p-8 md:p-10 flex flex-col items-center">

                        {/* Logo + Title */}
                        <div className="text-center mb-8">
                            <motion.div
                                animate={{ y: [-4, 4, -4] }}
                                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                                className="inline-block mb-5"
                            >
                                <div className="w-20 h-20 rounded-2xl bg-[#00f5ff]/8 border border-[#00f5ff]/25 flex items-center justify-center shadow-[0_0_24px_rgba(0,245,255,0.12)] p-2.5 mx-auto">
                                    <Image
                                        src="/logo.png"
                                        alt="Grimoire Coins"
                                        width={64}
                                        height={64}
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                            </motion.div>

                            <h1 className="text-2xl md:text-3xl font-(family-name:--font-cinzel) font-black tracking-[0.2em] text-white uppercase mb-1.5">
                                Grimoire
                            </h1>
                            <div className="flex items-center justify-center gap-3">
                                <div className="h-px w-8 bg-linear-to-r from-transparent to-[#00f5ff]/40" />
                                <p className="text-[9px] tracking-[0.4em] uppercase font-bold text-[#00f5ff]/50">
                                    Sign In
                                </p>
                                <div className="h-px w-8 bg-linear-to-l from-transparent to-[#00f5ff]/40" />
                            </div>
                        </div>

                        {/* Success Banner */}
                        {registered && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                className="w-full bg-green-500/8 border border-green-500/25 rounded-lg text-green-400 text-xs font-bold p-3 mb-6 text-center tracking-widest uppercase flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 size={13} />
                                Account created. Sign in to continue.
                            </motion.div>
                        )}

                        {/* Error Banner */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="w-full bg-red-500/8 border border-red-500/25 rounded-lg text-red-400 text-xs font-bold p-3 mb-6 text-center tracking-wide flex items-center justify-center gap-2"
                                >
                                    <AlertCircle size={13} />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Form */}
                        <form onSubmit={handleLogin} className="w-full space-y-4">
                            {/* Email */}
                            <div className="relative group">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 group-focus-within:text-[#00f5ff]/70 transition-colors">
                                    <Mail size={15} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder=" "
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="peer w-full bg-white/3 border border-white/10 rounded-xl pl-10 pr-4 pt-5 pb-2.5 text-white text-sm font-medium focus:border-[#00f5ff]/50 focus:ring-1 focus:ring-[#00f5ff]/15 outline-none transition-all"
                                />
                                <label className="absolute left-10 top-3.5 text-white/25 text-[10px] uppercase tracking-widest transition-all duration-200 peer-focus:top-1.5 peer-focus:text-[9px] peer-focus:text-[#00f5ff]/60 peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:text-[9px] peer-not-placeholder-shown:text-[#00f5ff]/50 pointer-events-none">
                                    Email
                                </label>
                            </div>

                            {/* Password */}
                            <div className="relative group">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 group-focus-within:text-[#00f5ff]/70 transition-colors">
                                    <Lock size={15} />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder=" "
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="peer w-full bg-white/3 border border-white/10 rounded-xl pl-10 pr-4 pt-5 pb-2.5 text-white text-sm font-medium focus:border-[#00f5ff]/50 focus:ring-1 focus:ring-[#00f5ff]/15 outline-none transition-all"
                                />
                                <label className="absolute left-10 top-3.5 text-white/25 text-[10px] uppercase tracking-widest transition-all duration-200 peer-focus:top-1.5 peer-focus:text-[9px] peer-focus:text-[#00f5ff]/60 peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:text-[9px] peer-not-placeholder-shown:text-[#00f5ff]/50 pointer-events-none">
                                    Password
                                </label>
                            </div>

                            {/* ReCAPTCHA */}
                            <div className="flex justify-center pt-1">
                                <ReCAPTCHA
                                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                                    onChange={handleCaptchaChange}
                                    theme="dark"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading || !recaptchaToken}
                                className="w-full mt-2 relative group overflow-hidden rounded-xl py-3.5 font-black text-xs tracking-[0.25em] uppercase transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed
                                    bg-[#00f5ff]/10 border border-[#00f5ff]/35 text-[#00f5ff]
                                    hover:bg-[#00f5ff]/20 hover:border-[#00f5ff]/60 hover:shadow-[0_0_24px_rgba(0,245,255,0.2)]"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {isLoading
                                        ? <><Loader2 className="animate-spin" size={14} /> Processing</>
                                        : 'Sign In'}
                                </span>
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="w-full flex items-center gap-3 my-6">
                            <div className="flex-1 h-px bg-white/6" />
                            <span className="text-white/20 text-[10px] uppercase tracking-widest font-bold">or</span>
                            <div className="flex-1 h-px bg-white/6" />
                        </div>

                        {/* Google */}
                        <GoogleButton text="Sign in with Google" onLoading={setIsLoading} />

                        {/* Register link */}
                        <p className="mt-6 text-center text-white/25 text-xs">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="text-[#00f5ff]/60 hover:text-[#00f5ff] font-bold transition-colors">
                                Register
                            </Link>
                        </p>
                    </div>

                    {/* Bottom scanline */}
                    <div className="h-px bg-linear-to-r from-transparent via-[#f000ff]/20 to-transparent" />
                </div>
            </div>

            {/* Tagline */}
            <p className="text-center text-white/10 text-[9px] tracking-[0.5em] mt-6 uppercase font-mono">
                Grimoire Coins · Secure Access
            </p>
        </motion.div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-transparent">
            {/* Radial vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)] z-0 pointer-events-none" />
            {/* Subtle cyan glow center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00f5ff]/3 rounded-full blur-3xl pointer-events-none z-0" />

            <CyberRings />
            <GridParticles />

            <Suspense fallback={
                <div className="text-[#00f5ff]/60 animate-pulse font-mono text-xs tracking-[0.3em] uppercase">
                    Loading...
                </div>
            }>
                <LoginContent />
            </Suspense>
        </div>
    );
}
