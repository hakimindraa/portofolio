"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Edit2,
    Trash2,
    X,
    Upload,
    Search,
    Loader2,
    Image as ImageIcon,
} from "lucide-react";

interface Photo {
    id: string;
    title: string;
    category: string;
    imageUrl: string;
    featured: boolean;
    order: number;
}

const categories = ["Portrait", "Wedding", "Nature", "Street", "Product", "Event"];

export default function GalleryPage() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        category: "Portrait",
        imageUrl: "",
        featured: false,
    });
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        try {
            const res = await fetch("/api/admin/photos");
            if (res.ok) {
                const data = await res.json();
                setPhotos(data);
            }
        } catch (error) {
            console.error("Failed to fetch photos:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPhotos = photos.filter((photo) => {
        const matchesSearch = photo.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || photo.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Handle file upload
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => setPreviewUrl(e.target?.result as string);
        reader.readAsDataURL(file);

        // Upload to Cloudinary
        setUploading(true);
        try {
            // Delete old image when editing
            if (editingPhoto && editingPhoto.imageUrl && editingPhoto.imageUrl.includes("cloudinary")) {
                await fetch(`/api/admin/delete-image?url=${encodeURIComponent(editingPhoto.imageUrl)}`, {
                    method: "DELETE",
                });
            }

            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setFormData((prev) => ({ ...prev, imageUrl: data.url }));
            } else {
                alert("Gagal upload gambar");
                setPreviewUrl(null);
            }
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Gagal upload gambar");
            setPreviewUrl(null);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.imageUrl) {
            alert("Silakan upload gambar terlebih dahulu");
            return;
        }

        setSaving(true);
        try {
            const url = "/api/admin/photos";
            const method = editingPhoto ? "PUT" : "POST";
            const body = editingPhoto ? { id: editingPhoto.id, ...formData } : formData;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                await fetchPhotos();
                closeModal();
            }
        } catch (error) {
            console.error("Failed to save photo:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus foto ini?")) return;

        try {
            // Find the photo to delete its image from Cloudinary
            const photoToDelete = photos.find((p) => p.id === id);
            if (photoToDelete?.imageUrl && photoToDelete.imageUrl.includes("cloudinary")) {
                await fetch(`/api/admin/delete-image?url=${encodeURIComponent(photoToDelete.imageUrl)}`, {
                    method: "DELETE",
                });
            }

            const res = await fetch(`/api/admin/photos?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setPhotos(photos.filter((p) => p.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete photo:", error);
        }
    };

    const openModal = (photo?: Photo) => {
        if (photo) {
            setEditingPhoto(photo);
            setFormData({
                title: photo.title,
                category: photo.category,
                imageUrl: photo.imageUrl,
                featured: photo.featured,
            });
            setPreviewUrl(photo.imageUrl);
        } else {
            setEditingPhoto(null);
            setFormData({ title: "", category: "Portrait", imageUrl: "", featured: false });
            setPreviewUrl(null);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPhoto(null);
        setFormData({ title: "", category: "Portrait", imageUrl: "", featured: false });
        setPreviewUrl(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gallery</h1>
                    <p className="text-gray-500 dark:text-gray-400">Kelola foto portfolio</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all"
                >
                    <Plus size={20} />
                    Tambah Foto
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Cari foto..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-teal-400"
                    />
                </div>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-teal-400"
                >
                    <option value="all">Semua Kategori</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* Photo Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin text-teal-500" size={32} />
                </div>
            ) : filteredPhotos.length === 0 ? (
                <div className="text-center py-12">
                    <ImageIcon className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
                    <p className="text-gray-500 dark:text-gray-400">Belum ada foto</p>
                    <button
                        onClick={() => openModal()}
                        className="mt-4 text-teal-500 hover:text-teal-600 font-medium"
                    >
                        Tambah foto pertama
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredPhotos.map((photo) => (
                        <motion.div
                            key={photo.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden"
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${photo.imageUrl})` }}
                            />
                            {!photo.imageUrl && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <ImageIcon className="text-gray-300" size={40} />
                                </div>
                            )}

                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    onClick={() => openModal(photo)}
                                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <Edit2 size={18} className="text-gray-700" />
                                </button>
                                <button
                                    onClick={() => handleDelete(photo.id)}
                                    className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                                >
                                    <Trash2 size={18} className="text-white" />
                                </button>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-white text-sm font-medium truncate">{photo.title}</p>
                                <p className="text-gray-300 text-xs">{photo.category}</p>
                            </div>

                            {photo.featured && (
                                <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                                    Featured
                                </div>
                            )}
                        </motion.div>
                    ))}
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
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {editingPhoto ? "Edit Foto" : "Tambah Foto"}
                                </h2>
                                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Gambar
                                    </label>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />

                                    {previewUrl ? (
                                        <div className="relative">
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="w-full h-48 object-cover rounded-xl"
                                            />
                                            {uploading && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                                                    <Loader2 className="animate-spin text-white" size={32} />
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="absolute bottom-2 right-2 bg-white px-3 py-1 rounded-lg text-sm font-medium shadow"
                                            >
                                                Ganti Gambar
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-teal-400 transition-colors"
                                        >
                                            <Upload size={32} className="text-gray-400" />
                                            <span className="text-gray-500 text-sm">Klik untuk upload gambar</span>
                                            <span className="text-gray-400 text-xs">JPG, PNG, WebP</span>
                                        </button>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Judul
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:border-teal-400"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Kategori
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:outline-none focus:border-teal-400"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="featured"
                                        checked={formData.featured}
                                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                        className="rounded text-teal-500 focus:ring-teal-500"
                                    />
                                    <label htmlFor="featured" className="text-sm text-gray-700 dark:text-gray-300">
                                        Tampilkan sebagai Featured
                                    </label>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving || uploading || !formData.imageUrl}
                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {saving && <Loader2 className="animate-spin" size={18} />}
                                        {editingPhoto ? "Simpan" : "Tambah"}
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
