"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Typewriter from "./Typewriter";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms for content
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const typewriterWords = [
    "Photo Editing",
    "Portrait Photography",
    "Creative Design",
    "Color Grading",
    "Retouching",
  ];

  return (
    <>
      <section ref={sectionRef} id="home" className="relative overflow-hidden bg-[#0d1f2d] min-h-screen">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#153448] via-[#0d2330] to-[#0a1a24]" />

        {/* Light Reflection / Glow Effects */}
        <div className="absolute inset-0">
          {/* Top right light reflection */}
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-teal-400/30 via-cyan-400/20 to-transparent rounded-full blur-3xl" />

          {/* Center glow */}
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-gradient-to-r from-teal-500/15 to-cyan-500/10 rounded-full blur-[100px]" />

          {/* Bottom left reflection */}
          <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-gradient-to-tr from-purple-500/20 via-pink-500/10 to-transparent rounded-full blur-3xl" />

          {/* Subtle accent light */}
          <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-cyan-400/10 rounded-full blur-[80px]" />
        </div>

        {/* Glass-like overlay with shadow effect */}
        <div className="absolute inset-0">
          {/* Glass panel effect - top */}
          <div className="absolute top-10 left-10 right-10 h-[200px] bg-gradient-to-b from-white/5 to-transparent rounded-3xl backdrop-blur-[2px]" />

          {/* Subtle inner shadow */}
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.3)]" />
        </div>

        {/* Noise texture overlay for depth */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />

        {/* Gradient Overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#153448]/30 to-[#0d1f2d] z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1f2d]/60 via-transparent to-[#0d1f2d]/40 z-[1]" />

        {/* Content */}
        <motion.div
          style={{ opacity, scale }}
          className="relative z-[2] text-white min-h-screen flex items-center pt-20 pb-20"
        >
          <div className="max-w-7xl mx-auto px-6 py-16 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block px-4 py-2 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 backdrop-blur-sm border border-teal-500/30 rounded-full text-teal-400 text-sm font-medium mb-6"
                >
                  ✨ Available for Projects
                </motion.span>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal leading-tight mb-6">
                  Hello, <span className="font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">I'm Hakim.</span>
                </h1>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-8">
                  <Typewriter
                    words={typewriterWords}
                    className="text-gray-200"
                    typingSpeed={80}
                    deletingSpeed={40}
                    delayBetweenWords={2000}
                  />
                  <br />
                  <span className="text-gray-400">in Tanjungpinang.</span>
                </h2>
                <p className="text-gray-400 leading-relaxed mb-10 max-w-xl text-lg">
                  Mengubah momen biasa menjadi karya seni yang memukau. Dengan pengalaman lebih dari 5 tahun dalam fotografi dan editing profesional.
                </p>
                <div className="flex flex-wrap gap-4">
                  <motion.a
                    href="#contact"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-teal-400 to-cyan-400 text-white px-8 py-4 rounded-full font-medium shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-shadow"
                  >
                    Get in Touch
                  </motion.a>
                  <motion.a
                    href="#gallery"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-medium backdrop-blur-sm hover:border-teal-400/50 transition-all"
                  >
                    View All Works
                  </motion.a>
                </div>

                {/* Stats mini */}
                <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
                  {[
                    { value: "5+", label: "Years" },
                    { value: "200+", label: "Projects" },
                    { value: "50+", label: "Clients" },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      <div className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Right Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative flex justify-center lg:justify-end"
              >
                <motion.div
                  style={{ y: imageY }}
                  className="relative w-full max-w-md aspect-square"
                >
                  {/* Glow effect behind image */}
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/30 to-cyan-500/30 rounded-3xl blur-2xl scale-110" />

                  {/* Image container */}
                  <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl">
                    <Image
                      src="/images/hero.jpg"
                      alt="Profile"
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#153448]/50 to-transparent" />
                  </div>

                  {/* Floating badge */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -bottom-4 -left-4 px-6 py-3 bg-white rounded-2xl shadow-xl"
                  >
                    <span className="text-gray-800 font-semibold">📸 Photo Editor</span>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2]"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center text-white/50"
          >
            <span className="text-sm mb-2">Scroll Down</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Scrolling Text */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 py-4 overflow-hidden relative border-y-4 border-[#153448] rotate-[-4deg] -mt-21">
        <div className="flex animate-scroll whitespace-nowrap">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="flex items-center mx-6">
              <span className="text-white font-medium text-lg">Photographer</span>
              <span className="text-white/80 text-2xl mx-3">◆</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scrolling Text */}
      <div className="bg-white py-4 overflow-hidden relative border-y-4 border-[#153448] rotate-[0deg] my-1.7">
        <div className="flex animate-scroll-reverse whitespace-nowrap">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="flex items-center mx-6">
              <span className="text-[#153448] font-medium text-lg">Photo Editing</span>
              <span className="text-teal-500 text-2xl mx-3">◆</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes scroll-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll-reverse {
          animation: scroll-reverse 30s linear infinite;
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </>
  );
}
