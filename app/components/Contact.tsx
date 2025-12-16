"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, User, Send, Instagram, Linkedin, Github, Twitter } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "hello@example.com",
    link: "mailto:hello@example.com",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+1 234 567 890",
    link: "tel:+1234567890",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "Turkey, Istanbul",
    link: "#",
  },
];

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
];

export default function Contact() {
  return (
    <section id="contact" className="bg-[#153448] py-24 px-6 shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-light mb-4 text-white">
            Get In <span className="font-bold text-[#F4F4F4]">Touch</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#F4F4F4] to-white mx-auto rounded-full mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Have a project in mind? Let's collaborate and create something amazing together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Side - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-semibold text-white mb-6">
                Let's talk about everything!
              </h3>
              <p className="text-gray-400 leading-relaxed mb-8">
                Don't like forms? Send me an email or reach out through social media. 
                I'm always happy to connect and discuss new projects.
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <motion.a
                    key={index}
                    href={info.link}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="contact-info-card flex items-center gap-4 group cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">{info.title}</p>
                      <p className="text-white font-medium">{info.value}</p>
                    </div>
                  </motion.a>
                );
              })}
            </div>

            {/* Social Links */}
            <div className="pt-6">
              <p className="text-gray-400 mb-4">Follow me on:</p>
              <div className="flex gap-4">
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
                      className="social-link"
                      aria-label={social.label}
                    >
                      <Icon size={20} />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <form className="space-y-6">
              <div className="contact-input-wrapper">
                <User className="contact-icon" size={20} />
                <input
                  type="text"
                  placeholder="Your Name"
                  className="contact-input"
                  required
                />
              </div>

              <div className="contact-input-wrapper">
                <Mail className="contact-icon" size={20} />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="contact-input"
                  required
                />
              </div>

              <div className="contact-input-wrapper">
                <Phone className="contact-icon" size={20} />
                <input
                  type="tel"
                  placeholder="Phone Number (Optional)"
                  className="contact-input"
                />
              </div>

              <div className="contact-input-wrapper contact-textarea-wrapper">
                <Send className="contact-icon" size={20} />
                <textarea
                  placeholder="Tell me about your project..."
                  rows={6}
                  className="contact-textarea"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-white text-[#153448] px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-white/30 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <Send size={20} />
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
