"use client";

import { motion } from "framer-motion";
import { MessageSquare, Camera, Palette, Send, CheckCircle } from "lucide-react";

const steps = [
    {
        id: 1,
        icon: MessageSquare,
        title: "Konsultasi",
        description: "Diskusi kebutuhan dan visi proyek Anda. Saya akan mendengarkan dengan seksama untuk memahami ekspektasi Anda.",
        color: "from-teal-400 to-cyan-400",
    },
    {
        id: 2,
        icon: Camera,
        title: "Eksekusi",
        description: "Proses pengambilan foto atau pengerjaan desain dengan standar profesional dan perhatian pada detail.",
        color: "from-cyan-400 to-blue-400",
    },
    {
        id: 3,
        icon: Palette,
        title: "Editing",
        description: "Post-processing dan retouching berkualitas tinggi untuk menghasilkan karya yang memukau.",
        color: "from-blue-400 to-purple-400",
    },
    {
        id: 4,
        icon: Send,
        title: "Review",
        description: "Presentasi hasil untuk review. Revisi hingga Anda puas dengan hasil akhir.",
        color: "from-purple-400 to-pink-400",
    },
    {
        id: 5,
        icon: CheckCircle,
        title: "Delivery",
        description: "Pengiriman file final dalam berbagai format sesuai kebutuhan Anda.",
        color: "from-pink-400 to-orange-400",
    },
];

export default function WorkProcess() {
    return (
        <section id="process" className="relative overflow-hidden py-24 px-6 bg-[#153448]">
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-400/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-teal-400 text-sm font-medium mb-4">
                        Work Process
                    </span>
                    <h2 className="text-4xl md:text-5xl font-light mb-4 text-white">
                        How I <span className="font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Work</span>
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-teal-400 to-cyan-400 mx-auto rounded-full mb-6" />
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Proses kerja yang terstruktur untuk memastikan hasil terbaik untuk setiap proyek.
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-400 via-purple-400 to-orange-400 transform md:-translate-x-1/2" />

                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isEven = index % 2 === 0;

                        return (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={`relative flex items-center mb-12 last:mb-0 ${isEven ? "md:flex-row" : "md:flex-row-reverse"
                                    }`}
                            >
                                {/* Content */}
                                <div className={`w-full md:w-1/2 ${isEven ? "md:pr-16 md:text-right" : "md:pl-16"} pl-20 md:pl-0`}>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                                    >
                                        <div className={`inline-flex items-center gap-3 mb-3 ${isEven ? "md:flex-row-reverse" : ""}`}>
                                            <span className={`text-4xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                                                0{step.id}
                                            </span>
                                            <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                                        </div>
                                        <p className="text-gray-400 leading-relaxed">{step.description}</p>
                                    </motion.div>
                                </div>

                                {/* Icon Circle */}
                                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10">
                                    <motion.div
                                        whileHover={{ scale: 1.2, rotate: 360 }}
                                        transition={{ duration: 0.4 }}
                                        className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center shadow-lg shadow-teal-500/20`}
                                    >
                                        <Icon className="w-7 h-7 text-white" />
                                    </motion.div>
                                </div>

                                {/* Empty space for other side */}
                                <div className="hidden md:block w-1/2" />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
