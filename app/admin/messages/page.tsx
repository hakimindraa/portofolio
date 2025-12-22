"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Mail,
    Trash2,
    Loader2,
    MessageSquare,
    Check,
    Reply,
    Clock,
} from "lucide-react";

interface Message {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    read: boolean;
    replied: boolean;
    createdAt: string;
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch("/api/admin/messages");
            if (res.ok) setMessages(await res.json());
        } catch (error) {
            console.error("Failed to fetch:", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await fetch("/api/admin/messages", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, read: true }),
            });
            setMessages(messages.map((m) => (m.id === id ? { ...m, read: true } : m)));
        } catch (error) {
            console.error("Failed to update:", error);
        }
    };

    const markAsReplied = async (id: string) => {
        try {
            await fetch("/api/admin/messages", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, replied: true }),
            });
            setMessages(messages.map((m) => (m.id === id ? { ...m, replied: true } : m)));
        } catch (error) {
            console.error("Failed to update:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus pesan ini?")) return;
        try {
            await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
            setMessages(messages.filter((m) => m.id !== id));
            if (selectedMessage?.id === id) setSelectedMessage(null);
        } catch (error) {
            console.error("Failed to delete:", error);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const unreadCount = messages.filter((m) => !m.read).length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
                <p className="text-gray-500">
                    {unreadCount > 0 ? `${unreadCount} pesan belum dibaca` : "Semua pesan sudah dibaca"}
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-teal-500" size={32} />
                </div>
            ) : messages.length === 0 ? (
                <div className="text-center py-12">
                    <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-500">Belum ada pesan masuk</p>
                </div>
            ) : (
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Message List */}
                    <div className="space-y-3">
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => {
                                    setSelectedMessage(msg);
                                    if (!msg.read) markAsRead(msg.id);
                                }}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedMessage?.id === msg.id
                                        ? "border-teal-400 bg-teal-50 dark:bg-teal-900/20"
                                        : "border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300"
                                    } ${!msg.read ? "border-l-4 border-l-teal-500" : ""}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 flex items-center justify-center">
                                            <span className="text-white font-medium">{msg.name[0]}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{msg.name}</p>
                                            <p className="text-xs text-gray-500">{msg.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {msg.replied && (
                                            <span className="text-green-500" title="Sudah dibalas">
                                                <Reply size={14} />
                                            </span>
                                        )}
                                        {!msg.read && (
                                            <span className="w-2 h-2 bg-teal-500 rounded-full" title="Belum dibaca" />
                                        )}
                                    </div>
                                </div>
                                <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{msg.subject}</p>
                                <p className="text-sm text-gray-500 truncate">{msg.message}</p>
                                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                                    <Clock size={12} />
                                    {formatDate(msg.createdAt)}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Message Detail */}
                    {selectedMessage ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 h-fit sticky top-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {selectedMessage.subject}
                                    </h2>
                                    <p className="text-gray-500 text-sm">
                                        Dari: {selectedMessage.name} ({selectedMessage.email})
                                    </p>
                                    <p className="text-gray-400 text-xs mt-1">
                                        {formatDate(selectedMessage.createdAt)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDelete(selectedMessage.id)}
                                    className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <div className="prose dark:prose-invert max-w-none mb-6">
                                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                            </div>

                            <div className="flex gap-3">
                                <a
                                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                                    onClick={() => markAsReplied(selectedMessage.id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl"
                                >
                                    <Mail size={18} />
                                    Balas via Email
                                </a>
                                {!selectedMessage.replied && (
                                    <button
                                        onClick={() => markAsReplied(selectedMessage.id)}
                                        className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-gray-50"
                                    >
                                        <Check size={18} />
                                        Tandai Sudah Dibalas
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="hidden lg:flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-12">
                            <p className="text-gray-400">Pilih pesan untuk melihat detail</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
