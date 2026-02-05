"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { GRADIENTS, COLORS, BORDERS } from "@/lib/theme";

const NavbarItems = ["Features", "Integrations"];

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
        backgroundColor: COLORS.black.full,
        borderBottom: isScrolled
          ? `1px solid ${BORDERS.ghostSubtle}`
          : `1px solid ${BORDERS.transparent}`,
      }}
    >
      <nav className="flex items-center justify-between h-16 px-6 lg:px-8 mx-auto max-w-8xl">
        {/* Logo */}
        <a href="https://sidekick.runtimelabs.space" className="flex items-center">
          <Image src="/favion.png" alt="Sidekick" width={75} height={30} priority />
          <span className="text-white font-semibold text-xl tracking-tight -ml-6">sidekick</span>
        </a>

        {/* Navigation Links - hidden on scroll - unhide this later on after deploying the entire app */}
        {/* <div
          className={`hidden md:flex items-center gap-8 transition-all duration-350 ease-[cubic-bezier(0.33,1,0.68,1)] ${
            isScrolled ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          {NavbarItems.map((label) => (
            <a
              key={label}
              href="#"
              className="relative font-sans font-normal text-sm leading-5 text-white group"
            >
              {label}
              <span
                className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full transition-all duration-300 ease-out"
                style={{
                  background: GRADIENTS.primary,
                }}
              />
            </a>
          ))}
        </div> */}

        {/* CTA Button - Black with white border */}
        <button
          className="text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-200"
          style={{
            background: COLORS.black.full,
            border: `1px solid ${COLORS.white[20]}`,
          }}
        >
          Join the Waitlist
        </button>
      </nav>
    </header>
  );
}
