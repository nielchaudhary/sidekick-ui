"use client";

import { useState, useEffect, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { delay } from "@/lib/utils";

const features = [
  {
    id: "memory",
    label: "MEMORY",
    title: "Never lose a thread",
    description: null,
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
    description:
      "It understands the 'why' behind your projects, linking disparate ideas automatically across your entire knowledge base.",
    icon: ContextAnimation,
    points: null,
  },
  {
    id: "retention",
    label: "RETENTION",
    title: "Long-term storage",
    description:
      "High-stakes decisions preserved forever. Your data stays fresh, indexed, and accessible when you need it most.",
    icon: RetentionAnimation,
    points: null,
  },
  {
    id: "retrieval",
    label: "RETRIEVAL",
    title: "Instant access",
    description: "Query your past thoughts with natural language and get precise answers in milliseconds, not minutes.",
    icon: RetrievalAnimation,
    points: null,
  },
  {
    id: "reasoning",
    label: "REASONING",
    title: "A second brain",
    description:
      "Stress-test your logic and surface blind spots. Let AI challenge your assumptions before reality does.",
    icon: ReasoningAnimation,
    points: null,
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

        {/* Feature Card with Nested Canvas Design */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative"
          >
            {/* Card container */}
            <div className="relative rounded-xl p-3 md:p-8">
              {/* Internal Card with visible border matching dotted grid */}
              <div
                className="relative rounded-3xl overflow-hidden border border-white/20"
              >
                <div className="flex flex-col md:flex-row min-h-[380px]">
                  {/* Left: Content (40%) */}
                  <div className="w-full md:w-[40%] p-8 md:p-12 flex flex-col justify-center">
                    {/* Top dotted line - subtle white */}
                    <div
                      className="w-full h-px mb-6"
                      style={{
                        backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.2) 50%, transparent 50%)",
                        backgroundSize: "8px 1px",
                        backgroundRepeat: "repeat-x",
                      }}
                    />

                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="font-headline text-3xl md:text-4xl text-white mb-4"
                      style={{
                        letterSpacing: "-0.04em",
                        WebkitFontSmoothing: "antialiased",
                      }}
                    >
                      {activeFeature.title.toUpperCase()}
                    </motion.h3>
                    {activeFeature.description && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg leading-relaxed mb-6"
                        style={{ color: "#A1A1AA" }}
                      >
                        {activeFeature.description}
                      </motion.p>
                    )}

                    {/* Feature Points */}
                    {activeFeature.points && (
                      <>
                        <motion.ul
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="space-y-4"
                        >
                          {activeFeature.points.map((point: string, idx: number) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + idx * 0.1 }}
                              className="flex items-start gap-2"
                            >
                              <span className="text-[#6A2424] font-bold text-lg leading-none mt-px">|</span>
                              <span
                                className="font-sans text-sm md:text-base tracking-wide leading-relaxed"
                                style={{ color: "#A1A1AA" }}
                              >
                                {point}
                              </span>
                            </motion.li>
                          ))}
                        </motion.ul>

                        {/* Bottom dotted line - subtle white */}
                        <div
                          className="w-full h-px mt-6"
                          style={{
                            backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.2) 50%, transparent 50%)",
                            backgroundSize: "8px 1px",
                            backgroundRepeat: "repeat-x",
                          }}
                        />
                      </>
                    )}
                  </div>

                  {/* Dashed Divider - subtle white for dark theme */}
                  <div className="hidden md:block w-px relative">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.15) 50%, transparent 50%)",
                        backgroundSize: "1px 8px",
                        backgroundRepeat: "repeat-y",
                      }}
                    />
                  </div>

                  {/* Right: Animation Area (60%) */}
                  <div className="w-full md:w-[60%] flex items-center justify-center p-6 md:p-8">
                    <activeFeature.icon />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

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

type AnimationPhase = "idle" | "input" | "sending" | "thinking" | "responding" | "collapse" | "storage";

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
        const brightness = dot.distance < maxDistance ? 0.3 - (dot.distance / maxDistance) * 0.25 : 0.05;

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
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: dot.distance * 0.01 },
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
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
    <div className="relative w-[340px] h-[420px] overflow-hidden rounded-2xl">
      {/* SVG Defs for Filters */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" result="noise" />
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

      {/* Dithered Burgundy Gradient Background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, #B34B71 0%, #6B2D4A 35%, #3D1A2E 60%, #1A0912 100%)`,
        }}
        animate={{
          filter: isBackgroundActive ? "brightness(1.1)" : "brightness(1)",
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Neural Pathways Background - Activates during thinking */}
      <NeuralPathwaysBackground isActive={isBackgroundActive} />

      {/* Grain Overlay */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Secondary Grain Layer */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise2)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          mixBlendMode: "soft-light",
        }}
      />

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
                          <span className="text-[11px] text-white font-medium leading-relaxed">{userMessage}</span>
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
                        <span className="text-[11px] text-gray-400 font-medium">Write your message...</span>
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
                  background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)",
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
                  boxShadow: "0 0 40px rgba(179, 75, 113, 0.7), inset 0 0 25px rgba(255,255,255,0.15)",
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
                    background: "radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)",
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
                      background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6) 100%)",
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

