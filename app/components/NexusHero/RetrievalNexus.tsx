"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database } from "lucide-react";

type AppPhase =
  | "idle"
  | "sending"
  | "retrieving"
  | "ingestion"
  | "crossReferencing"
  | "judgment"
  | "responding"
  | "storing";

interface MemorySource {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
}

interface BulletPoint {
  text: string;
  keyword: string;
  suffix: string;
}

interface Message {
  role: "user" | "assistant";
  content?: string;
  bullets?: BulletPoint[];
}

// Five data sources positioned around the orb (pentagon arrangement, 20% longer connectors)
const MEMORY_SOURCES: MemorySource[] = [
  { id: "sidekick-db", label: "Sidekick DB", x: 50, y: 24, color: "#B34B71" },
  { id: "notion", label: "Notion", x: 74, y: 38, color: "#FFFFFF" },
  { id: "slack", label: "Slack", x: 67, y: 72, color: "#E01E5A" },
  { id: "gmail", label: "Gmail", x: 33, y: 72, color: "#EA4335" },
  { id: "sheets", label: "Google Sheets", x: 26, y: 38, color: "#34A853" },
];

const DEMO_CONVERSATION = {
  userMessage: "What were the key decisions from my Pfizer meetings?",
  assistantBullets: [
    { text: "Budget approved at ", keyword: "$2.4M", suffix: " for Q2 expansion" },
    { text: "API blocker resolved by switching to ", keyword: "new SDK", suffix: "" },
    { text: "Next review scheduled for ", keyword: "March 15th", suffix: "" },
  ],
  sourcesToActivate: ["sidekick-db", "notion", "slack", "gmail", "sheets"],
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Brand Logo Components
function NotionLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
      <path d="M6.017 4.313l55.333 -4.087c6.797 -0.583 8.543 -0.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277 -1.553 6.807 -6.99 7.193L24.467 99.967c-4.08 0.193 -6.023 -0.39 -8.16 -3.113L3.3 79.94c-2.333 -3.113 -3.3 -5.443 -3.3 -8.167V11.113c0 -3.497 1.553 -6.413 6.017 -6.8z" fill="#fff"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M61.35 0.227l-55.333 4.087C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723 0.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257 -3.89c5.433 -0.387 6.99 -2.917 6.99 -7.193V20.64c0 -2.21 -0.873 -2.847 -3.443 -4.733L74.167 3.143c-4.273 -3.107 -6.02 -3.5 -12.817 -2.917zM25.92 19.523c-5.247 0.353 -6.437 0.433 -9.417 -1.99L8.927 11.507c-0.77 -0.78 -0.383 -1.753 1.557 -1.947l53.193 -3.887c4.467 -0.39 6.793 1.167 8.54 2.527l9.123 6.61c0.39 0.197 1.36 1.36 0.193 1.36l-54.933 3.307 -0.68 0.047zM19.803 88.3V30.367c0 -2.53 0.777 -3.697 3.103 -3.893L86 22.78c2.14 -0.193 3.107 1.167 3.107 3.693v57.547c0 2.53 -0.39 4.67 -3.883 4.863l-60.377 3.5c-3.493 0.193 -5.043 -0.97 -5.043 -4.083zm59.6 -54.827c0.387 1.75 0 3.5 -1.75 3.7l-2.91 0.577v42.773c-2.527 1.36 -4.853 2.137 -6.797 2.137 -3.107 0 -3.883 -0.973 -6.21 -3.887l-19.03 -29.94v28.967l6.02 1.363s0 3.5 -4.857 3.5l-13.39 0.777c-0.39 -0.78 0 -2.723 1.357 -3.11l3.497 -0.97v-38.3L30.48 40.667c-0.39 -1.75 0.58 -4.277 3.3 -4.473l14.367 -0.967 19.8 30.327v-26.83l-5.047 -0.58c-0.39 -2.143 1.163 -3.7 3.103 -3.89l13.4 -0.78z" fill="#000"/>
    </svg>
  );
}

function SlackLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 128 128" fill="none">
      <path d="M27.255 80.719c0 7.33-5.978 13.317-13.309 13.317C6.616 94.036.63 88.049.63 80.719s5.987-13.317 13.317-13.317h13.309zm6.709 0c0-7.33 5.987-13.317 13.317-13.317s13.317 5.986 13.317 13.317v33.335c0 7.33-5.986 13.317-13.317 13.317-7.33 0-13.317-5.987-13.317-13.317z" fill="#DE1C59"/>
      <path d="M47.281 27.255c-7.33 0-13.317-5.978-13.317-13.309C33.964 6.616 39.951.63 47.281.63s13.317 5.987 13.317 13.317v13.309zm0 6.709c7.33 0 13.317 5.987 13.317 13.317s-5.986 13.317-13.317 13.317H13.946C6.616 60.598.63 54.612.63 47.281c0-7.33 5.987-13.317 13.317-13.317z" fill="#35C5F0"/>
      <path d="M100.745 47.281c0-7.33 5.978-13.317 13.309-13.317 7.33 0 13.317 5.987 13.317 13.317s-5.987 13.317-13.317 13.317h-13.309zm-6.709 0c0 7.33-5.987 13.317-13.317 13.317s-13.317-5.986-13.317-13.317V13.946C67.402 6.616 73.388.63 80.719.63c7.33 0 13.317 5.987 13.317 13.317z" fill="#2EB67D"/>
      <path d="M80.719 100.745c7.33 0 13.317 5.978 13.317 13.309 0 7.33-5.987 13.317-13.317 13.317s-13.317-5.987-13.317-13.317v-13.309zm0-6.709c-7.33 0-13.317-5.987-13.317-13.317s5.986-13.317 13.317-13.317h33.335c7.33 0 13.317 5.986 13.317 13.317 0 7.33-5.987 13.317-13.317 13.317z" fill="#ECB22D"/>
    </svg>
  );
}

function GmailLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/>
    </svg>
  );
}

function GoogleSheetsLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M19.5 24h-15A2.5 2.5 0 0 1 2 21.5v-19A2.5 2.5 0 0 1 4.5 0h10l7.5 7.5v14a2.5 2.5 0 0 1-2.5 2.5z" fill="#0F9D58"/>
      <path d="M14.5 0v5a2.5 2.5 0 0 0 2.5 2.5h5" fill="#87CEAC"/>
      <path d="M6 12h12v9H6z" fill="#fff"/>
      <path d="M6 15h12M6 18h12M10 12v9M14 12v9" stroke="#0F9D58" strokeWidth="0.5"/>
    </svg>
  );
}

// Icon Wrapper
function SourceIcon({ id, color, isActive }: { id: string; color: string; isActive: boolean }) {
  const getIcon = () => {
    switch (id) {
      case "sidekick-db": return <Database size={20} strokeWidth={1.5} />;
      case "notion": return <NotionLogo />;
      case "slack": return <SlackLogo />;
      case "gmail": return <GmailLogo />;
      case "sheets": return <GoogleSheetsLogo />;
      default: return null;
    }
  };

  return (
    <motion.div
      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border border-white/10"
      style={{
        background: id === "sidekick-db"
          ? `linear-gradient(135deg, rgba(20,20,20,0.9) 0%, rgba(10,10,10,0.95) 100%)`
          : `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,240,240,0.9) 100%)`,
        color: color,
      }}
      animate={isActive ? {
        scale: [1, 1.08, 1],
        opacity: [0.5, 1, 1],
        boxShadow: [
          `0 0 0 rgba(${hexToRgb(color)}, 0)`,
          `0 0 20px rgba(${hexToRgb(color)}, 0.5)`,
          `0 0 10px rgba(${hexToRgb(color)}, 0.3)`,
        ],
      } : { opacity: 0.4 }}
      transition={{
        scale: { duration: 0.6, repeat: isActive ? Infinity : 0 },
        opacity: { duration: 0.3 },
        boxShadow: { duration: 0.6, repeat: isActive ? Infinity : 0 },
      }}
    >
      {getIcon()}
    </motion.div>
  );
}

// Helper to convert hex to rgb
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "255, 255, 255";
}

