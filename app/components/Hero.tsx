"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <>
      <section id="home" className="relative overflow-hidden bg-[#153448]">
        
        {/* Content */}
        <div className="relative text-white min-h-screen flex items-center pt-20 pb-20">
          <div className="max-w-7xl mx-auto px-6 py-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal leading-tight mb-6">
                Hello, <span className="text-[#F4F4F4] font-bold">I'm Hakim.</span>
              </h1>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8">
                Photo Editing
                <br />
                in Tanjungpinang.
              </h2>
              <p className="text-gray-400 leading-relaxed mb-10 max-w-xl text-base">
                Lorem ipsum dolor sit amet consectetur. At libero sit nec tincidunt
                eu at semper. Pharetra duis ipsum laoreet amet sem imperdiet cras
                feugiat. Lacinia pretium duis pellentesque et nec ipsum est.
              </p>
              <div className="flex gap-4">
                <button className="bg-gray-50 text-black px-8 py-3.5 rounded-full font-medium hover:bg-gray-200 transition">
                  Get in Touch
                </button>
                <button className="border border-white text-white px-8 py-3.5 rounded-full font-medium hover:bg-gray-50 hover:text-black transition">
                  View All Works
                </button>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden bg-gray-200">
                <Image
                  src="/images/hero.jpg"
                  alt="Profile"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </motion.div>
          </div>
        </div>
        </div>
      </section>

      {/* Scrolling Text */}
      <div className="bg-gray-100 py-4 overflow-hidden relative border-y-4 border-[#153448] rotate-[-4deg] -mt-21">
        <div className="flex animate-scroll whitespace-nowrap">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="flex items-center mx-6">
              <span className="text-black font-medium text-lg">Photographer</span>
              <span className="text-[#153448] text-2xl mx-3">◆</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scrolling Text */}
      <div className="bg-gray-100 py-4 overflow-hidden relative border-y-4 border-[#153448] rotate-[0deg] my-1.7">
        <div className="flex animate-scroll whitespace-nowrap">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="flex items-center mx-6">
              <span className="text-black font-medium text-lg">Photo Editing</span>
              <span className="text-[#153448] text-2xl mx-3">◆</span>
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
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </>
  );
}
