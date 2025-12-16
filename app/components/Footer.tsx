"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Heart, Instagram, Linkedin, Github, Twitter, ArrowUp } from "lucide-react";
import Link from "next/link";

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

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="#home" className="logo-gradient text-2xl font-bold tracking-tight">
              Portfolio
            </Link>
            <p className="text-gray-600 leading-relaxed">
              Creating stunning visuals and memorable experiences through photography and design.
            </p>
            <div className="flex gap-3">
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
                    <Icon size={18} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="footer-link inline-block">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-6">Services</h3>
            <ul className="space-y-3">
              {navigation.services.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="footer-link inline-block">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-6">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-600">
                <Mail size={18} className="text-[#065039] mt-1 flex-shrink-0" />
                <a href="mailto:hello@example.com" className="hover:text-[#065039] transition">
                  hello@example.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <Phone size={18} className="text-[#065039] mt-1 flex-shrink-0" />
                <a href="tel:+1234567890" className="hover:text-[#065039] transition">
                  +1 234 567 890
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <MapPin size={18} className="text-[#065039] mt-1 flex-shrink-0" />
                <span>Istanbul, Turkey</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider mb-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm flex items-center gap-1">
            &copy; {new Date().getFullYear()} Portfolio. Made with <Heart size={14} className="text-red-500 fill-red-500" /> by Can.
          </p>
          
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-gray-600 hover:text-[#065039] transition">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-[#065039] transition">
              Terms of Service
            </a>
          </div>

          {/* Scroll to Top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm font-medium text-[#065039] hover:text-[#10a879] transition group"
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
