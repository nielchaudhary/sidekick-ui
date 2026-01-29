"use client";

import { cn } from "@/lib/utils";
import { GRADIENTS } from "@/lib/theme";

/**
 * Slack Logo SVG Components
 */
function SlackLogoWhite({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 130 130"
      className={className}
      fill="white"
    >
      <path d="M27.3,81.8c0,7.5-6.1,13.6-13.6,13.6S0.1,89.3,0.1,81.8c0-7.5,6.1-13.6,13.6-13.6h13.6V81.8z M34.1,81.8c0-7.5,6.1-13.6,13.6-13.6s13.6,6.1,13.6,13.6v34c0,7.5-6.1,13.6-13.6,13.6s-13.6-6.1-13.6-13.6V81.8z" />
      <path d="M47.7,27.2c-7.5,0-13.6-6.1-13.6-13.6S40.2,0,47.7,0s13.6,6.1,13.6,13.6v13.6H47.7z M47.7,34.1c7.5,0,13.6,6.1,13.6,13.6s-6.1,13.6-13.6,13.6H13.6C6.1,61.3,0,55.2,0,47.7s6.1-13.6,13.6-13.6H47.7z" />
      <path d="M102.2,47.7c0-7.5,6.1-13.6,13.6-13.6s13.6,6.1,13.6,13.6s-6.1,13.6-13.6,13.6h-13.6V47.7z M95.4,47.7c0,7.5-6.1,13.6-13.6,13.6s-13.6-6.1-13.6-13.6V13.6C68.2,6.1,74.3,0,81.8,0s13.6,6.1,13.6,13.6V47.7z" />
      <path d="M81.8,102.2c7.5,0,13.6,6.1,13.6,13.6s-6.1,13.6-13.6,13.6s-13.6-6.1-13.6-13.6v-13.6H81.8z M81.8,95.4c-7.5,0-13.6-6.1-13.6-13.6s6.1-13.6,13.6-13.6h34.1c7.5,0,13.6,6.1,13.6,13.6s-6.1,13.6-13.6,13.6H81.8z" />
    </svg>
  );
}

function SlackLogoColor({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 130 130"
      className={className}
    >
      <path
        d="M27.3,81.8c0,7.5-6.1,13.6-13.6,13.6S0.1,89.3,0.1,81.8c0-7.5,6.1-13.6,13.6-13.6h13.6V81.8z M34.1,81.8c0-7.5,6.1-13.6,13.6-13.6s13.6,6.1,13.6,13.6v34c0,7.5-6.1,13.6-13.6,13.6s-13.6-6.1-13.6-13.6V81.8z"
        fill="#E01E5A"
      />
      <path
        d="M47.7,27.2c-7.5,0-13.6-6.1-13.6-13.6S40.2,0,47.7,0s13.6,6.1,13.6,13.6v13.6H47.7z M47.7,34.1c7.5,0,13.6,6.1,13.6,13.6s-6.1,13.6-13.6,13.6H13.6C6.1,61.3,0,55.2,0,47.7s6.1-13.6,13.6-13.6H47.7z"
        fill="#36C5F0"
      />
      <path
        d="M102.2,47.7c0-7.5,6.1-13.6,13.6-13.6s13.6,6.1,13.6,13.6s-6.1,13.6-13.6,13.6h-13.6V47.7z M95.4,47.7c0,7.5-6.1,13.6-13.6,13.6s-13.6-6.1-13.6-13.6V13.6C68.2,6.1,74.3,0,81.8,0s13.6,6.1,13.6,13.6V47.7z"
        fill="#2EB67D"
      />
      <path
        d="M81.8,102.2c7.5,0,13.6,6.1,13.6,13.6s-6.1,13.6-13.6,13.6s-13.6-6.1-13.6-13.6v-13.6H81.8z M81.8,95.4c-7.5,0-13.6-6.1-13.6-13.6s6.1-13.6,13.6-13.6h34.1c7.5,0,13.6,6.1,13.6,13.6s-6.1,13.6-13.6,13.6H81.8z"
        fill="#ECB22E"
      />
    </svg>
  );
}

/**
 * Integration data - curated list with brand colors for hover glow effect
 */
