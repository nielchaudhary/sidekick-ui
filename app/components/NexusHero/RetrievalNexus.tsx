"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Calendar, Check } from "lucide-react";
import {
  NotionLogo,
  SlackLogo,
  GmailLogo,
  GoogleSheetsLogo,
  GoogleCalendarLogo,
} from "@/app/components/icons/brand-logos";
import type {
  RetrievalNexusPhase as AppPhase,
  MemorySource,
  BulletPoint,
  CalendarEvent,
  ChatMessage as Message,
} from "@/types";
import { ChronosCalendar } from "./components/ChronosCalendar";

// Five data sources positioned around the orb
const MEMORY_SOURCES: MemorySource[] = [
  { id: "sidekick-db", label: "Sidekick DB", x: 50, y: 24, color: "#B34B71" },
  { id: "notion", label: "Notion", x: 74, y: 38, color: "#FFFFFF" },
  { id: "slack", label: "Slack", x: 67, y: 72, color: "#E01E5A" },
  { id: "gmail", label: "Gmail", x: 33, y: 72, color: "#EA4335" },
  { id: "sheets", label: "Google Sheets", x: 26, y: 38, color: "#34A853" },
];

const DEMO_CONVERSATION = {
  userMessage:
    "What were the last month's key decisions with development team? Also, schedule a follow-up for March 15th with Product Team.",
  keywords: [
    { text: "last month's", type: "retrieval" as const },
    { text: "key decisions", type: "retrieval" as const },
    { text: "schedule", type: "action" as const },
    { text: "March 15th", type: "action" as const },
  ],
  assistantBullets: [
    {
      text: "Retrieved ",
      keyword: "3 key decisions",
      suffix: " from last month's dev team discussions:",
    },
    {
      text: "• API architecture: REST over GraphQL • Sprint velocity: reduced for quality • DB migration: ",
      keyword: "postponed to Q2",
      suffix: "",
    },
    {
      text: "Scheduled ",
      keyword: "March 15th follow-up",
      suffix: " with Product Team, context auto-attached.",
    },
  ],
  calendarEvent: {
    date: "2024-03-15",
    day: 15,
    month: "March",
    year: 2024,
    time: "10:00 AM",
    title: "Follow-up with Product Team",
  },
  sourcesToActivate: ["sidekick-db", "notion", "slack", "gmail", "sheets"],
};

