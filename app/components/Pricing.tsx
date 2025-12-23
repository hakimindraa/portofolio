"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Crown, Zap, Star, Award, LucideIcon } from "lucide-react";
import { useState, useEffect } from "react";

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
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
    Zap,
    Sparkles,
    Crown,
    Star,
    Award,
};

// Default plans (fallback if database is empty)
const defaultPlans: PricingPlan[] = [
    {
        id: "1",
        name: "Basic",
        price: "500K",
        period: "per project",
        description: "Cocok untuk kebutuhan foto personal atau event kecil",
        icon: "Zap",
        color: "from-gray-400 to-gray-500",
        features: JSON.stringify([
            "Durasi foto 2 jam",
            "10 foto edit standar",
            "Delivery 3-5 hari",
            "1x revisi minor",
            "File JPEG resolusi tinggi",
        ]),
        popular: false,
    },
    {
        id: "2",
        name: "Professional",
        price: "1.5JT",
        period: "per project",
        description: "Ideal untuk pre-wedding, portrait, atau brand photography",
        icon: "Sparkles",
        color: "from-teal-400 to-cyan-400",
        features: JSON.stringify([
            "Durasi foto 4 jam",
            "30 foto edit premium",
            "Delivery 5-7 hari",
            "3x revisi",
            "File JPEG + RAW",
            "Konsultasi konsep",
            "1 lokasi outdoor",
        ]),
        popular: true,
    },
    {
        id: "3",
        name: "Premium",
        price: "3JT",
        period: "per project",
        description: "Paket lengkap untuk wedding atau corporate event",
        icon: "Crown",
        color: "from-orange-400 to-pink-500",
        features: JSON.stringify([
            "Full day coverage (8 jam)",
            "100+ foto edit premium",
            "Delivery 7-10 hari",
            "Unlimited revisi",
            "File JPEG + RAW + TIFF",
            "2 fotografer",
            "Album foto eksklusif",
            "Video highlight 3 menit",
        ]),
        popular: false,
    },
];

export default function Pricing() {
    const [plans, setPlans] = useState<PricingPlan[]>(defaultPlans);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        async function fetchPlans() {
            try {
                const res = await fetch("/api/pricing");
                if (res.ok) {
                    const data = await res.json();
                    if (data.length > 0) {
                        setPlans(data);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch pricing plans:", error);
            } finally {
                setIsLoaded(true);
            }
        }
        fetchPlans();
    }, []);

    const parseFeatures = (features: string): string[] => {
        try {
            const parsed = JSON.parse(features);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    return (
        <section id="pricing" className="relative overflow-hidden py-24 px-6 bg-[var(--bg)]">
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-teal-400/10 to-cyan-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-to-r from-orange-400/10 to-pink-400/10 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 rounded-full text-teal-500 dark:text-teal-400 text-sm font-medium mb-4">
                        Pricing
                    </span>
                    <h2 className="text-4xl md:text-5xl font-light mb-4 text-[var(--text)]">
                        Transparent <span className="font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Pricing</span>
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-teal-400 to-cyan-400 mx-auto rounded-full mb-6" />
                    <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-lg">
                        Pilih paket yang sesuai dengan kebutuhan Anda. Semua paket termasuk hasil berkualitas profesional.
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => {
                        const Icon = iconMap[plan.icon] || Zap;
                        const features = parseFeatures(plan.features);
                        return (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={`relative group ${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
                            >
                                {/* Popular Badge */}
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                                        <span className="px-4 py-1 bg-gradient-to-r from-teal-400 to-cyan-400 text-white text-sm font-medium rounded-full shadow-lg">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div
                                    className={`h-full bg-[var(--card-bg)] rounded-3xl border-2 transition-all duration-300 hover:-translate-y-2 ${plan.popular
                                        ? "border-teal-400 shadow-xl shadow-teal-500/20"
                                        : "border-[var(--card-border)] hover:border-teal-400/50"
                                        }`}
                                >
                                    <div className="p-8">
                                        {/* Icon */}
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center mb-6`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>

                                        {/* Plan Name */}
                                        <h3 className="text-2xl font-bold text-[var(--text)] mb-2">{plan.name}</h3>
                                        <p className="text-[var(--text-muted)] text-sm mb-6">{plan.description}</p>

                                        {/* Price */}
                                        <div className="mb-8">
                                            <span className="text-4xl font-bold text-[var(--text)]">Rp {plan.price}</span>
                                            <span className="text-[var(--text-muted)] ml-2">/{plan.period}</span>
                                        </div>

                                        {/* Features */}
                                        <ul className="space-y-4 mb-8">
                                            {features.map((feature, i) => (
                                                <li key={i} className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center flex-shrink-0`}>
                                                        <Check className="w-3 h-3 text-white" />
                                                    </div>
                                                    <span className="text-[var(--text-muted)]">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* CTA Button */}
                                        <motion.a
                                            href="#contact"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`block w-full py-4 rounded-full text-center font-semibold transition-all duration-300 ${plan.popular
                                                ? "bg-gradient-to-r from-teal-400 to-cyan-400 text-white shadow-lg hover:shadow-teal-500/30"
                                                : "bg-[var(--bg-secondary)] text-[var(--text)] hover:bg-gradient-to-r hover:from-teal-400 hover:to-cyan-400 hover:text-white"
                                                }`}
                                        >
                                            Get Started
                                        </motion.a>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="text-center text-[var(--text-muted)] mt-12"
                >
                    * Harga dapat disesuaikan berdasarkan kebutuhan spesifik proyek Anda. {" "}
                    <a href="#contact" className="text-teal-500 hover:text-teal-400 font-medium">
                        Hubungi saya
                    </a>{" "}
                    untuk penawaran khusus.
                </motion.p>
            </div>
        </section>
    );
}
