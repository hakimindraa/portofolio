"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, X, MessageSquare, Camera, Palette, Send, CheckCircle, Zap, Star, Heart, Target, Award, Sparkles } from "lucide-react";

// Available icons for work steps
const iconOptions = [
    { name: "MessageSquare", icon: MessageSquare },
    { name: "Camera", icon: Camera },
    { name: "Palette", icon: Palette },
    { name: "Send", icon: Send },
    { name: "CheckCircle", icon: CheckCircle },
    { name: "Zap", icon: Zap },
    { name: "Star", icon: Star },
    { name: "Heart", icon: Heart },
    { name: "Target", icon: Target },
    { name: "Award", icon: Award },
    { name: "Sparkles", icon: Sparkles },
];

// Available gradient colors
const colorOptions = [
    { name: "Teal to Cyan", value: "from-teal-400 to-cyan-400" },
    { name: "Cyan to Blue", value: "from-cyan-400 to-blue-400" },
    { name: "Blue to Purple", value: "from-blue-400 to-purple-400" },
    { name: "Purple to Pink", value: "from-purple-400 to-pink-400" },
    { name: "Pink to Orange", value: "from-pink-400 to-orange-400" },
    { name: "Orange to Yellow", value: "from-orange-400 to-yellow-400" },
    { name: "Green to Teal", value: "from-green-400 to-teal-400" },
];

interface WorkStep {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    order: number;
    active: boolean;
}

export default function WorkProcessPage() {
    const [steps, setSteps] = useState<WorkStep[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingStep, setEditingStep] = useState<WorkStep | null>(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        icon: "MessageSquare",
        color: "from-teal-400 to-cyan-400",
        order: 0,
        active: true,
    });

    useEffect(() => {
        fetchSteps();
    }, []);

    const fetchSteps = async () => {
        try {
            const res = await fetch("/api/admin/work-steps");
            if (res.ok) {
                const data = await res.json();
                setSteps(data);
            }
        } catch (error) {
            console.error("Failed to fetch work steps:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = "/api/admin/work-steps";
            const method = editingStep ? "PUT" : "POST";
            const body = editingStep
                ? { ...formData, id: editingStep.id }
                : formData;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                fetchSteps();
                closeModal();
            }
        } catch (error) {
            console.error("Failed to save work step:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus step ini?")) return;

        try {
            const res = await fetch(`/api/admin/work-steps?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                fetchSteps();
            }
        } catch (error) {
            console.error("Failed to delete work step:", error);
        }
    };

    const openAddModal = () => {
        setEditingStep(null);
        setFormData({
            title: "",
            description: "",
            icon: "MessageSquare",
            color: "from-teal-400 to-cyan-400",
            order: steps.length + 1,
            active: true,
        });
        setShowModal(true);
    };

    const openEditModal = (step: WorkStep) => {
        setEditingStep(step);
        setFormData({
            title: step.title,
            description: step.description,
            icon: step.icon,
            color: step.color,
            order: step.order,
            active: step.active,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingStep(null);
    };

    const getIconComponent = (iconName: string) => {
        const found = iconOptions.find((i) => i.name === iconName);
        return found ? found.icon : MessageSquare;
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">How I Work</h1>
                    <p className="text-gray-500">Kelola langkah-langkah proses kerja</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium"
                >
                    <Plus size={20} />
                    Tambah Step
                </button>
            </div>

            {/* Steps List */}
            <div className="space-y-4">
                {steps.map((step, index) => {
                    const IconComponent = getIconComponent(step.icon);
                    return (
                        <motion.div
                            key={step.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 flex items-center gap-6"
                        >
                            <div className={`p-4 rounded-xl bg-gradient-to-r ${step.color} flex-shrink-0`}>
                                <IconComponent className="text-white" size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className={`text-2xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                                        0{index + 1}
                                    </span>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {step.title}
                                    </h3>
                                </div>
                                <p className="text-gray-500 text-sm line-clamp-2">
                                    {step.description}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span className={`px-2 py-1 text-xs rounded-full ${step.active ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                                    {step.active ? "Active" : "Inactive"}
                                </span>
                                <button
                                    onClick={() => openEditModal(step)}
                                    className="p-2 text-gray-400 hover:text-teal-500 transition-colors"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(step.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {steps.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    Belum ada work steps. Klik "Tambah Step" untuk menambahkan.
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
                                    {editingStep ? "Edit Step" : "Tambah Step"}
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
                                        placeholder="Contoh: Konsultasi"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400 dark:bg-gray-700 dark:border-gray-600"
                                        placeholder="Jelaskan langkah ini..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Icon
                                    </label>
                                    <div className="grid grid-cols-6 gap-2">
                                        {iconOptions.map((option) => {
                                            const IconComp = option.icon;
                                            return (
                                                <button
                                                    key={option.name}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, icon: option.name })}
                                                    className={`p-3 rounded-xl border-2 transition-all ${formData.icon === option.name
                                                        ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                                                        : "border-gray-200 dark:border-gray-600 hover:border-teal-300"
                                                        }`}
                                                >
                                                    <IconComp size={20} className={formData.icon === option.name ? "text-teal-500" : "text-gray-500"} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Color Gradient
                                    </label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {colorOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, color: option.value })}
                                                className={`p-3 rounded-xl border-2 transition-all ${formData.color === option.value
                                                    ? "border-teal-500"
                                                    : "border-gray-200 dark:border-gray-600"
                                                    }`}
                                            >
                                                <div className={`h-6 rounded-lg bg-gradient-to-r ${option.value}`} />
                                            </button>
                                        ))}
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
                                        disabled={saving}
                                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium disabled:opacity-50"
                                    >
                                        {saving && <Loader2 className="animate-spin" size={18} />}
                                        {editingStep ? "Simpan" : "Tambah"}
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
