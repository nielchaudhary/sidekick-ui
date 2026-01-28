"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Calendar, Check } from "lucide-react";
import { delay } from "@/lib/utils";

type AppPhase =
  | "idle"
  | "sending"
  | "intentExtraction"
  | "retrieving"
  | "ingestion"
  | "crossReferencing"
  | "judgment"
  | "calendar"
  | "execution"
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

interface CalendarEvent {
  date: string;
  day: number;
  month: string;
  year: number;
  time: string;
  title: string;
}

interface Message {
  role: "user" | "assistant";
  content?: string;
  bullets?: BulletPoint[];
  calendarEvent?: CalendarEvent;
  hasLiveCard?: boolean;
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
  userMessage:
    "What were the last month's key decisions with development team? Also, schedule a follow-up for March 15th with Product Team.",
  keywords: [
    { text: "last month's", type: "retrieval" as const },
    { text: "key decisions", type: "retrieval" as const },
    { text: "schedule", type: "action" as const },
    { text: "March 15th", type: "action" as const },
  ],
  assistantBullets: [
    { text: "Ask anything. Get the ", keyword: "exact context", suffix: " you need." },
    { text: "No digging through docs or ", keyword: "reconstructing threads", suffix: "." },
    { text: "Right answer, right moment, ", keyword: "zero friction", suffix: "." },
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

// Brand Logo Components
function NotionLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
      <path
        d="M6.017 4.313l55.333 -4.087c6.797 -0.583 8.543 -0.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277 -1.553 6.807 -6.99 7.193L24.467 99.967c-4.08 0.193 -6.023 -0.39 -8.16 -3.113L3.3 79.94c-2.333 -3.113 -3.3 -5.443 -3.3 -8.167V11.113c0 -3.497 1.553 -6.413 6.017 -6.8z"
        fill="#fff"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M61.35 0.227l-55.333 4.087C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723 0.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257 -3.89c5.433 -0.387 6.99 -2.917 6.99 -7.193V20.64c0 -2.21 -0.873 -2.847 -3.443 -4.733L74.167 3.143c-4.273 -3.107 -6.02 -3.5 -12.817 -2.917zM25.92 19.523c-5.247 0.353 -6.437 0.433 -9.417 -1.99L8.927 11.507c-0.77 -0.78 -0.383 -1.753 1.557 -1.947l53.193 -3.887c4.467 -0.39 6.793 1.167 8.54 2.527l9.123 6.61c0.39 0.197 1.36 1.36 0.193 1.36l-54.933 3.307 -0.68 0.047zM19.803 88.3V30.367c0 -2.53 0.777 -3.697 3.103 -3.893L86 22.78c2.14 -0.193 3.107 1.167 3.107 3.693v57.547c0 2.53 -0.39 4.67 -3.883 4.863l-60.377 3.5c-3.493 0.193 -5.043 -0.97 -5.043 -4.083zm59.6 -54.827c0.387 1.75 0 3.5 -1.75 3.7l-2.91 0.577v42.773c-2.527 1.36 -4.853 2.137 -6.797 2.137 -3.107 0 -3.883 -0.973 -6.21 -3.887l-19.03 -29.94v28.967l6.02 1.363s0 3.5 -4.857 3.5l-13.39 0.777c-0.39 -0.78 0 -2.723 1.357 -3.11l3.497 -0.97v-38.3L30.48 40.667c-0.39 -1.75 0.58 -4.277 3.3 -4.473l14.367 -0.967 19.8 30.327v-26.83l-5.047 -0.58c-0.39 -2.143 1.163 -3.7 3.103 -3.89l13.4 -0.78z"
        fill="#000"
      />
    </svg>
  );
}

function SlackLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 128 128" fill="none">
      <path
        d="M27.255 80.719c0 7.33-5.978 13.317-13.309 13.317C6.616 94.036.63 88.049.63 80.719s5.987-13.317 13.317-13.317h13.309zm6.709 0c0-7.33 5.987-13.317 13.317-13.317s13.317 5.986 13.317 13.317v33.335c0 7.33-5.986 13.317-13.317 13.317-7.33 0-13.317-5.987-13.317-13.317z"
        fill="#DE1C59"
      />
      <path
        d="M47.281 27.255c-7.33 0-13.317-5.978-13.317-13.309C33.964 6.616 39.951.63 47.281.63s13.317 5.987 13.317 13.317v13.309zm0 6.709c7.33 0 13.317 5.987 13.317 13.317s-5.986 13.317-13.317 13.317H13.946C6.616 60.598.63 54.612.63 47.281c0-7.33 5.987-13.317 13.317-13.317z"
        fill="#35C5F0"
      />
      <path
        d="M100.745 47.281c0-7.33 5.978-13.317 13.309-13.317 7.33 0 13.317 5.987 13.317 13.317s-5.987 13.317-13.317 13.317h-13.309zm-6.709 0c0 7.33-5.987 13.317-13.317 13.317s-13.317-5.986-13.317-13.317V13.946C67.402 6.616 73.388.63 80.719.63c7.33 0 13.317 5.987 13.317 13.317z"
        fill="#2EB67D"
      />
      <path
        d="M80.719 100.745c7.33 0 13.317 5.978 13.317 13.309 0 7.33-5.987 13.317-13.317 13.317s-13.317-5.987-13.317-13.317v-13.309zm0-6.709c-7.33 0-13.317-5.987-13.317-13.317s5.986-13.317 13.317-13.317h33.335c7.33 0 13.317 5.986 13.317 13.317 0 7.33-5.987 13.317-13.317 13.317z"
        fill="#ECB22D"
      />
    </svg>
  );
}

function GmailLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
        fill="#EA4335"
      />
    </svg>
  );
}

function GoogleSheetsLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M19.5 24h-15A2.5 2.5 0 0 1 2 21.5v-19A2.5 2.5 0 0 1 4.5 0h10l7.5 7.5v14a2.5 2.5 0 0 1-2.5 2.5z"
        fill="#0F9D58"
      />
      <path d="M14.5 0v5a2.5 2.5 0 0 0 2.5 2.5h5" fill="#87CEAC" />
      <path d="M6 12h12v9H6z" fill="#fff" />
      <path d="M6 15h12M6 18h12M10 12v9M14 12v9" stroke="#0F9D58" strokeWidth="0.5" />
    </svg>
  );
}

// Google Calendar Logo for toast
function GoogleCalendarLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"
        fill="#4285F4"
      />
      <path d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z" fill="#fff" />
      <path d="M8 2v4M16 2v4" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" />
      <rect x="7" y="11" width="3" height="3" rx="0.5" fill="#EA4335" />
      <rect x="11" y="11" width="3" height="3" rx="0.5" fill="#FBBC04" />
      <rect x="7" y="15" width="3" height="3" rx="0.5" fill="#34A853" />
      <rect x="11" y="15" width="3" height="3" rx="0.5" fill="#4285F4" />
    </svg>
  );
}

// Photon Particle - flies from keyword to orb
function PhotonParticle({
  startX,
  startY,
  targetX,
  targetY,
  delay: particleDelay,
  color,
}: {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  delay: number;
  color: string;
}) {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full pointer-events-none"
      style={{
        left: startX,
        top: startY,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        boxShadow: `0 0 8px ${color}, 0 0 16px ${color}40`,
      }}
      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1.5, 1, 0.5],
        x: targetX - startX,
        y: targetY - startY,
      }}
      transition={{
        duration: 0.6,
        delay: particleDelay,
        ease: [0.16, 1, 0.3, 1],
      }}
    />
  );
}

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

