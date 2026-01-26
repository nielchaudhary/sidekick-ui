"use client";

import RetrievalNexus from "./RetrievalNexus";

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
    <section className="relative h-screen w-full overflow-hidden">
      {/* SVG Filter for Grain Effect */}
      <svg className="hidden">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
      </svg>

      {/* Ghost Border - Vertical Separator */}
      <div
        className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent)",
        }}
      />

      <div className="relative h-full flex flex-col md:flex-row">
        {/* Left Side: The Narrative */}
        <div className="z-20 w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-24 md:pt-0">
          {/* Typography */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl tracking-[-0.02em] leading-[0.9] text-white mb-6 mt-5"
            style={{
              fontFamily: '"Editorial New", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
              fontWeight: 300,
            }}
          >
            <span
              style={{
                background: "linear-gradient(90deg, #B34B71 0%, #4A0404 100%)",
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

          <p className="max-w-lg text-zinc-300 text-lg leading-relaxed mb-12 font-semibold">
            What if you had instant answers from every decision you've made? Sidekick remembers your context and
            surfaces it exactly when it matters, turning past thinking into present clarity.
          </p>

          {/* Interactive Offerings / Pillars */}
          <div className="grid grid-cols-1 gap-6 border-l border-white/10 pl-6 mb-12">
            {offerings.map((offering, i) => (
              <div key={offering.id} className="group cursor-pointer">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <span className="text-[10px] text-zinc-600">0{i + 1}</span> {offering.title}
                </h3>
                <p className="text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors">{offering.body}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-6">
            <button className="group bg-black text-white px-8 py-3 text-sm font-medium border rounded-2xl border-gray-800 cursor-pointer flex items-center gap-2 transition-all duration-300 hover:border-gray-600">
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
        <div className="absolute inset-0 md:relative md:w-1/2 h-full">
          <div className="relative w-full h-full">
            {/* Retrieval Nexus Animation */}
            <div className="w-full h-full opacity-60 md:opacity-100">
              <RetrievalNexus />
            </div>

            {/* Burgundy Bloom */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(circle at 50% 50%, rgba(179,75,113,0.1), transparent 70%)",
                animation: "pulse 4s ease-in-out infinite",
              }}
            />

            {/* Noise/Grain Layer */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ filter: "url(#grain)" }} />
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
