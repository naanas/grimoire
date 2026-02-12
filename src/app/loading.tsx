import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-[9999]">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-[var(--blood-red)]" />
                <p className="text-white font-[family-name:var(--font-cinzel)] text-lg animate-pulse tracking-widest uppercase">
                    Loading Realm...
                </p>
            </div>
        </div>
    );
}