const integrations = [
  {
    name: "Notion",
    logoWhite: "https://cdn.simpleicons.org/notion/white",
    logoColor: "https://cdn.simpleicons.org/notion",
    color: "rgba(255, 255, 255, 0.4)",
    desc: "Knowledge Base",
  },
  {
    name: "Slack",
    logoWhite: "https://cdn.simpleicons.org/slack/white",
    logoColor: "https://cdn.simpleicons.org/slack",
    color: "rgba(74, 21, 75, 0.6)",
    desc: "Communication",
  },
  {
    name: "Gmail",
    logoWhite: "https://cdn.simpleicons.org/gmail/white",
    logoColor: "https://cdn.simpleicons.org/gmail",
    color: "rgba(234, 67, 53, 0.5)",
    desc: "Email Protocol",
  },
  {
    name: "GitHub",
    logoWhite: "https://cdn.simpleicons.org/github/white",
    logoColor: "https://cdn.simpleicons.org/github",
    color: "rgba(36, 41, 47, 0.8)",
    desc: "Source Control",
  },
  {
    name: "Discord",
    logoWhite: "https://cdn.simpleicons.org/discord/white",
    logoColor: "https://cdn.simpleicons.org/discord",
    color: "rgba(88, 101, 242, 0.5)",
    desc: "Community",
  },
  {
    name: "Linear",
    logoWhite: "https://cdn.simpleicons.org/linear/white",
    logoColor: "https://cdn.simpleicons.org/linear",
    color: "rgba(94, 106, 210, 0.6)",
    desc: "Issue Tracking",
  },
];

/**
 * IntegrationCard - Individual card with ghosted state and hover excitation
 */
function IntegrationCard({
  name,
  logoWhite,
  logoColor,
  color,
  desc,
}: {
  name: string;
  logoWhite: string;
  logoColor: string;
  color: string;
  desc: string;
}) {
  return (
    <figure
      className={cn(
        "group relative w-52 cursor-pointer overflow-hidden rounded-xl border p-4 transition-all duration-500 shrink-0",
        // State I: Substrate - Dimmed & Ghosted
        "border-white/5 bg-white/1 opacity-40 grayscale-100",
        // State II: Excitation - Glowing & Vibrant on hover
        "hover:opacity-100 hover:grayscale-0 hover:border-white/20 hover:bg-white/5"
      )}
      style={{
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div className="flex flex-row items-center gap-3">
        <div className="relative w-7 h-7">
          {/* White logo - visible by default, hidden on hover */}
          <img
            className="absolute inset-0 z-10 transition-opacity duration-500 opacity-100 group-hover:opacity-0"
            width="28"
            height="28"
            alt={name}
            src={logoWhite}
          />
          {/* Colored logo - hidden by default, visible on hover */}
          <img
            className="absolute inset-0 z-10 transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-110"
            width="28"
            height="28"
            alt={name}
            src={logoColor}
          />
          {/* Photonic Bloom - Glow layer on hover */}
          <div
            className="absolute inset-0 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-70 scale-150"
            style={{ backgroundColor: color }}
          />
        </div>
        <div className="flex flex-col">
          {/* Name with gradient on hover */}
          <figcaption
            className="text-[13px] font-medium tracking-tight transition-all duration-500"
            style={{ fontFamily: "Geist Mono, monospace" }}
          >
            <span
              className="bg-clip-text transition-all duration-500"
              style={{
                background: GRADIENTS.primary,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "rgba(255, 255, 255, 0.7)",
                WebkitTextFillColor: "rgba(255, 255, 255, 0.7)",
              }}
            >
              <span className="group-hover:[-webkit-text-fill-color:transparent] group-hover:text-transparent transition-all duration-500">
                {name}
              </span>
            </span>
          </figcaption>
          <p
            className="text-[10px] uppercase tracking-widest text-white/30 transition-colors duration-500 group-hover:text-white/50"
            style={{ fontFamily: "Geist Mono, monospace" }}
          >
            {desc}
          </p>
        </div>
      </div>

      {/* Gas-discharge lamp effect - Brand color bleed on hover */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-500 opacity-0 group-hover:opacity-100 rounded-xl"
        style={{
          boxShadow: `0 0 30px ${color}, inset 0 0 20px ${color.replace(/[\d.]+\)$/, "0.1)")}`,
        }}
      />

      {/* Glass shine overlay */}
      <div className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100 bg-linear-to-br from-white/8 via-transparent to-transparent rounded-xl" />
    </figure>
  );
}

/**
 * IntegrationMarquee - The Nexus Flux integration showcase
 */
export function IntegrationMarquee() {
  return (
    <div className="group/marquee relative flex w-full flex-col items-center justify-center overflow-hidden py-10 [--duration:40s] [--gap:2rem]">
      {/* The Unified Flux Stream */}
      <div className="flex w-full overflow-hidden">
        <div className="flex shrink-0 items-center gap-(--gap) animate-marquee group-hover/marquee:[animation-play-state:paused]">
          {integrations.map((item) => (
            <IntegrationCard key={item.name} {...item} />
          ))}
        </div>
        <div
          className="flex shrink-0 items-center gap-(--gap) animate-marquee group-hover/marquee:[animation-play-state:paused]"
          aria-hidden="true"
        >
          {integrations.map((item) => (
            <IntegrationCard key={`${item.name}-clone`} {...item} />
          ))}
        </div>
      </div>

      {/* Edge Vignettes - Logos emerge from shadows */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-black via-black/80 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l from-black via-black/80 to-transparent" />
    </div>
  );
}

export default IntegrationMarquee;
