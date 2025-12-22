"use client";

import { motion, useInView } from "framer-motion";
import { Award, Briefcase, Users, Trophy, Camera, Palette } from "lucide-react";
import { useRef, useEffect, useState } from "react";

// Animated Counter Hook
function useCounter(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (startOnView && !isInView) return;
    if (hasStarted) return;

    setHasStarted(true);
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView, startOnView, hasStarted]);

  return { count, ref };
}

function AnimatedStat({ stat, index }: { stat: any; index: number }) {
  const numericValue = parseInt(stat.number);
  const { count, ref } = useCounter(numericValue, 2000);
  const Icon = stat.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="relative group"
    >
      <div className="card-hover bg-[var(--card-bg)] p-8 rounded-2xl shadow-lg border border-[var(--card-border)] text-center h-full hover:border-teal-400/50 transition-all duration-300">
        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} mb-4 shadow-lg`}>
          <Icon className="text-white" size={28} />
        </div>
        <div className="text-4xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent mb-2">
          {count}+
        </div>
        <div className="text-[var(--text-muted)] font-medium text-sm">
          {stat.label}
        </div>
      </div>
    </motion.div>
  );
}

export default function About() {
  const stats = [
    { number: "5", label: "Years Experience", icon: Award, gradient: "from-teal-400 to-cyan-400" },
    { number: "200", label: "Projects Completed", icon: Briefcase, gradient: "from-cyan-400 to-blue-400" },
    { number: "50", label: "Happy Clients", icon: Users, gradient: "from-purple-400 to-pink-400" },
    { number: "10", label: "Awards Won", icon: Trophy, gradient: "from-orange-400 to-yellow-400" },
  ];

  const skills = [
    { name: "Photography", icon: Camera, level: 95 },
    { name: "Photo Editing", icon: Palette, level: 90 },
  ];

  return (
    <section id="about" className="section-glass-dark relative overflow-hidden py-24 px-6">
      {/* Light Reflection Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-teal-400/20 via-cyan-400/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-[600px] h-[600px] bg-gradient-to-tr from-purple-500/15 via-pink-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Inner Shadow Overlay */}
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.3)] pointer-events-none" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-teal-400 text-sm font-medium mb-4">
            About Me
          </span>
          <h2 className="text-5xl md:text-6xl font-light mb-4 text-white">
            About <span className="font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Me</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-teal-400 to-cyan-400 mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <p className="text-gray-300 leading-relaxed text-lg">
                Saya adalah seorang <span className="font-semibold text-teal-400">photo editor dan fotografer profesional</span> yang berbasis di Tanjungpinang. Dengan pengalaman lebih dari 5 tahun dalam industri kreatif, saya telah membantu banyak klien mewujudkan visi visual mereka.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg">
                Saya percaya bahwa setiap foto memiliki cerita. Tugas saya adalah membantu cerita tersebut bersinar melalui editing yang berkualitas dan perhatian pada detail terkecil.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-teal-400 to-cyan-400 text-white px-8 py-3.5 rounded-full font-medium shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-shadow flex items-center gap-2"
                >
                  <Award size={20} />
                  Download CV
                </motion.a>
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white/30 text-white px-8 py-3.5 rounded-full font-medium hover:bg-white/10 transition-all"
                >
                  Contact Me
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Right Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <AnimatedStat key={index} stat={stat} index={index} />
            ))}
          </motion.div>
        </div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h3 className="text-4xl font-light mb-12 text-center text-white">
            <span className="font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Skills</span> & Expertise
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {skills.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-teal-400/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400">
                      <Icon className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <span className="text-white font-medium">{skill.name}</span>
                      <span className="text-teal-400 ml-2 font-bold">{skill.level}%</span>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      viewport={{ once: true }}
                      className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section >
  );
}
