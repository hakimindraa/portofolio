"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useState, useEffect } from "react";

interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    rating: number;
    avatar?: string;
}

// Default testimonials (fallback if database is empty)
const defaultTestimonials: Testimonial[] = [
    {
        id: "1",
        name: "Sarah Johnson",
        role: "Wedding Client",
        content: "Hakim captured our wedding day beautifully! Every photo tells a story. His attention to detail and creative vision exceeded our expectations.",
        rating: 5,
    },
    {
        id: "2",
        name: "Michael Chen",
        role: "Business Owner",
        content: "The product photography for our brand was exceptional. Hakim understood our vision perfectly and delivered stunning results that boosted our sales.",
        rating: 5,
    },
    {
        id: "3",
        name: "Emily Rodriguez",
        role: "Model & Influencer",
        content: "Working with Hakim was an amazing experience. His editing skills transformed my portfolio. Highly recommend for anyone looking for professional work!",
        rating: 5,
    },
    {
        id: "4",
        name: "David Park",
        role: "Event Organizer",
        content: "We've hired Hakim for multiple corporate events. His professionalism and ability to capture key moments make him our go-to photographer.",
        rating: 5,
    },
];

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        async function fetchTestimonials() {
            try {
                const res = await fetch("/api/testimonials");
                if (res.ok) {
                    const data = await res.json();
                    if (data.length > 0) {
                        setTestimonials(data);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch testimonials:", error);
            } finally {
                setIsLoaded(true);
            }
        }
        fetchTestimonials();
    }, []);

    return (
        <section id="testimonials" className="relative overflow-hidden py-24 px-6 bg-[var(--bg)]">
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-teal-400/10 to-cyan-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl" />
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
                        Testimonials
                    </span>
                    <h2 className="text-4xl md:text-5xl font-light mb-4 text-[var(--text)]">
                        What <span className="font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Clients Say</span>
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-teal-400 to-cyan-400 mx-auto rounded-full mb-6" />
                    <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-lg">
                        Don't just take my word for it. Here's what my clients have to say about working with me.
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative group"
                        >
                            <div className="bg-[var(--card-bg)] p-8 rounded-2xl border border-[var(--card-border)] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                {/* Quote Icon */}
                                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                                    <Quote className="w-6 h-6 text-white" />
                                </div>

                                {/* Rating */}
                                <div className="flex gap-1 mb-4 ml-6">
                                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>

                                {/* Text */}
                                <p className="text-[var(--text-muted)] leading-relaxed mb-6 italic">
                                    "{testimonial.content}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 p-0.5">
                                        {testimonial.avatar ? (
                                            <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full rounded-full bg-[var(--card-bg)] flex items-center justify-center text-xl font-bold text-teal-500">
                                                {testimonial.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[var(--text)]">{testimonial.name}</h4>
                                        <p className="text-sm text-[var(--text-muted)]">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
