"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { photos } from "@/app/data/photos";
import { Camera, Heart, Sparkles, Mountain, Film, Grid3x3, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  { id: "all", label: "All Works", icon: Grid3x3 },
  { id: "portrait", label: "Portrait", icon: Camera },
  { id: "wedding", label: "Wedding", icon: Heart },
  { id: "street", label: "Street", icon: Sparkles },
  { id: "nature", label: "Nature", icon: Mountain },
  { id: "cinematic", label: "Cinematic", icon: Film },
];

export default function Gallery() {
  const [index, setIndex] = useState(-1);
  const [activeCategory, setActiveCategory] = useState("all");

  // Limit to 6 photos for home page
  const displayPhotos = photos.slice(0, 6);

  const filteredPhotos = activeCategory === "all" 
    ? displayPhotos 
    : displayPhotos.filter((p: any) => p.category === activeCategory);

  return (
    <section id="gallery" className="relative overflow-hidden py-24 px-6">
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
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-light mb-4 text-white">
            My <span className="font-bold text-[#F4F4F4]">Portfolio</span>
          </h2>
          <div className="w-20 h-1 bg-white mx-auto rounded-full mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Capturing moments that tell stories. Browse through my recent works.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`category-badge ${activeCategory === cat.id ? "active" : ""}`}
              >
                <Icon size={18} />
                {cat.label}
              </button>
            );
          })}
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredPhotos.map((photo: any, i: number) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              onClick={() => setIndex(i)}
              className="gallery-card"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="gallery-overlay">
                <h3 className="text-white font-semibold text-lg mb-1">{photo.alt}</h3>
                <p className="text-white/80 text-sm capitalize">{photo.category}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a
            href="/gallery"
            className="inline-flex items-center gap-2 bg-white text-[#153448] px-8 py-4 rounded-full text-base font-medium hover:shadow-lg hover:shadow-white/30 transition-all duration-300 hover:scale-105"
          >
            View All Projects
            <ArrowRight size={20} />
          </a>
        </motion.div>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={filteredPhotos.map((p: any) => ({ src: p.src }))}
      />
    </section>
  );
}
