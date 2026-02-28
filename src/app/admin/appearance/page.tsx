'use client';

import { useState } from 'react';
import { Palette, Film, Ticket, Image as ImageIcon } from 'lucide-react';
import BackgroundSettings from '@/components/admin/BackgroundSettings';
import BannerManager from '@/components/admin/BannerManager';
import PromoPopupSettings from '@/components/admin/PromoPopupSettings';

const TABS = [
    { id: 'background', label: 'Background', icon: Film },
    { id: 'promo', label: 'Promo Popup', icon: Ticket },
    { id: 'banners', label: 'Banners', icon: ImageIcon },
];

export default function AppearancePage() {
    const [activeTab, setActiveTab] = useState('background');

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
                <p className="text-neutral-400 mt-2 ml-1 text-sm">
                    Customize the look and feel of your website, manage banners, and configure popups.
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="relative mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Glow line behind the tab bar */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-800" />

                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-px">
                    {TABS.map(({ id, label, icon: Icon }) => {
                        const isActive = activeTab === id;
                        return (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-t-lg border-b-2 whitespace-nowrap transition-all duration-200 focus:outline-none ${isActive
                                        ? 'text-white border-red-500 bg-red-500/5'
                                        : 'text-neutral-500 border-transparent hover:text-neutral-300 hover:bg-white/5'
                                    }`}
                            >
                                <Icon size={16} className={isActive ? 'text-red-500' : ''} />
                                {label}
                                {isActive && (
                                    <span className="hidden sm:inline-flex items-center justify-center w-2 h-2 rounded-full bg-red-500 ml-0.5" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-400" key={activeTab}>
                {activeTab === 'background' && <BackgroundSettings />}
                {activeTab === 'promo' && <PromoPopupSettings />}
                {activeTab === 'banners' && <BannerManager />}
            </div>
        </div>
    );
}
