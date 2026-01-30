"use client";

import RetrievalNexus from "./RetrievalNexus";
import SiliconInference from "./SiliconInference";
import { Highlighter } from "@/components/ui/highlighter";

// Export both animation components for flexible use
export { RetrievalNexus, SiliconInference };
import { GRADIENTS, COLORS } from "@/lib/theme";

interface Offering {
  id: string;
  title: string;
  body: string;
}

const offerings: Offering[] = [
  {
    id: "capture",
    title: "Capture",
    body: "Voice, text, data captured instantly.",
  },
  {
    id: "retrieve",
    title: "Retrieve",
    body: "Find what you decided, exactly when needed.",
  },
  {
    id: "reason",
    title: "Reason",
    body: "Challenge assumptions with your own history.",
  },
];

export default function NexusHero() {
  return (
    <section className="relative min-h-screen md:h-screen w-full overflow-hidden">
      {/* SVG Filter for Grain Effect */}
      <svg className="hidden">
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
      </svg>

      {/* Ghost Border - Vertical Separator */}
      <div
        className="absolute left-1/2 top-0 bottom-0 w-px hidden lg:block z-10 pointer-events-none"
        style={{
          background: GRADIENTS.glassReflection,
        }}
      />

      <div className="relative h-full flex flex-col lg:flex-row">
        {/* Left Side: The Narrative */}
        <div className="z-20 w-full lg:w-1/2 flex flex-col justify-center px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 pt-20 sm:pt-24 md:pt-28 lg:pt-0 pb-8 lg:pb-0">
          {/* Typography */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-[-0.02em] leading-[0.9] text-white mb-4 sm:mb-5 md:mb-6 mt-3 sm:mt-4 md:mt-5"
            style={{
              fontFamily:
                '"Editorial New", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
              fontWeight: 300,
            }}
          >
            <span
              style={{
                background: GRADIENTS.primary,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Memory
            </span>{" "}
            <span className="text-zinc-700">is</span> <br />
            <span className="text-zinc-700 transition-colors duration-700 ">the MOAT.</span>
          </h1>

          <p className="max-w-xl text-zinc-300 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 md:mb-10 font-semibold">
            What if you had instant answers from every decision you&apos;ve made? Sidekick remembers
            your context and surfaces it exactly when it matters,
            <Highlighter action="underline" color={COLORS.burgundy.primary} strokeWidth={2} isView>
              turning past thinking into present clarity
            </Highlighter>
            .
          </p>

          {/* Interactive Offerings / Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 sm:gap-3 md:gap-6 border-l sm:border-l-0 lg:border-l border-white/10 pl-4 sm:pl-0 lg:pl-6 mb-8 sm:mb-10 md:mb-12">
            {offerings.map((offering, i) => (
              <div
                key={offering.id}
                className="group cursor-pointer sm:border-l lg:border-l-0 sm:border-white/10 sm:pl-3 lg:pl-0"
              >
                <h3 className="text-white font-semibold flex items-center gap-2 text-sm sm:text-base">
                  <span className="text-[10px] text-zinc-600">0{i + 1}</span> {offering.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors">
                  {offering.body}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <button className="group w-full sm:w-auto bg-black text-white px-6 sm:px-8 py-3 text-sm font-medium border rounded-2xl border-gray-800 cursor-pointer flex items-center justify-center sm:justify-start gap-2 transition-all duration-300 hover:border-gray-600 active:scale-[0.98]">
              Join the waitlist
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="transition-transform duration-300 ease-out rotate-0 group-hover:-rotate-30"
              >
                <path
                  d="M3 8H13M13 8L9 4M13 8L9 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Side: The Retrieval Nexus */}
        <div className="relative w-[90%] sm:w-full lg:w-1/2 h-[65vh] sm:h-[60vh] md:h-[70vh] lg:h-full mx-auto sm:mx-0">
          <div className="relative w-full h-full">
            {/* Retrieval Nexus Animation */}
            <div className="w-full h-full">
              <RetrievalNexus />
            </div>

            {/* Burgundy Bloom */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: GRADIENTS.burgundyBloom,
                animation: "pulse 4s ease-in-out infinite",
              }}
            />

            {/* Noise/Grain Layer */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{ filter: "url(#grain)" }}
            />
          </div>
        </div>
      </div>

      {/* Global Styles for Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
