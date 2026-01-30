"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/** Hook to detect mobile viewport */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);

  return isMobile;
}
import { SiliconInference } from "@/app/components/NexusHero";
import {
  MemoryAnimation,
  ContextAnimation,
  RetentionAnimation,
  RetrievalAnimation,
} from "./FeatureAnimations";

/** Reasoning animation wrapper */
function ReasoningAnimation() {
  return (
    <div className="relative w-[340px] h-[280px] overflow-hidden rounded-2xl">
      <SiliconInference />
    </div>
  );
}

/** Feature configuration */
const features = [
  {
    id: "retention",
    label: "RETENTION",
    title: "Judgment that compounds over time",
    icon: RetentionAnimation,
    points: [
      "Every decision strengthens the next one.",
      "Lessons learned once, applied forever.",
      "Your thinking gets sharper, not repetitive.",
    ],
  },
  {
    id: "context",
    label: "CONTEXT",
    title: "BUILD ON WHAT YOU KNOW",
    icon: ContextAnimation,
    points: [
      "Decisions linked to past reasoning and outcomes.",
      "Tradeoffs and patterns automatically connected.",
      "Every choice informed by everything you've learned.",
    ],
  },
  {
    id: "memory",
    label: "MEMORY",
    title: "Never lose a thread",
    icon: MemoryAnimation,
    points: [
      "Every conversation, decision, and thought automatically saved.",
      "Nothing slips through. Everything searchable. Always there.",
      "Captures meetings, notes, and stray thoughts instantly.",
    ],
  },
  {
    id: "retrieval",
    label: "RETRIEVAL",
    title: "Find what matters, instantly",
    icon: RetrievalAnimation,
    points: [
      "Ask anything. Get the exact context you need.",
      "No digging through docs or reconstructing threads.",
      "Right answer, right moment, zero friction.",
    ],
  },
  {
    id: "reasoning",
    label: "REASONING",
    title: "Think alongside someone who remembers",
    icon: ReasoningAnimation,
    points: [
      "Challenges your assumptions with your own history.",
      "Spots patterns you're too close to see.",
      "Pushes back when past decisions contradict current thinking.",
    ],
  },
];

/**
 * FeatureSwitcher Component
 * Tab-based feature showcase with animated visualizations
 */
