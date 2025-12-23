"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Photo {
    id: string;
    title: string;
    category: string;
    imageUrl: string;
    featured: boolean;
}

const categories = ["All", "Portrait", "Wedding", "Nature", "Street", "Commercial"];

export default function GalleryPage() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

    useEffect(() => {
        async function fetchPhotos() {
            try {
                const res = await fetch("/api/gallery");
                if (res.ok) {
                    const data = await res.json();
                    setPhotos(data);
                }
            } catch (error) {
                console.error("Failed to fetch photos:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchPhotos();
    }, []);

    const filteredPhotos = activeCategory === "All"
        ? photos
        : photos.filter((photo) => photo.category === activeCategory);

    return (
        <div className="min-h-screen bg-[var(--bg)]">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-teal-500 hover:text-teal-400 transition mb-6"
                    >
                        <ArrowLeft size={20} />
                        Back to Home
                    </Link>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-4"
                    >
                        My <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Portfolio</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-[var(--text-muted)] text-lg max-w-2xl"
                    >
                        Explore my complete collection of photography and editing work.
                    </motion.p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Category Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-3 mb-12"
                >
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category
                                ? "bg-gradient-to-r from-teal-400 to-cyan-400 text-white shadow-lg"
                                : "bg-[var(--card-bg)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--card-border)]"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </motion.div>

                {/* Loading */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-teal-500" size={40} />
                    </div>
                ) : filteredPhotos.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-[var(--text-muted)] text-lg">No photos found in this category.</p>
                    </div>
                ) : (
                    /* Gallery Grid */
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {filteredPhotos.map((photo, index) => (
                            <motion.div
                                key={photo.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
                                onClick={() => setSelectedPhoto(photo)}
                            >
                                {photo.imageUrl ? (
                                    <img
                                        src={photo.imageUrl}
                                        alt={photo.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                                        <span className="text-white/60 text-2xl font-bold">{photo.title}</span>
                                    </div>
                                )}

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h3 className="text-white font-semibold text-lg">{photo.title}</h3>
                                        <p className="text-white/70 text-sm">{photo.category}</p>
                                    </div>
                                </div>

                                {/* Featured Badge */}
                                {photo.featured && (
                                    <div className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-teal-400 to-cyan-400 text-white text-xs font-medium rounded-full">
                                        Featured
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Lightbox Modal */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
                    onClick={() => setSelectedPhoto(null)}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setSelectedPhoto(null)}
                        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Image Container */}
                    <div
                        className="relative w-full h-full flex items-center justify-center p-4 md:p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {selectedPhoto.imageUrl ? (
                            <img
                                src={selectedPhoto.imageUrl}
                                alt={selectedPhoto.title}
                                className="max-w-full max-h-full object-contain"
                            />
                        ) : (
                            <div className="w-full max-w-3xl aspect-video bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center">
                                <span className="text-white text-4xl font-bold">{selectedPhoto.title}</span>
                            </div>
                        )}
                    </div>

                    {/* Photo Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                        <div className="max-w-7xl mx-auto">
                            <h3 className="text-white text-xl md:text-2xl font-bold">{selectedPhoto.title}</h3>
                            <p className="text-white/70">{selectedPhoto.category}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
