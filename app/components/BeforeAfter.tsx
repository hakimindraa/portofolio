"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ComparisonItem {
    id: string;
    title: string;
    beforeImage: string;
    afterImage: string;
}

// Default comparisons (fallback if database is empty)
const defaultComparisons: ComparisonItem[] = [
    {
        id: "1",
        title: "Portrait Retouching",
        beforeImage: "/images/before1.jpg",
        afterImage: "/images/after1.jpg",
    },
    {
        id: "2",
        title: "Color Grading",
        beforeImage: "/images/before2.jpg",
        afterImage: "/images/after2.jpg",
    },
    {
        id: "3",
        title: "Background Enhancement",
        beforeImage: "/images/before3.jpg",
        afterImage: "/images/after3.jpg",
    },
];

function ComparisonSlider({ before, after, title }: { before: string; after: string; title: string }) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
        setSliderPosition(percent);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        handleMove(e.clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        handleMove(e.touches[0].clientX);
    };

    useEffect(() => {
        const handleMouseUp = () => setIsDragging(false);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("touchend", handleMouseUp);
        return () => {
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchend", handleMouseUp);
        };
    }, []);

    return (
        <div className="relative group">
            <div
                ref={containerRef}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-ew-resize"
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                onMouseDown={() => setIsDragging(true)}
                onTouchStart={() => setIsDragging(true)}
            >
                {/* After Image (Background) */}
                <div className="absolute inset-0">
                    {after ? (
                        <img src={after} alt="After" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white text-xl font-medium">
                            After
                        </div>
                    )}
                </div>

                {/* Before Image (Foreground with clip) */}
                <div
                    className="absolute inset-0"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                    {before ? (
                        <img src={before} alt="Before" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gray-600 flex items-center justify-center text-white text-xl font-medium">
                            Before
                        </div>
                    )}
                </div>

                {/* Slider Line */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
                    style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
                >
                    {/* Slider Handle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                        </svg>
                    </div>
                </div>

                {/* Labels */}
                <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg text-white text-sm font-medium">
                    Before
                </div>
                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg text-white text-sm font-medium">
                    After
                </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-[var(--text)] mt-4 text-center">{title}</h3>
        </div>
    );
}

export default function BeforeAfter() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [comparisons, setComparisons] = useState<ComparisonItem[]>(defaultComparisons);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        async function fetchComparisons() {
            try {
                const res = await fetch("/api/before-after");
                if (res.ok) {
                    const data = await res.json();
                    if (data.length > 0) {
                        setComparisons(data);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch before/after items:", error);
            } finally {
                setIsLoaded(true);
            }
        }
        fetchComparisons();
    }, []);

    return (
        <section id="before-after" className="relative overflow-hidden py-24 px-6 bg-[#153448]">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-teal-400 text-sm font-medium mb-4">
                        Photo Editing
                    </span>
                    <h2 className="text-4xl md:text-5xl font-light mb-4 text-white">
                        Before & <span className="font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">After</span>
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-teal-400 to-cyan-400 mx-auto rounded-full mb-6" />
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Lihat transformasi foto dengan editing profesional. Geser slider untuk melihat perbedaannya.
                    </p>
                </motion.div>

                {/* Comparison Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap justify-center gap-4 mb-12"
                >
                    {comparisons.map((item, index) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveIndex(index)}
                            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${activeIndex === index
                                ? "bg-gradient-to-r from-teal-400 to-cyan-400 text-white shadow-lg"
                                : "bg-white/10 text-gray-300 hover:bg-white/20"
                                }`}
                        >
                            {item.title}
                        </button>
                    ))}
                </motion.div>

                {/* Active Comparison */}
                <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="max-w-3xl mx-auto"
                >
                    {comparisons[activeIndex] && (
                        <ComparisonSlider
                            before={comparisons[activeIndex].beforeImage}
                            after={comparisons[activeIndex].afterImage}
                            title={comparisons[activeIndex].title}
                        />
                    )}
                </motion.div>

                {/* Instructions */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    viewport={{ once: true }}
                    className="text-center text-gray-400 mt-8 text-sm"
                >
                    💡 Geser slider ke kiri atau kanan untuk melihat perubahan
                </motion.p>
            </div>
        </section>
    );
}
