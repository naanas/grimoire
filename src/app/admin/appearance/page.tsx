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

            {/* Dashboard Layout */}
            <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Column 1: Background & Popup (1/3 width on desktop) */}
                <div className="w-full lg:w-1/3 flex flex-col gap-8 flex-shrink-0">
                    <BackgroundSettings />
                    <PromoPopupSettings />
                </div>

                {/* Column 2: Banner Manager (2/3 width on desktop) */}
                <div className="w-full lg:w-2/3 flex-grow h-fit">
                    <BannerManager />
                </div>
            </div>
        </div>
    );
}
