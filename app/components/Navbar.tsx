"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "gallery", label: "Portfolio" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Auto-detect active section
      const scrollPosition = window.scrollY + 100;
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActive(section.id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 py-5 ${
          scrolled ? "navbar-glass shadow-lg" : "bg-[#153448]/80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <a href="#home" className="text-[#f4f4f4] text-2xl font-bold tracking-tight">
            Portfolio
          </a>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-10">
            {sections.map((sec) => (
              <li key={sec.id}>
                <a
                  href={`#${sec.id}`}
                  onClick={() => setActive(sec.id)}
                  className={`nav-link text-sm font-medium tracking-wide ${
                    active === sec.id
                      ? "text-[#F4F4F4] active"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {sec.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="#contact"
              className="bg-[#f4f4f4] text-[#153448] px-7 py-3 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-[#f4f4f4]/30 transition-all duration-300 hover:scale-105"
            >
              Let's Talk
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="fixed inset-0 z-40 bg-[#153448]/95 backdrop-blur-lg md:hidden">
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            {sections.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                onClick={() => {
                  setActive(sec.id);
                  setMobileMenu(false);
                }}
                className={`text-2xl font-medium transition-colors ${
                  active === sec.id
                    ? "text-[#F4F4F4]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {sec.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileMenu(false)}
              className="bg-[#f4f4f4] text-[#153448] px-8 py-3.5 rounded-full text-lg font-medium mt-6"
            >
              Let's Talk
            </a>
          </div>
        </div>
      )}
    </>
  );
}