function ContextAnimation() {
  return (
    <svg
      width="280"
      height="160"
      viewBox="0 0 280 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Layered context circles */}
      <motion.circle
        cx="140"
        cy="80"
        r="60"
        stroke="#000000"
        strokeWidth="1"
        fill="none"
        opacity="0.2"
        initial={{ scale: 0.8 }}
        animate={{ scale: [0.8, 1, 0.8], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="140"
        cy="80"
        r="45"
        stroke="#000000"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
        initial={{ scale: 0.9 }}
        animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.circle
        cx="140"
        cy="80"
        r="30"
        stroke="#000000"
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Orbiting data points */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <motion.g
          key={`orbit-${i}`}
          initial={{ rotate: angle }}
          animate={{ rotate: angle + 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "140px 80px" }}
        >
          <motion.circle
            cx="140"
            cy="20"
            r="4"
            fill="#000000"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
          />
        </motion.g>
      ))}

      {/* Center hub */}
      <motion.circle
        cx="140"
        cy="80"
        r="12"
        fill="#ffffff"
        stroke="#000000"
        strokeWidth="2"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle cx="140" cy="80" r="4" fill="#000000" />

      {/* Connection spokes */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <motion.line
          key={`spoke-${i}`}
          x1="140"
          y1="80"
          x2={140 + Math.cos((angle * Math.PI) / 180) * 55}
          y2={80 + Math.sin((angle * Math.PI) / 180) * 55}
          stroke="#000000"
          strokeWidth="1"
          strokeDasharray="4 4"
          initial={{ opacity: 0.1 }}
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
        />
      ))}
    </svg>
  );
}

