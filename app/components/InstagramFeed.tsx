"use client";

import { motion } from "framer-motion";
import { Instagram, Heart, MessageCircle, ExternalLink } from "lucide-react";
import Image from "next/image";

// Sample Instagram posts - Ganti dengan data asli dari Instagram API atau hardcode
const instagramPosts = [
    {
        id: 1,
        image: "/images/ig1.jpg",
        likes: 234,
        comments: 18,
        caption: "Portrait session ✨",
    },
    {
        id: 2,
        image: "/images/ig2.jpg",
        likes: 456,
        comments: 32,
        caption: "Wedding moments 💕",
    },
    {
        id: 3,
        image: "/images/ig3.jpg",
        likes: 189,
        comments: 12,
        caption: "Nature vibes 🌿",
    },
    {
        id: 4,
        image: "/images/ig4.jpg",
        likes: 312,
        comments: 24,
        caption: "Street photography 📸",
    },
    {
        id: 5,
        image: "/images/ig5.jpg",
        likes: 278,
        comments: 15,
        caption: "Creative editing 🎨",
    },
    {
        id: 6,
        image: "/images/ig6.jpg",
        likes: 345,
        comments: 28,
        caption: "Cinematic shots 🎬",
    },
];

export default function InstagramFeed() {
    const instagramUsername = "hakimlesmna"; // Ganti dengan username Instagram kamu

    return (
        <section className="relative overflow-hidden py-24 px-6 bg-[var(--bg)]">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-orange-400/10 to-pink-400/10 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full text-pink-500 dark:text-pink-400 text-sm font-medium mb-4">
                        <Instagram size={16} />
                        Instagram
                    </span>
                    <h2 className="text-4xl md:text-5xl font-light mb-4 text-[var(--text)]">
                        Follow on{" "}
                        <span className="font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 bg-clip-text text-transparent">
                            Instagram
                        </span>
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full mb-6" />
                    <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-lg">
                        Ikuti perjalanan kreatif saya di Instagram untuk karya terbaru dan behind-the-scenes.
                    </p>
                </motion.div>

                {/* Instagram Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    {instagramPosts.map((post, index) => (
                        <motion.a
                            key={post.id}
                            href={`https://instagram.com/${instagramUsername}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative aspect-square rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800"
                        >
                            {/* Placeholder gradient - Replace with actual images */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${index % 6 === 0
                                    ? "from-pink-400 to-purple-500"
                                    : index % 6 === 1
                                        ? "from-purple-400 to-blue-500"
                                        : index % 6 === 2
                                            ? "from-teal-400 to-cyan-500"
                                            : index % 6 === 3
                                                ? "from-orange-400 to-pink-500"
                                                : index % 6 === 4
                                                    ? "from-cyan-400 to-teal-500"
                                                    : "from-pink-500 to-orange-400"
                                    }`}
                            />

                            {/* Placeholder content */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white/60 text-4xl font-bold">{post.id}</span>
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="flex items-center gap-4 text-white">
                                    <span className="flex items-center gap-1">
                                        <Heart size={18} className="fill-white" />
                                        {post.likes}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageCircle size={18} />
                                        {post.comments}
                                    </span>
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>

                {/* Follow Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <a
                        href={`https://instagram.com/${instagramUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 text-white px-8 py-4 rounded-full font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 hover:scale-105"
                    >
                        <Instagram size={22} />
                        @{instagramUsername}
                        <ExternalLink size={18} />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
