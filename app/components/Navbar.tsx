"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "gallery", label: "Portfolio" },
  { id: "contact", label: "Contact" },
];

// Animated Hamburger Icon Component
function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="w-6 h-5 relative flex flex-col justify-between">
      <span
        className={`block h-0.5 w-full bg-white rounded-full transition-all duration-300 ease-in-out origin-left ${isOpen ? "rotate-45 translate-x-[3px] -translate-y-[1px]" : ""
          }`}
      />
      <span
        className={`block h-0.5 w-full bg-white rounded-full transition-all duration-300 ease-in-out ${isOpen ? "opacity-0 translate-x-4" : ""
          }`}
      />
      <span
        className={`block h-0.5 w-full bg-white rounded-full transition-all duration-300 ease-in-out origin-left ${isOpen ? "-rotate-45 translate-x-[3px] translate-y-[1px]" : ""
          }`}
      />
    </div>
  );
}

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
        className={`fixed top-0 w-full z-50 transition-all duration-300 py-5 ${scrolled ? "navbar-glass shadow-lg" : "bg-[#153448]/80"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Hakim
            </span>
          </a>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-8">
            {sections.map((sec) => (
              <li key={sec.id}>
                <a
                  href={`#${sec.id}`}
                  onClick={() => setActive(sec.id)}
                  className={`nav-link text-sm font-medium tracking-wide ${active === sec.id
                    ? "text-teal-400 active"
                    : "text-gray-300 hover:text-white"
                    }`}
                >
                  {sec.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right Side - Theme Toggle & CTA */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <a
              href="#contact"
              className="bg-gradient-to-r from-teal-400 to-cyan-400 text-white px-7 py-3 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300 hover:scale-105"
            >
              Let's Talk
            </a>
          </div>

          {/* Mobile - Theme Toggle & Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="text-white p-2"
              aria-label="Toggle menu"
            >
              <HamburgerIcon isOpen={mobileMenu} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#153448]/95 backdrop-blur-lg md:hidden transition-all duration-500 ease-in-out ${mobileMenu
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-full pointer-events-none"
          }`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {sections.map((sec, index) => (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              onClick={() => {
                setActive(sec.id);
                setMobileMenu(false);
              }}
              className={`text-2xl font-medium transition-all duration-300 ${active === sec.id
                ? "text-teal-400"
                : "text-gray-400 hover:text-white"
                }`}
              style={{
                transitionDelay: mobileMenu ? `${index * 100}ms` : "0ms",
                opacity: mobileMenu ? 1 : 0,
                transform: mobileMenu ? "translateY(0)" : "translateY(20px)",
              }}
            >
              {sec.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileMenu(false)}
            className="bg-gradient-to-r from-teal-400 to-cyan-400 text-white px-8 py-3.5 rounded-full text-lg font-medium mt-6 transition-all duration-300"
            style={{
              transitionDelay: mobileMenu ? `${sections.length * 100}ms` : "0ms",
              opacity: mobileMenu ? 1 : 0,
              transform: mobileMenu ? "translateY(0)" : "translateY(20px)",
            }}
          >
            Let's Talk
          </a>
        </div>
      </div>
    </>
  );
}
