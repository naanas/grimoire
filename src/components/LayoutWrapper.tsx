'use client';

import { Suspense, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import BackgroundEffects from './BackgroundEffects';
import ChatWidget from './ChatWidget';
import NavigationLoader from './NavigationLoader';
import IdleLogout from './IdleLogout';
import MobileBottomNav from './MobileBottomNav';
import PromoPopup from '@/components/PromoPopup';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/lib/authStore';

import { GoogleOAuthProvider } from '@react-oauth/google';
import CompleteProfileModal from './CompleteProfileModal';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');
    const isOrderPage = !!pathname?.match(/^\/order\/[^/]+$/);
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
                position="top-center"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: 'rgba(20, 16, 28, 0.95)',
                        backdropFilter: 'blur(20px)',
                        color: '#f5f3ff',
                        border: '1px solid rgba(167, 139, 250, 0.15)',
                        borderRadius: '12px',
                        fontSize: '13px',
                        padding: '12px 16px',
                        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)',
                    },
                    success: {
                        iconTheme: {
                            primary: '#a78bfa',
                            secondary: '#fff',
                        },
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
                    {!isOrderPage && <Navbar />}
                    {/* pt-16/pt-20 for navbar offset — removed on order pages */}
                    <main className={`relative z-10 flex flex-col grow min-h-screen pb-24 lg:pb-0 ${isOrderPage ? 'pt-0' : 'pt-16 md:pt-20'}`}>
                        {children}
                    </main>
                    <Footer />
                    {!isOrderPage && <MobileBottomNav />}
                    <PromoPopup />
                    {!isOrderPage && <ChatWidget />}
                </>
            )}
        </GoogleOAuthProvider>
    );
}

