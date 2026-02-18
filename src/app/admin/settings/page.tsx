'use client';

import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, CreditCard, Globe, Shield, Ticket, LayoutGrid } from 'lucide-react';
import TripaySettings from '@/components/admin/TripaySettings';
import PaymentGatewaySwitch from '@/components/admin/PaymentGatewaySwitch';
import PaymentMethodSettings from '@/components/admin/PaymentMethodSettings';
import PromoPopupSettings from '@/components/admin/PromoPopupSettings';

const SECTIONS = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'tripay', label: 'Tripay', icon: Shield },
    { id: 'methods', label: 'Payment Methods', icon: LayoutGrid },
    { id: 'promo', label: 'Promo Popup', icon: Ticket },
];

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState('general');

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20 relative">
            <div className="space-y-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <SettingsIcon className="text-red-600" size={32} />
                        System Settings
                    </h1>
                    <p className="text-neutral-400 mt-2">Configure payment gateways, system preferences, and integrations.</p>
                </div>

                {/* Tab Navigation */}
                <div className="bg-[#0a0a0a] border-b border-gray-800">
                    <div className="flex items-center gap-6 border-b border-gray-800 mb-8 overflow-x-auto pb-1 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide">
                        {SECTIONS.map((section) => {
                            const Icon = section.icon;
                            const isActive = activeSection === section.id;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`flex items-center gap-2 py-4 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${isActive
                                        ? 'border-red-600 text-red-500'
                                        : 'border-transparent text-gray-400 hover:text-white hover:border-gray-700'
                                        }`}
                                >
                                    <Icon size={18} />
                                    {section.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px] animate-in fade-in slide-in-from-bottom-4 duration-300">

                {activeSection === 'general' && (
                    <section>
                        <PaymentGatewaySwitch />
                    </section>
                )}

                {activeSection === 'tripay' && (
                    <section>
                        <TripaySettings />
                    </section>
                )}

                {activeSection === 'methods' && (
                    <section>
                        <PaymentMethodSettings />
                    </section>
                )}

                {activeSection === 'promo' && (
                    <section>
                        <PromoPopupSettings />
                    </section>
                )}
            </div>
        </div>
    );
}
