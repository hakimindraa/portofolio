"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Save, Loader2, User, Link as LinkIcon, Phone, Mail, MapPin, Upload, Home, BarChart3 } from "lucide-react";

interface Settings {
    // Profile
    name: string;
    title: string;
    bio: string;
    location: string;
    profileImage: string;
    // Hero content
    heroTagline: string;
    heroDescription: string;
    // Stats
    statsYears: string;
    statsProjects: string;
    statsClients: string;
    // Contact
    email: string;
    phone: string;
    whatsapp: string;
    // Social
    instagram: string;
    github: string;
    linkedin: string;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<Settings>({
        name: "Hakim",
        title: "Photo Editor",
        bio: "",
        location: "Tanjungpinang",
        profileImage: "",
        heroTagline: "Photo Editing",
        heroDescription: "Mengubah momen biasa menjadi karya seni yang memukau. Dengan pengalaman lebih dari 5 tahun dalam fotografi dan editing profesional.",
        statsYears: "5",
        statsProjects: "200",
        statsClients: "50",
        email: "",
        phone: "",
        whatsapp: "",
        instagram: "",
        github: "",
        linkedin: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/admin/settings");
            if (res.ok) {
                const data = await res.json();
                const settingsObj: Record<string, string> = {};
                data.forEach((s: { key: string; value: string }) => {
                    settingsObj[s.key] = s.value;
                });
                setSettings((prev) => ({ ...prev, ...settingsObj }));
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setSettings((prev) => ({ ...prev, profileImage: data.url }));
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
            const res = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (error) {
            console.error("Failed to save settings:", error);
        } finally {
            setSaving(false);
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
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-500">Kelola informasi profil dan konten website</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Hero Content Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Home size={20} className="text-teal-500" />
                        Hero Content
                    </h2>
                    <div className="grid gap-4">
                        {/* Profile Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Foto Profil
                            </label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            <div className="flex items-center gap-4">
                                {settings.profileImage ? (
                                    <img
                                        src={settings.profileImage}
                                        alt="Profile"
                                        className="w-24 h-24 rounded-xl object-cover"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                        <User size={32} className="text-gray-400" />
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

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Nama
                                </label>
                                <input
                                    type="text"
                                    value={settings.name}
                                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400"
                                    placeholder="Hakim"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Tagline/Title
                                </label>
                                <input
                                    type="text"
                                    value={settings.heroTagline}
                                    onChange={(e) => setSettings({ ...settings, heroTagline: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400"
                                    placeholder="Photo Editing"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Lokasi
                            </label>
                            <input
                                type="text"
                                value={settings.location}
                                onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400"
                                placeholder="Tanjungpinang"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Deskripsi Hero
                            </label>
                            <textarea
                                value={settings.heroDescription}
                                onChange={(e) => setSettings({ ...settings, heroDescription: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400"
                                placeholder="Deskripsi singkat tentang kamu..."
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <BarChart3 size={20} className="text-teal-500" />
                        Statistik
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Tahun Pengalaman
                            </label>
                            <input
                                type="text"
                                value={settings.statsYears}
                                onChange={(e) => setSettings({ ...settings, statsYears: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400"
                                placeholder="5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Total Projects
                            </label>
                            <input
                                type="text"
                                value={settings.statsProjects}
                                onChange={(e) => setSettings({ ...settings, statsProjects: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400"
                                placeholder="200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Total Clients
                            </label>
                            <input
                                type="text"
                                value={settings.statsClients}
                                onChange={(e) => setSettings({ ...settings, statsClients: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400"
                                placeholder="50"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Phone size={20} className="text-teal-500" />
                        Kontak
                    </h2>
                    <div className="grid gap-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        value={settings.email}
                                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    WhatsApp
                                </label>
                                <input
                                    type="text"
                                    value={settings.whatsapp}
                                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400"
                                    placeholder="628xxx (tanpa +)"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Links Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <LinkIcon size={20} className="text-teal-500" />
                        Social Media
                    </h2>
                    <div className="grid gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Instagram Username
                            </label>
                            <input
                                type="text"
                                value={settings.instagram}
                                onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400"
                                placeholder="@username"
                            />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {saved ? "Tersimpan!" : "Simpan Perubahan"}
                    </button>
                </div>
            </form>
        </div>
    );
}
