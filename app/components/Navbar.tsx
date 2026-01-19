"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white box-border transition-all duration-350 ease-[cubic-bezier(0.33,1,0.68,1)] ${
        isScrolled ? "border-b border-gray-300" : "border-b border-transparent"
      }`}
    >
      <nav className="flex items-center justify-between h-16 px-6 lg:px-8 mx-auto max-w-7xl">
        {/* Logo */}
        <div className="font-sans text-xl tracking-wide">
          Sidekick
        </div>

        {/* Navigation Links - hidden on scroll */}
        <div
          className={`hidden md:flex items-center gap-8 transition-all duration-350 ease-[cubic-bezier(0.33,1,0.68,1)] ${
            isScrolled
              ? "opacity-0 pointer-events-none"
              : "opacity-100"
          }`}
        >
          <a
            href="#"
            className="font-sans font-normal text-sm leading-5 text-black hover:text-gray-600 transition-colors"
          >
            Agents
          </a>
          <a
            href="#"
            className="font-sans font-normal text-sm leading-5 text-black hover:text-gray-600 transition-colors"
          >
            Resources
          </a>
          <a
            href="#"
            className="font-sans font-normal text-sm leading-5 text-black hover:text-gray-600 transition-colors"
          >
            Pricing
          </a>
        </div>

        {/* CTA Button - always visible, pill-shaped */}
        <button className="bg-black text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors">
          Join the Waitlist
        </button>
      </nav>
    </header>
  );
}
