"use client";

import { useState, useEffect, useRef } from "react";
import { Save, Loader2, User, Link as LinkIcon, Phone, Mail, Upload, Home, BarChart3, FileText, Sparkles } from "lucide-react";

interface Settings {
    // Profile
    name: string;
    title: string;
    location: string;
    profileImage: string;
    // Hero content
    heroTagline: string;
    heroDescription: string;
    // About content
    aboutParagraph1: string;
    aboutParagraph2: string;
    cvUrl: string;
    // Stats (shared between Hero mini stats and About)
    statsYears: string;
    statsProjects: string;
    statsClients: string;
    statsAwards: string;
    // Skills
    skill1Name: string;
    skill1Level: string;
    skill2Name: string;
    skill2Level: string;
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
        location: "Tanjungpinang",
        profileImage: "",
        heroTagline: "Photo Editing",
        heroDescription: "Mengubah momen biasa menjadi karya seni yang memukau. Dengan pengalaman lebih dari 5 tahun dalam fotografi dan editing profesional.",
        aboutParagraph1: "Saya adalah seorang photo editor dan fotografer profesional yang berbasis di Tanjungpinang. Dengan pengalaman lebih dari 5 tahun dalam industri kreatif, saya telah membantu banyak klien mewujudkan visi visual mereka.",
        aboutParagraph2: "Saya percaya bahwa setiap foto memiliki cerita. Tugas saya adalah membantu cerita tersebut bersinar melalui editing yang berkualitas dan perhatian pada detail terkecil.",
        cvUrl: "",
        statsYears: "5",
        statsProjects: "200",
        statsClients: "50",
        statsAwards: "10",
        skill1Name: "Photography",
        skill1Level: "95",
        skill2Name: "Photo Editing",
        skill2Level: "90",
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
            // Delete old image from Cloudinary if exists
            if (settings.profileImage && settings.profileImage.includes("cloudinary")) {
                await fetch(`/api/admin/delete-image?url=${encodeURIComponent(settings.profileImage)}`, {
                    method: "DELETE",
                });
            }

            // Upload new image
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
                                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400 dark:bg-gray-700 dark:border-gray-600"
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
                                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400 dark:bg-gray-700 dark:border-gray-600"
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
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400 dark:bg-gray-700 dark:border-gray-600"
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
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400 dark:bg-gray-700 dark:border-gray-600"
                                placeholder="Deskripsi singkat tentang kamu..."
                            />
                        </div>
                    </div>
                </div>

                {/* About Content Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <FileText size={20} className="text-teal-500" />
                        About Content
                    </h2>
                    <div className="grid gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Paragraf 1 (Intro)
                            </label>
                            <textarea
                                value={settings.aboutParagraph1}
                                onChange={(e) => setSettings({ ...settings, aboutParagraph1: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400 dark:bg-gray-700 dark:border-gray-600"
                                placeholder="Saya adalah seorang photo editor..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Paragraf 2 (Philosophy)
                            </label>
                            <textarea
                                value={settings.aboutParagraph2}
                                onChange={(e) => setSettings({ ...settings, aboutParagraph2: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400 dark:bg-gray-700 dark:border-gray-600"
                                placeholder="Saya percaya bahwa setiap foto memiliki cerita..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Link CV (URL)
                            </label>
                            <input
                                type="text"
                                value={settings.cvUrl}
                                onChange={(e) => setSettings({ ...settings, cvUrl: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400 dark:bg-gray-700 dark:border-gray-600"
                                placeholder="https://drive.google.com/..."
                            />
                            <p className="text-xs text-gray-400 mt-1">Upload CV ke Google Drive lalu paste link-nya disini</p>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <BarChart3 size={20} className="text-teal-500" />
                        Statistik (Hero + About)
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">Statistik ini akan tampil di Hero dan About section</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Years Experience
                            </label>
                            <input
                                type="number"
                                value={settings.statsYears}
                                onChange={(e) => setSettings({ ...settings, statsYears: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400 dark:bg-gray-700 dark:border-gray-600"
                                placeholder="5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Projects Completed
                            </label>
                            <input
                                type="number"
                                value={settings.statsProjects}
                                onChange={(e) => setSettings({ ...settings, statsProjects: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400 dark:bg-gray-700 dark:border-gray-600"
                                placeholder="200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Happy Clients
                            </label>
                            <input
                                type="number"
                                value={settings.statsClients}
                                onChange={(e) => setSettings({ ...settings, statsClients: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400 dark:bg-gray-700 dark:border-gray-600"
                                placeholder="50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Awards Won
                            </label>
                            <input
                                type="number"
                                value={settings.statsAwards}
                                onChange={(e) => setSettings({ ...settings, statsAwards: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400 dark:bg-gray-700 dark:border-gray-600"
                                placeholder="10"
                            />
                        </div>
                    </div>
                </div>

                {/* Skills Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Sparkles size={20} className="text-teal-500" />
                        Skills & Expertise
                    </h2>
                    <div className="grid gap-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Skill 1 - Nama
                                </label>
                                <input
                                    type="text"
                                    value={settings.skill1Name}
                                    onChange={(e) => setSettings({ ...settings, skill1Name: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400 dark:bg-gray-700 dark:border-gray-600"
                                    placeholder="Photography"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Skill 1 - Level (%)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={settings.skill1Level}
                                    onChange={(e) => setSettings({ ...settings, skill1Level: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400 dark:bg-gray-700 dark:border-gray-600"
                                    placeholder="95"
                                />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Skill 2 - Nama
                                </label>
                                <input
                                    type="text"
                                    value={settings.skill2Name}
                                    onChange={(e) => setSettings({ ...settings, skill2Name: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400 dark:bg-gray-700 dark:border-gray-600"
                                    placeholder="Photo Editing"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Skill 2 - Level (%)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={settings.skill2Level}
                                    onChange={(e) => setSettings({ ...settings, skill2Level: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400 dark:bg-gray-700 dark:border-gray-600"
                                    placeholder="90"
                                />
                            </div>
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
                                        className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400 dark:bg-gray-700 dark:border-gray-600"
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
                                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400 dark:bg-gray-700 dark:border-gray-600"
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
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Instagram Username
                            </label>
                            <input
                                type="text"
                                value={settings.instagram}
                                onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400 dark:bg-gray-700 dark:border-gray-600"
                                placeholder="hakimlesmna"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                GitHub URL
                            </label>
                            <input
                                type="url"
                                value={settings.github}
                                onChange={(e) => setSettings({ ...settings, github: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400 dark:bg-gray-700 dark:border-gray-600"
                                placeholder="https://github.com/username"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                LinkedIn URL
                            </label>
                            <input
                                type="url"
                                value={settings.linkedin}
                                onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:border-teal-400 dark:bg-gray-700 dark:border-gray-600"
                                placeholder="https://linkedin.com/in/username"
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
