"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Tag, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    coverImage: string | null;
    readTime: number;
    createdAt: string;
}

const categories = ["All", "Tutorial", "Tips", "Behind The Scenes", "Showcase", "News"];

// Gradient colors for posts without cover image
const gradientColors = [
    "from-teal-400 to-cyan-400",
    "from-purple-400 to-pink-400",
    "from-orange-400 to-yellow-400",
    "from-blue-400 to-indigo-400",
    "from-green-400 to-teal-400",
    "from-pink-400 to-red-400",
];

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        async function fetchPosts() {
            try {
                const res = await fetch("/api/blog");
                if (res.ok) {
                    const data = await res.json();
                    setPosts(data);
                }
            } catch (error) {
                console.error("Failed to fetch blog posts:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
    }, []);

    const filteredPosts = activeCategory === "All"
        ? posts
        : posts.filter((post) => post.category === activeCategory);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-[var(--bg)]">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-purple-500 hover:text-purple-400 transition mb-6"
                    >
                        <ArrowLeft size={20} />
                        Back to Home
                    </Link>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-4"
                    >
                        Latest <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Articles</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-[var(--text-muted)] text-lg max-w-2xl"
                    >
                        Tips, tutorial, dan insights seputar fotografi dan editing dari pengalaman saya.
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
                                    ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-lg"
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
                        <Loader2 className="animate-spin text-purple-500" size={40} />
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-[var(--text-muted)] text-lg">No articles found in this category.</p>
                    </div>
                ) : (
                    /* Blog Grid */
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post, index) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group"
                            >
                                <Link href={`/blog/${post.slug}`}>
                                    <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                        {/* Image */}
                                        <div className="relative h-52 overflow-hidden">
                                            {post.coverImage ? (
                                                <img
                                                    src={post.coverImage}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <>
                                                    <div className={`absolute inset-0 bg-gradient-to-r ${gradientColors[index % 6]} opacity-80`} />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <span className="text-white/80 text-6xl font-bold">0{(index % 9) + 1}</span>
                                                    </div>
                                                </>
                                            )}

                                            {/* Category Badge */}
                                            <div className="absolute top-4 left-4">
                                                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                                                    <Tag size={12} />
                                                    {post.category}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            {/* Meta */}
                                            <div className="flex items-center gap-4 text-sm text-[var(--text-muted)] mb-3">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar size={14} />
                                                    {formatDate(post.createdAt)}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock size={14} />
                                                    {post.readTime} min read
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-xl font-semibold text-[var(--text)] mb-3 group-hover:text-purple-500 transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>

                                            {/* Excerpt */}
                                            <p className="text-[var(--text-muted)] text-sm leading-relaxed line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </motion.article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
