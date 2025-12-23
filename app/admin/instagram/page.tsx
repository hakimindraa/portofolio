"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, X, Upload, Image as ImageIcon, Heart, MessageCircle } from "lucide-react";

interface InstagramPost {
    id: string;
    imageUrl: string;
    caption: string | null;
    likes: number;
    comments: number;
    order: number;
    active: boolean;
}

export default function InstagramPage() {
    const [posts, setPosts] = useState<InstagramPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPost, setEditingPost] = useState<InstagramPost | null>(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        imageUrl: "",
        caption: "",
        likes: 0,
        comments: 0,
        order: 0,
        active: true,
    });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch("/api/admin/instagram");
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        } catch (error) {
            console.error("Failed to fetch instagram posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (file: File) => {
        setUploading(true);

        try {
            const formDataUpload = new FormData();
            formDataUpload.append("file", file);

            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formDataUpload,
            });

            if (res.ok) {
                const data = await res.json();
                setFormData((prev) => ({ ...prev, imageUrl: data.url }));
            }
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = "/api/admin/instagram";
            const method = editingPost ? "PUT" : "POST";
            const body = editingPost
                ? { ...formData, id: editingPost.id }
                : formData;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                fetchPosts();
                closeModal();
            }
        } catch (error) {
            console.error("Failed to save instagram post:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus foto ini?")) return;

        try {
            const res = await fetch(`/api/admin/instagram?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                fetchPosts();
            }
        } catch (error) {
            console.error("Failed to delete instagram post:", error);
        }
    };

    const openAddModal = () => {
        setEditingPost(null);
        setFormData({
            imageUrl: "",
            caption: "",
            likes: Math.floor(Math.random() * 300) + 100, // Random likes for display
            comments: Math.floor(Math.random() * 30) + 5, // Random comments for display
            order: posts.length,
            active: true,
        });
        setShowModal(true);
    };

    const openEditModal = (post: InstagramPost) => {
        setEditingPost(post);
        setFormData({
            imageUrl: post.imageUrl,
            caption: post.caption || "",
            likes: post.likes,
            comments: post.comments,
            order: post.order,
            active: post.active,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingPost(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-teal-500" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Instagram Feed</h1>
                    <p className="text-gray-500">Kelola foto Instagram yang ditampilkan di website (max 6 foto)</p>
                </div>
                <button
                    onClick={openAddModal}
                    disabled={posts.length >= 6}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium disabled:opacity-50"
                >
                    <Plus size={20} />
                    Tambah Foto
                </button>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {posts.map((post) => (
                    <motion.div
                        key={post.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group aspect-square rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700"
                    >
                        {post.imageUrl ? (
                            <img src={post.imageUrl} alt={post.caption || "Instagram"} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon size={32} className="text-gray-400" />
                            </div>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            <div className="flex items-center gap-4 text-white text-sm">
                                <span className="flex items-center gap-1">
                                    <Heart size={14} className="fill-white" />
                                    {post.likes}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MessageCircle size={14} />
                                    {post.comments}
                                </span>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => openEditModal(post)}
                                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                                >
                                    <Pencil size={16} className="text-white" />
                                </button>
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    className="p-2 bg-white/20 rounded-lg hover:bg-red-500/50 transition-colors"
                                >
                                    <Trash2 size={16} className="text-white" />
                                </button>
                            </div>
                        </div>

                        {!post.active && (
                            <div className="absolute top-2 right-2 px-2 py-1 bg-gray-800/80 text-white text-xs rounded">
                                Inactive
                            </div>
                        )}
                    </motion.div>
                ))}

                {/* Empty slots */}
                {Array.from({ length: Math.max(0, 6 - posts.length) }).map((_, i) => (
                    <div
                        key={`empty-${i}`}
                        className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-pink-400 transition-colors"
                        onClick={openAddModal}
                    >
                        <Plus size={24} className="text-gray-400" />
                    </div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {editingPost ? "Edit Foto" : "Tambah Foto"}
                                </h2>
                                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Foto Instagram
                                    </label>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                                        className="hidden"
                                    />
                                    <div className="flex items-center gap-4">
                                        {formData.imageUrl ? (
                                            <img src={formData.imageUrl} alt="Preview" className="w-24 h-24 rounded-xl object-cover" />
                                        ) : (
                                            <div className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                                <ImageIcon size={32} className="text-gray-400" />
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploading}
                                            className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                                            {uploading ? "Uploading..." : "Upload Foto"}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Caption (Opsional)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.caption}
                                        onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-pink-400 dark:bg-gray-700 dark:border-gray-600"
                                        placeholder="Wedding moments 💕"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Likes
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.likes}
                                            onChange={(e) => setFormData({ ...formData, likes: parseInt(e.target.value) || 0 })}
                                            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-pink-400 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Comments
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.comments}
                                            onChange={(e) => setFormData({ ...formData, comments: parseInt(e.target.value) || 0 })}
                                            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-pink-400 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Order
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-pink-400 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                    </div>
                                    <div className="flex items-center pt-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.active}
                                                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                                className="w-5 h-5 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving || !formData.imageUrl}
                                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium disabled:opacity-50"
                                    >
                                        {saving && <Loader2 className="animate-spin" size={18} />}
                                        {editingPost ? "Simpan" : "Tambah"}
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
