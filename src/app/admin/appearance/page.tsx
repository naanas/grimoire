'use client';

import { Palette } from 'lucide-react';
import BackgroundSettings from '@/components/admin/BackgroundSettings';
import BannerManager from '@/components/admin/BannerManager';
import PromoPopupSettings from '@/components/admin/PromoPopupSettings';

export default function AppearancePage() {
    return (
        <div className="pb-20 relative">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-[var(--blood-red)]/10 rounded-lg border border-[var(--blood-red)]/30">
                        <Palette className="text-[var(--blood-red)]" size={32} />
                    </div>
                    Appearance & Media
                </h1>
                <p className="text-neutral-400 mt-2 ml-1">
                    Customize the look and feel of your website, manage banners, and configure popups.
                </p>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Column 1: Background & Popup */}
                <div className="flex flex-col space-y-6 self-start">
                    <BackgroundSettings />
                    <PromoPopupSettings />
                </div>

                {/* Column 2: Banner Manager */}
                <div className="h-full">
                    <BannerManager />
                </div>
            </div>
        </div>
    );
}
