"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        isScrolled
          ? "top-4 left-4 right-4 mx-auto max-w-4xl"
          : ""
      }`}
    >
      <nav
        className={`flex items-center justify-between px-6 py-4 transition-all duration-300 ease-out ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-gray-100"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <div
          className={`font-headline text-2xl tracking-wide transition-all duration-300 ${
            isScrolled ? "opacity-100" : "opacity-100"
          }`}
        >
          Sidekick
        </div>

        {/* Navigation Links - visible on desktop */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm text-gray-600 hover:text-black transition-colors"
          >
            Features
          </a>
          <a
            href="#about"
            className="text-sm text-gray-600 hover:text-black transition-colors"
          >
            About
          </a>
        </div>

        {/* CTA Button - appears on scroll */}
        <div
          className={`transition-all duration-300 ${
            isScrolled
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-4 pointer-events-none"
          }`}
        >
          <button className="bg-black text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
            Join the Waitlist
          </button>
        </div>
      </nav>
    </header>
  );
}
