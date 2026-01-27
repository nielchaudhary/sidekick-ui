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
      className="sticky top-0 z-50 w-full box-border transition-all duration-350 ease-[cubic-bezier(0.33,1,0.68,1)]"
      style={{
        backgroundColor: "#000000",
        borderBottom: isScrolled ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid transparent",
      }}
    >
      <nav className="flex items-center justify-between h-16 px-6 lg:px-8 mx-auto max-w-7xl">
        {/* Logo - Ghost White */}
        <div
          className="font-sans text-xl tracking-wide"
          style={{
            color: "#FFFFFF",
            fontFamily: '"Editorial New", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
            fontWeight: 300,
          }}
        >
          Sidekick
        </div>

        {/* Navigation Links - hidden on scroll */}
        <div
          className={`hidden md:flex items-center gap-8 transition-all duration-350 ease-[cubic-bezier(0.33,1,0.68,1)] ${
            isScrolled ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          {["Agents", "Resources", "Pricing"].map((label) => (
            <a key={label} href="#" className="relative font-sans font-normal text-sm leading-5 text-white group">
              {label}
              <span
                className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full transition-all duration-300 ease-out"
                style={{
                  background: "linear-gradient(90deg, #B34B71 0%, #4A0404 100%)",
                }}
              />
            </a>
          ))}
        </div>

        {/* CTA Button - Black with white border */}
        <button
          className="text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-200"
          style={{
            background: "#000000",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          Join the Waitlist
        </button>
      </nav>
    </header>
  );
}
