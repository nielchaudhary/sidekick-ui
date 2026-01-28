"use client";

import { useState, useEffect, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { delay } from "@/lib/utils";

const features = [
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
    id: "context",
    label: "CONTEXT",
    title: "Beyond keywords",
    icon: ContextAnimation,
    points: [
      "Links your Q3 budget to a stray comment from a November meeting.",
      "Sees the intent behind the task, not just the data.",
      "Bridges the gap between your Notion docs and GitHub PRs.",
    ],
  },
  {
    id: "retention",
    label: "RETENTION",
    title: "Long-term storage",
    icon: RetentionAnimation,
    points: [
      "Data doesn't rot. Decisions from 3 years ago are as fresh as today's.",
      "High-stakes info encrypted and mirrored across secure nodes.",
      "Pull archived context into active workspace in under 50ms.",
    ],
  },
  {
    id: "retrieval",
    label: "RETRIEVAL",
    title: "Instant access",
    icon: RetrievalAnimation,
    points: [
      "Ask 'Who approved the Vercel spend?' instead of searching folders.",
      "Finds what you mean, even if you don't remember the exact words.",
      "Sub-100ms response times for your entire company history.",
    ],
  },
  {
    id: "reasoning",
    label: "REASONING",
    title: "YOUR Virtual Second Brain",
    icon: ReasoningAnimation,
    points: [
      "Flags when your current plan contradicts previous data.",
      "Plays Devil's Advocate to ensure your strategy is watertight.",
      "Condenses 4-hour meetings into 3 actionable bullet points.",
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
                          letterSpacing: "-0.04em",
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
function ContextAnimation() {
  const [activeConnection, setActiveConnection] = useState(0);

  // Node positions for the constellation
  const nodes = useMemo(
    () => [
      { id: 0, x: 40, y: 80, label: "Q3 Budget" },
      { id: 1, x: 300, y: 120, label: "Nov Meeting" },
      { id: 2, x: 280, y: 60, label: "Slack Thread" },
      { id: 3, x: 60, y: 180, label: "Email Chain" },
      { id: 4, x: 170, y: 40, label: "PR Comment" },
      { id: 5, x: 170, y: 210, label: "Notion Doc" },
    ],
    []
  );

  // Connection pairs that will be animated
  const connections = useMemo(
    () => [
      { from: 0, to: 1 }, // Q3 Budget -> Nov Meeting
      { from: 2, to: 3 }, // Slack -> Email
      { from: 4, to: 5 }, // PR -> Notion
      { from: 1, to: 4 }, // Nov Meeting -> PR
      { from: 3, to: 2 }, // Email -> Slack
    ],
    []
  );

  // Cycle through connections
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveConnection((prev) => (prev + 1) % connections.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [connections.length]);

  const currentConnection = connections[activeConnection];
  const fromNode = nodes[currentConnection.from];
  const toNode = nodes[currentConnection.to];

  return (
    <div className="relative w-[340px] h-[280px] overflow-hidden rounded-2xl">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 340 280">
        <defs>
          {/* Glow filter for the traveling synapse */}
          <filter id="synapseGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Node glow */}
          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Ruby gradient for active elements */}
          <linearGradient id="rubyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B34B71" />
            <stop offset="100%" stopColor="#FF6B9D" />
          </linearGradient>

          {/* Radial glow for connection points */}
          <radialGradient id="connectionGlow">
            <stop offset="0%" stopColor="#B34B71" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#B34B71" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#B34B71" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background constellation lines (dormant) */}
        {connections.map((conn, i) => {
          const from = nodes[conn.from];
          const to = nodes[conn.to];
          return (
            <line
              key={`bg-line-${i}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Active synapse beam */}
        <motion.line
          key={`synapse-${activeConnection}`}
          x1={fromNode.x}
          y1={fromNode.y}
          x2={toNode.x}
          y2={toNode.y}
          stroke="url(#rubyGradient)"
          strokeWidth="1"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 1, 0.3] }}
          transition={{ duration: 2, ease: [0.45, 0, 0.55, 1] }}
        />

        {/* Traveling glow particle along the synapse */}
        <motion.circle
          key={`particle-${activeConnection}`}
          r="4"
          fill="#FFFFFF"
          filter="url(#synapseGlow)"
          initial={{ cx: fromNode.x, cy: fromNode.y, opacity: 0, scale: 0 }}
          animate={{
            cx: [fromNode.x, toNode.x],
            cy: [fromNode.y, toNode.y],
            opacity: [0, 1, 1, 0],
            scale: [0, 1.5, 1.5, 0],
          }}
          transition={{
            duration: 2,
            ease: [0.45, 0, 0.55, 1],
            times: [0, 0.1, 0.9, 1],
          }}
        />

        {/* Constellation nodes */}
        {nodes.map((node, i) => {
          const isActive = currentConnection.from === i || currentConnection.to === i;
          return (
            <g key={`node-${i}`}>
              {/* Pulse ring when active */}
              {isActive && (
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r="12"
                  fill="none"
                  stroke="#B34B71"
                  strokeWidth="1"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: [0.5, 2], opacity: [0.8, 0] }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              )}

              {/* Node outer ring */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="8"
                fill="none"
                stroke={isActive ? "#B34B71" : "rgba(255,255,255,0.3)"}
                strokeWidth="1"
                animate={{
                  stroke: isActive ? "#B34B71" : "rgba(255,255,255,0.3)",
                  scale: isActive ? 1.2 : 1,
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Node core */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="4"
                fill={isActive ? "#FFFFFF" : "rgba(255,255,255,0.5)"}
                filter={isActive ? "url(#nodeGlow)" : "none"}
                animate={{
                  fill: isActive ? "#FFFFFF" : "rgba(255,255,255,0.5)",
                  scale: isActive ? [1, 1.3, 1] : 1,
                }}
                transition={{
                  duration: 0.5,
                  scale: { duration: 0.8, repeat: isActive ? Infinity : 0 },
                }}
              />

              {/* Node label */}
              <motion.text
                x={node.x}
                y={node.y + 22}
                textAnchor="middle"
                fill="rgba(255,255,255,0.6)"
                fontSize="8"
                fontFamily="monospace"
                letterSpacing="0.05em"
                animate={{
                  fill: isActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
                }}
                transition={{ duration: 0.3 }}
              >
                {node.label}
              </motion.text>
            </g>
          );
        })}

        {/* Connection established indicator */}
        <AnimatePresence>
          <motion.g
            key={`indicator-${activeConnection}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.text
              x="170"
              y="265"
              textAnchor="middle"
              fill="rgba(255,255,255,0.7)"
              fontSize="9"
              fontFamily="monospace"
              letterSpacing="0.15em"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: [0, 1, 1, 0], y: 0 }}
              transition={{ duration: 2.5, times: [0, 0.2, 0.8, 1] }}
            >
              SEMANTIC LINK ESTABLISHED
            </motion.text>
          </motion.g>
        </AnimatePresence>
      </svg>
    </div>
  );
}

// Chronos Vault - Retention Animation
// Vertical stack of translucent glass slabs with compression effect
function RetentionAnimation() {
  const [isCompressing, setIsCompressing] = useState(false);
  const [newSlabKey, setNewSlabKey] = useState(0);

  // Animation cycle: add new slab, compress, repeat
  useEffect(() => {
    const cycle = async () => {
      // Wait, then add new slab
      await delay(2000);
      setIsCompressing(true);
      setNewSlabKey((prev) => prev + 1);

      // Compression animation duration
      await delay(800);
      setIsCompressing(false);

      // Reset after showing full stack
      await delay(2500);
      cycle();
    };

    cycle();
  }, []);

  // Glass slab configuration
  const slabs = useMemo(() => {
    const baseY = 220;
    const slabHeight = 35;
    const gap = 8;
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      y: baseY - i * (slabHeight + gap),
      depth: i, // 0 = newest (top), 4 = oldest (bottom)
      burgundyIntensity: Math.min(0.3 + i * 0.15, 0.9), // Older = more burgundy
    }));
  }, []);

  return (
    <div className="relative w-[340px] h-[280px] overflow-hidden rounded-2xl">
      {/* SVG Filters */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="glassBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
          <filter id="slabGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="slabGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
          </linearGradient>
          <linearGradient id="burgundyGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#B34B71" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#4A0404" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>

      {/* Main content */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Vertical guide lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 340 280">
          <line
            x1="70"
            y1="30"
            x2="70"
            y2="250"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <line
            x1="270"
            y1="30"
            x2="270"
            y2="250"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        </svg>

        {/* Glass Slabs Stack */}
        <div className="relative" style={{ width: 200, height: 220 }}>
          <AnimatePresence>
            {slabs.map((slab, index) => {
              const isNewest = index === 0;
              const compressionOffset = isCompressing && !isNewest ? 8 : 0;

              return (
                <motion.div
                  key={`slab-${slab.id}-${isNewest ? newSlabKey : "static"}`}
                  className="absolute left-0 right-0"
                  style={{
                    height: 35,
                    top: slab.y - 220 + 30,
                  }}
                  initial={
                    isNewest ? { opacity: 0, y: -50, scaleY: 1.2 } : { opacity: 1, y: 0, scaleY: 1 }
                  }
                  animate={{
                    opacity: 1,
                    y: compressionOffset,
                    scaleY: isCompressing && !isNewest ? 0.92 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                    duration: 0.6,
                  }}
                >
                  {/* Glass slab with backdrop blur effect */}
                  <div
                    className="relative w-full h-full rounded-lg overflow-hidden"
                    style={{
                      background: `linear-gradient(180deg,
                        rgba(255,255,255,${0.12 - slab.depth * 0.015}) 0%,
                        rgba(255,255,255,${0.04 - slab.depth * 0.005}) 100%)`,
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      boxShadow: `
                        0 4px 16px rgba(0,0,0,0.2),
                        inset 0 1px 0 rgba(255,255,255,0.1),
                        inset 0 -1px 0 rgba(0,0,0,0.1)
                      `,
                    }}
                  >
                    {/* Burgundy long-term glow for older slabs */}
                    <motion.div
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: `linear-gradient(180deg,
                          rgba(179, 75, 113, ${slab.burgundyIntensity * 0.3}) 0%,
                          rgba(74, 4, 4, ${slab.burgundyIntensity * 0.2}) 100%)`,
                      }}
                      animate={{
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 3,
                        delay: slab.depth * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Data fragments inside slab */}
                    <div className="absolute inset-0 flex items-center justify-center gap-3 px-4">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={`data-${i}`}
                          className="h-1.5 rounded-full"
                          style={{
                            width: 20 + Math.random() * 30,
                            background: `rgba(255,255,255,${0.4 - slab.depth * 0.05})`,
                          }}
                          animate={{
                            opacity: [0.3, 0.6, 0.3],
                          }}
                          transition={{
                            duration: 2,
                            delay: i * 0.3,
                            repeat: Infinity,
                          }}
                        />
                      ))}
                    </div>

                    {/* Timestamp label */}
                    <div
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] font-mono tracking-wider"
                      style={{ color: `rgba(255,255,255,${0.5 - slab.depth * 0.08})` }}
                    >
                      {slab.depth === 0
                        ? "NOW"
                        : slab.depth === 1
                          ? "1D AGO"
                          : slab.depth === 2
                            ? "1W AGO"
                            : slab.depth === 3
                              ? "1M AGO"
                              : "1Y AGO"}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Incoming data particle */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: -20 }}
            animate={{
              y: [0, 30],
              opacity: [1, 0],
              scale: [1, 0.5],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatDelay: 4.5,
              ease: "easeIn",
            }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{
                background: "radial-gradient(circle, #FFFFFF 0%, rgba(255,255,255,0.6) 100%)",
                boxShadow: "0 0 12px rgba(255,255,255,0.8)",
              }}
            />
          </motion.div>
        </div>

        {/* Encryption indicator */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <rect
              x="3"
              y="11"
              width="18"
              height="11"
              rx="2"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="2"
            />
            <path
              d="M7 11V7a5 5 0 0 1 10 0v4"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          <span className="text-[9px] font-mono tracking-[0.2em] text-white/60 uppercase">
            Encrypted Vault
          </span>
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

// Logic Mirror - Reasoning Animation
// Two brain hemispheres with accelerating spark bouncing between them
function ReasoningAnimation() {
  const [phase, setPhase] = useState<"thinking" | "conclusion">("thinking");
  const [bounceCount, setBounceCount] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);

  // Animation cycle: spark bounces faster and faster, then conclusion forms
  useEffect(() => {
    const runCycle = async () => {
      setPhase("thinking");
      setBounceCount(0);

      // Accelerating bounces
      const bounceTimes = [600, 500, 400, 300, 200, 150, 100, 80, 60];
      for (let i = 0; i < bounceTimes.length; i++) {
        await delay(bounceTimes[i]);
        setBounceCount(i + 1);
      }

      // Conclusion phase
      await delay(200);
      setPhase("conclusion");

      // Hold conclusion
      await delay(3000);

      // Reset
      setCycleKey((prev) => prev + 1);
    };

    runCycle();
  }, [cycleKey]);

  // Calculate spark position based on bounce count
  const sparkOnLeft = bounceCount % 2 === 0;

  return (
    <div className="relative w-[340px] h-[280px] overflow-hidden rounded-2xl">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 340 280"
        key={`reason-${cycleKey}`}
      >
        <defs>
          {/* Spark glow */}
          <filter id="sparkGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Conclusion burst glow */}
          <filter id="conclusionGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Radial gradient for conclusion */}
          <radialGradient id="conclusionRadial">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#B34B71" />
            <stop offset="100%" stopColor="#B34B71" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Left Hemisphere */}
        <motion.g
          animate={{
            filter: sparkOnLeft && phase === "thinking" ? "url(#sparkGlow)" : "none",
          }}
        >
          {/* Hemisphere outline */}
          <motion.path
            d="M170 60 C130 60 95 90 95 140 C95 190 130 220 170 220"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.5"
            fill="none"
            animate={{
              stroke:
                sparkOnLeft && phase === "thinking"
                  ? "rgba(255,255,255,0.8)"
                  : "rgba(255,255,255,0.3)",
            }}
            transition={{ duration: 0.1 }}
          />

          {/* Left hemisphere neural nodes */}
          {[
            { cx: 120, cy: 100 },
            { cx: 110, cy: 140 },
            { cx: 130, cy: 180 },
            { cx: 145, cy: 120 },
            { cx: 140, cy: 160 },
          ].map((node, i) => (
            <motion.circle
              key={`left-node-${i}`}
              cx={node.cx}
              cy={node.cy}
              r="4"
              fill="rgba(255,255,255,0.4)"
              animate={{
                fill:
                  sparkOnLeft && phase === "thinking"
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(255,255,255,0.4)",
                scale: sparkOnLeft && phase === "thinking" ? [1, 1.3, 1] : 1,
              }}
              transition={{ duration: 0.15, delay: i * 0.02 }}
            />
          ))}

          {/* Left neural pathways */}
          <motion.path
            d="M120 100 Q130 120 145 120 M110 140 Q125 150 140 160 M130 180 Q140 170 140 160"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
            fill="none"
            animate={{
              stroke:
                sparkOnLeft && phase === "thinking"
                  ? "rgba(255,255,255,0.6)"
                  : "rgba(255,255,255,0.2)",
            }}
          />
        </motion.g>

        {/* Right Hemisphere */}
        <motion.g
          animate={{
            filter: !sparkOnLeft && phase === "thinking" ? "url(#sparkGlow)" : "none",
          }}
        >
          {/* Hemisphere outline */}
          <motion.path
            d="M170 60 C210 60 245 90 245 140 C245 190 210 220 170 220"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.5"
            fill="none"
            animate={{
              stroke:
                !sparkOnLeft && phase === "thinking"
                  ? "rgba(255,255,255,0.8)"
                  : "rgba(255,255,255,0.3)",
            }}
            transition={{ duration: 0.1 }}
          />

          {/* Right hemisphere neural nodes */}
          {[
            { cx: 220, cy: 100 },
            { cx: 230, cy: 140 },
            { cx: 210, cy: 180 },
            { cx: 195, cy: 120 },
            { cx: 200, cy: 160 },
          ].map((node, i) => (
            <motion.circle
              key={`right-node-${i}`}
              cx={node.cx}
              cy={node.cy}
              r="4"
              fill="rgba(255,255,255,0.4)"
              animate={{
                fill:
                  !sparkOnLeft && phase === "thinking"
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(255,255,255,0.4)",
                scale: !sparkOnLeft && phase === "thinking" ? [1, 1.3, 1] : 1,
              }}
              transition={{ duration: 0.15, delay: i * 0.02 }}
            />
          ))}

          {/* Right neural pathways */}
          <motion.path
            d="M220 100 Q210 120 195 120 M230 140 Q215 150 200 160 M210 180 Q200 170 200 160"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
            fill="none"
            animate={{
              stroke:
                !sparkOnLeft && phase === "thinking"
                  ? "rgba(255,255,255,0.6)"
                  : "rgba(255,255,255,0.2)",
            }}
          />
        </motion.g>

        {/* Center divider / Corpus Callosum */}
        <line
          x1="170"
          y1="70"
          x2="170"
          y2="210"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Bouncing Spark */}
        {phase === "thinking" && (
          <motion.g
            key={`spark-${bounceCount}`}
            initial={{ x: sparkOnLeft ? 130 : 210, opacity: 0 }}
            animate={{
              x: sparkOnLeft ? 130 : 210,
              opacity: 1,
            }}
            transition={{ duration: 0.05 }}
          >
            {/* Spark core */}
            <motion.circle
              cx="0"
              cy="140"
              r={4 + Math.min(bounceCount * 0.5, 4)}
              fill="#FFFFFF"
              filter="url(#sparkGlow)"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 0.1, repeat: Infinity }}
            />

            {/* Spark trail */}
            <motion.circle
              cx="0"
              cy="140"
              r={8 + bounceCount}
              fill="none"
              stroke="#B34B71"
              strokeWidth="2"
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.g>
        )}

        {/* Connection beam during fast bouncing */}
        {bounceCount > 5 && phase === "thinking" && (
          <motion.line
            x1="130"
            y1="140"
            x2="210"
            y2="140"
            stroke="#B34B71"
            strokeWidth="2"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 0.1, repeat: Infinity }}
          />
        )}

        {/* CONCLUSION - Central Burst */}
        {phase === "conclusion" && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Radial expansion rings */}
            {[0, 1, 2].map((i) => (
              <motion.circle
                key={`ring-${i}`}
                cx="170"
                cy="140"
                r="20"
                fill="none"
                stroke="#B34B71"
                strokeWidth="2"
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 3 + i, opacity: 0 }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            ))}

            {/* Central conclusion orb */}
            <motion.circle
              cx="170"
              cy="140"
              r="25"
              fill="url(#conclusionRadial)"
              filter="url(#conclusionGlow)"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />

            {/* Inner core */}
            <motion.circle
              cx="170"
              cy="140"
              r="12"
              fill="#FFFFFF"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            />

            {/* Checkmark icon */}
            <motion.path
              d="M162 140 L168 146 L180 134"
              stroke="#B34B71"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            />

            {/* Connecting lines to both hemispheres */}
            <motion.line
              x1="145"
              y1="140"
              x2="120"
              y2="140"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            />
            <motion.line
              x1="195"
              y1="140"
              x2="220"
              y2="140"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            />
          </motion.g>
        )}

        {/* Status text */}
        <motion.text
          x="170"
          y="255"
          textAnchor="middle"
          fill="rgba(255,255,255,0.7)"
          fontSize="9"
          fontFamily="monospace"
          letterSpacing="0.15em"
        >
          {phase === "thinking" ? (
            <motion.tspan
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.3, repeat: Infinity }}
            >
              REASONING...
            </motion.tspan>
          ) : (
            <motion.tspan initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              CONCLUSION SYNTHESIZED
            </motion.tspan>
          )}
        </motion.text>

        {/* Bounce counter (subtle) */}
        {phase === "thinking" && (
          <motion.text
            x="170"
            y="270"
            textAnchor="middle"
            fill="rgba(255,255,255,0.4)"
            fontSize="8"
            fontFamily="monospace"
          >
            {bounceCount} iterations
          </motion.text>
        )}
      </svg>
    </div>
  );
}
