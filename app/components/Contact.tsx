"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, User, Send, Instagram, Linkedin, Github, Twitter, Loader2, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface ContactInfo {
  icon: React.ElementType;
  title: string;
  value: string;
  link: string;
}

const defaultContactInfo: ContactInfo[] = [
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
    value: "Indonesia",
    link: "#",
  },
];

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

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [contactInfo, setContactInfo] = useState(defaultContactInfo);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(defaultSocialLinks);

  // Fetch contact info and social links from settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          // Update contact info
          if (data.email || data.phone || data.location) {
            setContactInfo([
              {
                icon: Mail,
                title: "Email",
                value: data.email || "hello@example.com",
                link: `mailto:${data.email || "hello@example.com"}`,
              },
              {
                icon: Phone,
                title: "Phone",
                value: data.phone || data.whatsapp || "+62 xxx xxxx xxxx",
                link: `tel:${(data.phone || data.whatsapp || "+62").replace(/\s/g, "")}`,
              },
              {
                icon: MapPin,
                title: "Location",
                value: data.location || "Indonesia",
                link: "#",
              },
            ]);
          }
          // Update social links from settings
          setSocialLinks([
            { icon: Instagram, href: data.instagram ? `https://instagram.com/${data.instagram}` : "https://instagram.com", label: "Instagram" },
            { icon: Linkedin, href: data.linkedin || "https://linkedin.com", label: "LinkedIn" },
            { icon: Github, href: data.github || "https://github.com", label: "GitHub" },
            { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch contact settings:", error);
      }
    }
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSent(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        // Reset sent status after 5 seconds
        setTimeout(() => setSent(false), 5000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to send message");
      }
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

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
                const Icon = info.icon as React.ElementType;
                return (
                  <motion.a
                    key={index}
                    href={info.link}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="contact-info-card flex items-center gap-4 group cursor-pointer overflow-hidden"
                  >
                    <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="text-white" size={24} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-gray-500 text-sm">{info.title}</p>
                      <p className="text-white font-medium break-all text-sm sm:text-base">{info.value}</p>
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="contact-input-wrapper">
                <User className="contact-icon" size={20} />
                <input
                  type="text"
                  placeholder="Your Name"
                  className="contact-input"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="contact-input-wrapper">
                <Mail className="contact-icon" size={20} />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="contact-input"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="contact-input-wrapper">
                <Phone className="contact-icon" size={20} />
                <input
                  type="text"
                  placeholder="Subject"
                  className="contact-input"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="contact-input-wrapper contact-textarea-wrapper">
                <Send className="contact-icon" size={20} />
                <textarea
                  placeholder="Tell me about your project..."
                  rows={6}
                  className="contact-textarea"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              {sent ? (
                <div className="w-full bg-green-500 text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2">
                  <CheckCircle size={20} />
                  Message Sent Successfully!
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-white text-[#153448] px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-white/30 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {sending ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
