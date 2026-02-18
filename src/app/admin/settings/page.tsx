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

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            // Offset for sticky header
            const y = element.getBoundingClientRect().top + window.scrollY - 180;
            window.scrollTo({ top: y, behavior: 'smooth' });
            setActiveSection(id);
        }
    };

    // Optional: Update active section on scroll
    useEffect(() => {
        const handleScroll = () => {
            const sections = SECTIONS.map(s => document.getElementById(s.id));
            const scrollPosition = window.scrollY + 200;

            for (const section of sections) {
                if (section && section.offsetTop <= scrollPosition && (section.offsetTop + section.offsetHeight) > scrollPosition) {
                    setActiveSection(section.id);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

                {/* Sticky Sub-Navbar */}
                <div className="sticky top-20 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-gray-800 py-4 -mx-4 px-4 md:mx-0 md:px-0 md:bg-transparent md:backdrop-blur-none md:border-none md:static">
                    <div className="flex overflow-x-auto gap-2 no-scrollbar pb-2 md:pb-0">
                        {SECTIONS.map((section) => {
                            const Icon = section.icon;
                            const isActive = activeSection === section.id;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${isActive
                                            ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/20'
                                            : 'bg-gray-900/50 border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-white'
                                        }`}
                                >
                                    <Icon size={16} />
                                    {section.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Settings Sections */}
            <div className="space-y-12">
                {/* Active Gateway Section */}
                <section id="general" className="scroll-mt-40">
                    <div className="mb-6 border-b border-neutral-800 pb-2">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Globe className="text-blue-500" size={24} />
                            General Payment Settings
                        </h2>
                        <p className="text-sm text-neutral-500">Choose the active payment processor for the website.</p>
                    </div>
                    <PaymentGatewaySwitch />
                </section>

                {/* Tripay Section */}
                <section id="tripay" className="scroll-mt-40">
                    <div className="mb-6 border-b border-neutral-800 pb-2">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Shield className="text-orange-500" size={24} />
                            Payment Gateway (Tripay)
                        </h2>
                        <p className="text-sm text-neutral-500">Configure Tripay connection for automated payments.</p>
                    </div>
                    <TripaySettings />
                </section>

                {/* Payment Method Toggle Section */}
                <section id="methods" className="scroll-mt-40">
                    <div className="mb-6 border-b border-neutral-800 pb-2">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <LayoutGrid className="text-purple-500" size={24} />
                            Payment Method Management
                        </h2>
                        <p className="text-sm text-neutral-500">Enable or disable individual payment methods.</p>
                    </div>
                    <PaymentMethodSettings />
                </section>

                {/* Promo Popup Section */}
                <section id="promo" className="scroll-mt-40">
                    <div className="mb-6 border-b border-neutral-800 pb-2">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Ticket className="text-green-500" size={24} />
                            Promo Popup Configuration
                        </h2>
                        <p className="text-sm text-neutral-500">Manage the promotional popup shown to users.</p>
                    </div>
                    <PromoPopupSettings />
                </section>

                {/* Future Sections (e.g., General, Email, etc.) */}
            </div>
        </div>
    );
}

