'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gamepad2, Activity, User, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

const items = [
    { name: 'Beranda', href: '/', icon: Home },
    { name: 'Games', href: '/games', icon: Gamepad2 },
    { name: 'Top Up', href: '/topup', icon: Wallet, primary: true },
    { name: 'Lacak', href: '/track', icon: Activity },
    { name: 'Akun', href: '/profile', icon: User, requiresAuth: true, fallback: '/login' },
];

export default function MobileBottomNav() {
    const pathname = usePathname() ?? '';
    const { user } = useAuth();

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <nav
            className="lg:hidden fixed bottom-0 inset-x-0 z-40 safe-bottom pointer-events-none"
            aria-label="Mobile navigation"
        >
            <div className="px-3 pb-3 pt-1 pointer-events-auto">
                <div
                    className="relative mx-auto max-w-md glass-panel rounded-2xl px-1.5 py-1.5 flex items-center justify-between shadow-[0_-12px_40px_rgba(0,0,0,0.5)]"
                    style={{ backdropFilter: 'blur(24px) saturate(150%)' }}
                >
                    {items.map((item) => {
                        const Icon = item.icon;
                        const href =
                            item.requiresAuth && !user ? item.fallback || item.href : item.href;
                        const active = isActive(item.href);

                        if (item.primary) {
                            return (
                                <Link
                                    key={item.name}
                                    href={href}
                                    aria-label={item.name}
                                    className="relative -mt-7 flex flex-col items-center gap-1 group"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-(--gold) to-(--ember) blur-md opacity-60 group-active:opacity-90 transition-opacity" />
                                        <div className="relative w-14 h-14 rounded-2xl bg-linear-to-br from-(--gold) via-(--ember) to-(--crimson) flex items-center justify-center shadow-[0_8px_24px_rgba(245,158,11,0.45)] ring-2 ring-(--bg-deep) group-active:scale-95 transition-transform">
                                            <Icon size={22} className="text-(--bg-void)" strokeWidth={2.5} />
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-[0.18em] text-(--gold-soft)">
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        }

                        return (
                            <Link
                                key={item.name}
                                href={href}
                                aria-label={item.name}
                                className="relative flex-1 flex flex-col items-center justify-center gap-1 py-2 group"
                            >
                                {active && (
                                    <motion.span
                                        layoutId="bottomNavActive"
                                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                        className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[2px] rounded-full bg-linear-to-r from-(--violet) to-(--crimson)"
                                    />
                                )}
                                <Icon
                                    size={18}
                                    className={`transition-all duration-200 ${
                                        active
                                            ? 'text-white'
                                            : 'text-(--text-muted) group-active:text-white'
                                    }`}
                                    strokeWidth={active ? 2.4 : 2}
                                />
                                <span
                                    className={`text-[9px] font-bold uppercase tracking-[0.15em] transition-colors ${
                                        active ? 'text-white' : 'text-(--text-muted)'
                                    }`}
                                >
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}

