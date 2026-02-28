'use client';

import { useState } from 'react';
import { Settings as SettingsIcon, DollarSign, Shield, CreditCard } from 'lucide-react';
import TripaySettings from '@/components/admin/TripaySettings';
import PaymentGatewaySwitch from '@/components/admin/PaymentGatewaySwitch';
import PaymentMethodSettings from '@/components/admin/PaymentMethodSettings';

const TABS = [
    { id: 'gateway', label: 'Gateway', icon: DollarSign, desc: 'Active payment provider' },
    { id: 'tripay', label: 'Tripay Config', icon: Shield, desc: 'API keys & credentials' },
    { id: 'methods', label: 'Payment Methods', icon: CreditCard, desc: 'Enable / disable methods' },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('gateway');

    return (
        <div className="pb-20 relative">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-[var(--blood-red)]/10 rounded-lg border border-[var(--blood-red)]/30">
                        <SettingsIcon className="text-[var(--blood-red)]" size={32} />
                    </div>
                    System Settings
                    <span className="text-[10px] bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded text-neutral-500 font-mono hidden sm:inline">V3.0</span>
                </h1>
                <p className="text-neutral-400 mt-2 ml-1 text-sm">
                    Control all payment gateways, system integrations, and promotional modules.
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="relative mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
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
                                    <span className="hidden sm:inline-flex w-2 h-2 rounded-full bg-red-500 ml-0.5" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-400" key={activeTab}>
                {activeTab === 'gateway' && <PaymentGatewaySwitch />}
                {activeTab === 'tripay' && <TripaySettings />}
                {activeTab === 'methods' && <PaymentMethodSettings />}
            </div>
        </div>
    );
}
