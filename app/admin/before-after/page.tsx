"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, X, Upload, Image as ImageIcon } from "lucide-react";

interface BeforeAfterItem {
    id: string;
    title: string;
    beforeImage: string;
    afterImage: string;
    order: number;
    active: boolean;
}

export default function BeforeAfterPage() {
    const [items, setItems] = useState<BeforeAfterItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<BeforeAfterItem | null>(null);
    const [saving, setSaving] = useState(false);
    const [uploadingBefore, setUploadingBefore] = useState(false);
    const [uploadingAfter, setUploadingAfter] = useState(false);
    const beforeInputRef = useRef<HTMLInputElement>(null);
    const afterInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        title: "",
        beforeImage: "",
        afterImage: "",
        order: 0,
        active: true,
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await fetch("/api/admin/before-after");
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (error) {
            console.error("Failed to fetch before/after items:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (file: File, type: "before" | "after") => {
        if (type === "before") setUploadingBefore(true);
        else setUploadingAfter(true);

        try {
            const formDataUpload = new FormData();
            formDataUpload.append("file", file);

            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formDataUpload,
            });

            if (res.ok) {
                const data = await res.json();
                if (type === "before") {
                    setFormData((prev) => ({ ...prev, beforeImage: data.url }));
                } else {
                    setFormData((prev) => ({ ...prev, afterImage: data.url }));
                }
            }
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            if (type === "before") setUploadingBefore(false);
            else setUploadingAfter(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = "/api/admin/before-after";
            const method = editingItem ? "PUT" : "POST";
            const body = editingItem
                ? { ...formData, id: editingItem.id }
                : formData;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                fetchItems();
                closeModal();
            }
        } catch (error) {
            console.error("Failed to save before/after item:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus item ini?")) return;

        try {
            const res = await fetch(`/api/admin/before-after?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                fetchItems();
            }
        } catch (error) {
            console.error("Failed to delete before/after item:", error);
        }
    };

    const openAddModal = () => {
        setEditingItem(null);
        setFormData({
            title: "",
            beforeImage: "",
            afterImage: "",
            order: items.length,
            active: true,
        });
        setShowModal(true);
    };

    const openEditModal = (item: BeforeAfterItem) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            beforeImage: item.beforeImage,
            afterImage: item.afterImage,
            order: item.order,
            active: item.active,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Before & After</h1>
                    <p className="text-gray-500">Kelola gambar perbandingan sebelum dan sesudah editing</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium"
                >
                    <Plus size={20} />
                    Tambah Item
                </button>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                    <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
                    >
                        {/* Image Preview */}
                        <div className="relative aspect-video bg-gray-100 dark:bg-gray-700">
                            <div className="absolute inset-0 grid grid-cols-2">
                                <div className="relative border-r border-white/50">
                                    {item.beforeImage ? (
                                        <img src={item.beforeImage} alt="Before" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <ImageIcon size={32} />
                                        </div>
                                    )}
                                    <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">Before</span>
                                </div>
                                <div className="relative">
                                    {item.afterImage ? (
                                        <img src={item.afterImage} alt="After" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <ImageIcon size={32} />
                                        </div>
                                    )}
                                    <span className="absolute bottom-2 right-2 px-2 py-1 bg-teal-500 text-white text-xs rounded">After</span>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {item.title}
                                </h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEditModal(item)}
                                        className="p-2 text-gray-400 hover:text-teal-500 transition-colors"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                                <span className={`px-2 py-1 text-xs rounded-full ${item.active ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                                    {item.active ? "Active" : "Inactive"}
                                </span>
                                <span className="text-xs text-gray-400">Order: {item.order}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {items.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    Belum ada item. Klik "Tambah Item" untuk menambahkan.
                </div>
            )}

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
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {editingItem ? "Edit Item" : "Tambah Item"}
                                </h2>
                                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400 dark:bg-gray-700 dark:border-gray-600"
                                        placeholder="Contoh: Portrait Retouching"
                                        required
                                    />
                                </div>

                                {/* Before Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Before Image
                                    </label>
                                    <input
                                        ref={beforeInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "before")}
                                        className="hidden"
                                    />
                                    <div className="flex items-center gap-4">
                                        {formData.beforeImage ? (
                                            <img src={formData.beforeImage} alt="Before" className="w-24 h-24 rounded-xl object-cover" />
                                        ) : (
                                            <div className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                                <ImageIcon size={32} className="text-gray-400" />
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => beforeInputRef.current?.click()}
                                            disabled={uploadingBefore}
                                            className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            {uploadingBefore ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                                            {uploadingBefore ? "Uploading..." : "Upload Before"}
                                        </button>
                                    </div>
                                </div>

                                {/* After Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        After Image
                                    </label>
                                    <input
                                        ref={afterInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "after")}
                                        className="hidden"
                                    />
                                    <div className="flex items-center gap-4">
                                        {formData.afterImage ? (
                                            <img src={formData.afterImage} alt="After" className="w-24 h-24 rounded-xl object-cover" />
                                        ) : (
                                            <div className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                                <ImageIcon size={32} className="text-gray-400" />
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => afterInputRef.current?.click()}
                                            disabled={uploadingAfter}
                                            className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            {uploadingAfter ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                                            {uploadingAfter ? "Uploading..." : "Upload After"}
                                        </button>
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
                                            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                    </div>
                                    <div className="flex items-center pt-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.active}
                                                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                                className="w-5 h-5 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
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
                                        disabled={saving || !formData.beforeImage || !formData.afterImage}
                                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium disabled:opacity-50"
                                    >
                                        {saving && <Loader2 className="animate-spin" size={18} />}
                                        {editingItem ? "Simpan" : "Tambah"}
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
