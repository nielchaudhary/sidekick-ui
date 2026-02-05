import Image from "next/image";
import { GRADIENTS } from "@/lib/theme";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="relative pt-12 pb-24 md:pt-16 md:pb-32">
      {/* Top Border - Subtle gradient fade */}
      <div className="border-t border-white/[0.1]"></div>

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-6 pt-16">
        <div className="grid grid-cols-12 gap-y-12 lg:gap-y-0 gap-x-8 mb-16">
          {/* Left: Brand Identity (Spans 5 columns on desktop) */}
          <div className="col-span-full lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center">
                <Image src="/favicon.png" alt="Sidekick" width={70} height={30} className="-ml-5" />
                <span className="text-white font-semibold text-xl tracking-tight -ml-4">
                  sidekick
                </span>
              </div>
              <p className="mt-4 text-sm text-white/60 max-w-[280px] leading-relaxed">
                Intelligent memory for people who can&apos;t afford to forget.
              </p>
              <div className="mt-4 text-sm text-white/40">
                &copy; {currentYear} Sidekick. All rights reserved.
              </div>
            </div>
          </div>

          {/* Right: Navigation Links (Spans 7 columns on desktop) */}
          <div className="col-span-full lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Integrations */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-white/40 mb-4">Integrations</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="relative text-sm text-white/60 hover:text-white transition-colors duration-200 inline-block group"
                  >
                    Notion
                    <span
                      className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full transition-all duration-300 ease-out"
                      style={{
                        background: GRADIENTS.primary,
                      }}
                    />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="relative text-sm text-white/60 hover:text-white transition-colors duration-200 inline-block group"
                  >
                    Gmail
                    <span
                      className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full transition-all duration-300 ease-out"
                      style={{
                        background: GRADIENTS.primary,
                      }}
                    />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="relative text-sm text-white/60 hover:text-white transition-colors duration-200 inline-block group"
                  >
                    Google Meet
                    <span
                      className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full transition-all duration-300 ease-out"
                      style={{
                        background: GRADIENTS.primary,
                      }}
                    />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="relative text-sm text-white/60 hover:text-white transition-colors duration-200 inline-block group"
                  >
                    Google Docs
                    <span
                      className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full transition-all duration-300 ease-out"
                      style={{
                        background: GRADIENTS.primary,
                      }}
                    />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="relative text-sm text-white/60 hover:text-white transition-colors duration-200 inline-block group"
                  >
                    Google Sheets
                    <span
                      className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full transition-all duration-300 ease-out"
                      style={{
                        background: GRADIENTS.primary,
                      }}
                    />
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-white/40 mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#about"
                    className="relative text-sm text-white/60 hover:text-white transition-colors duration-200 inline-block group"
                  >
                    About
                    <span
                      className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full transition-all duration-300 ease-out"
                      style={{
                        background: GRADIENTS.primary,
                      }}
                    />
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="relative text-sm text-white/60 hover:text-white transition-colors duration-200 inline-block group"
                  >
                    Pricing
                    <span
                      className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full transition-all duration-300 ease-out"
                      style={{
                        background: GRADIENTS.primary,
                      }}
                    />
                  </a>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-white/40 mb-4">Connect</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative text-sm text-white/60 hover:text-white transition-colors duration-200 inline-block group"
                  >
                    Twitter / X
                    <span
                      className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full transition-all duration-300 ease-out"
                      style={{
                        background: GRADIENTS.primary,
                      }}
                    />
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative text-sm text-white/60 hover:text-white transition-colors duration-200 inline-block group"
                  >
                    LinkedIn
                    <span
                      className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full transition-all duration-300 ease-out"
                      style={{
                        background: GRADIENTS.primary,
                      }}
                    />
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative text-sm text-white/60 hover:text-white transition-colors duration-200 inline-block group"
                  >
                    GitHub
                    <span
                      className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full transition-all duration-300 ease-out"
                      style={{
                        background: GRADIENTS.primary,
                      }}
                    />
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:hello@sidekick.ai"
                    className="relative text-sm text-white/60 hover:text-white transition-colors duration-200 inline-block group"
                  >
                    Email
                    <span
                      className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full transition-all duration-300 ease-out"
                      style={{
                        background: GRADIENTS.primary,
                      }}
                    />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
