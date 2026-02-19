'use client';

import { Settings as SettingsIcon } from 'lucide-react';
import TripaySettings from '@/components/admin/TripaySettings';
import PaymentGatewaySwitch from '@/components/admin/PaymentGatewaySwitch';
import PaymentMethodSettings from '@/components/admin/PaymentMethodSettings';

export default function SettingsPage() {
    return (
        <div className="pb-20 relative">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-[var(--blood-red)]/10 rounded-lg border border-[var(--blood-red)]/30">
                        <SettingsIcon className="text-[var(--blood-red)]" size={32} />
                    </div>
                    System Command Center
                    <span className="text-[10px] bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded text-neutral-400 font-mono">V3.0-CYBER</span>
                </h1>
                <p className="text-neutral-400 mt-2 ml-1">
                    Control all payment gateways, system integrations, and promotional modules from a single dashboard.
                </p>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Row 1: Active Gateway (Full Width) */}
                <div className="md:col-span-3">
                    <PaymentGatewaySwitch />
                </div>

                {/* Row 2: Tripay Settings (2 Columns) & Payment Methods (1 Column) */}
                <div className="md:col-span-2 h-full">
                    <TripaySettings />
                </div>

                <div className="md:col-span-1 h-full">
                    <PaymentMethodSettings />
                </div>

                {/* Row 3: More Settings (Placeholder) */}
                <div className="md:col-span-1 h-full">
                    <div className="bg-neutral-950/30 border border-neutral-900 rounded-2xl flex items-center justify-center p-8 border-dashed h-full">
                        <p className="text-neutral-600 text-sm">More system settings...</p>
                    </div>
                </div>

                {/* Future: Add more cards here or expand Tripay/Methods to take more space */}
                <div className="md:col-span-2 bg-neutral-950/30 border border-neutral-900 rounded-2xl flex items-center justify-center p-8 border-dashed">
                    <p className="text-neutral-600 text-sm">More system settings coming soon...</p>
                </div>
            </div>
        </div>
    );
}
