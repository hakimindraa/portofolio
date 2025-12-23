"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, X, Zap, Sparkles, Crown, Star, Award, Check } from "lucide-react";

// Available icons for pricing
const iconOptions = [
    { name: "Zap", icon: Zap },
    { name: "Sparkles", icon: Sparkles },
    { name: "Crown", icon: Crown },
    { name: "Star", icon: Star },
    { name: "Award", icon: Award },
];

// Available gradient colors
const colorOptions = [
    { name: "Gray", value: "from-gray-400 to-gray-500" },
    { name: "Teal to Cyan", value: "from-teal-400 to-cyan-400" },
    { name: "Orange to Pink", value: "from-orange-400 to-pink-500" },
    { name: "Purple to Pink", value: "from-purple-400 to-pink-400" },
    { name: "Blue to Purple", value: "from-blue-400 to-purple-400" },
    { name: "Green to Teal", value: "from-green-400 to-teal-400" },
];

interface PricingPlan {
    id: string;
    name: string;
    price: string;
    period: string;
    description: string;
    icon: string;
    color: string;
    features: string;
    popular: boolean;
    order: number;
    active: boolean;
}

export default function PricingPage() {
    const [plans, setPlans] = useState<PricingPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        period: "per project",
        description: "",
        icon: "Zap",
        color: "from-gray-400 to-gray-500",
        features: "",
        popular: false,
        order: 0,
        active: true,
    });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await fetch("/api/admin/pricing");
            if (res.ok) {
                const data = await res.json();
                setPlans(data);
            }
        } catch (error) {
            console.error("Failed to fetch pricing plans:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = "/api/admin/pricing";
            const method = editingPlan ? "PUT" : "POST";

            // Convert features string to array for storage
            const featuresArray = formData.features.split("\n").filter(f => f.trim());

            const body = editingPlan
                ? { ...formData, id: editingPlan.id, features: featuresArray }
                : { ...formData, features: featuresArray };

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                fetchPlans();
                closeModal();
            }
        } catch (error) {
            console.error("Failed to save pricing plan:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus paket ini?")) return;

        try {
            const res = await fetch(`/api/admin/pricing?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                fetchPlans();
            }
        } catch (error) {
            console.error("Failed to delete pricing plan:", error);
        }
    };

    const openAddModal = () => {
        setEditingPlan(null);
        setFormData({
            name: "",
            price: "",
            period: "per project",
            description: "",
            icon: "Zap",
            color: "from-gray-400 to-gray-500",
            features: "",
            popular: false,
            order: plans.length,
            active: true,
        });
        setShowModal(true);
    };

    const openEditModal = (plan: PricingPlan) => {
        setEditingPlan(plan);
        // Parse features from JSON string to newline-separated string for editing
        let featuresText = "";
        try {
            const featuresArray = JSON.parse(plan.features);
            featuresText = Array.isArray(featuresArray) ? featuresArray.join("\n") : plan.features;
        } catch {
            featuresText = plan.features;
        }
        setFormData({
            name: plan.name,
            price: plan.price,
            period: plan.period,
            description: plan.description,
            icon: plan.icon,
            color: plan.color,
            features: featuresText,
            popular: plan.popular,
            order: plan.order,
            active: plan.active,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingPlan(null);
    };

    const getIconComponent = (iconName: string) => {
        const found = iconOptions.find((i) => i.name === iconName);
        return found ? found.icon : Zap;
    };

    const parseFeatures = (features: string): string[] => {
        try {
            const parsed = JSON.parse(features);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pricing</h1>
                    <p className="text-gray-500">Kelola paket harga untuk layanan Anda</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium"
                >
                    <Plus size={20} />
                    Tambah Paket
                </button>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => {
                    const IconComponent = getIconComponent(plan.icon);
                    const features = parseFeatures(plan.features);
                    return (
                        <motion.div
                            key={plan.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border-2 ${plan.popular ? "border-teal-400" : "border-gray-100 dark:border-gray-700"}`}
                        >
                            {plan.popular && (
                                <div className="bg-gradient-to-r from-teal-400 to-cyan-400 text-white text-center text-sm py-1 font-medium">
                                    Most Popular
                                </div>
                            )}
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl bg-gradient-to-r ${plan.color}`}>
                                        <IconComponent className="text-white" size={24} />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditModal(plan)}
                                            className="p-2 text-gray-400 hover:text-teal-500 transition-colors"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(plan.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{plan.name}</h3>
                                <p className="text-gray-500 text-sm mb-3">{plan.description}</p>
                                <div className="mb-4">
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">Rp {plan.price}</span>
                                    <span className="text-gray-500 text-sm ml-1">/{plan.period}</span>
                                </div>
                                <div className="space-y-2 mb-4">
                                    {features.slice(0, 4).map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Check size={14} className="text-teal-500" />
                                            <span className="truncate">{feature}</span>
                                        </div>
                                    ))}
                                    {features.length > 4 && (
                                        <p className="text-xs text-gray-400">+{features.length - 4} fitur lainnya</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 text-xs rounded-full ${plan.active ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                                        {plan.active ? "Active" : "Inactive"}
                                    </span>
                                    <span className="text-xs text-gray-400">Order: {plan.order}</span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {plans.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    Belum ada paket harga. Klik "Tambah Paket" untuk menambahkan.
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
                                    {editingPlan ? "Edit Paket" : "Tambah Paket"}
                                </h2>
                                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Nama Paket
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400 dark:bg-gray-700 dark:border-gray-600"
                                            placeholder="Basic"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Harga
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400 dark:bg-gray-700 dark:border-gray-600"
                                            placeholder="500K"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Period
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.period}
                                        onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400 dark:bg-gray-700 dark:border-gray-600"
                                        placeholder="per project"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Deskripsi
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400 dark:bg-gray-700 dark:border-gray-600"
                                        placeholder="Cocok untuk kebutuhan foto personal"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Icon
                                    </label>
                                    <div className="flex gap-2">
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
                                        Color
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {colorOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, color: option.value })}
                                                className={`p-2 rounded-xl border-2 transition-all ${formData.color === option.value
                                                    ? "border-teal-500"
                                                    : "border-gray-200 dark:border-gray-600"
                                                    }`}
                                            >
                                                <div className={`h-6 rounded-lg bg-gradient-to-r ${option.value}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Fitur (satu per baris)
                                    </label>
                                    <textarea
                                        value={formData.features}
                                        onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                        rows={5}
                                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400 dark:bg-gray-700 dark:border-gray-600"
                                        placeholder="Durasi foto 2 jam&#10;10 foto edit standar&#10;Delivery 3-5 hari"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
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
                                                checked={formData.popular}
                                                onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                                                className="w-5 h-5 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Popular</span>
                                        </label>
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
                                        {editingPlan ? "Simpan" : "Tambah"}
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
