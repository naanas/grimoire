'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function NavigationLoader() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Reset loading state when route changes
        setIsLoading(false);
    }, [pathname, searchParams]);

    useEffect(() => {
        // Intercept clicks on links to show loader
        const handleAnchorClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a');

            if (activeLinkCheck(anchor)) {
                setIsLoading(true);
            }
        };

        const activeLinkCheck = (anchor: HTMLAnchorElement | null) => {
            if (!anchor || !anchor.href) return false;
            if (anchor.target === '_blank') return false;
            // Check if internal link
            if (!anchor.href.startsWith(window.location.origin)) return false;
            // Check if strictly same page hash
            if (anchor.pathname === window.location.pathname && anchor.search === window.location.search) return false;
            // Ignore if modifier keys pressed
            // (Simplified check for now)
            return true;
        };

        window.addEventListener('click', handleAnchorClick);
        return () => window.removeEventListener('click', handleAnchorClick);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ scaleX: 0, opacity: 1 }}
                    animate={{ scaleX: 0.7, opacity: 1, transition: { duration: 1.5, ease: "easeInOut" } }}
                    exit={{ scaleX: 1, opacity: 0, transition: { duration: 0.2 } }}
                    style={{ transformOrigin: '0%' }}
                    className="fixed top-0 left-0 right-0 h-1 bg-[var(--blood-red)] z-[9999] shadow-[0_0_10px_rgba(187,10,30,0.8)]"
                />
            )}
        </AnimatePresence>
    );
}