// Keyword with underline glow effect
function HighlightedKeyword({
  children,
  type,
  isActive,
  onEmitPhoton,
}: {
  children: React.ReactNode;
  type: "retrieval" | "action";
  isActive: boolean;
  onEmitPhoton?: (rect: DOMRect) => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const color = type === "retrieval" ? "#B34B71" : "#4285F4";

  useEffect(() => {
    if (isActive && ref.current && onEmitPhoton) {
      const rect = ref.current.getBoundingClientRect();
      onEmitPhoton(rect);
    }
  }, [isActive, onEmitPhoton]);

  return (
    <motion.span
      ref={ref}
      className="relative inline-block"
      animate={isActive ? { color: "#fff" } : {}}
    >
      {children}
      <motion.span
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ background: color }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isActive ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
      {isActive && (
        <motion.span
          className="absolute bottom-0 left-0 right-0 h-0.5 blur-sm"
          style={{ background: color }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </motion.span>
  );
}

// Glow Toast Component
function GlowToast({
  isVisible,
  message,
  transactionId,
}: {
  isVisible: boolean;
  message: string;
  transactionId: string;
}) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
        >
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl border"
            style={{
              background: "rgba(0,0,0,0.8)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              borderColor: "rgba(179,75,113,0.3)",
              boxShadow: "0 0 30px rgba(179,75,113,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            {/* Calendar Icon */}
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <GoogleCalendarLogo />
            </div>

            {/* Content */}
            <div className="flex flex-col">
              <span className="text-[12px] font-medium text-white">{message}</span>
              <span
                className="text-[9px] font-mono text-white/40 tracking-wider"
                style={{ fontFamily: "Geist Mono, monospace" }}
              >
                TX: {transactionId}
              </span>
            </div>

            {/* Success indicator */}
            <motion.div
              className="w-5 h-5 rounded-full bg-[#34A853] flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <Check size={12} className="text-white" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Live Card Component - Embedded in assistant message
function LiveCard({
  bullets,
  calendarEvent,
  animate,
}: {
  bullets: BulletPoint[];
  calendarEvent?: CalendarEvent;
  animate: boolean;
}) {
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    if (animate && calendarEvent) {
      const timer = setTimeout(() => setShowCalendar(true), bullets.length * 800 + 500);
      return () => clearTimeout(timer);
    }
  }, [animate, calendarEvent, bullets.length]);

  return (
    <div className="space-y-3">
      {/* Retrieval Section */}
      <BulletList bullets={bullets} animate={animate} />

      {/* Calendar Section */}
      {calendarEvent && (
        <AnimatePresence>
          {showCalendar && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ type: "spring", damping: 20 }}
              className="mt-3 pt-3 border-t border-white/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={12} className="text-[#4285F4]" />
                <span className="text-[10px] uppercase tracking-wider text-white/40">
                  Scheduled
                </span>
              </div>
              <motion.div
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2"
                initial={{ x: -10 }}
                animate={{ x: 0 }}
                transition={{ type: "spring", delay: 0.1 }}
              >
                <div className="w-10 h-10 rounded-lg bg-[#B34B71]/20 flex flex-col items-center justify-center">
                  <span className="text-[8px] uppercase text-[#B34B71]">
                    {calendarEvent.month.slice(0, 3)}
                  </span>
                  <span className="text-[14px] font-bold text-white">{calendarEvent.day}</span>
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-medium text-white">{calendarEvent.title}</div>
                  <div className="text-[10px] text-white/40">{calendarEvent.time}</div>
                </div>
                <motion.div
                  className="w-5 h-5 rounded-full bg-[#34A853] flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.3 }}
                >
                  <Check size={10} className="text-white" />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

// Icon Wrapper
function SourceIcon({ id, color, isActive }: { id: string; color: string; isActive: boolean }) {
  const getIcon = () => {
    switch (id) {
      case "sidekick-db":
        return <Database size={20} strokeWidth={1.5} />;
      case "notion":
        return <NotionLogo />;
      case "slack":
        return <SlackLogo />;
      case "gmail":
        return <GmailLogo />;
      case "sheets":
        return <GoogleSheetsLogo />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border border-white/10"
      style={{
        background:
          id === "sidekick-db"
            ? `linear-gradient(135deg, rgba(20,20,20,0.9) 0%, rgba(10,10,10,0.95) 100%)`
            : `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,240,240,0.9) 100%)`,
        color: color,
      }}
      animate={
        isActive
          ? {
              scale: [1, 1.08, 1],
              opacity: [0.5, 1, 1],
              boxShadow: [
                `0 0 0 rgba(${hexToRgb(color)}, 0)`,
                `0 0 20px rgba(${hexToRgb(color)}, 0.5)`,
                `0 0 10px rgba(${hexToRgb(color)}, 0.3)`,
              ],
            }
          : { opacity: 0.4 }
      }
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

// Gradient keyword component
function GradientKeyword({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-semibold"
      style={{
        background: "linear-gradient(90deg, #B34B71 0%, #7A3434 100%)",
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
  const [animationProgress, setAnimationProgress] = useState(0);

  // Derive visible count: show all when not animating, otherwise show based on progress
  const visibleCount = animate ? animationProgress : bullets.length;

  useEffect(() => {
    if (!animate) return;

    // Reset and animate using timers (async callbacks satisfy the lint rule)
    const timers: NodeJS.Timeout[] = [];

    // Reset to 0 at start
    const resetTimer = setTimeout(() => setAnimationProgress(0), 0);
    timers.push(resetTimer);

    bullets.forEach((_, idx) => {
      const timer = setTimeout(
        () => {
          setAnimationProgress(idx + 1);
        },
        (idx + 1) * 800
      );
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
function DataPulse({
  sourceX,
  sourceY,
  delay: pulseDelay,
}: {
  sourceX: number;
  sourceY: number;
  delay: number;
}) {
  return (
    <motion.circle
      r="3"
      fill="url(#pulseGradient)"
      filter="url(#glow)"
      initial={{
        cx: `${sourceX}%`,
        cy: `${sourceY}%`,
        opacity: 0,
        scale: 0,
      }}
      animate={{
        cx: ["50%"],
        cy: ["50%"],
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1.2, 1, 0.5],
      }}
      transition={{
        duration: 0.8,
        delay: pulseDelay,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo approximation
        repeat: Infinity,
        repeatDelay: 1.5,
      }}
    />
  );
}

// Memory Lattice Component with iOS icons and dashed connectors
function MemoryLattice({ phase, activeSources }: { phase: AppPhase; activeSources: string[] }) {
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
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
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
                        opacity: showShatter ? 0 : isActive ? 1 : 0,
                      }}
                      transition={{
                        pathLength: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                        opacity: { duration: showShatter ? 0.15 : 0.3 },
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
              {showShatter &&
                MEMORY_SOURCES.map((source) => {
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
                    opacity: showShatter ? 0 : 1,
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
  const orbScale = isIngestion ? 1.15 : isCrossRef ? 1.1 : isJudgment ? 1.2 : 1;

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
                      ? {
                          rotate: { duration: 1.2, repeat: Infinity, ease: "linear" },
                          scale: { duration: 0.6, repeat: Infinity },
                        }
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
                    isIngestion ? { rotate: [0, -180], opacity: [0.3, 0.5, 0.3] } : { rotate: 0 }
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
                            rotate: [0, idx % 2 === 0 ? 360 : -360],
                          }}
                          exit={{ opacity: 0, scale: 1.5 }}
                          transition={{
                            rotate: {
                              duration: durations[idx],
                              repeat: Infinity,
                              ease: "linear" as const,
                            },
                            opacity: { duration: 0.3, delay: idx * 0.05 },
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
                              top: idx % 2 === 0 ? 0 : "50%",
                              left: idx % 2 === 0 ? "50%" : 0,
                              transform: idx % 2 === 0 ? "translateX(-50%)" : "translateY(-50%)",
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
                          ease: "easeOut",
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

// Highlighted User Message - shows keywords during intent extraction
function HighlightedUserMessage({
  content,
  isExtracting,
}: {
  content: string;
  isExtracting: boolean;
}) {
  if (!isExtracting) {
    return <>{content}</>;
  }

  // Highlight keywords from DEMO_CONVERSATION
  const keywords = DEMO_CONVERSATION.keywords;
  const result: React.ReactNode[] = [];
  let lastIndex = 0;

  keywords.forEach((kw, idx) => {
    const startIdx = content.toLowerCase().indexOf(kw.text.toLowerCase(), lastIndex);
    if (startIdx !== -1) {
      // Add text before keyword
      if (startIdx > lastIndex) {
        result.push(content.slice(lastIndex, startIdx));
      }
      // Add highlighted keyword
      result.push(
        <HighlightedKeyword key={idx} type={kw.type} isActive={true}>
          {content.slice(startIdx, startIdx + kw.text.length)}
        </HighlightedKeyword>
      );
      lastIndex = startIdx + kw.text.length;
    }
  });

  // Add remaining text
  if (lastIndex < content.length) {
    result.push(content.slice(lastIndex));
  }

  return <>{result}</>;
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

  const isVisible = ["idle", "sending", "intentExtraction", "responding"].includes(phase);
  const isExtracting = phase === "intentExtraction";

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
              className="flex-1 overflow-y-auto scrollbar-hide p-5 space-y-4"
              style={{
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
              }}
            >
              <AnimatePresence mode="popLayout">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={`message-${idx}`}
                    layout
                    layoutId={`message-${idx}`}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`w-fit max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] leading-[1.6]
                        ${
                          msg.role === "user"
                            ? "bg-black text-white border border-white/20 rounded-br-md"
                            : "bg-black text-white border border-white/10 rounded-bl-md"
                        }`}
                      style={{
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {msg.role === "assistant" && msg.bullets ? (
                        msg.hasLiveCard && msg.calendarEvent ? (
                          <LiveCard
                            bullets={msg.bullets}
                            calendarEvent={msg.calendarEvent}
                            animate={idx === messages.length - 1}
                          />
                        ) : (
                          <BulletList bullets={msg.bullets} animate={idx === messages.length - 1} />
                        )
                      ) : msg.role === "user" && msg.content ? (
                        <HighlightedUserMessage content={msg.content} isExtracting={isExtracting} />
                      ) : (
                        msg.content
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {phase === "responding" && messages[messages.length - 1]?.role === "user" && (
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
              <div className="relative flex items-start bg-white/5 rounded-xl border border-white/15 px-4 py-3">
                <div
                  className="flex-1 text-[12px] text-white font-medium"
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
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
  const [showToast, setShowToast] = useState(false);
  const txId = "SK-DEMO-0001";

  // Auto-running demo animation with Context Formation sequence + Dual Intent
  useEffect(() => {
    let cancelled = false;

    const safeDelay = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = setTimeout(resolve, ms);
        if (cancelled) {
          clearTimeout(id);
          resolve();
        }
      });

    const runDemo = async () => {
      while (!cancelled) {
        // Reset
        setPhase("idle");
        setMessages([]);
        setActiveSources([]);
        setInputValue("");
        setShowToast(false);

        await safeDelay(1500);
        if (cancelled) return;

        // Simulate typing
        const userMsg = DEMO_CONVERSATION.userMessage;
        for (let i = 0; i <= userMsg.length; i++) {
          if (cancelled) return;
          setInputValue(userMsg.slice(0, i));
          await safeDelay(35 + Math.random() * 20);
        }

        await safeDelay(600);
        if (cancelled) return;

        // Send message
        setPhase("sending");
        setMessages([{ role: "user", content: userMsg }]);
        setInputValue("");

        await safeDelay(400);
        if (cancelled) return;

        // Phase I: Intent Extraction - Keywords glow
        setPhase("intentExtraction");
        await safeDelay(1200);
        if (cancelled) return;

        // Phase II: Activate sources for retrieval
        setPhase("retrieving");
        await safeDelay(100);
        if (cancelled) return;
        setActiveSources(["sidekick-db", "notion", "slack", "gmail", "sheets"]);
        await safeDelay(1500);
        if (cancelled) return;

        // Phase IV Step 1: Ingestion (The Swirl)
        setPhase("ingestion");
        await safeDelay(1500);
        if (cancelled) return;

        // Phase IV Step 2: Cross-Referencing (Geometric Alignment)
        setPhase("crossReferencing");
        await safeDelay(2500);
        if (cancelled) return;

        // Phase IV Step 3: Judgment Formed (Stabilization + Shatter)
        setPhase("judgment");
        await safeDelay(1200);
        if (cancelled) return;

        // Phase V: Calendar Construction
        setPhase("calendar");
        await safeDelay(3500);
        if (cancelled) return;

        // Phase VI: Execution - Show toast
        setPhase("execution");
        setShowToast(true);
        await safeDelay(2000);
        if (cancelled) return;

        // Responding with Live Card
        setPhase("responding");
        setShowToast(false);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            bullets: DEMO_CONVERSATION.assistantBullets,
            calendarEvent: DEMO_CONVERSATION.calendarEvent,
            hasLiveCard: true,
          },
        ]);

        await safeDelay(6000);
        if (cancelled) return;

        // Reset and loop
        setActiveSources([]);
      }
    };

    runDemo();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
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
      <ChronosCalendar
        phase={phase}
        targetDay={DEMO_CONVERSATION.calendarEvent.day}
        targetMonth={DEMO_CONVERSATION.calendarEvent.month}
      />
      <GlowToast
        isVisible={showToast}
        message="Event scheduled successfully"
        transactionId={txId}
      />

      {/* Phase Label HUD */}
      <div className="absolute top-6 left-6 hidden md:block">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40 mb-1">
            Context Formation
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={phase}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-[12px] font-medium tracking-[0.2em] text-[#B34B71] uppercase"
            >
              {phase === "crossReferencing"
                ? "cross-referencing"
                : phase === "intentExtraction"
                  ? "intent extraction"
                  : phase === "calendar"
                    ? "scheduling"
                    : phase === "execution"
                      ? "executing"
                      : phase}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
