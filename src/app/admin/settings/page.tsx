import { Settings as SettingsIcon } from 'lucide-react';
import TripaySettings from '@/components/admin/TripaySettings';
import PaymentGatewaySwitch from '@/components/admin/PaymentGatewaySwitch';
import PaymentMethodSettings from '@/components/admin/PaymentMethodSettings';

export default function SettingsPage() {
    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <SettingsIcon className="text-red-600" size={32} />
                    System Settings
                </h1>
                <p className="text-neutral-400">Configure payment gateways, system preferences, and integrations.</p>
            </div>

            {/* Settings Sections */}
            <div className="space-y-12">
                {/* Active Gateway Section */}
                <section>
                    <div className="mb-6 border-b border-neutral-800 pb-2">
                        <h2 className="text-xl font-bold text-white">General Payment Settings</h2>
                        <p className="text-sm text-neutral-500">Choose the active payment processor for the website.</p>
                    </div>
                    <PaymentGatewaySwitch />
                </section>

                {/* Tripay Section */}
                <section>
                    <div className="mb-6 border-b border-neutral-800 pb-2">
                        <h2 className="text-xl font-bold text-white">Payment Gateway (Tripay)</h2>
                        <p className="text-sm text-neutral-500">Configure Tripay connection for automated payments.</p>
                    </div>
                    <TripaySettings />
                </section>

                {/* Payment Method Toggle Section */}
                <section>
                    <div className="mb-6 border-b border-neutral-800 pb-2">
                        <h2 className="text-xl font-bold text-white">Payment Method Management</h2>
                        <p className="text-sm text-neutral-500">Enable or disable individual payment methods.</p>
                    </div>
                    <PaymentMethodSettings />
                </section>

                {/* Future Sections (e.g., General, Email, etc.) */}
            </div>
        </div>
    );
}

