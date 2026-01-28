"use client";

import { useState, useEffect, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { delay } from "@/lib/utils";
import { SiliconInference } from "@/app/components/NexusHero";

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

export default function FeatureSwitcher() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeFeature = features[activeIndex];

  return (
    <section id="features" className="relative py-24 px-6 lg:px-8 overflow-hidden">
      {/* Global Noise Overlay - prevents flatness on OLED displays */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />
      <div className="relative max-w-5xl mx-auto">
        {/* Tab Navigation - Instrument Panel Tray */}
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
                {/* Sliding Active Background with layoutId */}
                {isActive && (
                  <motion.span
                    layoutId="activeTabBackground"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: "linear-gradient(90deg, #B34B71 0%, #8B2D5A 50%, #4A0404 100%)",
                      borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
                {/* Dither Layer - 4x4 Bayer matrix pattern */}
                {isActive && (
                  <motion.span
                    className="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-soft-light"
                    style={{
                      backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAACpJREFUGFdjZEADJgY0QCSTBaYByicmJmByyAImBl0AXQCmAsYA0wByAAsvBg8f889VAAAAAElFTkSuQmCC")`,
                      backgroundRepeat: "repeat",
                    }}
                    initial={{ scale: 0.98 }}
                    animate={{ scale: [0.98, 1, 0.98] }}
                    transition={{ duration: 0.15 }}
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

        {/* Feature Card - Static container, only content changes */}
        <div className="relative">
          {/* Card container */}
          <div className="relative rounded-xl p-3 md:p-8">
            {/* Internal Card with visible border matching dotted grid */}
            <div className="relative rounded-3xl overflow-hidden border border-white/20">
              <div className="flex flex-col md:flex-row h-[500px] md:h-[420px]">
                {/* Left: Content (40%) */}
                <div className="w-full md:w-[40%] p-8 md:p-12 flex flex-col justify-center overflow-hidden">
                  {/* Top dotted line - subtle white */}
                  <div
                    className="w-full h-px mb-6"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(255,255,255,0.2) 50%, transparent 50%)",
                      backgroundSize: "8px 1px",
                      backgroundRepeat: "repeat-x",
                    }}
                  />

                  {/* Animated content area */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeFeature.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
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

                      {/* Feature Points */}
                      {activeFeature.points && (
                        <ul className="space-y-4">
                          {activeFeature.points.map((point: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-[#6A2424] font-bold text-lg leading-none mt-px">
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

                  {/* Bottom dotted line - subtle white */}
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

                {/* Dashed Divider - subtle white for dark theme */}
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

                {/* Right: Animation Area (60%) */}
                <div className="w-full md:w-[60%] flex items-center justify-center p-6 md:p-8">
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

        {/* Feature indicators - Burgundy accent on black */}
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

type AnimationPhase =
  | "idle"
  | "input"
  | "sending"
  | "thinking"
  | "responding"
  | "collapse"
  | "storage";

// Shared pulse frequency for synchronization (1.2Hz = 833ms period)
const PULSE_DURATION = 0.833;

// Typewriter effect component - character by character with variable speed
function TypewriterText({
  text,
  className,
  onComplete,
}: {
  text: string;
  className?: string;
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
        // Smoother, more consistent speed
        const char = text[index - 1];
        const baseDelay = 35;
        const delay =
          char === " "
            ? baseDelay * 0.6
            : [".", ",", "!", "?"].includes(char)
              ? baseDelay * 3
              : baseDelay + Math.random() * 10;
        setTimeout(typeNextChar, delay);
      } else {
        setIsComplete(true);
        onComplete?.();
      }
    };

    const timer = setTimeout(typeNextChar, 100);
    return () => clearTimeout(timer);
  }, [text, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && (
        <motion.span
          className="inline-block w-[2px] h-[10px] bg-white/80 ml-[1px] align-middle"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </span>
  );
}

// Bento Grid Background with gravitational well effect
const BentoGrid = memo(function BentoGrid({ isActive }: { isActive: boolean }) {
  const dots = useMemo(() => {
    const gridSize = 20;
    const result: { x: number; y: number; distance: number }[] = [];
    for (let x = 0; x <= 340; x += gridSize) {
      for (let y = 0; y <= 420; y += gridSize) {
        const centerX = 170;
        const centerY = 210;
        const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        result.push({ x, y, distance });
      }
    }
    return result;
  }, []);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 340 420">
      <defs>
        <radialGradient id="wellGlow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.35" />
          <stop offset="40%" stopColor="white" stopOpacity="0.15" />
          <stop offset="100%" stopColor="white" stopOpacity="0.05" />
        </radialGradient>
      </defs>
      {dots.map((dot, i) => {
        const maxDistance = 100;
        const brightness =
          dot.distance < maxDistance ? 0.3 - (dot.distance / maxDistance) * 0.25 : 0.05;

        return (
          <motion.circle
            key={`grid-dot-${i}`}
            cx={dot.x}
            cy={dot.y}
            r="1"
            fill="white"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isActive ? brightness : 0,
              scale: isActive && dot.distance < 60 ? [1, 1.5, 1] : 1,
            }}
            transition={{
              opacity: { duration: 0.8, delay: i * 0.002 },
              scale: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: dot.distance * 0.01,
              },
            }}
          />
        );
      })}
    </svg>
  );
});

// Background Vector Neural Pathways - Animated during "thinking" state
function NeuralPathwaysBackground({ isActive }: { isActive: boolean }) {
  // Generate neural pathway points
  const pathways = [
    { d: "M50,200 Q100,150 150,180 T250,160", delay: 0 },
    { d: "M80,220 Q130,170 180,200 T280,180", delay: 0.2 },
    { d: "M30,240 Q90,190 140,220 T240,200", delay: 0.4 },
    { d: "M100,260 Q150,210 200,240 T300,220", delay: 0.1 },
    { d: "M60,280 Q120,230 170,260 T270,240", delay: 0.3 },
  ];

  const nodes = [
    { cx: 100, cy: 180, delay: 0 },
    { cx: 180, cy: 200, delay: 0.15 },
    { cx: 140, cy: 240, delay: 0.3 },
    { cx: 220, cy: 220, delay: 0.45 },
    { cx: 260, cy: 190, delay: 0.2 },
    { cx: 80, cy: 260, delay: 0.35 },
  ];

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 340 420"
      fill="none"
      style={{ opacity: isActive ? 1 : 0.3, transition: "opacity 0.5s ease" }}
    >
      {/* Neural pathways */}
      {pathways.map((path, i) => (
        <motion.path
          key={`path-${i}`}
          d={path.d}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            isActive
              ? {
                  pathLength: [0, 1, 1, 0],
                  opacity: [0, 0.6, 0.6, 0],
                }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{
            duration: PULSE_DURATION * 3,
            delay: path.delay,
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Neural nodes */}
      {nodes.map((node, i) => (
        <g key={`node-${i}`}>
          {/* Pulse ring */}
          <motion.circle
            cx={node.cx}
            cy={node.cy}
            r="3"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
            initial={{ scale: 1, opacity: 0 }}
            animate={
              isActive
                ? {
                    scale: [1, 2.5],
                    opacity: [0.6, 0],
                  }
                : { scale: 1, opacity: 0 }
            }
            transition={{
              duration: PULSE_DURATION,
              delay: node.delay,
              repeat: isActive ? Infinity : 0,
              ease: "easeOut",
            }}
          />
          {/* Core node */}
          <motion.circle
            cx={node.cx}
            cy={node.cy}
            r="2"
            fill="rgba(255,255,255,0.5)"
            initial={{ scale: 0.8, opacity: 0.3 }}
            animate={
              isActive
                ? {
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.3, 0.8, 0.3],
                  }
                : { scale: 0.8, opacity: 0.3 }
            }
            transition={{
              duration: PULSE_DURATION,
              delay: node.delay,
              repeat: isActive ? Infinity : 0,
              ease: "easeInOut",
            }}
          />
        </g>
      ))}

      {/* Connecting data streams during active state */}
      {isActive && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.circle
              key={`stream-${i}`}
              r="1.5"
              fill="rgba(255,255,255,0.8)"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
                cx: [80 + i * 30, 170, 260 - i * 20],
                cy: [260 - i * 20, 200 + i * 10, 180 + i * 15],
              }}
              transition={{
                duration: PULSE_DURATION * 2,
                delay: i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </>
      )}
    </svg>
  );
}

// Mic icon with breathing pulse animation
function MicIcon({ isActive }: { isActive: boolean }) {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      animate={isActive ? { scale: [1, 1.08, 1] } : {}}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full bg-gray-400/30"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    </motion.div>
  );
}

function MemoryAnimation() {
  const [phase, setPhase] = useState<AnimationPhase>("input");
  const [inputText, setInputText] = useState("");
  const [showUserMessage, setShowUserMessage] = useState(false);
  const [showAiResponse, setShowAiResponse] = useState(false);

  // The message content
  const userMessage = "need to close deal today";
  const aiResponse = "Sure, Sidekick will set a reminder for 6PM";

  // Determine if background should be active (during thinking phase)
  const isBackgroundActive = phase === "thinking";

  // Animation state machine
  useEffect(() => {
    const runAnimation = async () => {
      // Reset state
      setPhase("input");
      setInputText("");
      setShowUserMessage(false);
      setShowAiResponse(false);

      // Phase 1: Idle then Input - Simulate typing
      await delay(600);

      // Simulate character-by-character typing
      for (let i = 0; i <= userMessage.length; i++) {
        setInputText(userMessage.slice(0, i));
        await delay(40 + Math.random() * 30);
      }

      await delay(400);

      // Phase 2: Send message
      setPhase("sending");
      setInputText("");

      await delay(100);
      setShowUserMessage(true);

      await delay(600);

      // Phase 3: Response - Show immediately without thinking state
      setPhase("responding");
      setShowAiResponse(true);

      await delay(3500); // Let user read the response

      // Phase 5: Collapse - The "Wow Factor"
      setPhase("collapse");

      await delay(800);

      // Phase 6: Storage
      setPhase("storage");

      await delay(4200); // 1.2s for text to appear + 3s display time

      // Loop
      runAnimation();
    };

    runAnimation();
  }, []);

  const layoutMorphTransition = {
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
    duration: 0.4,
  };

  const collapseTransition = {
    type: "spring" as const,
    stiffness: 150,
    damping: 20,
    duration: 0.6,
  };

  const magneticTransition = {
    type: "spring" as const,
    stiffness: 120,
    damping: 14,
    mass: 0.8,
  };

  return (
    <div className="relative w-[340px] h-[420px] overflow-hidden flex items-center justify-center">
      {/* SVG Defs for Filters */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="4"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix type="saturate" values="0" in="noise" result="monoNoise" />
            <feBlend in="SourceGraphic" in2="monoNoise" mode="multiply" />
          </filter>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Gooey effect filter - creates liquid/melting appearance */}
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Background card with 10% vertical padding */}
      <div className="absolute inset-x-0 top-[5%] bottom-[5%] rounded-2xl overflow-hidden">
        {/* Neural Pathways Background - Activates during thinking */}
        <NeuralPathwaysBackground isActive={isBackgroundActive} />
      </div>

      {/* Content Container with backdrop blur during thinking */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center p-4"
        animate={{
          backdropFilter: isBackgroundActive ? "blur(2px)" : "blur(0px)",
        }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {/* Chat Window - All phases except storage */}
          {(phase === "input" ||
            phase === "sending" ||
            phase === "thinking" ||
            phase === "responding" ||
            phase === "collapse") && (
            <motion.div
              key="chat-window-wrapper"
              className="relative"
              style={{
                filter: phase === "collapse" ? "url(#gooey)" : "none",
                willChange: phase === "collapse" ? "filter" : "auto",
              }}
            >
              <motion.div
                key="chat-window"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{
                  opacity: phase === "collapse" ? 0 : 1,
                  scale: phase === "collapse" ? 0.15 : 1,
                  y: phase === "collapse" ? -20 : 0,
                  borderRadius: phase === "collapse" ? "50%" : "24px",
                  filter: phase === "collapse" ? "blur(4px)" : "blur(0px)",
                }}
                exit={{
                  opacity: 0,
                  scale: 0.1,
                  borderRadius: "50%",
                  filter: "blur(8px)",
                }}
                transition={phase === "collapse" ? collapseTransition : layoutMorphTransition}
                className="relative w-[280px] h-[320px] overflow-hidden flex flex-col"
                style={{
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: "0 25px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.15)",
                  borderRadius: "24px",
                }}
              >
                {/* Chat Header */}
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100/80">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-emerald-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>

                {/* Messages Container */}
                <div className="flex-1 p-4 space-y-3 min-h-[200px] overflow-hidden">
                  {/* User Message - iOS style bubble */}
                  <AnimatePresence>
                    {showUserMessage && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85, x: 20, y: 5 }}
                        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: -20 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                          duration: 0.5,
                        }}
                        className="flex justify-end"
                      >
                        <motion.div
                          className="px-3.5 py-2 rounded-2xl rounded-br-md max-w-[180px]"
                          style={{ background: "#1a1a1a" }}
                        >
                          <span className="text-[11px] text-white font-medium leading-relaxed">
                            {userMessage}
                          </span>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* AI Response - Typewriter effect */}
                  <AnimatePresence>
                    {showAiResponse && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.5, y: -20 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="flex justify-start"
                      >
                        <motion.div
                          className="relative flex items-start gap-2 px-3 py-2.5 rounded-2xl max-w-[220px] overflow-hidden"
                          style={{
                            background: "#000000",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                          }}
                        >
                          {/* Typewriter Text Response */}
                          <TypewriterText
                            text={aiResponse}
                            className="text-[11px] text-white font-medium leading-relaxed"
                          />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Input Bar */}
                <motion.div
                  className="px-3 pb-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    className="flex items-center gap-2 px-3 py-2 rounded-full"
                    style={{
                      background: "rgba(255, 255, 255, 0.5)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                    }}
                    animate={{
                      borderColor: inputText ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.08)",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Text Input Area */}
                    <div className="flex-1 min-h-[20px] flex items-center overflow-hidden">
                      {inputText ? (
                        <span className="text-[11px] text-gray-800 font-medium whitespace-nowrap">
                          {inputText}
                          <motion.span
                            className="inline-block w-[2px] h-[12px] bg-gray-800 ml-[1px] align-middle"
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 0.53, repeat: Infinity, ease: "linear" }}
                          />
                        </span>
                      ) : (
                        <span className="text-[11px] text-gray-400 font-medium">
                          Write your message...
                        </span>
                      )}
                    </div>

                    {/* Send Button */}
                    <motion.button
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{
                        background: inputText ? "#1a1a1a" : "#e5e5e5",
                      }}
                      animate={{
                        background: inputText ? "#1a1a1a" : "#e5e5e5",
                        scale: inputText ? 1 : 0.95,
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={inputText ? "white" : "#9ca3af"}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="19" x2="12" y2="5" />
                        <polyline points="5 12 12 5 19 12" />
                      </svg>
                    </motion.button>

                    {/* Mic Icon */}
                    <div className="text-gray-400">
                      <MicIcon isActive={!inputText && phase === "input"} />
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* The "Data Packet" - Appears during collapse, flies to memory node */}
          {phase === "collapse" && (
            <motion.div
              key="data-packet"
              className="absolute"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.5, 0.8],
                opacity: [0, 1, 0],
                y: [0, -40, -80],
              }}
              transition={{
                duration: 1,
                times: [0, 0.4, 1],
                ease: "easeInOut",
              }}
              style={{
                width: 16,
                height: 16,
                background:
                  "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)",
                borderRadius: "50%",
                filter: "url(#glow)",
                boxShadow: "0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.4)",
              }}
            />
          )}

          {/* Phase C: Atomic Persistence - Memory Storage Node */}
          {phase === "storage" && (
            <motion.div
              key="storage-node"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={magneticTransition}
              className="relative flex items-center justify-center"
            >
              {/* Bento Grid Background with Gravitational Well */}
              <BentoGrid isActive={true} />

              {/* Write-to-Disk Flash - High frequency radial flash */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)",
                }}
                initial={{ width: 20, height: 20, opacity: 0 }}
                animate={{
                  width: [20, 120],
                  height: [20, 120],
                  opacity: [0.9, 0],
                }}
                transition={{
                  duration: 0.15,
                  ease: "easeOut",
                }}
              />

              {/* Pressure Wave - Background dilation */}
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{
                  duration: 0.3,
                  delay: 0.1,
                  ease: "easeOut",
                }}
              />

              {/* Dynamic Lattice Core - 3 concentric rings at prime intervals */}
              {[
                { radius: 20, duration: 7, strokeDash: "2 4", opacity: 0.6 },
                { radius: 32, duration: 13, strokeDash: "4 6", opacity: 0.5 },
                { radius: 44, duration: 17, strokeDash: "3 5", opacity: 0.4 },
              ].map((ring, i) => (
                <motion.div
                  key={`lattice-ring-${i}`}
                  className="absolute"
                  animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                  transition={{ duration: ring.duration, repeat: Infinity, ease: "linear" }}
                >
                  <svg
                    width={ring.radius * 2 + 10}
                    height={ring.radius * 2 + 10}
                    viewBox={`0 0 ${ring.radius * 2 + 10} ${ring.radius * 2 + 10}`}
                    fill="none"
                  >
                    <motion.circle
                      cx={ring.radius + 5}
                      cy={ring.radius + 5}
                      r={ring.radius}
                      stroke={`rgba(255,255,255,${ring.opacity})`}
                      strokeWidth="1"
                      strokeDasharray={ring.strokeDash}
                      fill="none"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{
                        scale: [0.9, 1.05, 0.9],
                        opacity: [ring.opacity * 0.8, ring.opacity, ring.opacity * 0.8],
                      }}
                      transition={{
                        duration: 2 + i * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.2,
                      }}
                    />
                  </svg>
                </motion.div>
              ))}

              {/* Central Memory Core - The crystallized hub */}
              <motion.div
                className="relative w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #B34B71 0%, #6B2D4A 100%)",
                  boxShadow:
                    "0 0 40px rgba(179, 75, 113, 0.7), inset 0 0 25px rgba(255,255,255,0.15)",
                }}
                initial={{ scale: 0.5 }}
                animate={{ scale: [0.5, 1.15, 1] }}
                transition={{
                  duration: 0.8,
                  times: [0, 0.5, 1],
                  ease: "easeOut",
                }}
              >
                {/* Inner Glow - Pulses to show crystallization */}
                <motion.div
                  className="absolute inset-1.5 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)",
                  }}
                  animate={{
                    opacity: [0.3, 1, 0.5],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 1,
                    times: [0, 0.3, 1],
                    ease: "easeOut",
                  }}
                />

                {/* Crystal/Database Icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <motion.path
                    d="M12 2L2 7l10 5 10-5-10-5z"
                    stroke="white"
                    strokeWidth="1.5"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <motion.path
                    d="M2 17l10 5 10-5"
                    stroke="white"
                    strokeWidth="1.5"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  />
                  <motion.path
                    d="M2 12l10 5 10-5"
                    stroke="white"
                    strokeWidth="1.5"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  />
                </svg>
              </motion.div>

              {/* Particle Accumulation Grid - Particles snap to hexagonal positions */}
              {[...Array(12)].map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const startRadius = 80;
                const endRadius = 26; // Inside the middle ring
                const endX = Math.cos(angle) * endRadius;
                const endY = Math.sin(angle) * endRadius;

                return (
                  <motion.div
                    key={`particle-${i}`}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6) 100%)",
                      boxShadow: "0 0 8px rgba(255,255,255,0.9)",
                    }}
                    initial={{
                      x: Math.cos(angle) * startRadius,
                      y: Math.sin(angle) * startRadius,
                      opacity: 0,
                      scale: 0,
                    }}
                    animate={{
                      x: [Math.cos(angle) * startRadius, endX],
                      y: [Math.sin(angle) * startRadius, endY],
                      opacity: [0, 1, 1],
                      scale: [0, 1.3, 0.8],
                    }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.06,
                      ease: [0.68, -0.55, 0.265, 1.55], // Snap bezier with overshoot
                    }}
                  />
                );
              })}

              {/* Locked Particles - Pulse after snapping into place */}
              {[...Array(12)].map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const radius = 26;
                return (
                  <motion.div
                    key={`locked-particle-${i}`}
                    className="absolute w-1.5 h-1.5 rounded-full bg-white/70"
                    style={{
                      x: Math.cos(angle) * radius,
                      y: Math.sin(angle) * radius,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 0, 0.8],
                      scale: [0, 0, 1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      delay: 0.8 + i * 0.05,
                      times: [0, 0.4, 0.5, 0.7, 1],
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  />
                );
              })}

              {/* Memory Stored Label */}
              <motion.div
                className="absolute -bottom-12 whitespace-nowrap"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <motion.span
                  className="text-[11px] font-bold tracking-[0.2em] text-white uppercase"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  Memory Stored
                </motion.span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// Neural Constellation - Context Animation
