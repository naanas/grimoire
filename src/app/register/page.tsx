'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, User, Mail, Lock, ShieldCheck, Phone, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import GoogleButton from '@/components/GoogleButton';

type ApiErrorResponse = {
    message?: string;
};

type ApiError = {
    response?: {
        data?: ApiErrorResponse;
    };
};

const inputClass = `
    peer w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm
    focus:border-[#00f5ff]/50 focus:ring-1 focus:ring-[#00f5ff]/15 outline-none transition-all
    placeholder:text-white/20
`;

const iconClass = `absolute left-3 top-3.5 transition-colors`;

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
            setError('Passwords do not match.');
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
        } catch (err: unknown) {
            const message =
                typeof err === 'object' &&
                    err !== null &&
                    'response' in err
                    ? (err as ApiError).response?.data?.message
                    : undefined;

            setError(message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-transparent">
            {/* Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)] z-0 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#f000ff]/3 rounded-full blur-3xl pointer-events-none z-0" />
            <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-[#00f5ff]/3 rounded-full blur-3xl pointer-events-none z-0" />

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccessModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="bg-[#05050f] border border-green-500/20 rounded-2xl p-8 max-w-sm w-full text-center relative overflow-hidden"
                        >
                            <div className="h-px bg-linear-to-r from-transparent via-green-500/50 to-transparent mb-6" />
                            <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 ring-1 ring-green-500/25">
                                <CheckCircle2 className="text-green-400" size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2 font-(family-name:--font-cinzel) uppercase tracking-widest">
                                Account Created!
                            </h2>
                            <p className="text-white/40 text-sm mb-6 leading-relaxed">
                                A verification email has been sent to{' '}
                                <span className="text-white/70 font-bold">{formData.email}</span>.
                                Please verify your account to continue.
                            </p>
                            <button
                                onClick={() => router.push('/login')}
                                className="w-full bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 hover:border-green-500/50 text-green-400 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
                            >
                                Go to Sign In <ArrowRight size={14} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-full max-w-md relative z-10"
            >
                <div className="relative">
                    {/* Outer glow */}
                    <div className="absolute -inset-px rounded-2xl bg-linear-to-b from-[#f000ff]/15 via-transparent to-[#00f5ff]/10 opacity-60 blur-sm pointer-events-none" />

                    <div className="relative bg-[#05050f]/95 backdrop-blur-xl border border-white/8 rounded-2xl overflow-hidden">
                        {/* Top scanline */}
                        <div className="h-px bg-linear-to-r from-transparent via-[#00f5ff]/60 to-transparent" />

                        {/* Loading overlay */}
                        {isLoading && (
                            <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
                                <Loader2 className="animate-spin text-[#00f5ff] mb-3" size={32} />
                                <span className="text-[#00f5ff]/60 text-xs font-mono tracking-[0.3em] uppercase animate-pulse">
                                    Creating Account...
                                </span>
                            </div>
                        )}

                        <div className="p-8 space-y-5">
                            {/* Header */}
                            <div className="text-center mb-2">
                                <h1 className="text-2xl font-(family-name:--font-cinzel) font-black tracking-[0.15em] text-white uppercase mb-1.5">
                                    Create Account
                                </h1>
                                <div className="flex items-center justify-center gap-3">
                                    <div className="h-px w-6 bg-linear-to-r from-transparent to-[#f000ff]/40" />
                                    <p className="text-[9px] tracking-[0.4em] uppercase font-bold text-[#f000ff]/40">
                                        Grimoire Coins
                                    </p>
                                    <div className="h-px w-6 bg-linear-to-l from-transparent to-[#f000ff]/40" />
                                </div>
                            </div>

                            {/* Error */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        className="flex items-center gap-2 bg-red-500/8 border border-red-500/25 rounded-lg text-red-400 text-xs font-bold p-3 tracking-wide"
                                    >
                                        <AlertCircle size={13} className="shrink-0" />
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Form */}
                            <form onSubmit={handleRegister} className="space-y-3">
                                {/* Name */}
                                <div className="relative group">
                                    <User className={`${iconClass} text-white/25 group-focus-within:text-[#00f5ff]/70`} size={15} />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                {/* Email */}
                                <div className="relative group">
                                    <Mail className={`${iconClass} text-white/25 group-focus-within:text-[#00f5ff]/70`} size={15} />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                {/* Phone */}
                                <div className="relative group">
                                    <Phone className={`${iconClass} text-white/25 group-focus-within:text-[#00f5ff]/70`} size={15} />
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        placeholder="WhatsApp Number (08xx / 62xx)"
                                        value={formData.phoneNumber || ''}
                                        onChange={handleChange}
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                {/* Password */}
                                <div className="relative group">
                                    <Lock className={`${iconClass} text-white/25 group-focus-within:text-[#00f5ff]/70`} size={15} />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div className="relative group">
                                    <ShieldCheck className={`${iconClass} text-white/25 group-focus-within:text-[#00f5ff]/70`} size={15} />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full mt-1 relative overflow-hidden rounded-xl py-3.5 font-black text-xs tracking-[0.25em] uppercase transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed
                                        bg-[#00f5ff]/10 border border-[#00f5ff]/35 text-[#00f5ff]
                                        hover:bg-[#00f5ff]/20 hover:border-[#00f5ff]/60 hover:shadow-[0_0_24px_rgba(0,245,255,0.2)]
                                        flex items-center justify-center gap-2"
                                >
                                    {isLoading
                                        ? <><Loader2 className="animate-spin" size={14} /> Processing...</>
                                        : <>Create Account <ArrowRight size={13} /></>}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-white/6" />
                                <span className="text-white/20 text-[10px] uppercase tracking-widest font-bold">or</span>
                                <div className="flex-1 h-px bg-white/6" />
                            </div>

                            {/* Google */}
                            <GoogleButton text="Sign up with Google" onLoading={setIsLoading} />

                            {/* Login link */}
                            <p className="text-center text-white/25 text-xs pt-1">
                                Already have an account?{' '}
                                <Link href="/login" className="text-[#00f5ff]/60 hover:text-[#00f5ff] font-bold transition-colors">
                                    Sign In
                                </Link>
                            </p>
                        </div>

                        {/* Bottom scanline */}
                        <div className="h-px bg-linear-to-r from-transparent via-[#f000ff]/20 to-transparent" />
                    </div>
                </div>

                <p className="text-center text-white/10 text-[9px] tracking-[0.5em] mt-5 uppercase font-mono">
                    Grimoire Coins · Secure Registration
                </p>
            </motion.div>
        </div>
    );
}