export default function FeatureSwitcher() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeFeature = features[activeIndex];
  const isMobile = useIsMobile();

  return (
    <section id="features" className="relative py-24 px-6 lg:px-8 overflow-hidden mt-5">
      {/* Global Noise Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center mb-12 mt-10 space-y-3 px-4">
          <h2 className="text-2xl md:text-3xl font-medium tracking-tighter text-white text-center">
            What makes Sidekick intelligent
          </h2>
          <p className="max-w-2xl text-center text-xs md:text-sm font-mono uppercase tracking-[0.2em] text-zinc-500 leading-relaxed">
            A singular memory layer that weaves your apps into a unified digital nervous system.
          </p>
        </div>

        {/* Tab Navigation */}
        <div
          className="relative flex flex-wrap justify-center gap-2 mb-8 p-1.5 rounded-2xl mx-auto w-fit"
          style={{
            border: "1px solid rgba(255, 255, 255, 0.15)",
            background: "rgba(255, 255, 255, 0.02)",
          }}
        >
          {features.map((feature, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={feature.id}
                onClick={() => setActiveIndex(index)}
                className="relative px-5 py-2 text-xs font-semibold tracking-[0.08em] rounded-xl overflow-hidden transition-colors duration-200"
                style={{
                  color: isActive ? "#FFFFFF" : "#71717A",
                  WebkitFontSmoothing: "antialiased",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "#FFFFFF";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "#71717A";
                  }
                }}
              >
                {/* Active Tab Background */}
                {isActive && (
                  <motion.span
                    layoutId={isMobile ? undefined : "activeTabBackground"}
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: "linear-gradient(90deg, #B34B71 0%, #8B2D5A 50%, #4A0404 100%)",
                      borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                    transition={
                      isMobile
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }
                    }
                  />
                )}
                {/* Dither Layer */}
                {isActive && (
                  <motion.span
                    className="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-soft-light"
                    style={{
                      backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAACpJREFUGFdjZEADJgY0QCSTBaYByicmJmByyAImBl0AXQCmAsYA0wByAAsvBg8f889VAAAAAElFTkSuQmCC")`,
                      backgroundRepeat: "repeat",
                    }}
                    initial={isMobile ? false : { scale: 0.98 }}
                    animate={isMobile ? {} : { scale: [0.98, 1, 0.98] }}
                    transition={isMobile ? { duration: 0 } : { duration: 0.15 }}
                  />
                )}
                <span
                  className="relative z-10"
                  style={{
                    textShadow: isActive ? "0 1px 2px rgba(0,0,0,0.3)" : "none",
                  }}
                >
                  {feature.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feature Card */}
        <div className="relative">
          <div className="relative rounded-xl p-3 md:p-8">
            <div className="relative rounded-3xl overflow-hidden border border-white/20">
              <div className="flex flex-col md:flex-row h-auto md:h-[420px]">
                {/* Left: Content */}
                <div className="w-full md:w-[40%] p-6 md:p-12 flex flex-col justify-center overflow-hidden text-center md:text-left">
                  {/* Top dotted line */}
                  <div
                    className="w-full h-px mb-6"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(255,255,255,0.2) 50%, transparent 50%)",
                      backgroundSize: "8px 1px",
                      backgroundRepeat: "repeat-x",
                    }}
                  />

                  {/* Animated content */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeFeature.id}
                      initial={isMobile ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={isMobile ? {} : { opacity: 0, y: -10 }}
                      transition={isMobile ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }}
                    >
                      <h3
                        className="font-headline text-2xl md:text-2xl text-white mb-4"
                        style={{
                          letterSpacing: "0.03em",
                          WebkitFontSmoothing: "antialiased",
                        }}
                      >
                        {activeFeature.title.toUpperCase()}
                      </h3>

                      {activeFeature.points && (
                        <ul className="space-y-4">
                          {activeFeature.points.map((point: string, idx: number) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 justify-center md:justify-start"
                            >
                              <span className="text-[#6A2424] font-bold text-lg leading-none mt-px hidden md:inline">
                                |
                              </span>
                              <span
                                className="font-sans text-sm md:text-base tracking-wide leading-relaxed"
                                style={{ color: "#A1A1AA" }}
                              >
                                {point}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Bottom dotted line */}
                  <div
                    className="w-full h-px mt-6"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(255,255,255,0.2) 50%, transparent 50%)",
                      backgroundSize: "8px 1px",
                      backgroundRepeat: "repeat-x",
                    }}
                  />
                </div>

                {/* Dashed Divider */}
                <div className="hidden md:block w-px relative">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(to bottom, rgba(255,255,255,0.15) 50%, transparent 50%)",
                      backgroundSize: "1px 8px",
                      backgroundRepeat: "repeat-y",
                    }}
                  />
                </div>

                {/* Right: Animation Area - Hidden on mobile */}
                <div className="hidden md:flex w-full md:w-[60%] items-center justify-center p-6 md:p-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeFeature.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      <activeFeature.icon />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-1 rounded-full ${activeIndex === index ? "w-8" : "w-2"}`}
              style={{
                transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
                background:
                  activeIndex === index
                    ? "linear-gradient(90deg, #B34B71 0%, #4A0404 100%)"
                    : "rgba(179, 75, 113, 0.3)",
                boxShadow: activeIndex === index ? "0 0 10px rgba(179, 75, 113, 0.5)" : "none",
              }}
              onMouseEnter={(e) => {
                if (activeIndex !== index) {
                  e.currentTarget.style.background = "rgba(179, 75, 113, 0.5)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeIndex !== index) {
                  e.currentTarget.style.background = "rgba(179, 75, 113, 0.3)";
                }
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