// Nodes connected by high-velocity synapse beams with traveling glow
// Semantic Graph Context Engine Animation (Enhanced)
// 2D Graph Visualization showing semantic search and context mapping
type SemanticGraphPhase = "idle" | "scanning" | "connecting" | "synthesis";
type LogoType = "notion" | "sheets" | "gmail" | "slack" | "github";

interface ClusterNode {
  id: number;
  x: number;
  y: number;
  label: string;
  logoType: LogoType;
  labelId: string;
}

// Inline SVG Logo Components for the graph
const LogoSVGs: Record<LogoType, (size: number) => React.ReactNode> = {
  notion: (size) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
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
  ),
  slack: (size) => (
    <svg width={size} height={size} viewBox="0 0 128 128" fill="none">
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
  ),
  gmail: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
        fill="#EA4335"
      />
    </svg>
  ),
  sheets: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M19.5 24h-15A2.5 2.5 0 0 1 2 21.5v-19A2.5 2.5 0 0 1 4.5 0h10l7.5 7.5v14a2.5 2.5 0 0 1-2.5 2.5z"
        fill="#0F9D58"
      />
      <path d="M14.5 0v5a2.5 2.5 0 0 0 2.5 2.5h5" fill="#87CEAC" />
      <path d="M6 12h12v9H6z" fill="#fff" />
      <path d="M6 15h12M6 18h12M10 12v9M14 12v9" stroke="#0F9D58" strokeWidth="0.5" />
    </svg>
  ),
  github: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
        fill="#FFFFFF"
      />
    </svg>
  ),
};

