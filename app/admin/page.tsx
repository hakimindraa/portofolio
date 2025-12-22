"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Images,
    Star,
    FileText,
    MessageSquare,
    TrendingUp,
    Eye,
    Plus,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface Stats {
    photos: number;
    testimonials: number;
    posts: number;
    messages: number;
    unreadMessages: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        photos: 0,
        testimonials: 0,
        posts: 0,
        messages: 0,
        unreadMessages: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch stats from API
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/admin/stats");
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        {
            label: "Photos",
            value: stats.photos,
            icon: Images,
            color: "from-teal-400 to-cyan-400",
            href: "/admin/gallery",
        },
        {
            label: "Testimonials",
            value: stats.testimonials,
            icon: Star,
            color: "from-yellow-400 to-orange-400",
            href: "/admin/testimonials",
        },
        {
            label: "Blog Posts",
            value: stats.posts,
            icon: FileText,
            color: "from-purple-400 to-pink-400",
            href: "/admin/blog",
        },
        {
            label: "Messages",
            value: stats.messages,
            icon: MessageSquare,
            color: "from-blue-400 to-indigo-400",
            href: "/admin/messages",
            badge: stats.unreadMessages > 0 ? stats.unreadMessages : null,
        },
    ];

    const quickActions = [
        { label: "Upload Photo", href: "/admin/gallery?action=new", icon: Images },
        { label: "Add Testimonial", href: "/admin/testimonials?action=new", icon: Star },
        { label: "Write Blog Post", href: "/admin/blog/new", icon: FileText },
        { label: "View Messages", href: "/admin/messages", icon: MessageSquare },
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Dashboard
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Selamat datang di admin panel portfolio
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={stat.href}>
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group relative overflow-hidden">
                                    {/* Background gradient */}
                                    <div
                                        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform`}
                                    />

                                    <div className="relative">
                                        <div className="flex items-center justify-between mb-4">
                                            <div
                                                className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}
                                            >
                                                <Icon size={24} className="text-white" />
                                            </div>
                                            {stat.badge && (
                                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                    {stat.badge} baru
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {loading ? "-" : stat.value}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                            {stat.label}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <motion.div
                                key={action.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                            >
                                <Link href={action.href}>
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:border-teal-400 hover:shadow-md transition-all group flex items-center gap-4">
                                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-teal-500/10 transition-colors">
                                            <Icon
                                                size={20}
                                                className="text-gray-600 dark:text-gray-400 group-hover:text-teal-500"
                                            />
                                        </div>
                                        <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-teal-500">
                                            {action.label}
                                        </span>
                                        <ArrowRight
                                            size={16}
                                            className="ml-auto text-gray-400 group-hover:text-teal-500 group-hover:translate-x-1 transition-all"
                                        />
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Info Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-6 text-white"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                        <TrendingUp size={28} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Tips</h3>
                        <p className="text-teal-100 text-sm">
                            Upload foto berkualitas tinggi dan buat deskripsi yang menarik
                            untuk meningkatkan engagement.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
