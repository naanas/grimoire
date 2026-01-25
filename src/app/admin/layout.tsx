'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    LogOut,
    Menu,
    X
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // Protect Admin Route (Client-side simple check)
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (!token || !userStr) {
            router.push('/login');
            return;
        }

        try {
            const user = JSON.parse(userStr);
            if (user.role !== 'ADMIN') {
                router.push('/');
            }
        } catch (e) {
            router.push('/login');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
        { icon: ShoppingCart, label: 'Transactions', href: '/admin/transactions' },
        { icon: Package, label: 'Products', href: '/admin/products' },
    ];



    return (
        <div className="min-h-screen bg-neutral-900 text-white flex">
            {/* Sidebar */}
            {/* Sidebar */}
            <aside
                className={`fixed top-24 bottom-0 left-0 z-50 w-64 bg-neutral-950 border-r border-neutral-800 transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:relative md:translate-x-0 md:top-0 md:h-auto`}
            >
                <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-800 shrink-0">
                    <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                        Admin Panel
                    </span>
                    <button
                        className="md:hidden text-neutral-400 hover:text-white"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                    ? 'bg-red-900/20 text-red-500 font-medium'
                                    : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                                    }`}
                            >
                                <Icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-neutral-800 shrink-0">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-neutral-400 hover:text-red-500 hover:bg-red-900/10 rounded-lg transition-all"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[45] md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 min-h-screen flex flex-col">
                {/* Mobile Header */}
                <header className="h-16 md:hidden flex items-center px-4 bg-neutral-950 border-b border-neutral-800 sticky top-0 z-40">
                    <button
                        className="text-neutral-400 hover:text-white p-2"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>
                </header>

                <div className="flex-1 p-6 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