function ContextAnimation() {
  const [phase, setPhase] = useState<SemanticGraphPhase>("idle");
  const [cycleKey, setCycleKey] = useState(0);
  const [queryPosition, setQueryPosition] = useState({ x: -30, y: 210 });
  const [activeInfluenceNodes, setActiveInfluenceNodes] = useState<Set<number>>(new Set());
  const [connectionProgress, setConnectionProgress] = useState(0);
  const [sparkProgress, setSparkProgress] = useState(0);
  const [similarityScore, setSimilarityScore] = useState(0);
  const [warpIntensity, setWarpIntensity] = useState(0);
  const [showLabels, setShowLabels] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  // Canvas dimensions (larger for better visibility)
  const WIDTH = 340;
  const HEIGHT = 420;

  // Cluster nodes - Budget cluster (left) and Slack cluster (right)
  // Scaled up positions for 420px height
  const clusterNodes = useMemo<ClusterNode[]>(
    () => [
      {
        id: 0,
        x: 70,
        y: 130,
        label: "Q3 Budget",
        logoType: "notion",
        labelId: "BUDGET_REF",
      },
      {
        id: 1,
        x: 45,
        y: 220,
        label: "Spend Report",
        logoType: "sheets",
        labelId: "SPEND_DOC",
      },
      {
        id: 2,
        x: 95,
        y: 300,
        label: "Approval",
        logoType: "gmail",
        labelId: "APPROVE_01",
      },
      {
        id: 3,
        x: 270,
        y: 110,
        label: "Nov Thread",
        logoType: "slack",
        labelId: "SLACK_COMM",
      },
      {
        id: 4,
        x: 250,
        y: 200,
        label: "Decision",
        logoType: "slack",
        labelId: "DEC_THREAD",
      },
      {
        id: 5,
        x: 290,
        y: 290,
        label: "Follow-up",
        logoType: "github",
        labelId: "GH_ISSUE",
      },
    ],
    []
  );

  // Connection pair: Q3 Budget <-> Nov Thread
  const connectionPair = { from: 0, to: 3 };
  const node1 = clusterNodes[connectionPair.from];
  const node2 = clusterNodes[connectionPair.to];
  const midPoint = {
    x: (node1.x + node2.x) / 2,
    y: (node1.y + node2.y) / 2,
  };

  // Check if node is within influence radius (increased to 90px)
  const isWithinInfluence = (
    nodeX: number,
    nodeY: number,
    queryX: number,
    queryY: number,
    radius: number = 90
  ): boolean => {
    const distance = Math.sqrt(Math.pow(nodeX - queryX, 2) + Math.pow(nodeY - queryY, 2));
    return distance <= radius;
  };

  // Update influence nodes based on query position
  const updateInfluenceRadius = (queryX: number, queryY: number) => {
    const influenced = new Set<number>();
    clusterNodes.forEach((node) => {
      if (isWithinInfluence(node.x, node.y, queryX, queryY)) {
        influenced.add(node.id);
      }
    });
    setActiveInfluenceNodes(influenced);
  };

  // Check if node is part of the connection pair
  const isConnectedNode = (nodeId: number): boolean => {
    return nodeId === connectionPair.from || nodeId === connectionPair.to;
  };

  // Generate dot grid positions (20px spacing for larger canvas)
  const dotGrid = useMemo(() => {
    const dots: { x: number; y: number; id: number }[] = [];
    const spacing = 20;
    let id = 0;
    for (let y = spacing / 2; y < HEIGHT; y += spacing) {
      for (let x = spacing / 2; x < WIDTH; x += spacing) {
        dots.push({ x, y, id: id++ });
      }
    }
    return dots;
  }, []);

  // Calculate warp displacement for grid dots (increased effect)
  const getWarpedPosition = (dotX: number, dotY: number) => {
    if (warpIntensity === 0) return { x: dotX, y: dotY };
    const distance = Math.sqrt(Math.pow(dotX - midPoint.x, 2) + Math.pow(dotY - midPoint.y, 2));
    if (distance > 120) return { x: dotX, y: dotY };

    const pullStrength = (1 - distance / 120) * (warpIntensity / 100) * 10;
    const angle = Math.atan2(midPoint.y - dotY, midPoint.x - dotX);

    return {
      x: dotX + Math.cos(angle) * pullStrength,
      y: dotY + Math.sin(angle) * pullStrength,
    };
  };

  // Animation cycle
  useEffect(() => {
    const runCycle = async () => {
      // Reset state
      setPhase("idle");
      setQueryPosition({ x: -30, y: 210 });
      setActiveInfluenceNodes(new Set());
      setConnectionProgress(0);
      setSparkProgress(0);
      setSimilarityScore(0);
      setWarpIntensity(0);
      setShowLabels(false);
      setShowRipple(false);

      await delay(400);

      // ═══════════════════════════════════════════════
      // PHASE I: Spatial Scan (0-3.5s)
      // ═══════════════════════════════════════════════
      setPhase("scanning");

      // Non-linear scan path (adjusted for larger canvas)
      const scanPath = [
        { x: 50, y: 280, wait: 400 },
        { x: 100, y: 150, wait: 350 },
        { x: 170, y: 240, wait: 400 },
        { x: 240, y: 130, wait: 350 },
        { x: 280, y: 200, wait: 400 },
        { x: 170, y: 160, wait: 0 }, // Final position between clusters
      ];

      for (const waypoint of scanPath) {
        setQueryPosition({ x: waypoint.x, y: waypoint.y });
        updateInfluenceRadius(waypoint.x, waypoint.y);
        if (waypoint.wait > 0) await delay(waypoint.wait);
      }

      await delay(500);

      // ═══════════════════════════════════════════════
      // PHASE II: Connection Pulse (3.5-6s)
      // ═══════════════════════════════════════════════
      setPhase("connecting");
      setActiveInfluenceNodes(new Set([connectionPair.from, connectionPair.to]));

      // Animate connection line with smooth progression
      for (let i = 0; i <= 100; i += 5) {
        setConnectionProgress(i);
        await delay(20);
      }

      await delay(150);

      // Show labels
      setShowLabels(true);

      await delay(300);

      // Synapse spark travels along the line
      for (let i = 0; i <= 100; i += 3) {
        setSparkProgress(i);
        await delay(12);
      }

      await delay(400);

      // ═══════════════════════════════════════════════
      // PHASE III: Synthesis (6-10s)
      // ═══════════════════════════════════════════════
      setPhase("synthesis");

      // Animate similarity score counting up to 94%
      for (let i = 0; i <= 94; i += 2) {
        setSimilarityScore(Math.min(i, 94));
        await delay(20);
      }
      setSimilarityScore(94);

      // Gravitational warp effect
      for (let i = 0; i <= 100; i += 5) {
        setWarpIntensity(i);
        await delay(25);
      }

      // Show ripple
      setShowRipple(true);

      // Hold synthesis state
      await delay(3000);

      // Reset and loop
      setCycleKey((prev) => prev + 1);
    };

    runCycle();
  }, [cycleKey]);

  return (
    <div className="relative w-[340px] h-[420px] overflow-hidden rounded-2xl p-4">
      <svg
        className="absolute inset-4 w-[calc(100%-32px)] h-[calc(100%-32px)]"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        key={`semantic-${cycleKey}`}
      >
        <defs>
          {/* Query node glow - enhanced */}
          <filter id="ctx-queryGlow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Synapse spark glow - brighter */}
          <filter id="ctx-synapseGlow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Node glow */}
          <filter id="ctx-nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Connection line glow */}
          <filter id="ctx-lineGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Burgundy gradient for connection */}
          <linearGradient id="ctx-connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B34B71" />
            <stop offset="50%" stopColor="#E05A8D" />
            <stop offset="100%" stopColor="#B34B71" />
          </linearGradient>

          {/* Influence radius gradient - more visible */}
          <radialGradient id="ctx-influenceGradient">
            <stop offset="0%" stopColor="#B34B71" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#B34B71" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#B34B71" stopOpacity="0" />
          </radialGradient>

          {/* Ripple gradient - more visible */}
          <radialGradient id="ctx-rippleGradient">
            <stop offset="0%" stopColor="white" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#B34B71" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#B34B71" stopOpacity="0" />
          </radialGradient>

          {/* Active node gradient */}
          <radialGradient id="ctx-activeNodeGradient">
            <stop offset="0%" stopColor="#E05A8D" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#B34B71" stopOpacity="0.4" />
          </radialGradient>
        </defs>

        {/* ═══════════════════════════════════════════════
            LAYER 1: DOT GRID BACKGROUND (20px spacing)
            ═══════════════════════════════════════════════ */}
        <g className="dot-grid">
          {dotGrid.map((dot) => {
            const warped = getWarpedPosition(dot.x, dot.y);
            return (
              <circle
                key={`grid-${dot.id}`}
                cx={warped.x}
                cy={warped.y}
                r="1"
                fill="rgba(255,255,255,0.15)"
              />
            );
          })}
        </g>

        {/* ═══════════════════════════════════════════════
            LAYER 2: CLUSTER NODES (larger, more visible)
            ═══════════════════════════════════════════════ */}
        {clusterNodes.map((node) => {
          const isInfluenced = activeInfluenceNodes.has(node.id);
          const isConnected = isConnectedNode(node.id);
          const shouldExpand = phase === "synthesis" && isConnected;

          return (
            <g key={`node-${node.id}`}>
              {/* Pulse ring for connected nodes during synthesis */}
              {shouldExpand && (
                <>
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r="16"
                    fill="none"
                    stroke="#B34B71"
                    strokeWidth="1.5"
                    initial={{ scale: 0.8, opacity: 0.9 }}
                    animate={{ scale: 3, opacity: 0 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r="16"
                    fill="none"
                    stroke="#B34B71"
                    strokeWidth="1"
                    initial={{ scale: 0.8, opacity: 0.7 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 0.3,
                    }}
                  />
                </>
              )}

              {/* Node outer ring - larger, 2px stroke */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="14"
                fill="none"
                strokeWidth="2"
                filter={isConnected || isInfluenced ? "url(#ctx-nodeGlow)" : "none"}
                initial={{ opacity: 0.4, scale: 1 }}
                animate={{
                  opacity: isInfluenced ? [0.3, 0.9, 0.3] : isConnected ? 1 : 0.4,
                  scale: shouldExpand ? 1.2 : 1,
                  stroke: isConnected
                    ? "#E05A8D"
                    : isInfluenced
                      ? "rgba(224, 90, 141, 0.8)"
                      : "rgba(255,255,255,0.4)",
                }}
                transition={{
                  opacity: isInfluenced
                    ? { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.3 },
                  scale: {
                    type: "spring",
                    stiffness: 600,
                    damping: 20,
                  },
                  stroke: { duration: 0.2 },
                }}
              />

              {/* Node inner core - filled dot for visibility */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="5"
                initial={{ opacity: 0.5 }}
                animate={{
                  opacity: isConnected ? 1 : isInfluenced ? 0.8 : 0.5,
                  fill: isConnected
                    ? "#FFFFFF"
                    : isInfluenced
                      ? "rgba(224, 90, 141, 0.9)"
                      : "rgba(255,255,255,0.5)",
                  scale: isConnected ? [1, 1.3, 1] : 1,
                }}
                transition={{
                  duration: 0.3,
                  scale: isConnected
                    ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
                    : undefined,
                }}
              />

              {/* Node label with logo - positioned below node */}
              <motion.g
                animate={{
                  opacity: isConnected ? 1 : isInfluenced ? 0.85 : 0.6,
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Logo icon using foreignObject */}
                <foreignObject x={node.x - 50} y={node.y + 20} width="18" height="18">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      opacity: isConnected ? 1 : isInfluenced ? 0.9 : 0.7,
                    }}
                  >
                    {LogoSVGs[node.logoType](16)}
                  </div>
                </foreignObject>

                {/* Node label text */}
                <motion.text
                  x={node.x - 28}
                  y={node.y + 34}
                  textAnchor="start"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight={isConnected ? "bold" : "normal"}
                  style={{ letterSpacing: "0.02em" }}
                  animate={{
                    fill: isConnected
                      ? "rgba(255,255,255,0.95)"
                      : isInfluenced
                        ? "rgba(255,255,255,0.8)"
                        : "rgba(255,255,255,0.5)",
                  }}
                >
                  {node.label}
                </motion.text>
              </motion.g>
            </g>
          );
        })}

        {/* ═══════════════════════════════════════════════
            LAYER 3: QUERY NODE WITH CROSSHAIR (Phase I)
            ═══════════════════════════════════════════════ */}
        {phase === "scanning" && (
          <motion.g
            initial={{ x: -30, y: 210, opacity: 0 }}
            animate={{
              x: queryPosition.x,
              y: queryPosition.y,
              opacity: 1,
            }}
            transition={{
              x: { type: "tween", ease: "easeOut", duration: 0.4 },
              y: { type: "tween", ease: "easeOut", duration: 0.4 },
              opacity: { duration: 0.3 },
            }}
          >
            {/* Influence radius indicator - larger, more visible */}
            <motion.circle
              cx="0"
              cy="0"
              r="90"
              fill="url(#ctx-influenceGradient)"
              animate={{ scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Query node circle - larger, 12px radius, 3px stroke */}
            <circle
              cx="0"
              cy="0"
              r="12"
              fill="none"
              stroke="#E05A8D"
              strokeWidth="3"
              filter="url(#ctx-queryGlow)"
            />

            {/* Inner dot */}
            <circle cx="0" cy="0" r="4" fill="#FFFFFF" opacity="0.9" />

            {/* Crosshair - larger, thicker */}
            <line
              x1="-22"
              y1="0"
              x2="-8"
              y2="0"
              stroke="#E05A8D"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="8"
              y1="0"
              x2="22"
              y2="0"
              stroke="#E05A8D"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="0"
              y1="-22"
              x2="0"
              y2="-8"
              stroke="#E05A8D"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="0"
              y1="8"
              x2="0"
              y2="22"
              stroke="#E05A8D"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Rotating scan indicator */}
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <circle cx="0" cy="-30" r="2" fill="#E05A8D" opacity="0.6" />
            </motion.g>
          </motion.g>
        )}

        {/* ═══════════════════════════════════════════════
            LAYER 4: CONNECTION LINE (Phase II-III)
            ═══════════════════════════════════════════════ */}
        {(phase === "connecting" || phase === "synthesis") && (
          <>
            {/* Background glow line */}
            <motion.line
              x1={node1.x}
              y1={node1.y}
              x2={node1.x + (node2.x - node1.x) * (connectionProgress / 100)}
              y2={node1.y + (node2.y - node1.y) * (connectionProgress / 100)}
              stroke="#B34B71"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.3"
              filter="url(#ctx-lineGlow)"
            />

            {/* Main vector line - 2px stroke, crisp burgundy */}
            <motion.line
              x1={node1.x}
              y1={node1.y}
              x2={node1.x + (node2.x - node1.x) * (connectionProgress / 100)}
              y2={node1.y + (node2.y - node1.y) * (connectionProgress / 100)}
              stroke="url(#ctx-connectionGradient)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Synapse Spark - larger, brighter */}
            {sparkProgress > 0 && sparkProgress < 100 && (
              <>
                {/* Spark trail */}
                <motion.circle
                  r="12"
                  fill="#E05A8D"
                  opacity="0.3"
                  filter="url(#ctx-synapseGlow)"
                  cx={node1.x + (node2.x - node1.x) * (sparkProgress / 100)}
                  cy={node1.y + (node2.y - node1.y) * (sparkProgress / 100)}
                />
                {/* Spark core */}
                <motion.circle
                  r="6"
                  fill="#FFFFFF"
                  filter="url(#ctx-synapseGlow)"
                  cx={node1.x + (node2.x - node1.x) * (sparkProgress / 100)}
                  cy={node1.y + (node2.y - node1.y) * (sparkProgress / 100)}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.15, scale: { duration: 0.2 } }}
                />
              </>
            )}
          </>
        )}

        {/* ═══════════════════════════════════════════════
            LAYER 5: NODE ID LABELS (Phase II-III)
            ═══════════════════════════════════════════════ */}
        {showLabels && (
          <>
            {/* Label background for node1 */}
            <motion.rect
              x={node1.x - 45}
              y={node1.y - 38}
              width="90"
              height="16"
              rx="3"
              fill="rgba(0,0,0,0.6)"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.text
              x={node1.x}
              y={node1.y - 26}
              textAnchor="middle"
              fill="rgba(255,255,255,0.9)"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
              style={{ letterSpacing: "0.05em" }}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              ID: {node1.labelId}
            </motion.text>

            {/* Label background for node2 */}
            <motion.rect
              x={node2.x - 45}
              y={node2.y - 38}
              width="90"
              height="16"
              rx="3"
              fill="rgba(0,0,0,0.6)"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            />
            <motion.text
              x={node2.x}
              y={node2.y - 26}
              textAnchor="middle"
              fill="rgba(255,255,255,0.9)"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
              style={{ letterSpacing: "0.05em" }}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              ID: {node2.labelId}
            </motion.text>
          </>
        )}

        {/* ═══════════════════════════════════════════════
            LAYER 6: WAVEFORM RIPPLE (Phase III)
            ═══════════════════════════════════════════════ */}
        {showRipple && (
          <>
            <motion.circle
              cx={midPoint.x}
              cy={midPoint.y}
              fill="url(#ctx-rippleGradient)"
              initial={{ r: 0, opacity: 1 }}
              animate={{ r: 150, opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            <motion.circle
              cx={midPoint.x}
              cy={midPoint.y}
              fill="none"
              stroke="#B34B71"
              strokeWidth="2"
              initial={{ r: 0, opacity: 0.8 }}
              animate={{ r: 120, opacity: 0 }}
              transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
            />
          </>
        )}

        {/* ═══════════════════════════════════════════════
            LAYER 7: HUD OVERLAY
            ═══════════════════════════════════════════════ */}

        {/* Status indicator - top */}
        {phase === "scanning" && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <rect x="110" y="12" width="120" height="22" rx="4" fill="rgba(0,0,0,0.5)" />
            <motion.circle
              cx="120"
              cy="23"
              r="3"
              fill="#E05A8D"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            <text
              x="175"
              y="28"
              textAnchor="middle"
              fill="rgba(255,255,255,0.7)"
              fontSize="10"
              fontFamily="monospace"
              style={{ letterSpacing: "0.1em" }}
            >
              SCANNING...
            </text>
          </motion.g>
        )}

        {/* Similarity Score Counter - larger */}
        {phase === "synthesis" && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <rect x="100" y="365" width="140" height="24" rx="4" fill="rgba(0,0,0,0.5)" />
            <text
              x="170"
              y="382"
              textAnchor="middle"
              fill="rgba(255,255,255,0.7)"
              fontSize="11"
              fontFamily="monospace"
              style={{ letterSpacing: "0.08em" }}
            >
              SIMILARITY:{" "}
              <tspan fill="#E05A8D" fontWeight="bold">
                {similarityScore}%
              </tspan>
            </text>
          </motion.g>
        )}

        {/* Status Labels - larger, more prominent */}
        {phase === "synthesis" && similarityScore >= 94 && (
          <>
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <rect x="85" y="392" width="170" height="18" rx="3" fill="rgba(0,0,0,0.4)" />
              <text
                x="170"
                y="405"
                textAnchor="middle"
                fill="rgba(255,255,255,0.7)"
                fontSize="9"
                fontFamily="monospace"
                style={{ letterSpacing: "0.1em" }}
              >
                RELATION_STRENGTH: 0.98
              </text>
            </motion.g>

            <motion.g
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.6,
                type: "spring",
                stiffness: 500,
                damping: 20,
              }}
            >
              <rect
                x="95"
                y="10"
                width="150"
                height="26"
                rx="4"
                fill="rgba(179, 75, 113, 0.3)"
                stroke="#B34B71"
                strokeWidth="1"
              />
              <text
                x="170"
                y="28"
                textAnchor="middle"
                fill="#E05A8D"
                fontSize="12"
                fontFamily="monospace"
                fontWeight="bold"
                style={{ letterSpacing: "0.12em" }}
              >
                LINK: ESTABLISHED
              </text>
            </motion.g>
          </>
        )}
      </svg>
    </div>
  );
}

