"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { delay } from "@/lib/utils";
import type { MemoryAnimationPhase } from "@/types/animations";
import TypewriterText from "./TypewriterText";
import BentoGrid from "./BentoGrid";
import NeuralPathwaysBackground from "./NeuralPathwaysBackground";
import MicIcon from "./MicIcon";

/** SVG filter definitions for visual effects */
function SVGFilters() {
  return (
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
  );
}

/** Data packet animation during collapse phase */
function DataPacket() {
  return (
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
  );
}

/** Lattice ring animation for storage phase */
function LatticeRing({ index, radius, duration, strokeDash, opacity }: {
  index: number;
  radius: number;
  duration: number;
  strokeDash: string;
  opacity: number;
}) {
  return (
    <motion.div
      className="absolute"
      animate={{ rotate: index % 2 === 0 ? 360 : -360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      <svg
        width={radius * 2 + 10}
        height={radius * 2 + 10}
        viewBox={`0 0 ${radius * 2 + 10} ${radius * 2 + 10}`}
        fill="none"
      >
        <motion.circle
          cx={radius + 5}
          cy={radius + 5}
          r={radius}
          stroke={`rgba(255,255,255,${opacity})`}
          strokeWidth="1"
          strokeDasharray={strokeDash}
          fill="none"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [0.9, 1.05, 0.9],
            opacity: [opacity * 0.8, opacity, opacity * 0.8],
          }}
          transition={{
            duration: 2 + index * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.2,
          }}
        />
      </svg>
    </motion.div>
  );
}

/** Memory core icon with animated paths */
function MemoryCoreIcon() {
  return (
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
  );
}

/** Storage node view during storage phase */
function StorageNode() {
  const latticeRings = [
    { radius: 20, duration: 7, strokeDash: "2 4", opacity: 0.6 },
    { radius: 32, duration: 13, strokeDash: "4 6", opacity: 0.5 },
    { radius: 44, duration: 17, strokeDash: "3 5", opacity: 0.4 },
  ];

  const magneticTransition = {
    type: "spring" as const,
    stiffness: 120,
    damping: 14,
    mass: 0.8,
  };

  return (
    <motion.div
      key="storage-node"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={magneticTransition}
      className="relative flex items-center justify-center"
    >
      <BentoGrid isActive={true} />

      {/* Write-to-Disk Flash */}
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
        transition={{ duration: 0.15, ease: "easeOut" }}
      />

      {/* Pressure Wave */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
      />

      {/* Dynamic Lattice Rings */}
      {latticeRings.map((ring, i) => (
        <LatticeRing key={`lattice-ring-${i}`} index={i} {...ring} />
      ))}

      {/* Central Memory Core */}
      <motion.div
        className="relative w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #B34B71 0%, #6B2D4A 100%)",
          boxShadow:
            "0 0 40px rgba(179, 75, 113, 0.7), inset 0 0 25px rgba(255,255,255,0.15)",
        }}
        initial={{ scale: 0.5 }}
        animate={{ scale: [0.5, 1.15, 1] }}
        transition={{ duration: 0.8, times: [0, 0.5, 1], ease: "easeOut" }}
      >
        {/* Inner Glow */}
        <motion.div
          className="absolute inset-1.5 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)",
          }}
          animate={{ opacity: [0.3, 1, 0.5], scale: [1, 1.1, 1] }}
          transition={{ duration: 1, times: [0, 0.3, 1], ease: "easeOut" }}
        />
        <MemoryCoreIcon />
      </motion.div>

      {/* Particle Accumulation */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const startRadius = 80;
        const endRadius = 26;
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
              ease: [0.68, -0.55, 0.265, 1.55],
            }}
          />
        );
      })}

      {/* Locked Particles */}
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
  );
}

const USER_MESSAGE = "need to close deal today";
const AI_RESPONSE = "Sure, Sidekick will set a reminder for 6PM";

/**
 * MemoryAnimation Component
 * Displays an animated chat interface showing memory capture and storage
 */
export default function MemoryAnimation() {
  const [phase, setPhase] = useState<MemoryAnimationPhase>("input");
  const [inputText, setInputText] = useState("");
  const [showUserMessage, setShowUserMessage] = useState(false);
  const [showAiResponse, setShowAiResponse] = useState(false);

  const isBackgroundActive = phase === "thinking";

  useEffect(() => {
    let cancelled = false;

    const runAnimation = async () => {
      // Reset state
      setPhase("input");
      setInputText("");
      setShowUserMessage(false);
      setShowAiResponse(false);

      await delay(600);

      // Phase 1: Input - Simulate typing
      for (let i = 0; i <= USER_MESSAGE.length; i++) {
        if (cancelled) return;
        setInputText(USER_MESSAGE.slice(0, i));
        await delay(40 + Math.random() * 30);
      }

      await delay(400);

      // Phase 2: Send message
      if (cancelled) return;
      setPhase("sending");
      setInputText("");
      await delay(100);
      setShowUserMessage(true);
      await delay(600);

      // Phase 3: Responding
      if (cancelled) return;
      setPhase("responding");
      setShowAiResponse(true);
      await delay(3500);

      // Phase 4: Collapse
      if (cancelled) return;
      setPhase("collapse");
      await delay(800);

      // Phase 5: Storage
      if (cancelled) return;
      setPhase("storage");
      await delay(4200);

      // Loop
      if (!cancelled) {
        runAnimation();
      }
    };

    runAnimation();

    return () => {
      cancelled = true;
    };
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

  const isInChatPhase =
    phase === "input" ||
    phase === "sending" ||
    phase === "thinking" ||
    phase === "responding" ||
    phase === "collapse";

  return (
    <div className="relative w-[340px] h-[420px] overflow-hidden flex items-center justify-center">
      <SVGFilters />

      {/* Background card */}
      <div className="absolute inset-x-0 top-[5%] bottom-[5%] rounded-2xl overflow-hidden">
        <NeuralPathwaysBackground isActive={isBackgroundActive} />
      </div>

      {/* Content Container */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center p-4"
        animate={{
          backdropFilter: isBackgroundActive ? "blur(2px)" : "blur(0px)",
        }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {/* Chat Window */}
          {isInChatPhase && (
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
                  {/* User Message */}
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
                            {USER_MESSAGE}
                          </span>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* AI Response */}
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
                          <TypewriterText
                            text={AI_RESPONSE}
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
                      style={{ background: inputText ? "#1a1a1a" : "#e5e5e5" }}
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

          {/* Data Packet during collapse */}
          {phase === "collapse" && <DataPacket />}

          {/* Storage Node */}
          {phase === "storage" && <StorageNode />}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
