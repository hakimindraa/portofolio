"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Tag, Loader2, Share2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, use } from "react";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    coverImage: string | null;
    readTime: number;
    createdAt: string;
}

// Gradient colors for posts without cover image
const gradientColors = [
    "from-teal-400 to-cyan-400",
    "from-purple-400 to-pink-400",
    "from-orange-400 to-yellow-400",
    "from-blue-400 to-indigo-400",
];

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        async function fetchPost() {
            try {
                const res = await fetch(`/api/blog/${resolvedParams.slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setPost(data);
                } else if (res.status === 404) {
                    setNotFound(true);
                }
            } catch (error) {
                console.error("Failed to fetch blog post:", error);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        }
        fetchPost();
    }, [resolvedParams.slug]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const handleShare = async () => {
        if (navigator.share && post) {
            try {
                await navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: window.location.href,
                });
            } catch (error) {
                console.error("Error sharing:", error);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
                <Loader2 className="animate-spin text-purple-500" size={40} />
            </div>
        );
    }

    if (notFound || !post) {
        return (
            <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center p-6">
                <h1 className="text-4xl font-bold text-[var(--text)] mb-4">404</h1>
                <p className="text-[var(--text-muted)] mb-8">Article not found</p>
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-purple-500 hover:text-purple-400 transition"
                >
                    <ArrowLeft size={20} />
                    Back to Blog
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg)]">
            {/* Navigation Bar */}
            <div className="bg-[var(--bg)] border-b border-[var(--card-border)] sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-purple-500 hover:text-purple-400 transition"
                    >
                        <ArrowLeft size={20} />
                        Back to Blog
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Cover Image (optional, smaller) */}
                {post.coverImage && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative aspect-video rounded-2xl overflow-hidden mb-8"
                    >
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                )}

                {/* Article Header */}
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    {/* Category */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 rounded-full text-sm font-medium text-purple-500 mb-4">
                        <Tag size={14} />
                        {post.category}
                    </span>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-bold text-[var(--text)] mb-4 leading-tight">
                        {post.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-[var(--text-muted)]">
                        <span className="flex items-center gap-1.5">
                            <Calendar size={16} />
                            {formatDate(post.createdAt)}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock size={16} />
                            {post.readTime || 5} min read
                        </span>
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-1.5 hover:text-purple-500 transition"
                        >
                            <Share2 size={16} />
                            Share
                        </button>
                    </div>
                </motion.header>

                {/* Article Content */}
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Excerpt */}
                    <p className="text-lg text-[var(--text-muted)] leading-relaxed mb-8 border-l-4 border-purple-500 pl-6 italic">
                        {post.excerpt}
                    </p>

                    {/* Main Content */}
                    <div className="text-[var(--text)] leading-relaxed whitespace-pre-wrap text-lg">
                        {post.content || "Content coming soon..."}
                    </div>
                </motion.article>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-[var(--card-border)]">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-purple-500 hover:text-purple-400 transition"
                    >
                        <ArrowLeft size={20} />
                        Back to All Articles
                    </Link>
                </div>
            </div>
        </div>
    );
}
