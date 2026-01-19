"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const features = [
  {
    id: "memory",
    label: "MEMORY",
    title: "Never lose a thread",
    description: null,
    icon: MemoryAnimation,
    points: [
      "EVERY CONVERSATION, DECISION, AND THOUGHT—AUTOMATICALLY SAVED.",
      "NOTHING SLIPS THROUGH. EVERYTHING SEARCHABLE. ALWAYS THERE.",
      "CAPTURES MEETINGS, NOTES, AND STRAY THOUGHTS INSTANTLY.",
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
    <section id="features" className="relative py-24 px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-headline text-4xl md:text-5xl text-black mb-4 tracking-wide">BUILT FOR OPERATORS</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Five core capabilities that transform how you think, remember, and decide.
          </p>
        </motion.div>

        {/* Tab Navigation - Individual buttons above card */}
        <div className="flex justify-center gap-3 mb-8">
          {features.map((feature, index) => (
            <button
              key={feature.id}
              onClick={() => setActiveIndex(index)}
              className={`px-6 py-2 text-sm font-bold transition-all duration-300 border border-gray-300 rounded-md ${
                activeIndex === index ? "bg-gray-100 text-black" : "bg-white text-gray-400 hover:text-gray-600"
              }`}
            >
              {feature.label}
            </button>
          ))}
        </div>

        {/* Feature Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative"
          >
            {/* Card with border */}
            <div className="relative rounded-xl border border-gray-300 bg-white overflow-hidden">
              <div className="flex flex-col md:flex-row min-h-[380px]">
                {/* Left: Content (40%) */}
                <div className="w-full md:w-[40%] p-8 md:p-12 flex flex-col justify-center">
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="font-headline text-3xl md:text-4xl text-black mb-4 tracking-wide"
                  >
                    {activeFeature.title.toUpperCase()}
                  </motion.h3>
                  {activeFeature.description && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-gray-600 text-lg leading-relaxed mb-6"
                    >
                      {activeFeature.description}
                    </motion.p>
                  )}

                  {/* Feature Points */}
                  {activeFeature.points && (
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
                          className="flex items-start gap-3"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                          <span className="font-headline text-sm md:text-base text-gray-600 tracking-wide leading-relaxed">
                            {point}
                          </span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </div>

                {/* Dashed Divider */}
                <div className="hidden md:block w-px relative">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: "linear-gradient(to bottom, #d1d5db 50%, transparent 50%)",
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
          </motion.div>
        </AnimatePresence>

        {/* Feature indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-1 transition-all duration-300 ${
                activeIndex === index ? "w-8 bg-black" : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   ANIMATED SVG ICONS - Black Monochrome
   ============================================ */

/* ============================================
   MEMORIA - Premium AI Memory Interaction
   ============================================ */

type AnimationPhase = "dialogue" | "collapse" | "storage";

function MemoryAnimation() {
  const [phase, setPhase] = useState<AnimationPhase>("dialogue");
  const [showUserMessage, setShowUserMessage] = useState(false);
  const [showAiResponse, setShowAiResponse] = useState(false);
  const [showTyping, setShowTyping] = useState(true);

  // Animation state machine
  useEffect(() => {
    const runAnimation = async () => {
      // Reset state
      setPhase("dialogue");
      setShowTyping(true);
      setShowUserMessage(false);
      setShowAiResponse(false);

      // Phase A: Dialogue
      await delay(800);
      setShowTyping(false);
      setShowUserMessage(true);

      await delay(600);
      setShowAiResponse(true);

      await delay(2000);

      // Phase B: Collapse
      setPhase("collapse");

      await delay(1200);

      // Phase C: Storage
      setPhase("storage");

      await delay(2500);

      // Loop
      runAnimation();
    };

    runAnimation();
  }, []);

  const springTransition = {
    type: "spring" as const,
    stiffness: 300,
    damping: 20,
  };

  return (
    <div className="relative w-[400px] h-[280px] overflow-hidden rounded-2xl">
      {/* SVG Defs for Grain Filter */}
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
            <feColorMatrix
              type="saturate"
              values="0"
              in="noise"
              result="monoNoise"
            />
            <feBlend in="SourceGraphic" in2="monoNoise" mode="multiply" />
          </filter>
        </defs>
      </svg>

      {/* Dithered Burgundy Gradient Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, #B34B71 0%, #6B2D4A 35%, #3D1A2E 60%, #1A0912 100%)`,
        }}
      />

      {/* Grain Overlay */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Secondary Grain Layer for Depth */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise2)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          mixBlendMode: "soft-light",
        }}
      />

      {/* Content Container */}
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {/* Phase A & B: Chat Window */}
          {(phase === "dialogue" || phase === "collapse") && (
            <motion.div
              key="chat-window"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{
                opacity: phase === "collapse" ? 0 : 1,
                scale: phase === "collapse" ? 0.6 : 1,
                y: 0,
                borderRadius: phase === "collapse" ? "50%" : "24px",
              }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={phase === "collapse" ? { duration: 0.8, ease: "easeInOut" } : springTransition}
              className="relative w-[300px] h-[180px] overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.92)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                borderRadius: "24px",
              }}
            >
              {/* Chat Header */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-medium text-gray-500 tracking-wide">SIDEKICK</span>
              </div>

              {/* Messages Container */}
              <div className="p-3 space-y-2 overflow-hidden">
                {/* Typing Indicator */}
                <AnimatePresence>
                  {showTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex gap-1 px-3 py-2"
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-gray-400"
                          animate={{ y: [0, -4, 0] }}
                          transition={{
                            duration: 0.6,
                            delay: i * 0.15,
                            repeat: Infinity,
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* User Message */}
                <AnimatePresence>
                  {showUserMessage && (
                    <motion.div
                      initial={{ opacity: 0, x: 30, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5, y: -20 }}
                      transition={springTransition}
                      className="flex justify-end"
                    >
                      <div
                        className="px-3 py-1.5 rounded-2xl rounded-br-md max-w-[160px]"
                        style={{ background: "#333333" }}
                      >
                        <span className="text-[11px] text-white font-medium">
                          Remember this meeting
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* AI Response */}
                <AnimatePresence>
                  {showAiResponse && (
                    <motion.div
                      initial={{ opacity: 0, x: -30, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5, y: -20 }}
                      transition={{ ...springTransition, delay: 0.1 }}
                      className="flex justify-start"
                    >
                      <div
                        className="px-3 py-1.5 rounded-2xl rounded-bl-md max-w-[180px]"
                        style={{ background: "#000000" }}
                      >
                        <span className="text-[11px] text-white font-medium">
                          Stored to your neural archive ✓
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Phase C: Memory Storage Node */}
          {phase === "storage" && (
            <motion.div
              key="storage-node"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative flex items-center justify-center"
            >
              {/* Outer Pulse Rings */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={`ring-${i}`}
                  className="absolute rounded-full border border-white/30"
                  initial={{ width: 40, height: 40, opacity: 0 }}
                  animate={{
                    width: [40, 120 + i * 40],
                    height: [40, 120 + i * 40],
                    opacity: [0.6, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.4,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              ))}

              {/* Rotating Geometric Frame */}
              <motion.div
                className="absolute"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                  <motion.polygon
                    points="50,5 95,50 50,95 5,50"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="1"
                    fill="none"
                    animate={{ rotate: [0, 90] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                </svg>
              </motion.div>

              {/* Counter-Rotating Inner Frame */}
              <motion.div
                className="absolute"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              >
                <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
                  <motion.polygon
                    points="35,5 65,35 35,65 5,35"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="1"
                    fill="none"
                  />
                </svg>
              </motion.div>

              {/* Central Memory Node */}
              <motion.div
                className="relative w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #B34B71 0%, #6B2D4A 100%)",
                  boxShadow: "0 0 30px rgba(179, 75, 113, 0.6), inset 0 0 20px rgba(255,255,255,0.1)",
                }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Inner Glow */}
                <motion.div
                  className="absolute inset-2 rounded-full"
                  style={{ background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)" }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />

                {/* Neural Icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <motion.circle
                    cx="12"
                    cy="12"
                    r="3"
                    fill="white"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <motion.path
                    d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                  />
                </svg>
              </motion.div>

              {/* Floating Data Particles */}
              {[...Array(8)].map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const radius = 55;
                return (
                  <motion.div
                    key={`particle-${i}`}
                    className="absolute w-1.5 h-1.5 rounded-full bg-white/60"
                    initial={{
                      x: 0,
                      y: 0,
                      opacity: 0,
                    }}
                    animate={{
                      x: [Math.cos(angle) * radius, 0],
                      y: [Math.sin(angle) * radius, 0],
                      opacity: [1, 0],
                      scale: [1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.15,
                      repeat: Infinity,
                      ease: "easeIn",
                    }}
                  />
                );
              })}

              {/* "Stored" Label */}
              <motion.div
                className="absolute -bottom-8 whitespace-nowrap"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-[10px] font-medium tracking-widest text-white/70 uppercase">
                  Memory Stored
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Utility delay function
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
