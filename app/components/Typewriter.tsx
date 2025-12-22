"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TypewriterProps {
    words: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    delayBetweenWords?: number;
    className?: string;
}

export default function Typewriter({
    words,
    typingSpeed = 100,
    deletingSpeed = 50,
    delayBetweenWords = 2000,
    className = "",
}: TypewriterProps) {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentWord = words[currentWordIndex];

        const timeout = setTimeout(
            () => {
                if (!isDeleting) {
                    // Typing
                    if (currentText.length < currentWord.length) {
                        setCurrentText(currentWord.slice(0, currentText.length + 1));
                    } else {
                        // Finished typing, wait then start deleting
                        setTimeout(() => setIsDeleting(true), delayBetweenWords);
                    }
                } else {
                    // Deleting
                    if (currentText.length > 0) {
                        setCurrentText(currentText.slice(0, -1));
                    } else {
                        // Finished deleting, move to next word
                        setIsDeleting(false);
                        setCurrentWordIndex((prev) => (prev + 1) % words.length);
                    }
                }
            },
            isDeleting ? deletingSpeed : typingSpeed
        );

        return () => clearTimeout(timeout);
    }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, delayBetweenWords]);

    return (
        <span className={className}>
            {currentText}
            <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                className="inline-block w-[3px] h-[1em] bg-teal-400 ml-1 align-middle"
            />
        </span>
    );
}