// Chronos Calendar Component - Procedural SVG Calendar
function ChronosCalendar({
  phase,
  targetDay,
  targetMonth,
  onComplete,
}: {
  phase: AppPhase;
  targetDay: number;
  targetMonth: string;
  onComplete?: () => void;
}) {
  const isVisible = phase === "calendar";
  const [currentStep, setCurrentStep] = useState<"skeleton" | "infill" | "scan" | "confirm">(
    "skeleton"
  );
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const hasRunRef = useRef(false);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  useEffect(() => {
    if (!isVisible) {
      hasRunRef.current = false;
      return;
    }

    if (hasRunRef.current) return;
    hasRunRef.current = true;

    let cancelled = false;

    const runSequence = async () => {
      // Skeleton phase
      if (cancelled) return;
      setCurrentStep("skeleton");
      await delay(400);

      // Infill phase - days populate
      if (cancelled) return;
      setCurrentStep("infill");
      await delay(800);

      // Scan phase - conflict check
      if (cancelled) return;
      setCurrentStep("scan");
      for (let i = 0; i <= 100; i += 5) {
        if (cancelled) return;
        setScanProgress(i);
        await delay(30);
      }
      await delay(200);

      // Confirm phase - select the target day
      if (cancelled) return;
      setCurrentStep("confirm");
      setSelectedDay(targetDay);
      await delay(800);

      if (!cancelled) onComplete?.();
    };

    runSequence();

    return () => {
      cancelled = true;
    };
  }, [isVisible, targetDay, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="absolute inset-0 flex items-center justify-center z-30"
        >
          <div className="relative w-64 h-72 bg-black/90 backdrop-blur-2xl border border-white/20 rounded-2xl p-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <motion.span
                className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {targetMonth} 2024
              </motion.span>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <Calendar size={16} className="text-[#B34B71]" />
              </motion.div>
            </div>

            {/* Week day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day, idx) => (
                <motion.div
                  key={day + idx}
                  className="text-[9px] text-white/40 text-center font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: currentStep !== "skeleton" ? 1 : 0.3 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  {day}
                </motion.div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 relative">
              {/* Skeleton dots */}
              {currentStep === "skeleton" &&
                days.slice(0, 28).map((_, idx) => (
                  <motion.div
                    key={`skeleton-${idx}`}
                    className="aspect-square flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.3, scale: 1 }}
                    transition={{ delay: idx * 0.02, type: "spring", damping: 15 }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  </motion.div>
                ))}

              {/* Actual days */}
              {currentStep !== "skeleton" &&
                days.slice(0, 28).map((day, idx) => {
                  const isSelected = selectedDay === day;
                  const isScanned = scanProgress >= (idx / 28) * 100;

                  return (
                    <motion.div
                      key={day}
                      className={`aspect-square flex items-center justify-center rounded-lg text-[11px] font-medium relative ${
                        isSelected ? "bg-[#B34B71] text-white" : "text-white/60 hover:bg-white/5"
                      }`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{
                        opacity: 1,
                        scale: isSelected ? 1.1 : 1,
                      }}
                      transition={{
                        delay: idx * 0.02,
                        type: "spring",
                        damping: 15,
                        stiffness: 200,
                      }}
                    >
                      {day}

                      {/* Scan glow effect */}
                      {currentStep === "scan" && isScanned && !isSelected && (
                        <motion.div
                          className="absolute inset-0 rounded-lg"
                          style={{
                            background:
                              "linear-gradient(90deg, transparent, rgba(179,75,113,0.3), transparent)",
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 0.3 }}
                        />
                      )}

                      {/* Selection checkmark */}
                      {isSelected && currentStep === "confirm" && (
                        <motion.div
                          className="absolute -top-1 -right-1"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.2 }}
                        >
                          <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                            <Check size={10} className="text-[#B34B71]" />
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}

              {/* Scan beam */}
              {currentStep === "scan" && (
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-full pointer-events-none"
                  style={{
                    background: `linear-gradient(90deg, transparent ${scanProgress - 10}%, rgba(179,75,113,0.4) ${scanProgress}%, transparent ${scanProgress + 10}%)`,
                  }}
                />
              )}
            </div>

            {/* Time Ribbon */}
            <AnimatePresence>
              {currentStep === "confirm" && selectedDay && (
                <motion.div
                  className="absolute bottom-4 left-4 right-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", delay: 0.3 }}
                >
                  <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                    <span className="text-[10px] text-white/50 uppercase tracking-wider">Time</span>
                    <motion.span
                      className="text-[12px] font-medium text-[#B34B71]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      10:00 AM
                    </motion.span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
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
    const runDemo = async () => {
      // Reset
      setPhase("idle");
      setMessages([]);
      setActiveSources([]);
      setInputValue("");
      setShowToast(false);

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

      // Phase I: Intent Extraction - Keywords glow
      setPhase("intentExtraction");
      await delay(1200);

      // Phase II: Activate sources for retrieval
      setPhase("retrieving");
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

      // Phase V: Calendar Construction
      setPhase("calendar");
      await delay(3500);

      // Phase VI: Execution - Show toast
      setPhase("execution");
      setShowToast(true);
      await delay(2000);

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

      await delay(6000);

      // Reset and loop
      setActiveSources([]);
      runDemo();
    };

    runDemo();
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
