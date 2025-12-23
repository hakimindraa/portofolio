"use client";

import { motion } from "framer-motion";
import { Camera, Palette, Video, Users, Award, Sparkles, Image, Star, Heart, Zap, Target, Briefcase, LucideIcon } from "lucide-react";
import { useState, useEffect } from "react";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  active: boolean;
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Camera,
  Palette,
  Video,
  Users,
  Award,
  Sparkles,
  Image,
  Star,
  Heart,
  Zap,
  Target,
  Briefcase,
};

// Default services (fallback if database is empty)
const defaultServices = [
  {
    id: "1",
    title: "Portrait Photography",
    description: "Professional portrait sessions capturing your unique personality and style with artistic vision.",
    icon: "Camera",
  },
  {
    id: "2",
    title: "Creative Design",
    description: "Innovative design solutions for branding, digital media, and visual identity projects.",
    icon: "Palette",
  },
  {
    id: "3",
    title: "Videography",
    description: "Cinematic video production for events, commercial projects, and storytelling content.",
    icon: "Video",
  },
  {
    id: "4",
    title: "Event Coverage",
    description: "Comprehensive coverage of weddings, corporate events, and special occasions.",
    icon: "Users",
  },
  {
    id: "5",
    title: "Photo Editing",
    description: "Expert post-processing and retouching to bring out the best in every image.",
    icon: "Sparkles",
  },
  {
    id: "6",
    title: "Creative Consultation",
    description: "Professional guidance and creative direction for your photography and design projects.",
    icon: "Award",
  },
];

export default function Services() {
  const [services, setServices] = useState(defaultServices);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/services");
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setServices(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setIsLoaded(true);
      }
    }
    fetchServices();
  }, []);

  return (
    <section id="services" className="relative overflow-hidden py-24 px-6">
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
            My <span className="font-bold text-[#F4F4F4]">Services</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#F4F4F4] to-white mx-auto rounded-full mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Offering a wide range of creative services to bring your vision to life.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Camera;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="service-card group bg-[#f4f4f4] border-gray-200"
              >
                <span className="service-number">0{index + 1}</span>

                <div className="service-icon mb-6">
                  <Icon className="text-[#153448]" size={32} strokeWidth={1.5} />
                </div>

                <h3 className="text-2xl font-semibold mb-4 text-gray-900 group-hover:text-[#153448] transition-colors">
                  {service.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>

                <div className="mt-6 inline-flex items-center text-[#153448] font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-white/10 border border-white/20 rounded-3xl p-12 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg">
              Let's collaborate and create something amazing together. Get in touch today!
            </p>
            <a
              href="#contact"
              className="inline-block bg-white text-[#153448] px-8 py-4 rounded-full font-semibold hover:bg-gray-200 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Get Started
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}