"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Images,
    MessageSquare,
    Star,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    User,
    Briefcase,
    GitBranch,
    SplitSquareHorizontal,
    DollarSign,
    Instagram,
} from "lucide-react";

const menuItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/gallery", icon: Images, label: "Gallery" },
    { href: "/admin/services", icon: Briefcase, label: "Services" },
    { href: "/admin/work-process", icon: GitBranch, label: "How I Work" },
    { href: "/admin/before-after", icon: SplitSquareHorizontal, label: "Before & After" },
    { href: "/admin/pricing", icon: DollarSign, label: "Pricing" },
    { href: "/admin/testimonials", icon: Star, label: "Testimonials" },
    { href: "/admin/instagram", icon: Instagram, label: "Instagram Feed" },
    { href: "/admin/blog", icon: FileText, label: "Blog" },
    { href: "/admin/messages", icon: MessageSquare, label: "Messages" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();

    // Lock body scroll when sidebar is open on mobile
    useEffect(() => {
        if (sidebarOpen) {
            // Prevent background scroll when sidebar is open
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.top = `-${window.scrollY}px`;
        } else {
            // Restore scroll position when sidebar is closed
            const scrollY = document.body.style.top;
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.top = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.top = '';
        };
    }, [sidebarOpen]);

    // Don't show layout on login page
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden touch-none"
                        onTouchMove={(e) => e.preventDefault()}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-screen w-64 bg-[#0d1f2d] transform transition-transform duration-300 lg:translate-x-0 flex flex-col overscroll-contain ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                style={{ touchAction: 'pan-y', maxHeight: '100vh' }}
            >
                {/* Logo - Fixed at top */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
                    <Link href="/admin" className="flex items-center gap-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                            Admin
                        </span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Menu Items - Scrollable with max height */}
                <nav className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-2" style={{ minHeight: 0 }}>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? "bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-400 border border-teal-500/30"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                                {isActive && <ChevronRight size={16} className="ml-auto" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info & Logout - Fixed at bottom */}
                <div className="p-4 border-t border-white/10 flex-shrink-0 bg-[#0d1f2d]">
                    <div className="flex items-center gap-3 px-4 py-2 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 flex items-center justify-center flex-shrink-0">
                            <User size={20} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate text-sm">
                                {session?.user?.name || "Admin"}
                            </p>
                            <p className="text-gray-400 text-xs truncate">
                                {session?.user?.email}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: "/admin/login" })}
                        className="flex items-center gap-3 px-4 py-2 w-full text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Top Header */}
                <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between px-6 py-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/"
                                target="_blank"
                                className="text-sm text-gray-500 hover:text-teal-500 transition-colors"
                            >
                                Lihat Website →
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
