"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // Show button when page is scrolled down 400px
            setIsVisible(window.scrollY > 400);
        };

        window.addEventListener("scroll", toggleVisibility, { passive: true });

        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0, y: 20 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={scrollToTop}
                    className="fixed bottom-6 left-6 z-[9999] w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full shadow-lg shadow-teal-500/30 flex items-center justify-center text-white hover:shadow-teal-500/50 transition-shadow"
                    aria-label="Scroll to top"
                >
                    <ArrowUp size={22} />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
