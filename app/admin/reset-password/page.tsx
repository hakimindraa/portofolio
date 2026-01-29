"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Mail, Lock, ArrowLeft, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [resetKey, setResetKey] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate passwords match
        if (newPassword !== confirmPassword) {
            setError("Password baru dan konfirmasi password tidak sama");
            return;
        }

        // Validate password length
        if (newPassword.length < 6) {
            setError("Password minimal 6 karakter");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/admin/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, resetKey, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Gagal reset password");
                return;
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/admin/login");
            }, 2000);
        } catch (err) {
            setError("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#153448] via-[#1a3a4f] to-[#0d2330] p-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md text-center border border-white/20">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Password Berhasil Diubah!</h2>
                    <p className="text-white/70 mb-4">Mengalihkan ke halaman login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#153448] via-[#1a3a4f] to-[#0d2330] p-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border border-white/20">
                {/* Back Button */}
                <Link
                    href="/admin/login"
                    className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={18} />
                    Kembali ke Login
                </Link>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <KeyRound className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
                    <p className="text-white/70 text-sm">
                        Masukkan email, reset key, dan password baru Anda
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-6">
                        <p className="text-red-300 text-sm text-center">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                            Email Admin
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-11 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/50 transition-all"
                            />
                        </div>
                    </div>

                    {/* Reset Key */}
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                            Reset Key
                        </label>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type="password"
                                value={resetKey}
                                onChange={(e) => setResetKey(e.target.value)}
                                placeholder="Masukkan reset key"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-11 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/50 transition-all"
                            />
                        </div>
                        <p className="text-white/20 text-xs mt-1 blur-[2px] hover:blur-none transition-all duration-300 cursor-pointer select-none" title="Hover untuk melihat hint">
                            Reset Key : RESETPASSWORD
                        </p>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                            Password Baru
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Minimal 6 karakter"
                                required
                                minLength={6}
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-11 pr-11 text-white placeholder:text-white/30 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/50 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                            Konfirmasi Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Ulangi password baru"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-11 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/50 transition-all"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-teal-400 to-cyan-400 text-white py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            "Reset Password"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