// Chronos Vault v2 - Retention Animation (2D)
// Storage Cell type for the 2D grid
interface StorageCell {
  id: number;
  row: number;
  col: number;
  status: "empty" | "writing" | "encrypted";
  bitstream: string;
}

// Generate random hex string
const generateHex = (length: number): string => {
  const chars = "0123456789ABCDEF";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * 16)]).join("");
};

// Generate WAL log entries
const generateLogEntry = (): string => {
  return `0x${generateHex(2)} 0x${generateHex(2)} 0x${generateHex(2)}`;
};

function RetentionAnimation() {
  const [phase, setPhase] = useState<"idle" | "log" | "allocate" | "flush" | "done">("idle");
  const [cycleKey, setCycleKey] = useState(0);
  const [logEntries, setLogEntries] = useState<string[]>([]);
  const [encryptionProgress, setEncryptionProgress] = useState(0);
  const [pageRef, setPageRef] = useState("0x00000000");
  const [integrityHash, setIntegrityHash] = useState("________________");
  const [iopsValue, setIopsValue] = useState(0);
  const [persistenceFlash, setPersistenceFlash] = useState(false);

  // Grid dimensions: 8 columns x 6 rows
  const GRID_COLS = 8;
  const GRID_ROWS = 6;

  // Initialize grid cells with fragmentation fill order
  const gridCells = useMemo<StorageCell[]>(() => {
    const cells: StorageCell[] = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        cells.push({
          id: row * GRID_COLS + col,
          row,
          col,
          status: "empty",
          bitstream: generateHex(4),
        });
      }
    }
    return cells;
  }, []);

  // Fragmentation fill order - non-sequential to mimic memory allocation
  const fillOrder = useMemo(() => {
    const order = [
      3, 17, 8, 24, 12, 1, 29, 5, 21, 14, 33, 7, 19, 2, 26, 11, 35, 4, 22, 15, 30, 9, 27, 0, 18, 13,
      31, 6, 23, 10, 34, 16, 20, 28, 32, 25, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
    ];
    return order.filter((i) => i < GRID_COLS * GRID_ROWS);
  }, []);

  // Track which cells are filled
  const [filledCells, setFilledCells] = useState<Set<number>>(new Set());
  const [encryptedCells, setEncryptedCells] = useState<Set<number>>(new Set());

  // Main animation cycle
  useEffect(() => {
    const runCycle = async () => {
      // Reset state
      setPhase("idle");
      setLogEntries([]);
      setEncryptionProgress(0);
      setFilledCells(new Set());
      setEncryptedCells(new Set());
      setPageRef("0x00000000");
      setIntegrityHash("________________");
      setIopsValue(0);
      setPersistenceFlash(false);

      await delay(400);

      // Phase I: WAL Log (0-1s)
      setPhase("log");
      for (let i = 0; i < 8; i++) {
        setLogEntries((prev) => [generateLogEntry(), ...prev].slice(0, 12));
        setPageRef(`0x${generateHex(8)}`);
        setIopsValue(Math.floor(Math.random() * 4000 + 2000));
        await delay(100);
      }

      await delay(200);

      // Phase II: Block Allocation (1-3s)
      setPhase("allocate");
      const cellsToFill = fillOrder.slice(0, 32);
      const localFilledCells = new Set<number>();
      for (let i = 0; i < cellsToFill.length; i++) {
        localFilledCells.add(cellsToFill[i]);
        setFilledCells(new Set(localFilledCells));
        setIopsValue(Math.floor(Math.random() * 6000 + 4000));
        await delay(50);
      }

      await delay(300);

      // Phase III: Encryption Sweep / Flush (3-5s)
      setPhase("flush");
      const totalRows = GRID_ROWS;
      for (let row = 0; row <= totalRows; row++) {
        setEncryptionProgress((row / totalRows) * 100);
        // Mark cells in current row as encrypted
        for (let col = 0; col < GRID_COLS; col++) {
          const cellId = (row - 1) * GRID_COLS + col;
          if (row > 0 && localFilledCells.has(cellId)) {
            setEncryptedCells((prev) => new Set([...prev, cellId]));
          }
        }
        await delay(250);
      }

      // Generate final hash
      setIntegrityHash(generateHex(16));

      // Persistence flash effect
      setPersistenceFlash(true);
      await delay(200);
      setPersistenceFlash(false);

      setPhase("done");
      await delay(2500);

      // Restart cycle
      setCycleKey((prev) => prev + 1);
    };

    runCycle();
  }, [cycleKey, fillOrder]);

  return (
    <div
      className="relative w-[340px] h-[280px] overflow-hidden rounded-2xl"
      style={{
        filter: persistenceFlash ? "contrast(1.15) brightness(1.1)" : "none",
        transition: "filter 200ms ease-out",
      }}
    >
      {/* Blueprint Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(10,10,15,0.98) 100%)",
        }}
      />

      {/* Subtle Grid Lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
        viewBox="0 0 340 280"
      >
        {/* Vertical lines */}
        {Array.from({ length: 18 }, (_, i) => (
          <line
            key={`v-${i}`}
            x1={i * 20}
            y1={0}
            x2={i * 20}
            y2={280}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.5"
          />
        ))}
        {/* Horizontal lines */}
        {Array.from({ length: 15 }, (_, i) => (
          <line
            key={`h-${i}`}
            x1={0}
            y1={i * 20}
            x2={340}
            y2={i * 20}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.5"
          />
        ))}
      </svg>

      {/* Main Layout: WAL (left) | Memory Heap (center) */}
      <div className="relative w-full h-full flex">
        {/* WAL - Write-Ahead Log (Left Column) */}
        <div className="w-[70px] h-full border-r border-white/10 flex flex-col pt-8 pb-12 px-2 overflow-hidden">
          <div
            className="text-[6px] font-mono tracking-[0.2em] mb-2"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            WAL
          </div>
          <div className="flex-1 overflow-hidden relative">
            {/* Log entries scrolling up */}
            <AnimatePresence mode="popLayout">
              {logEntries.map((entry, i) => (
                <motion.div
                  key={`${cycleKey}-${entry}-${i}`}
                  className="font-mono text-[7px] leading-relaxed"
                  style={{
                    color: i === 0 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)",
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1, ease: "linear" }}
                >
                  {entry}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Cursor line */}
            {phase === "log" && (
              <motion.div
                className="absolute left-0 right-0 h-[1px]"
                style={{ background: "#B34B71", top: 0 }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.3, repeat: Infinity }}
              />
            )}
          </div>
        </div>

        {/* Memory Heap - Central Grid */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
          {/* Grid Container */}
          <div className="relative">
            {/* Grid Cells */}
            <div
              className="grid gap-[3px]"
              style={{
                gridTemplateColumns: `repeat(${GRID_COLS}, 24px)`,
                gridTemplateRows: `repeat(${GRID_ROWS}, 24px)`,
              }}
            >
              {gridCells.map((cell) => {
                const isFilled = filledCells.has(cell.id);
                const isEncrypted = encryptedCells.has(cell.id);

                return (
                  <motion.div
                    key={cell.id}
                    className="relative rounded-[2px]"
                    style={{
                      border: isEncrypted
                        ? "1px solid rgba(179,75,113,0.6)"
                        : isFilled
                          ? "1px solid rgba(179,75,113,0.3)"
                          : "1px solid rgba(255,255,255,0.1)",
                      background: isEncrypted
                        ? "rgba(179,75,113,0.25)"
                        : isFilled
                          ? "rgba(179,75,113,0.12)"
                          : "transparent",
                    }}
                    initial={false}
                    animate={isFilled && !isEncrypted ? { opacity: [0.6, 1, 0.6] } : { opacity: 1 }}
                    transition={{ duration: PULSE_DURATION, repeat: Infinity }}
                  >
                    {/* Bayer Dither flash on fill */}
                    {isFilled && !isEncrypted && (
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAACpJREFUGFdjZEADJgY0QCSTBaYByicmJmByyAImBl0AXQCmAsYA0wByAAsvBg8f889VAAAAAElFTkSuQmCC")`,
                          backgroundRepeat: "repeat",
                          opacity: 0.3,
                          mixBlendMode: "overlay",
                        }}
                        initial={{ opacity: 0.6 }}
                        animate={{ opacity: 0.15 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    {/* Lock icon for encrypted cells */}
                    {isEncrypted && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.15 }}
                      >
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                          <rect
                            x="2"
                            y="4"
                            width="6"
                            height="5"
                            rx="1"
                            fill="rgba(179,75,113,0.6)"
                          />
                          <path
                            d="M3 4V3C3 1.89543 3.89543 1 5 1C6.10457 1 7 1.89543 7 3V4"
                            stroke="rgba(179,75,113,0.6)"
                            strokeWidth="1"
                            fill="none"
                          />
                        </svg>
                      </motion.div>
                    )}

                    {/* Hex data for filled cells */}
                    {isFilled && !isEncrypted && (
                      <div
                        className="absolute inset-0 flex items-center justify-center font-mono text-[5px]"
                        style={{ color: "rgba(179,75,113,0.5)" }}
                      >
                        {cell.bitstream.slice(0, 2)}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Encryption Sweep Line */}
            {phase === "flush" && (
              <motion.div
                className="absolute left-0 right-0 h-[2px] pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, #B34B71 50%, transparent 100%)",
                  top: `${encryptionProgress}%`,
                }}
              />
            )}
          </div>

          {/* Cold Storage Footer */}
          <div
            className="mt-4 w-full border-t border-white/10 pt-2"
            style={{ maxWidth: GRID_COLS * 27 }}
          >
            <div className="flex items-center justify-between">
              <span
                className="font-mono text-[6px] tracking-[0.15em]"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                STABLE
              </span>
              <motion.span
                className="font-mono text-[7px]"
                style={{ color: phase === "done" ? "#B34B71" : "rgba(255,255,255,0.4)" }}
              >
                {phase === "flush"
                  ? "FLUSHING TO DISK..."
                  : phase === "done"
                    ? "COMMITTED"
                    : "STANDBY"}
              </motion.span>
            </div>
          </div>
        </div>
      </div>

      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* IOPS Meter (top-right) */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
          <span
            className="font-mono text-[6px] tracking-[0.15em]"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            IOPS
          </span>
          <div className="flex gap-[2px]">
            {Array.from({ length: 8 }, (_, i) => {
              const threshold = (i + 1) * 1000;
              const isActive = iopsValue >= threshold;
              return (
                <motion.div
                  key={i}
                  className="w-[3px] rounded-sm"
                  style={{
                    height: 4 + i * 2,
                    background: isActive ? "#B34B71" : "rgba(255,255,255,0.1)",
                  }}
                  animate={isActive ? { opacity: [0.6, 1, 0.6] } : {}}
                  transition={{ duration: 0.2 }}
                />
              );
            })}
          </div>
        </div>

        {/* Page ID (top-left below WAL label) */}
        <div className="absolute top-3 left-[78px]">
          <span
            className="font-mono text-[6px] tracking-[0.1em]"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            PAGE_REF:{" "}
            <span style={{ color: "rgba(255,255,255,0.5)" }}>{pageRef.slice(0, 10)}...</span>
          </span>
        </div>

        {/* Integrity Hash (bottom) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
          <span
            className="font-mono text-[7px] tracking-[0.08em]"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            SHA256:{" "}
            <motion.span
              style={{ color: phase === "done" ? "rgba(179,75,113,0.8)" : "rgba(255,255,255,0.5)" }}
              animate={phase === "flush" ? { opacity: [0.3, 0.7, 0.3] } : {}}
              transition={{ duration: 0.15, repeat: Infinity }}
            >
              {integrityHash}
            </motion.span>
          </span>
        </div>

        {/* Status Label (top center) */}
        <motion.div
          className="absolute top-3 left-1/2 -translate-x-1/2 font-mono text-[7px] tracking-[0.15em] uppercase"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          {phase === "idle" && "CHRONOS VAULT"}
          {phase === "log" && "WRITING TO WAL..."}
          {phase === "allocate" && "ALLOCATING BLOCKS..."}
          {phase === "flush" && "ENCRYPTING..."}
          {phase === "done" && <span style={{ color: "#B34B71" }}>IMMUTABLE COMMIT</span>}
        </motion.div>
      </div>
    </div>
  );
}

// Quantum Scan - Retrieval Animation
// Horizontal laser beam sweeps over blurred data, revealing the answer
function RetrievalAnimation() {
  const [scanComplete, setScanComplete] = useState(false);
  const [cycleKey, setCycleKey] = useState(0);

  // Data points - one will be "the answer"
  const dataPoints = useMemo(
    () => [
      { x: 60, y: 80, isAnswer: false, label: "Meeting.doc" },
      { x: 120, y: 140, isAnswer: false, label: "Budget_v2.xlsx" },
      { x: 180, y: 100, isAnswer: true, label: "Approval_Q3.pdf" },
      { x: 240, y: 160, isAnswer: false, label: "Notes_draft.md" },
      { x: 100, y: 200, isAnswer: false, label: "Slack_export.json" },
      { x: 200, y: 60, isAnswer: false, label: "PR_review.diff" },
      { x: 280, y: 120, isAnswer: false, label: "Config.yaml" },
    ],
    []
  );

  // Animation cycle
  useEffect(() => {
    const runCycle = async () => {
      setScanComplete(false);
      await delay(3000); // Scan duration
      setScanComplete(true);
      await delay(3000); // Display answer
      setCycleKey((prev) => prev + 1);
    };
    runCycle();
  }, [cycleKey]);

  return (
    <div className="relative w-[340px] h-[280px] overflow-hidden rounded-2xl">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 340 280"
        key={`scan-${cycleKey}`}
      >
        <defs>
          {/* Laser beam gradient */}
          <linearGradient id="laserGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="40%" stopColor="#B34B71" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#B34B71" stopOpacity="1" />
            <stop offset="60%" stopColor="#B34B71" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* Glow for answer node */}
          <filter id="answerGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Blur filter for unfocused data */}
          <filter id="dataBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" />
          </filter>

          {/* Scan line clip path - animated */}
          <clipPath id="scanReveal">
            <motion.rect
              x="0"
              y="0"
              width="340"
              height="280"
              initial={{ x: -340 }}
              animate={{ x: 0 }}
              transition={{ duration: 3, ease: [0.45, 0, 0.55, 1] }}
            />
          </clipPath>
        </defs>

        {/* Background grid pattern */}
        {[...Array(8)].map((_, i) => (
          <line
            key={`vline-${i}`}
            x1={40 + i * 40}
            y1="20"
            x2={40 + i * 40}
            y2="260"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}
        {[...Array(6)].map((_, i) => (
          <line
            key={`hline-${i}`}
            x1="20"
            y1={40 + i * 40}
            x2="320"
            y2={40 + i * 40}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}

        {/* Blurred data points (before scan) */}
        {dataPoints.map((point, i) => (
          <g key={`blur-point-${i}`}>
            <motion.circle
              cx={point.x}
              cy={point.y}
              r={point.isAnswer ? 8 : 5}
              fill="rgba(255,255,255,0.2)"
              filter="url(#dataBlur)"
              initial={{ opacity: 1 }}
              animate={{ opacity: scanComplete ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            />
          </g>
        ))}

        {/* Scanning laser beam */}
        <motion.g
          initial={{ x: -60 }}
          animate={{ x: 340 }}
          transition={{ duration: 3, ease: [0.45, 0, 0.55, 1] }}
        >
          {/* Vertical laser line */}
          <rect x="-30" y="0" width="60" height="280" fill="url(#laserGradient)" />

          {/* Bright center line */}
          <motion.line
            x1="0"
            y1="0"
            x2="0"
            y2="280"
            stroke="#B34B71"
            strokeWidth="2"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 0.1, repeat: Infinity }}
          />

          {/* Scanning particles */}
          {[...Array(5)].map((_, i) => (
            <motion.circle
              key={`scan-particle-${i}`}
              cx="0"
              cy={50 + i * 45}
              r="2"
              fill="#FFFFFF"
              animate={{
                opacity: [0, 1, 0],
                cy: [50 + i * 45, 60 + i * 45, 50 + i * 45],
              }}
              transition={{
                duration: 0.3,
                delay: i * 0.05,
                repeat: Infinity,
              }}
            />
          ))}
        </motion.g>

        {/* Revealed data points (after scan passes) */}
        <g clipPath="url(#scanReveal)">
          {dataPoints.map((point, i) => (
            <g key={`reveal-point-${i}`}>
              {/* Non-answer points - dim after reveal */}
              {!point.isAnswer && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: scanComplete ? 0.3 : 0.6 }}
                  transition={{ duration: 0.5, delay: scanComplete ? 0 : 0.5 }}
                >
                  <circle cx={point.x} cy={point.y} r="5" fill="rgba(255,255,255,0.4)" />
                  <text
                    x={point.x}
                    y={point.y + 18}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.3)"
                    fontSize="7"
                    fontFamily="monospace"
                  >
                    {point.label}
                  </text>
                </motion.g>
              )}

              {/* THE ANSWER - pops into focus */}
              {point.isAnswer && (
                <motion.g
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{
                    scale: scanComplete ? 1.2 : 1,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.5,
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                >
                  {/* Ruby bloom effect */}
                  {scanComplete && (
                    <>
                      <motion.circle
                        cx={point.x}
                        cy={point.y}
                        r="20"
                        fill="none"
                        stroke="#B34B71"
                        strokeWidth="2"
                        initial={{ scale: 0.5, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <motion.circle
                        cx={point.x}
                        cy={point.y}
                        r="30"
                        fill="url(#answerGlow)"
                        filter="url(#answerGlow)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.4, 0.2] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{ fill: "rgba(179, 75, 113, 0.3)" }}
                      />
                    </>
                  )}

                  {/* Answer node */}
                  <motion.circle
                    cx={point.x}
                    cy={point.y}
                    r={scanComplete ? 12 : 8}
                    fill={scanComplete ? "#B34B71" : "rgba(255,255,255,0.6)"}
                    filter={scanComplete ? "url(#answerGlow)" : "none"}
                    animate={{
                      fill: scanComplete ? "#B34B71" : "rgba(255,255,255,0.6)",
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Inner glow */}
                  <motion.circle
                    cx={point.x}
                    cy={point.y}
                    r={scanComplete ? 6 : 4}
                    fill="#FFFFFF"
                    animate={{ scale: scanComplete ? [1, 1.2, 1] : 1 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />

                  {/* Answer label */}
                  <motion.text
                    x={point.x}
                    y={point.y + 28}
                    textAnchor="middle"
                    fill={scanComplete ? "#FFFFFF" : "rgba(255,255,255,0.5)"}
                    fontSize={scanComplete ? "9" : "7"}
                    fontFamily="monospace"
                    fontWeight={scanComplete ? "bold" : "normal"}
                    animate={{
                      fill: scanComplete ? "#FFFFFF" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {point.label}
                  </motion.text>

                  {/* "MATCH" indicator */}
                  {scanComplete && (
                    <motion.g
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      <rect
                        x={point.x - 22}
                        y={point.y - 30}
                        width="44"
                        height="14"
                        rx="2"
                        fill="#B34B71"
                      />
                      <text
                        x={point.x}
                        y={point.y - 20}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="8"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        MATCH
                      </text>
                    </motion.g>
                  )}
                </motion.g>
              )}
            </g>
          ))}
        </g>

        {/* Latency indicator */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: scanComplete ? 1 : 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <text
            x="170"
            y="265"
            textAnchor="middle"
            fill="rgba(255,255,255,0.7)"
            fontSize="10"
            fontFamily="monospace"
            letterSpacing="0.1em"
          >
            <tspan fill="#B34B71" fontWeight="bold">
              47ms
            </tspan>
            <tspan fill="rgba(255,255,255,0.5)"> — INSTANT RETRIEVAL</tspan>
          </text>
        </motion.g>
      </svg>
    </div>
  );
}

// Silicon Inference - Reasoning Animation
// 2D Chip Schematic visualizing the Token-to-Thought pipeline
function ReasoningAnimation() {
  return (
    <div className="relative w-[340px] h-[280px] overflow-hidden rounded-2xl">
      <SiliconInference />
    </div>
  );
}
