"use client";

import { motion } from "framer-motion";
import { Clock, ArrowRight, Calendar, Tag } from "lucide-react";
import Image from "next/image";

const posts = [
    {
        id: 1,
        title: "10 Tips Fotografi Portrait untuk Pemula",
        excerpt: "Pelajari teknik dasar fotografi portrait yang akan meningkatkan kualitas foto Anda secara drastis...",
        image: "/images/blog1.jpg",
        category: "Photography",
        date: "20 Des 2024",
        readTime: "5 min read",
        color: "from-teal-400 to-cyan-400",
    },
    {
        id: 2,
        title: "Trend Color Grading 2024",
        excerpt: "Eksplorasi tren warna dan editing yang sedang populer di tahun ini untuk hasil yang stunning...",
        image: "/images/blog2.jpg",
        category: "Editing",
        date: "18 Des 2024",
        readTime: "4 min read",
        color: "from-purple-400 to-pink-400",
    },
    {
        id: 3,
        title: "Memilih Lighting yang Tepat",
        excerpt: "Panduan lengkap memahami pencahayaan untuk menghasilkan foto berkualitas profesional...",
        image: "/images/blog3.jpg",
        category: "Tips",
        date: "15 Des 2024",
        readTime: "6 min read",
        color: "from-orange-400 to-yellow-400",
    },
];

export default function Blog() {
    return (
        <section id="blog" className="relative overflow-hidden py-24 px-6 bg-[var(--bg)]">
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-teal-400/10 to-cyan-400/10 rounded-full blur-3xl" />
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
                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full text-purple-500 dark:text-purple-400 text-sm font-medium mb-4">
                        Blog & Insights
                    </span>
                    <h2 className="text-4xl md:text-5xl font-light mb-4 text-[var(--text)]">
                        Latest <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Articles</span>
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full mb-6" />
                    <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-lg">
                        Tips, tutorial, dan insights seputar fotografi dan editing dari pengalaman saya.
                    </p>
                </motion.div>

                {/* Blog Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group cursor-pointer"
                        >
                            <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                {/* Image */}
                                <div className="relative h-52 overflow-hidden">
                                    <div className={`absolute inset-0 bg-gradient-to-r ${post.color} opacity-80`} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-white/80 text-6xl font-bold">0{post.id}</span>
                                    </div>

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
                                            {post.date}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock size={14} />
                                            {post.readTime}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-semibold text-[var(--text)] mb-3 group-hover:text-teal-500 transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>

                                    {/* Excerpt */}
                                    <p className="text-[var(--text-muted)] text-sm leading-relaxed line-clamp-2 mb-4">
                                        {post.excerpt}
                                    </p>

                                    {/* Read More */}
                                    <span className="inline-flex items-center gap-2 text-teal-500 font-medium text-sm group-hover:gap-3 transition-all">
                                        Read More
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <a
                        href="/blog"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white px-8 py-4 rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
                    >
                        View All Articles
                        <ArrowRight size={20} />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
