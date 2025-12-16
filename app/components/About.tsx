"use client";

import { motion } from "framer-motion";
import { Award, Briefcase, Users, Trophy, Code, Palette, Figma, Sparkles, Layers, Zap, Laptop, Camera } from "lucide-react";

export default function About() {
  const stats = [
    { number: "15+", label: "Years Experience", icon: Award, gradient: "from-[#0C2B4E] to-[#0C2B4E]" },
    { number: "200+", label: "Projects Completed", icon: Briefcase, gradient: "from-[#0C2B4E] to-[#0C2B4E]" },
    { number: "50+", label: "Happy Clients", icon: Users, gradient: "from-[#0C2B4E] to-[#0C2B4E]" },
    { number: "10+", label: "Awards Won", icon: Trophy, gradient: "from-[#0C2B4E] to-[#0C2B4E]" },
  ];

  const skills = [
    { name: "Design", icon: Palette },
    { name: "Photography", icon: Camera },
  ];

  return (
    <section id="about" className="relative overflow-hidden py-24 px-6">
      {/* Background (non-rotated for mobile consistency) */}
      <div className="absolute inset-0 bg-[#153448] shadow-[0_10px_30px_rgba(255,255,255,0.1)]"></div>
      
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
          <h2 className="text-5xl md:text-6xl font-light mb-4 text-white">
            About <span className="font-bold text-[#F4F4F4]">Me</span>
          </h2>
          <div className="w-20 h-1 bg-white mx-auto rounded-full"></div>
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
                I'm a passionate creative designer with over <span className="font-semibold text-white">15 years of experience</span> in creating beautiful, functional, and user-friendly designs. My work spans across web design, branding, UI/UX, and visual identity.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg">
                I believe in the power of simplicity and attention to detail. Every project is an opportunity to create something meaningful that connects with people and makes a lasting impact.
              </p>
              <div className="flex gap-4 pt-4">
                <button className="bg-white text-[#153448] px-8 py-3.5 rounded-full font-medium hover:bg-gray-200 transition flex items-center gap-2">
                  <Award size={20} />
                  Download CV
                </button>
                <button className="border-2 border-white text-white px-8 py-3.5 rounded-full font-medium hover:bg-white hover:text-[#153448] transition">
                  Contact Me
                </button>
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
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  <div className="card-hover bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-200 text-center h-full">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} mb-4`}>
                      <Icon className="text-white" size={28} />
                    </div>
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium text-sm">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
            <span className="font-bold">Skills</span> & Expertise
          </h3>
          <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
            {skills.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="card-hover bg-white/10 rounded-2xl p-6 shadow-sm border border-white/20 group cursor-pointer"
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="p-3 rounded-xl bg-white/20 group-hover:bg-white/30 transition-all duration-300">
                      <Icon className="text-white" size={24} />
                    </div>
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                      {skill.name}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
