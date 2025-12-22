"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Edit2,
    Trash2,
    X,
    Loader2,
    FileText,
    Eye,
    EyeOff,
} from "lucide-react";
import Link from "next/link";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    published: boolean;
    createdAt: string;
}

const categories = ["Tutorial", "Tips", "Behind The Scenes", "Showcase", "News"];

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<BlogPost | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        content: "",
        category: "Tutorial",
        coverImage: "",
        published: false,
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch("/api/admin/blog");
            if (res.ok) setPosts(await res.json());
        } catch (error) {
            console.error("Failed to fetch:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const method = editingItem ? "PUT" : "POST";
            const body = editingItem ? { id: editingItem.id, ...formData } : formData;

            const res = await fetch("/api/admin/blog", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                await fetchData();
                closeModal();
            }
        } catch (error) {
            console.error("Failed to save:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus post ini?")) return;
        try {
            await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" });
            setPosts(posts.filter((p) => p.id !== id));
        } catch (error) {
            console.error("Failed to delete:", error);
        }
    };

    const togglePublish = async (post: BlogPost) => {
        try {
            await fetch("/api/admin/blog", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: post.id, published: !post.published }),
            });
            await fetchData();
        } catch (error) {
            console.error("Failed to update:", error);
        }
    };

    const openModal = (item?: BlogPost) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: item.title,
                excerpt: item.excerpt,
                content: "",
                category: item.category,
                coverImage: "",
                published: item.published,
            });
        } else {
            setEditingItem(null);
            setFormData({ title: "", excerpt: "", content: "", category: "Tutorial", coverImage: "", published: false });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog</h1>
                    <p className="text-gray-500">Kelola artikel blog</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-xl"
                >
                    <Plus size={20} />
                    Tulis Artikel
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-teal-500" size={32} />
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-12">
                    <FileText className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-500">Belum ada artikel</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900 dark:text-white">{post.title}</p>
                                        <p className="text-sm text-gray-500 truncate max-w-xs">{post.excerpt}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded-full text-xs">
                                            {post.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => togglePublish(post)}
                                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${post.published
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {post.published ? <Eye size={14} /> : <EyeOff size={14} />}
                                            {post.published ? "Published" : "Draft"}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => openModal(post)} className="p-2 hover:bg-gray-100 rounded-lg">
                                            <Edit2 size={16} className="text-gray-500" />
                                        </button>
                                        <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-red-50 rounded-lg">
                                            <Trash2 size={16} className="text-red-500" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between mb-6">
                                <h2 className="text-xl font-semibold">{editingItem ? "Edit" : "Tulis"} Artikel</h2>
                                <button onClick={closeModal}><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Judul Artikel"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-xl"
                                    required
                                />
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-xl"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <textarea
                                    placeholder="Ringkasan singkat..."
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-xl"
                                    rows={2}
                                    required
                                />
                                <textarea
                                    placeholder="Konten artikel..."
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-xl"
                                    rows={6}
                                    required
                                />
                                <input
                                    type="url"
                                    placeholder="URL Cover Image"
                                    value={formData.coverImage}
                                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-xl"
                                />
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.published}
                                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                    />
                                    Publish langsung
                                </label>

                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border rounded-xl">
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl"
                                    >
                                        {saving ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Simpan"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
