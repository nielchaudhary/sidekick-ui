"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, FileText, MessageSquare, Mail, Sheet } from "lucide-react";

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

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Five data sources positioned closer to the orb (pentagon arrangement)
const MEMORY_SOURCES: MemorySource[] = [
  { id: "sidekick-db", label: "Sidekick DB", x: 50, y: 28, color: "#B34B71" },
  { id: "notion", label: "Notion", x: 70, y: 40, color: "#FFFFFF" },
  { id: "slack", label: "Slack", x: 64, y: 68, color: "#E01E5A" },
  { id: "gmail", label: "Gmail", x: 36, y: 68, color: "#EA4335" },
  { id: "sheets", label: "Google Sheets", x: 30, y: 40, color: "#34A853" },
];

const DEMO_CONVERSATION = {
  userMessage: "What were the key decisions from my Pfizer meetings?",
  assistantMessage:
    "Based on your Sidekick DB, Notion docs, Slack threads, emails, and spreadsheets: Budget was approved ($2.4M), the API blocker was resolved by switching to the new SDK, and next review is scheduled for March 15th.",
  sourcesToActivate: ["sidekick-db", "notion", "slack", "gmail", "sheets"],
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Lucide Icon Wrapper
function SourceIcon({ id, color, isActive }: { id: string; color: string; isActive: boolean }) {
  const iconProps = { size: 20, strokeWidth: 1.5 };

  const getIcon = () => {
    switch (id) {
      case "sidekick-db": return <Database {...iconProps} />;
      case "notion": return <FileText {...iconProps} />;
      case "slack": return <MessageSquare {...iconProps} />;
      case "gmail": return <Mail {...iconProps} />;
      case "sheets": return <Sheet {...iconProps} />;
      default: return null;
    }
  };

  return (
    <motion.div
      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border border-white/10"
      style={{
        background: `linear-gradient(135deg, rgba(20,20,20,0.9) 0%, rgba(10,10,10,0.95) 100%)`,
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
          <div className="w-[70%] h-[70%] bg-black/50 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-5 py-3.5 flex items-center justify-between border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full bg-[#B34B71]"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/50">
                  Sidekick
                </span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-white/10" />
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
                          ? "bg-[#4A0404] text-white rounded-br-md"
                          : "bg-white/10 text-white/90 border border-white/10 rounded-bl-md"
                      }`}
                  >
                    {msg.role === "assistant" && idx === messages.length - 1 ? (
                      <TypewriterText text={msg.content} />
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
                    <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-bl-md flex gap-1.5 items-center">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-white/40"
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
            <div className="p-3.5 bg-white/5 border-t border-white/5">
              <div className="relative flex items-center bg-white/10 rounded-xl border border-white/10 px-4 py-3">
                <div className="flex-1 text-[12px] text-white/70 font-medium truncate">
                  {inputValue || (
                    <span className="text-white/20 italic font-normal">
                      Ask Sidekick anything...
                    </span>
                  )}
                  {inputValue && (
                    <motion.span
                      className="inline-block w-[2px] h-[12px] bg-white/70 ml-0.5 align-middle"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                </div>
                <svg
                  className="w-4 h-4 text-white/20 ml-2"
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
        { role: "assistant", content: DEMO_CONVERSATION.assistantMessage },
      ]);

      await delay(5000);

      // Reset and loop
      setActiveSources([]);
      runDemo();
    };

    runDemo();
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
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
      <div className="absolute bottom-6 left-6 hidden md:block">
        <div className="flex flex-col">
          <span className="text-[8px] font-bold tracking-[0.4em] uppercase text-white/10 mb-1">
            Context Formation
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={phase}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-[10px] font-medium tracking-[0.2em] text-[#B34B71]/70 uppercase"
            >
              {phase === "crossReferencing" ? "cross-referencing" : phase}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
