'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { Loader2, Phone, Lock, Skull } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function CompleteProfileModal() {
    const { user, refreshUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        // Check if user is logged in AND missing either phone or password
        if (user && (!user.phoneNumber || !user.hasPassword)) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Adieus! Passwords do not match.");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Weakness! Password must be at least 6 characters.");
            return;
        }

        if (!formData.phoneNumber.startsWith('08') && !formData.phoneNumber.startsWith('62')) {
            toast.error("Invalid Phone Number! Must start with '08' or '62'.");
            return;
        }

        setIsLoading(true);

        try {
            const res = await api.post('/auth/complete-profile', {
                phoneNumber: formData.phoneNumber,
                password: formData.password
            });

            if (res.data.success) {
                toast.success("Profile Completed. The pact is sealed.");
                // Refresh user to update local state and close modal
                refreshUser();
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to complete profile.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full max-w-md relative"
                >
                    {/* BORDER CONTAINER */}
                    <div className="relative filter drop-shadow-[0_0_20px_rgba(187,10,30,0.3)]">
                        <div
                            className="absolute inset-0 bg-gradient-to-b from-red-900 to-black"
                            style={{
                                clipPath: "polygon(5% 0, 95% 0, 100% 10%, 100% 90%, 95% 100%, 5% 100%, 0 90%, 0 10%)"
                            }}
                        ></div>

                        <div
                            className="bg-black relative overflow-hidden p-8"
                            style={{
                                clipPath: "polygon(5% 0, 95% 0, 100% 10%, 100% 90%, 95% 100%, 5% 100%, 0 90%, 0 10%)",
                                margin: "2px"
                            }}
                        >
                            {/* Inner Texture */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(50,0,0,0.4),transparent)]"></div>

                            <div className="relative z-10">
                                <div className="text-center mb-6">
                                    <Skull className="w-12 h-12 text-red-700 mx-auto mb-2 opacity-80" />
                                    <h2 className="text-xl font-[family-name:var(--font-cinzel)] font-bold text-white tracking-widest uppercase">
                                        Seal Your Identity
                                    </h2>
                                    <p className="text-red-500/60 text-xs mt-2 font-[family-name:var(--font-cinzel)] uppercase tracking-wider">
                                        Complete your profile to proceed
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="relative group">
                                        <div className="absolute left-3 top-3 text-red-900">
                                            <Phone size={16} />
                                        </div>
                                        <input
                                            type="text"
                                            name="phoneNumber"
                                            placeholder="WhatsApp Number (e.g. 08xxx)"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-red-950/10 border border-red-900/30 text-white pl-10 pr-4 py-3 text-sm focus:border-red-600 focus:outline-none focus:bg-red-950/20 transition-all font-[family-name:var(--font-cinzel)]"
                                        />
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute left-3 top-3 text-red-900">
                                            <Lock size={16} />
                                        </div>
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="New Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            minLength={6}
                                            className="w-full bg-red-950/10 border border-red-900/30 text-white pl-10 pr-4 py-3 text-sm focus:border-red-600 focus:outline-none focus:bg-red-950/20 transition-all font-[family-name:var(--font-cinzel)]"
                                        />
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute left-3 top-3 text-red-900">
                                            <Lock size={16} />
                                        </div>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Confirm Password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            minLength={6}
                                            className="w-full bg-red-950/10 border border-red-900/30 text-white pl-10 pr-4 py-3 text-sm focus:border-red-600 focus:outline-none focus:bg-red-950/20 transition-all font-[family-name:var(--font-cinzel)]"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full mt-4 bg-gradient-to-r from-red-900 to-red-800 text-white font-bold py-3 uppercase tracking-widest text-xs hover:from-red-800 hover:to-red-700 transition-all flex justify-center items-center gap-2 border border-red-900 shadow-[0_0_10px_rgba(187,10,30,0.3)]"
                                    >
                                        {isLoading ? <Loader2 className="animate-spin" /> : 'Confirm Identity'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
