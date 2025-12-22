"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Edit2,
    Trash2,
    X,
    Star,
    Loader2,
    User,
} from "lucide-react";

interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    rating: number;
    avatar?: string;
}

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        content: "",
        rating: 5,
        avatar: "",
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch("/api/admin/testimonials");
            if (res.ok) setTestimonials(await res.json());
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

            const res = await fetch("/api/admin/testimonials", {
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
        if (!confirm("Yakin ingin menghapus?")) return;
        try {
            await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" });
            setTestimonials(testimonials.filter((t) => t.id !== id));
        } catch (error) {
            console.error("Failed to delete:", error);
        }
    };

    const openModal = (item?: Testimonial) => {
        if (item) {
            setEditingItem(item);
            setFormData({ name: item.name, role: item.role, content: item.content, rating: item.rating, avatar: item.avatar || "" });
        } else {
            setEditingItem(null);
            setFormData({ name: "", role: "", content: "", rating: 5, avatar: "" });
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Testimonials</h1>
                    <p className="text-gray-500">Kelola ulasan klien</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-xl"
                >
                    <Plus size={20} />
                    Tambah
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-teal-500" size={32} />
                </div>
            ) : (
                <div className="grid gap-4">
                    {testimonials.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700"
                        >
                            <div className="flex justify-between">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 flex items-center justify-center">
                                        <User className="text-white" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                                        <p className="text-gray-500 text-sm">{item.role}</p>
                                        <div className="flex gap-1 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    className={i < item.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openModal(item)} className="p-2 hover:bg-gray-100 rounded-lg">
                                        <Edit2 size={18} className="text-gray-500" />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-50 rounded-lg">
                                        <Trash2 size={18} className="text-red-500" />
                                    </button>
                                </div>
                            </div>
                            <p className="mt-4 text-gray-600 dark:text-gray-300 italic">"{item.content}"</p>
                        </div>
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
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md"
                        >
                            <div className="flex justify-between mb-6">
                                <h2 className="text-xl font-semibold">{editingItem ? "Edit" : "Tambah"} Testimonial</h2>
                                <button onClick={closeModal}><X size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Nama"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-xl"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Pekerjaan/Role"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-xl"
                                    required
                                />
                                <textarea
                                    placeholder="Testimoni"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-xl"
                                    rows={4}
                                    required
                                />
                                <div>
                                    <label className="block text-sm mb-1">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((r) => (
                                            <button
                                                key={r}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, rating: r })}
                                            >
                                                <Star
                                                    size={24}
                                                    className={r <= formData.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

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
