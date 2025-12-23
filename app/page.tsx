"use client";

import dynamic from "next/dynamic";
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import About from "@/app/components/About";
import Services from "@/app/components/Services";
import WorkProcess from "@/app/components/WorkProcess";
import BeforeAfter from "@/app/components/BeforeAfter";
import Gallery from "@/app/components/Gallery";
import Testimonials from "@/app/components/Testimonials";
import Pricing from "@/app/components/Pricing";
import InstagramFeed from "@/app/components/InstagramFeed";
import Blog from "@/app/components/Blog";
import Contact from "@/app/components/Contact";
import Footer from "@/app/components/Footer";
import FloatingWhatsApp from "@/app/components/FloatingWhatsApp";
import BackToTop from "@/app/components/BackToTop";
import ScrollProgress from "@/app/components/ScrollProgress";

// Dynamic imports for components that should only load on client
const LoadingScreen = dynamic(() => import("@/app/components/LoadingScreen"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      {/* Loading Screen */}
      <LoadingScreen />

      {/* Scroll Progress Bar */}
      <ScrollProgress />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="relative">
        <Hero />
        <About />
        <Services />
        <WorkProcess />
        <BeforeAfter />
        <Gallery />
        <Testimonials />
        <Pricing />
        <InstagramFeed />
        <Blog />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Buttons */}
      <FloatingWhatsApp />
      <BackToTop />
    </>
  );
}
