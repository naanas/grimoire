'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import BackgroundEffects from './BackgroundEffects';
import ChatWidget from './ChatWidget';
import NavigationLoader from './NavigationLoader';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            <Suspense fallback={null}>
                <NavigationLoader />
            </Suspense>
            <BackgroundEffects />
            <Navbar />
            <main className="relative z-10 flex flex-col flex-grow min-h-screen pt-20">
                {children}
            </main>
            <Footer />
            <ChatWidget />
        </>
    );
}
