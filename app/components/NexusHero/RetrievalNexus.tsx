"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type AppPhase =
  | "idle"
  | "sending"
  | "retrieving"
  | "synthesizing"
  | "responding"
  | "storing";

interface MemorySource {
  id: string;
  label: string;
  icon: string;
  x: number;
  y: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const MEMORY_SOURCES: MemorySource[] = [
  { id: "calendar", label: "Calendar", icon: "📅", x: 20, y: 25 },
  { id: "slack", label: "Slack", icon: "💬", x: 80, y: 20 },
  { id: "notion", label: "Notes", icon: "📝", x: 15, y: 75 },
  { id: "gmail", label: "Emails", icon: "✉️", x: 85, y: 80 },
  { id: "drive", label: "Docs", icon: "📂", x: 50, y: 10 },
];

const DEMO_CONVERSATION = {
  userMessage: "What were the key decisions from my Pfizer meetings?",
  assistantMessage:
    "Based on your calendar, Slack, and notes: Budget was approved ($2.4M), the API blocker was resolved by switching to the new SDK, and next review is scheduled for March 15th.",
  sourcesToActivate: ["calendar", "slack", "notion"],
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

// Memory Lattice Component
function MemoryLattice({
  phase,
  activeSources,
}: {
  phase: AppPhase;
  activeSources: string[];
}) {
  const isVisible = ["retrieving", "synthesizing", "storing"].includes(phase);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full relative"
          >
            {/* Connection Lines to Center */}
            <svg className="absolute inset-0 w-full h-full">
              {MEMORY_SOURCES.map((source) => (
                <motion.line
                  key={`line-${source.id}`}
                  x1={`${source.x}%`}
                  y1={`${source.y}%`}
                  x2="50%"
                  y2="50%"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: activeSources.includes(source.id) ? 1 : 0.2,
                    opacity: activeSources.includes(source.id) ? 0.5 : 0.1,
                    stroke: activeSources.includes(source.id)
                      ? "#B34B71"
                      : "rgba(255,255,255,0.05)",
                  }}
                  transition={{ duration: 0.8 }}
                />
              ))}
            </svg>

            {/* Nodes */}
            {MEMORY_SOURCES.map((source, idx) => {
              const isActive = activeSources.includes(source.id);
              return (
                <motion.div
                  key={source.id}
                  className="absolute"
                  style={{ left: `${source.x}%`, top: `${source.y}%` }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    damping: 15,
                    stiffness: 200,
                    delay: idx * 0.1,
                  }}
                >
                  <motion.div
                    className={`relative w-11 h-11 rounded-xl flex items-center justify-center -translate-x-1/2 -translate-y-1/2
                      ${isActive ? "bg-[#4A0404]/40 border-[#B34B71]/60 shadow-[0_0_25px_rgba(179,75,113,0.4)]" : "bg-white/5 border-white/10"}
                      border backdrop-blur-md transition-all duration-300`}
                    animate={
                      isActive ? { scale: [1, 1.1, 1], rotate: [0, 3, -3, 0] } : {}
                    }
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span className="text-lg">{source.icon}</span>
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span
                        className={`text-[9px] font-semibold tracking-[0.15em] uppercase transition-colors duration-300 ${isActive ? "text-[#B34B71]" : "text-white/25"}`}
                      >
                        {source.label}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Orb Core Component
function OrbCore({ phase }: { phase: AppPhase }) {
  const isLarge = ["synthesizing", "retrieving"].includes(phase);
  const isThinking = phase === "synthesizing";
  const isStoring = phase === "storing";

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <AnimatePresence>
        {/* Glow Background */}
        <motion.div
          className="absolute w-80 h-80 rounded-full blur-[100px]"
          animate={{
            background: isThinking
              ? "radial-gradient(circle, rgba(179,75,113,0.25) 0%, transparent 70%)"
              : isStoring
                ? "radial-gradient(circle, rgba(74,4,4,0.3) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
          }}
          transition={{ duration: 0.8 }}
        />
      </AnimatePresence>

      <motion.div
        className="relative z-10"
        animate={{
          scale: isLarge ? 1.4 : isStoring ? 1.2 : 1,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
      >
        {/* The Core Orb */}
        <motion.div
          className="w-14 h-14 rounded-full overflow-hidden relative shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #2b0707 0%, #0a0a0a 100%)",
            border: "1px solid rgba(179,75,113,0.3)",
          }}
        >
          {/* Inner Plasma Effect */}
          <motion.div
            className="absolute inset-0 opacity-90"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, #B34B71 0%, #6B2D4A 50%, #2b0707 100%)",
            }}
            animate={
              isThinking
                ? {
                    rotate: [0, 360],
                    scale: [1, 1.15, 1],
                  }
                : { scale: 1 }
            }
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          />

          {/* Liquid highlight */}
          <div className="absolute top-1.5 left-2 w-6 h-3 bg-white/25 rounded-full blur-[3px] rotate-[-20deg]" />
        </motion.div>

        {/* Pulse Rings for storing */}
        <AnimatePresence>
          {isStoring &&
            [...Array(3)].map((_, i) => (
              <motion.div
                key={`pulse-${i}`}
                className="absolute inset-0 rounded-full border border-[#B34B71]/40"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 3.5, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
              />
            ))}
        </AnimatePresence>

        {/* Synthesis Orbitals */}
        <AnimatePresence>
          {isThinking && (
            <>
              <motion.div
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-35px] border border-[#B34B71]/30 rounded-full"
              >
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#B34B71] rounded-full blur-[1px]"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, rotate: 180 }}
                animate={{ opacity: 1, rotate: -180 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-55px] border border-white/10 rounded-full"
              >
                <motion.div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white/60 rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
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

  // Auto-running demo animation
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

      // Retrieving phase - activate sources one by one
      setPhase("retrieving");

      for (const sourceId of DEMO_CONVERSATION.sourcesToActivate) {
        await delay(800);
        setActiveSources((prev) => [...prev, sourceId]);
      }

      await delay(1000);

      // Synthesizing
      setPhase("synthesizing");
      await delay(2500);

      // Responding
      setPhase("responding");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: DEMO_CONVERSATION.assistantMessage },
      ]);

      await delay(4500);

      // Storing
      setPhase("storing");
      await delay(3000);

      // Reset and loop
      setActiveSources([]);
      runDemo();
    };

    runDemo();
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
      {/* Background Neural Grid */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(179,75,113,0.15) 0%, transparent 70%),
                              linear-gradient(to right, #333 1px, transparent 1px),
                              linear-gradient(to bottom, #333 1px, transparent 1px)`,
            backgroundSize: "100% 100%, 50px 50px, 50px 50px",
          }}
        />
      </div>

      {/* Decorative Blur Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -60, 0],
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -left-1/4 w-[60%] h-[60%] bg-[#4A0404]/30 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 80, 0],
            opacity: [0.08, 0.12, 0.08],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-1/4 -right-1/4 w-[60%] h-[60%] bg-[#B34B71]/20 rounded-full blur-[120px]"
        />
      </div>

      <MemoryLattice phase={phase} activeSources={activeSources} />
      <OrbCore phase={phase} />
      <ChatWindow phase={phase} messages={messages} inputValue={inputValue} />

      {/* Phase Label HUD */}
      <div className="absolute bottom-6 left-6 hidden md:block">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/15 mb-1">
            Neural State
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={phase}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-[10px] font-medium tracking-[0.2em] text-[#B34B71]/80 uppercase"
            >
              {phase}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
