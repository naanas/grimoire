'use client';

import { Suspense, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import BackgroundEffects from './BackgroundEffects';
import ChatWidget from './ChatWidget';
import NavigationLoader from './NavigationLoader';
import IdleLogout from './IdleLogout';
import PromoPopup from '@/components/PromoPopup';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/lib/authStore';

import { GoogleOAuthProvider } from '@react-oauth/google';
import CompleteProfileModal from './CompleteProfileModal';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
    const { initialized, loadUser, fetchFreshUser } = useAuthStore();

    useEffect(() => {
        if (!initialized) {
            loadUser();
            fetchFreshUser();
        }
    }, [initialized, loadUser, fetchFreshUser]);

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#0a0a0a',
                        color: '#d6d3d1',
                        border: '1px solid #450a0a',
                        borderLeft: '4px solid #b91c1c',
                        borderRadius: '0.25rem',
                        boxShadow: '0 4px 20px rgba(185, 28, 28, 0.15)',
                        fontFamily: 'monospace',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontSize: '0.875rem'
                    },
                    success: {
                        iconTheme: {
                            primary: '#22c55e',
                            secondary: '#0a0a0a',
                        },
                        style: {
                            borderLeft: '4px solid #22c55e',
                            boxShadow: '0 4px 20px rgba(34, 197, 94, 0.15)',
                        }
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#0a0a0a',
                        },
                        style: {
                            borderLeft: '4px solid #ef4444',
                            boxShadow: '0 4px 20px rgba(239, 68, 68, 0.25)',
                        }
                    }
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
                    <PromoPopup />
                    <ChatWidget />
                </>
            )}
        </GoogleOAuthProvider>
    );
}
