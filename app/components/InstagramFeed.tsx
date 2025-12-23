"use client";

import { motion } from "framer-motion";
import { Instagram, Heart, MessageCircle, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";

interface InstagramPost {
    id: string;
    imageUrl: string;
    caption: string | null;
    likes: number;
    comments: number;
}

// Default Instagram posts (fallback if database is empty)
const defaultPosts: InstagramPost[] = [
    { id: "1", imageUrl: "", caption: "Portrait session ✨", likes: 234, comments: 18 },
    { id: "2", imageUrl: "", caption: "Wedding moments 💕", likes: 456, comments: 32 },
    { id: "3", imageUrl: "", caption: "Nature vibes 🌿", likes: 189, comments: 12 },
    { id: "4", imageUrl: "", caption: "Street photography 📸", likes: 312, comments: 24 },
    { id: "5", imageUrl: "", caption: "Creative editing 🎨", likes: 278, comments: 15 },
    { id: "6", imageUrl: "", caption: "Cinematic shots 🎬", likes: 345, comments: 28 },
];

// Placeholder gradient colors
const gradientColors = [
    "from-pink-400 to-purple-500",
    "from-purple-400 to-blue-500",
    "from-teal-400 to-cyan-500",
    "from-orange-400 to-pink-500",
    "from-cyan-400 to-teal-500",
    "from-pink-500 to-orange-400",
];

export default function InstagramFeed() {
    const [instagramUsername, setInstagramUsername] = useState("hakimiesmna");
    const [posts, setPosts] = useState<InstagramPost[]>(defaultPosts);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch instagram username from settings
                const settingsRes = await fetch("/api/settings");
                if (settingsRes.ok) {
                    const settings = await settingsRes.json();
                    if (settings.instagram) {
                        setInstagramUsername(settings.instagram);
                    }
                }

                // Fetch instagram posts
                const postsRes = await fetch("/api/instagram");
                if (postsRes.ok) {
                    const data = await postsRes.json();
                    if (data.length > 0) {
                        setPosts(data);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch instagram data:", error);
            } finally {
                setIsLoaded(true);
            }
        }
        fetchData();
    }, []);

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
                    {posts.map((post, index) => (
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
                            {/* Image or Placeholder gradient */}
                            {post.imageUrl ? (
                                <img src={post.imageUrl} alt={post.caption || "Instagram"} className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <div className={`absolute inset-0 bg-gradient-to-br ${gradientColors[index % 6]}`} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-white/60 text-4xl font-bold">{index + 1}</span>
                                    </div>
                                </>
                            )}

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
