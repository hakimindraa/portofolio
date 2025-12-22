"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate loading progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsLoading(false), 300);
                    return 100;
                }
                return prev + 20;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="fixed inset-0 z-[10000] bg-[#153448] flex flex-col items-center justify-center"
                >
                    {/* Logo */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="mb-12"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold">
                            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                                Hakim
                            </span>
                        </h1>
                        <p className="text-gray-400 text-center mt-2 text-lg">
                            Photo Editing & Design
                        </p>
                    </motion.div>

                    {/* Progress Bar */}
                    <div className="w-64 md:w-80">
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(progress, 100)}%` }}
                                transition={{ duration: 0.2 }}
                            />
                        </div>
                        <p className="text-gray-500 text-sm text-center mt-4">
                            Loading...
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