// Typewriter effect component
function TypewriterText({
  text,
  onComplete,
}: {
  text: string;
  onComplete?: () => void;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    setDisplayedText("");
    setIsComplete(false);

    const typeNextChar = () => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
        const char = text[index - 1];
        const baseDelay = 20;
        const charDelay =
          char === " "
            ? baseDelay * 0.5
            : [".", ",", "!", "?"].includes(char)
              ? baseDelay * 2.5
              : baseDelay + Math.random() * 8;
        setTimeout(typeNextChar, charDelay);
      } else {
        setIsComplete(true);
        onComplete?.();
      }
    };

    const timer = setTimeout(typeNextChar, 100);
    return () => clearTimeout(timer);
  }, [text, onComplete]);

  return (
    <span>
      {displayedText}
      {!isComplete && (
        <motion.span
          className="inline-block w-[2px] h-[12px] bg-white/80 ml-[1px] align-middle"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </span>
  );
}

// Gradient keyword component
function GradientKeyword({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-semibold"
      style={{
        background: "linear-gradient(90deg, #B34B71 0%, #4A0404 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </span>
  );
}

// Bullet list component with animated reveal
function BulletList({ bullets, animate }: { bullets: BulletPoint[]; animate: boolean }) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!animate) {
      setVisibleCount(bullets.length);
      return;
    }

    setVisibleCount(0);
    const timers: NodeJS.Timeout[] = [];

    bullets.forEach((_, idx) => {
      const timer = setTimeout(() => {
        setVisibleCount(idx + 1);
      }, (idx + 1) * 800);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [bullets, animate]);

  return (
    <ul className="space-y-2 list-none">
      {bullets.slice(0, visibleCount).map((bullet, idx) => (
        <motion.li
          key={idx}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-start gap-2"
        >
          <span className="text-white/40 mt-0.5">•</span>
          <span>
            {bullet.text}
            <GradientKeyword>{bullet.keyword}</GradientKeyword>
            {bullet.suffix}
          </span>
        </motion.li>
      ))}
      {animate && visibleCount < bullets.length && (
        <motion.div
          className="flex gap-1 ml-4"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <span className="w-1 h-1 rounded-full bg-white/40" />
          <span className="w-1 h-1 rounded-full bg-white/40" />
          <span className="w-1 h-1 rounded-full bg-white/40" />
        </motion.div>
      )}
    </ul>
  );
}

// Data Pulse Component - travels along connector
function DataPulse({ sourceX, sourceY, delay: pulseDelay }: { sourceX: number; sourceY: number; delay: number }) {
  return (
    <motion.circle
      r="3"
      fill="url(#pulseGradient)"
      filter="url(#glow)"
      initial={{
        cx: `${sourceX}%`,
        cy: `${sourceY}%`,
        opacity: 0,
        scale: 0
      }}
      animate={{
        cx: ["50%"],
        cy: ["50%"],
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1.2, 1, 0.5]
      }}
      transition={{
        duration: 0.8,
        delay: pulseDelay,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo approximation
        repeat: Infinity,
        repeatDelay: 1.5
      }}
    />
  );
}

// Memory Lattice Component with iOS icons and dashed connectors
function MemoryLattice({
  phase,
  activeSources,
}: {
  phase: AppPhase;
  activeSources: string[];
}) {
  const isVisible = ["retrieving", "ingestion", "crossReferencing", "judgment"].includes(phase);
  const showShatter = phase === "judgment";

  const renderIcon = (source: MemorySource, isActive: boolean) => {
    return <SourceIcon id={source.id} color={source.color} isActive={isActive} />;
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full relative"
          >
            {/* SVG Definitions */}
            <svg className="absolute w-0 h-0">
              <defs>
                <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#B34B71" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
            </svg>

            {/* Dashed Connectors with Data Pulses */}
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                  <stop offset="100%" stopColor="rgba(179,75,113,0.4)" />
                </linearGradient>
              </defs>

              {MEMORY_SOURCES.map((source, idx) => {
                const isActive = activeSources.includes(source.id);
                return (
                  <g key={`connector-${source.id}`}>
                    {/* Dashed connector line */}
                    <motion.line
                      x1={`${source.x}%`}
                      y1={`${source.y}%`}
                      x2="50%"
                      y2="50%"
                      stroke={isActive ? "rgba(179,75,113,0.5)" : "rgba(255,255,255,0.1)"}
                      strokeWidth="0.5"
                      strokeDasharray="4 4"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{
                        pathLength: isActive ? 1 : 0,
                        opacity: showShatter ? 0 : (isActive ? 1 : 0),
                      }}
                      transition={{
                        pathLength: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                        opacity: { duration: showShatter ? 0.15 : 0.3 }
                      }}
                    />

                    {/* Data pulses traveling to center */}
                    {isActive && !showShatter && (
                      <>
                        <DataPulse sourceX={source.x} sourceY={source.y} delay={idx * 0.3} />
                        <DataPulse sourceX={source.x} sourceY={source.y} delay={idx * 0.3 + 0.8} />
                      </>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Shatter Particles */}
            <AnimatePresence>
              {showShatter && MEMORY_SOURCES.map((source) => {
                const isActive = activeSources.includes(source.id);
                if (!isActive) return null;

                // Generate particles along the line
                return [...Array(8)].map((_, i) => {
                  const t = i / 7;
                  const startX = source.x + (50 - source.x) * t;
                  const startY = source.y + (50 - source.y) * t;
                  const angle = Math.random() * Math.PI * 2;
                  const distance = 30 + Math.random() * 50;

                  return (
                    <motion.div
                      key={`shatter-${source.id}-${i}`}
                      className="absolute w-1 h-1 rounded-full bg-white"
                      style={{
                        left: `${startX}%`,
                        top: `${startY}%`,
                        boxShadow: "0 0 4px rgba(179,75,113,0.8)",
                      }}
                      initial={{ opacity: 1, scale: 1 }}
                      animate={{
                        x: Math.cos(angle) * distance,
                        y: Math.sin(angle) * distance,
                        opacity: 0,
                        scale: 0,
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  );
                });
              })}
            </AnimatePresence>

            {/* iOS Icon Nodes */}
            {MEMORY_SOURCES.map((source, idx) => {
              const isActive = activeSources.includes(source.id);
              return (
                <motion.div
                  key={source.id}
                  className="absolute"
                  style={{ left: `${source.x}%`, top: `${source.y}%` }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: showShatter ? 0.8 : 1,
                    opacity: showShatter ? 0 : 1
                  }}
                  transition={{
                    type: "spring",
                    damping: 15,
                    stiffness: 200,
                    delay: idx * 0.08,
                  }}
                >
                  <div className="relative -translate-x-1/2 -translate-y-1/2">
                    {renderIcon(source, isActive)}
                    <motion.div
                      className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap"
                      animate={{ opacity: isActive ? 1 : 0.3 }}
                    >
                      <span
                        className={`text-[9px] font-semibold tracking-[0.15em] uppercase transition-colors duration-300 ${isActive ? "text-white" : "text-white/30"}`}
                      >
                        {source.label}
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Ruby Orb Core with 3-Step Context Formation
function OrbCore({ phase }: { phase: AppPhase }) {
  const isIngestion = phase === "ingestion";
  const isCrossRef = phase === "crossReferencing";
  const isJudgment = phase === "judgment";
  const isVisible = ["retrieving", "ingestion", "crossReferencing", "judgment"].includes(phase);

  // Scale: 15% larger during ingestion
  const orbScale = isIngestion ? 1.15 : (isCrossRef ? 1.1 : (isJudgment ? 1.2 : 1));

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
            transition={{ type: "spring", damping: 20, stiffness: 150 }}
          >
            {/* Glow Background */}
            <motion.div
              className="absolute w-80 h-80 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
              animate={{
                background: isJudgment
                  ? "radial-gradient(circle, rgba(179,75,113,0.5) 0%, transparent 60%)"
                  : isCrossRef
                    ? "radial-gradient(circle, rgba(179,75,113,0.3) 0%, transparent 70%)"
                    : "radial-gradient(circle, rgba(74,4,4,0.2) 0%, transparent 70%)",
                scale: isJudgment ? 1.3 : 1,
              }}
              transition={{ duration: 0.3 }}
            />

            <motion.div
              className="relative z-10"
              animate={{ scale: orbScale }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
            >
              {/* The Core Orb */}
              <motion.div
                className="w-16 h-16 rounded-full overflow-hidden relative shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #2b0707 0%, #0a0a0a 100%)",
                  border: "1px solid rgba(179,75,113,0.4)",
                }}
                animate={{
                  boxShadow: isJudgment
                    ? "0 0 60px rgba(179,75,113,0.8), 0 0 100px rgba(179,75,113,0.4)"
                    : "0 0 30px rgba(179,75,113,0.3)",
                }}
                transition={{ duration: 0.15 }}
              >
                {/* Inner Plasma - Swirling Vortex during Ingestion */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: isJudgment
                      ? "radial-gradient(circle at 50% 50%, #B34B71 0%, #8B2D5A 40%, #4A0404 100%)"
                      : "radial-gradient(circle at 30% 30%, #B34B71 0%, #6B2D4A 50%, #2b0707 100%)",
                  }}
                  animate={
                    isIngestion
                      ? { rotate: [0, 360], scale: [1, 1.1, 1] }
                      : isJudgment
                        ? { rotate: 0, scale: 1 }
                        : { scale: 1 }
                  }
                  transition={
                    isIngestion
                      ? { rotate: { duration: 1.2, repeat: Infinity, ease: "linear" }, scale: { duration: 0.6, repeat: Infinity } }
                      : { duration: 0.1 }
                  }
                />

                {/* Dithered grain overlay */}
                <motion.div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  }}
                  animate={
                    isIngestion
                      ? { rotate: [0, -180], opacity: [0.3, 0.5, 0.3] }
                      : { rotate: 0 }
                  }
                  transition={{ duration: 1.2, repeat: isIngestion ? Infinity : 0, ease: "linear" }}
                />

                {/* Liquid highlight */}
                <div className="absolute top-1.5 left-2 w-5 h-2.5 bg-white/30 rounded-full blur-[2px] rotate-[-20deg]" />
              </motion.div>

              {/* Cross-Referencing Rings - 5 concentric rings for each source */}
              <AnimatePresence>
                {isCrossRef && (
                  <>
                    {MEMORY_SOURCES.map((source, idx) => {
                      const insets = [-20, -32, -44, -56, -68];
                      const durations = [3, 3.5, 4, 4.5, 5];

                      return (
                        <motion.div
                          key={`ring-${source.id}`}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            rotate: [0, idx % 2 === 0 ? 360 : -360]
                          }}
                          exit={{ opacity: 0, scale: 1.5 }}
                          transition={{
                            rotate: { duration: durations[idx], repeat: Infinity, ease: "linear" as const },
                            opacity: { duration: 0.3, delay: idx * 0.05 }
                          }}
                          className="absolute rounded-full"
                          style={{
                            transformStyle: "preserve-3d",
                            inset: `${insets[idx]}px`,
                            border: `1px solid ${source.color}40`,
                          }}
                        >
                          <motion.div
                            className="absolute w-1.5 h-1.5 rounded-full"
                            style={{
                              background: source.color,
                              top: idx % 2 === 0 ? 0 : '50%',
                              left: idx % 2 === 0 ? '50%' : 0,
                              transform: idx % 2 === 0 ? 'translateX(-50%)' : 'translateY(-50%)',
                            }}
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 0.8 + idx * 0.2, repeat: Infinity }}
                          />
                        </motion.div>
                      );
                    })}
                  </>
                )}
              </AnimatePresence>

              {/* Judgment: Ruby Bloom pulse rings */}
              <AnimatePresence>
                {isJudgment && (
                  <>
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={`judgment-ring-${i}`}
                        className="absolute inset-0 rounded-full border-2 border-[#B34B71]"
                        initial={{ scale: 1, opacity: 0.8 }}
                        animate={{ scale: [1, 3], opacity: [0.8, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.4,
                          ease: "easeOut"
                        }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Chat Window Component
function ChatWindow({
  phase,
  messages,
  inputValue,
}: {
  phase: AppPhase;
  messages: Message[];
  inputValue: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const isVisible = ["idle", "sending", "responding"].includes(phase);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: -30, filter: "blur(8px)" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="absolute inset-0 flex items-center justify-center z-20"
        >
          <div className="w-[70%] h-[70%] bg-black backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-5 py-3.5 flex items-center justify-between border-b border-white/20">
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/70">
                Sidekick
              </span>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-5 space-y-4"
            >
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: msg.role === "user" ? 15 : -15, y: 8 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed
                      ${
                        msg.role === "user"
                          ? "bg-black text-white border border-white/20 rounded-br-md"
                          : "bg-black text-white border border-white/10 rounded-bl-md"
                      }`}
                  >
                    {msg.role === "assistant" && msg.bullets ? (
                      <BulletList bullets={msg.bullets} animate={idx === messages.length - 1} />
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              ))}

              {phase === "responding" &&
                messages[messages.length - 1]?.role === "user" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-md flex gap-1.5 items-center">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-white/50"
                          animate={{ scale: [1, 1.4, 1] }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.8,
                            delay: i * 0.15,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
            </div>

            {/* Footer Input Area */}
            <div className="p-3.5 border-t border-white/20">
              <div className="relative flex items-center bg-white/5 rounded-xl border border-white/15 px-4 py-3">
                <div className="flex-1 text-[12px] text-white font-medium truncate">
                  {inputValue || (
                    <span className="text-white/30 italic font-normal">
                      Ask Sidekick anything...
                    </span>
                  )}
                  {inputValue && (
                    <motion.span
                      className="inline-block w-0.5 h-3 bg-white ml-0.5 align-middle"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                </div>
                <svg
                  className="w-4 h-4 text-white/30 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function RetrievalNexus() {
  const [phase, setPhase] = useState<AppPhase>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeSources, setActiveSources] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  // Auto-running demo animation with Context Formation sequence
  useEffect(() => {
    const runDemo = async () => {
      // Reset
      setPhase("idle");
      setMessages([]);
      setActiveSources([]);
      setInputValue("");

      await delay(1500);

      // Simulate typing
      const userMsg = DEMO_CONVERSATION.userMessage;
      for (let i = 0; i <= userMsg.length; i++) {
        setInputValue(userMsg.slice(0, i));
        await delay(35 + Math.random() * 20);
      }

      await delay(600);

      // Send message
      setPhase("sending");
      setMessages([{ role: "user", content: userMsg }]);
      setInputValue("");

      await delay(400);

      // Phase III: Activate all sources simultaneously
      setPhase("retrieving");

      // Snap all connectors at once
      await delay(100);
      setActiveSources(["sidekick-db", "notion", "slack", "gmail", "sheets"]);

      await delay(1500);

      // Phase IV Step 1: Ingestion (The Swirl)
      setPhase("ingestion");
      await delay(1500);

      // Phase IV Step 2: Cross-Referencing (Geometric Alignment)
      setPhase("crossReferencing");
      await delay(2500);

      // Phase IV Step 3: Judgment Formed (Stabilization + Shatter)
      setPhase("judgment");
      await delay(1200);

      // Responding
      setPhase("responding");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", bullets: DEMO_CONVERSATION.assistantBullets },
      ]);

      await delay(5000);

      // Reset and loop
      setActiveSources([]);
      runDemo();
    };

    runDemo();
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center mt-5">
      {/* Background Neural Grid */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(179,75,113,0.1) 0%, transparent 70%),
                              linear-gradient(to right, #444 1px, transparent 1px),
                              linear-gradient(to bottom, #444 1px, transparent 1px)`,
            backgroundSize: "100% 100%, 60px 60px, 60px 60px",
          }}
        />
      </div>

      {/* Decorative Blur Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -40, 0],
            opacity: [0.06, 0.12, 0.06],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -left-1/4 w-[50%] h-[50%] bg-[#4A0404]/40 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
            opacity: [0.06, 0.1, 0.06],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-1/4 -right-1/4 w-[50%] h-[50%] bg-[#B34B71]/20 rounded-full blur-[150px]"
        />
      </div>

      <MemoryLattice phase={phase} activeSources={activeSources} />
      <OrbCore phase={phase} />
      <ChatWindow phase={phase} messages={messages} inputValue={inputValue} />

      {/* Phase Label HUD */}
      <div className="absolute top-6 left-6 hidden md:block">
        <div className="flex flex-col">
          <span className="text-[8px] font-bold tracking-[0.4em] uppercase text-white/40 mb-1">
            Context Formation
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={phase}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-[10px] font-medium tracking-[0.2em] text-[#B34B71] uppercase"
            >
              {phase === "crossReferencing" ? "cross-referencing" : phase}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
