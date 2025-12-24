"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Heart, Instagram, Linkedin, Github, Twitter, ArrowUp } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const navigation = {
  main: [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#gallery" },
    { name: "Contact", href: "#contact" },
  ],
  services: [
    { name: "Photography", href: "#" },
    { name: "Design", href: "#" },
    { name: "Videography", href: "#" },
    { name: "Editing", href: "#" },
  ],
};

interface SocialLink {
  icon: React.ElementType;
  href: string;
  label: string;
}

const defaultSocialLinks: SocialLink[] = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
];

interface ContactInfo {
  email: string;
  phone: string;
  location: string;
}

export default function Footer() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: "hello@example.com",
    phone: "+62 xxx xxxx xxxx",
    location: "Indonesia",
  });
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(defaultSocialLinks);
  const [ownerName, setOwnerName] = useState("Hakim");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          // Update contact info
          setContactInfo({
            email: data.email || "hello@example.com",
            phone: data.phone || data.whatsapp || "+62 xxx xxxx xxxx",
            location: data.location || "Indonesia",
          });
          // Update owner name
          if (data.name) {
            setOwnerName(data.name);
          }
          // Update social links
          setSocialLinks([
            { icon: Instagram, href: data.instagram ? `https://instagram.com/${data.instagram}` : "https://instagram.com", label: "Instagram" },
            { icon: Linkedin, href: data.linkedin || "https://linkedin.com", label: "LinkedIn" },
            { icon: Github, href: data.github || "https://github.com", label: "GitHub" },
            { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    }
    fetchSettings();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/20">
      {/* Background (non-rotated for mobile consistency) */}
      <div className="absolute inset-0 bg-[#153448] shadow-[0_10px_30px_rgba(255,255,255,0.1)]"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-3 md:space-y-6 col-span-2 md:col-span-1">
            <Link href="#home" className="text-white text-xl md:text-2xl font-bold tracking-tight">
              Portfolio
            </Link>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Creating stunning visuals and memorable experiences through photography and design.
            </p>
            <div className="flex gap-2 md:gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="footer-social"
                    aria-label={social.label}
                  >
                    <Icon size={16} className="md:w-[18px] md:h-[18px]" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm md:text-base font-semibold mb-3 md:mb-6">Quick Links</h3>
            <ul className="space-y-2 md:space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="footer-link inline-block text-xs md:text-base">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-sm md:text-base font-semibold mb-3 md:mb-6">Services</h3>
            <ul className="space-y-2 md:space-y-3">
              {navigation.services.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="footer-link inline-block text-xs md:text-base">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-white text-sm md:text-base font-semibold mb-3 md:mb-6">Get in Touch</h3>
            <ul className="space-y-2 md:space-y-4">
              <li className="flex items-start gap-2 md:gap-3 text-gray-300">
                <Mail size={14} className="text-[#F4F4F4] mt-0.5 flex-shrink-0 md:w-[18px] md:h-[18px]" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition text-xs md:text-base break-all">
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-start gap-2 md:gap-3 text-gray-300">
                <Phone size={14} className="text-[#F4F4F4] mt-0.5 flex-shrink-0 md:w-[18px] md:h-[18px]" />
                <a href={`tel:${contactInfo.phone.replace(/\s/g, "")}`} className="hover:text-white transition text-xs md:text-base">
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-start gap-2 md:gap-3 text-gray-300">
                <MapPin size={14} className="text-[#F4F4F4] mt-0.5 flex-shrink-0 md:w-[18px] md:h-[18px]" />
                <span className="text-xs md:text-base">{contactInfo.location}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider mb-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-300 text-sm flex items-center gap-1">
            &copy; {new Date().getFullYear()} Portfolio. Made with <Heart size={14} className="text-red-500 fill-red-500" /> by {ownerName}.
          </p>

          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-gray-300 hover:text-white transition">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition">
              Terms of Service
            </a>
          </div>

          {/* Scroll to Top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm font-medium text-white hover:text-[#F4F4F4] transition group"
            aria-label="Scroll to top"
          >
            Back to Top
            <ArrowUp size={16} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
