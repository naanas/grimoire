'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import BackgroundEffects from './BackgroundEffects';
import ChatWidget from './ChatWidget';
import NavigationLoader from './NavigationLoader';
import IdleLogout from './IdleLogout';
import PromoPopup from '@/components/PromoPopup'; // Added import for PromoPopup
import { Toaster } from 'react-hot-toast';

import { GoogleOAuthProvider } from '@react-oauth/google';
import CompleteProfileModal from './CompleteProfileModal';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#171717',
                        color: '#fff',
                        border: '1px solid #262626',
                    },
                    success: {
                        iconTheme: {
                            primary: '#ef4444', // Blood red for success matches theme
                            secondary: '#fff',
                        },
                    },
                }}
            />
            <CompleteProfileModal />
            <IdleLogout />
            {isAdmin ? (
                children
            ) : (
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
            )}
        </GoogleOAuthProvider>
    );
}