function RetentionAnimation() {
  const layers = [
    { y: 130, delay: 0 },
    { y: 105, delay: 0.15 },
    { y: 80, delay: 0.3 },
    { y: 55, delay: 0.45 },
    { y: 30, delay: 0.6 },
  ];

  return (
    <svg
      width="280"
      height="160"
      viewBox="0 0 280 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Stacked storage layers */}
      {layers.map((layer, i) => (
        <g key={`layer-${i}`}>
          {/* Layer shadow/depth */}
          <motion.ellipse
            cx="140"
            cy={layer.y}
            rx="70"
            ry="18"
            fill="none"
            stroke="#000000"
            strokeWidth="1.5"
            initial={{ opacity: 0.2 + i * 0.15 }}
            animate={{
              opacity: [0.2 + i * 0.15, 0.4 + i * 0.15, 0.2 + i * 0.15],
              strokeWidth: [1.5, 2, 1.5],
            }}
            transition={{
              duration: 3,
              delay: layer.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Data particles on layer */}
          {i === 0 && (
            <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
              <circle cx="110" cy={layer.y - 5} r="2" fill="#000000" opacity="0.6" />
              <circle cx="140" cy={layer.y - 5} r="2" fill="#000000" opacity="0.6" />
              <circle cx="170" cy={layer.y - 5} r="2" fill="#000000" opacity="0.6" />
            </motion.g>
          )}
        </g>
      ))}

      {/* Vertical connecting lines */}
      <line x1="70" y1="30" x2="70" y2="130" stroke="#000000" strokeWidth="1" opacity="0.3" />
      <line x1="210" y1="30" x2="210" y2="130" stroke="#000000" strokeWidth="1" opacity="0.3" />

      {/* Data flow animation */}
      <motion.circle
        cx="140"
        cy="30"
        r="3"
        fill="#000000"
        initial={{ cy: 30, opacity: 1 }}
        animate={{ cy: [30, 130], opacity: [1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeIn", repeatDelay: 1 }}
      />

      {/* Lock icon at top */}
      <motion.g animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
        <rect x="130" y="5" width="20" height="14" rx="2" stroke="#000000" strokeWidth="1.5" fill="none" />
        <path d="M134 5 V0 A6 6 0 0 1 146 0 V5" stroke="#000000" strokeWidth="1.5" fill="none" />
        <circle cx="140" cy="12" r="2" fill="#000000" />
      </motion.g>
    </svg>
  );
}

function RetrievalAnimation() {
  return (
    <svg
      width="280"
      height="160"
      viewBox="0 0 280 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Search magnifying glass */}
      <motion.g
        animate={{ x: [0, 10, 0], y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="110" cy="70" r="35" stroke="#000000" strokeWidth="2" fill="none" />
        <motion.line
          x1="135"
          y1="95"
          x2="160"
          y2="120"
          stroke="#000000"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{ strokeWidth: [3, 4, 3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.g>

      {/* Data points being found */}
      {[
        { cx: 95, cy: 60, delay: 0 },
        { cx: 110, cy: 75, delay: 0.3 },
        { cx: 125, cy: 65, delay: 0.6 },
        { cx: 105, cy: 85, delay: 0.9 },
      ].map((point, i) => (
        <motion.circle
          key={`point-${i}`}
          cx={point.cx}
          cy={point.cy}
          r="3"
          fill="#000000"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 1, 0],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: point.delay,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      ))}

      {/* Speed/retrieval lines */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
      >
        <line x1="170" y1="50" x2="220" y2="35" stroke="#000000" strokeWidth="1.5" />
        <line x1="175" y1="70" x2="230" y2="70" stroke="#000000" strokeWidth="1.5" />
        <line x1="170" y1="90" x2="220" y2="105" stroke="#000000" strokeWidth="1.5" />
      </motion.g>

      {/* Result indicators */}
      <motion.g
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: [20, 0], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
      >
        <circle cx="230" cy="35" r="5" fill="#000000" />
        <circle cx="245" cy="70" r="5" fill="#000000" />
        <circle cx="230" cy="105" r="5" fill="#000000" />
      </motion.g>

      {/* Milliseconds indicator */}
      <motion.text
        x="200"
        y="145"
        fontSize="10"
        fill="#000000"
        opacity="0.7"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        &lt;100ms
      </motion.text>
    </svg>
  );
}

function ReasoningAnimation() {
  return (
    <svg
      width="280"
      height="160"
      viewBox="0 0 280 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Brain outline */}
      <motion.path
        d="M140 20 C100 20 70 50 70 85 C70 120 100 145 140 145 C180 145 210 120 210 85 C210 50 180 20 140 20"
        stroke="#000000"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* Brain hemispheres divider */}
      <motion.path
        d="M140 25 C140 50 120 80 140 145"
        stroke="#000000"
        strokeWidth="1"
        fill="none"
        opacity="0.4"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Neural pathways */}
      {[
        { d: "M90 60 Q110 70 100 90", delay: 0 },
        { d: "M100 100 Q120 110 110 130", delay: 0.3 },
        { d: "M180 50 Q160 65 170 85", delay: 0.6 },
        { d: "M175 95 Q155 110 165 125", delay: 0.9 },
      ].map((path, i) => (
        <motion.path
          key={`path-${i}`}
          d={path.d}
          stroke="#000000"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 1, 0],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: 2.5,
            delay: path.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Decision nodes */}
      {[
        { cx: 100, cy: 65, delay: 0 },
        { cx: 170, cy: 60, delay: 0.4 },
        { cx: 140, cy: 100, delay: 0.8 },
      ].map((node, i) => (
        <g key={`decision-${i}`}>
          <motion.circle
            cx={node.cx}
            cy={node.cy}
            r="8"
            fill="none"
            stroke="#000000"
            strokeWidth="1"
            initial={{ scale: 1, opacity: 0 }}
            animate={{
              scale: [1, 1.8],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: 2,
              delay: node.delay,
              repeat: Infinity,
            }}
          />
          <motion.circle
            cx={node.cx}
            cy={node.cy}
            r="5"
            fill="#000000"
            animate={{
              scale: [1, 1.2, 1],
              fill: ["#000000", "#333333", "#000000"],
            }}
            transition={{
              duration: 2,
              delay: node.delay,
              repeat: Infinity,
            }}
          />
        </g>
      ))}

      {/* Thought bubbles */}
      <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
        <circle cx="220" cy="35" r="12" stroke="#000000" strokeWidth="1.5" fill="none" opacity="0.6" />
        <circle cx="235" cy="20" r="7" stroke="#000000" strokeWidth="1" fill="none" opacity="0.4" />
        <circle cx="245" cy="10" r="4" stroke="#000000" strokeWidth="1" fill="none" opacity="0.3" />
      </motion.g>

      {/* Question mark in thought */}
      <motion.text
        x="216"
        y="40"
        fontSize="14"
        fill="#000000"
        fontWeight="bold"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ?
      </motion.text>
    </svg>
  );
}
