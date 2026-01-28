"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { delay } from "@/lib/utils";

// Phase types for the inference animation
type InferencePhase =
  | "idle"
  | "embedding" // Phase I: Token embedding enters the bus
  | "attention" // Phase II: Multi-Head Attention matrix strobes
  | "ffn" // Phase III: FFN cores fire
  | "complete"; // Atomic inference flash

interface ProcessorBlock {
  id: "attention" | "ffn" | "kv_cache";
  status: "idle" | "processing" | "committed";
  load: number; // 0 to 100 for core glow intensity
}

// 6x6 Attention Matrix grid dimensions (compact for small containers)
const ATTENTION_GRID_SIZE = 6;
const ATTENTION_HEADS = 4; // 4 attention heads, each 3x3 region

// Token data for hex labels
const TOKEN_HEX_VALUES = ["0x4f2e", "0x8b3c", "0x1a7f", "0xd091"];

// Neural Bus trace component - horizontal data pathways
function NeuralBus({ phase, busIndex }: { phase: InferencePhase; busIndex: number }) {
  const isActive = phase === "embedding" || phase === "attention" || phase === "ffn";
  const delayOffset = busIndex * 0.15;

  return (
    <div className="relative h-[4px] w-full overflow-hidden">
      {/* Base trace line */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(179, 75, 113, 0.15)",
        }}
      />

      {/* Animated pulse */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute top-0 bottom-0 w-[135px]"
            style={{
              background: "linear-gradient(90deg, transparent 0%, #B34B71 50%, transparent 100%)",
              boxShadow: "0 0 8px rgba(179, 75, 113, 0.6)",
            }}
            initial={{ x: "-100%" }}
            animate={{ x: "500%" }}
            transition={{
              duration: 1.2,
              delay: delayOffset,
              repeat: Infinity,
              ease: "anticipate",
            }}
          />
        )}
      </AnimatePresence>

      {/* Hex label that follows the pulse */}
      <AnimatePresence>
        {phase === "embedding" && (
          <motion.span
            className="absolute top-4 text-[13px] font-mono text-white/50"
            style={{ fontFamily: "Geist Mono, monospace" }}
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: "300%", opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 1.5,
              delay: delayOffset,
              repeat: Infinity,
              ease: "anticipate",
            }}
          >
            {TOKEN_HEX_VALUES[busIndex % TOKEN_HEX_VALUES.length]}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

// Attention Matrix Cell - individual cell in the 8x8 grid
function AttentionCell({
  row,
  col,
  isActive,
  headIndex,
  phase,
}: {
  row: number;
  col: number;
  isActive: boolean;
  headIndex: number;
  phase: InferencePhase;
}) {
  const headColors = [
    "rgba(179, 75, 113, 1)", // Head 0 - burgundy
    "rgba(179, 75, 113, 0.8)", // Head 1 - lighter burgundy
    "rgba(179, 75, 113, 0.6)", // Head 2 - even lighter
    "rgba(179, 75, 113, 0.9)", // Head 3 - mid burgundy
  ];

  return (
    <motion.div
      className="w-2.5 h-2.5 rounded-[2px]"
      style={{
        background: isActive ? headColors[headIndex] : "rgba(255, 255, 255, 0.08)",
        boxShadow: isActive ? `0 0 6px ${headColors[headIndex]}` : "none",
      }}
      animate={
        isActive && phase === "attention"
          ? {
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5],
            }
          : {}
      }
      transition={{
        duration: 0.3,
        repeat: isActive && phase === "attention" ? Infinity : 0,
        repeatDelay: Math.random() * 0.5,
      }}
    />
  );
}

// Attention Matrix - 8x8 grid representing Multi-Head Self-Attention
function AttentionMatrix({
  phase,
  activePattern,
}: {
  phase: InferencePhase;
  activePattern: boolean[][];
}) {
  return (
    <div className="relative">
      {/* Matrix label */}
      <motion.div
        className="absolute -top-5 left-0 text-[9px] font-mono text-white/40 uppercase tracking-wider"
        style={{ fontFamily: "Geist Mono, monospace" }}
        animate={{ opacity: phase === "attention" ? 1 : 0.3 }}
      >
        ATTN
      </motion.div>

      {/* Grid container */}
      <div
        className="grid gap-[2px] p-2 border border-white/10 rounded-sm"
        style={{
          gridTemplateColumns: `repeat(${ATTENTION_GRID_SIZE}, 1fr)`,
          background: "rgba(9, 9, 11, 0.8)",
        }}
      >
        {Array.from({ length: ATTENTION_GRID_SIZE }).map((_, row) =>
          Array.from({ length: ATTENTION_GRID_SIZE }).map((_, col) => {
            // Determine which attention head this cell belongs to (3x3 regions)
            const headIndex = Math.floor(row / 3) * 2 + Math.floor(col / 3);
            const isActive = activePattern[row]?.[col] ?? false;

            return (
              <AttentionCell
                key={`${row}-${col}`}
                row={row}
                col={col}
                isActive={isActive}
                headIndex={headIndex}
                phase={phase}
              />
            );
          })
        )}
      </div>

      {/* Synapse connections overlay */}
      <AnimatePresence>
        {phase === "attention" && (
          <motion.svg
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Random synapse lines between active cells */}
            {[...Array(6)].map((_, i) => (
              <motion.line
                key={i}
                x1={`${10 + Math.random() * 80}%`}
                y1={`${10 + Math.random() * 80}%`}
                x2={`${10 + Math.random() * 80}%`}
                y2={`${10 + Math.random() * 80}%`}
                stroke="rgba(179, 75, 113, 0.4)"
                strokeWidth="0.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 1, 1, 0],
                  opacity: [0, 0.6, 0.6, 0],
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.15,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
            ))}
          </motion.svg>
        )}
      </AnimatePresence>
    </div>
  );
}

// FFN Compute Core - represents a Feed-Forward Network layer
function ComputeCore({
  index,
  phase,
  load,
}: {
  index: number;
  phase: InferencePhase;
  load: number;
}) {
  const isActive = phase === "ffn" || phase === "complete";
  const positions = [
    { top: "25%", left: "25%" },
    { top: "25%", left: "75%" },
    { top: "75%", left: "25%" },
    { top: "75%", left: "75%" },
  ];

  return (
    <motion.div
      className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2"
      style={{
        top: positions[index].top,
        left: positions[index].left,
      }}
      animate={{
        scale: isActive ? [1, 1.05, 1] : 1,
      }}
      transition={{
        duration: 0.6,
        repeat: isActive ? Infinity : 0,
        delay: index * 0.1,
      }}
    >
      {/* Core box */}
      <motion.div
        className="w-full h-full border border-white/20 rounded-sm relative overflow-hidden"
        style={{
          background: `rgba(9, 9, 11, 0.9)`,
        }}
        animate={{
          borderColor: isActive ? "rgba(179, 75, 113, 0.6)" : "rgba(255, 255, 255, 0.2)",
          boxShadow: isActive
            ? `0 0 ${12 + load * 0.2}px rgba(179, 75, 113, ${0.3 + load * 0.004})`
            : "none",
        }}
      >
        {/* Heat trace glow */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at center, rgba(179, 75, 113, ${load * 0.006}) 0%, transparent 70%)`,
          }}
          animate={{
            opacity: isActive ? [0.5, 1, 0.5] : 0,
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
          }}
        />

        {/* Core label */}
        <div
          className="absolute inset-0 flex items-center justify-center text-[9px] font-mono text-white/50"
          style={{ fontFamily: "Geist Mono, monospace" }}
        >
          {index}
        </div>
      </motion.div>
    </motion.div>
  );
}

// KV Cache - vertical bar that fills as context grows
function KVCache({ phase, fillLevel }: { phase: InferencePhase; fillLevel: number }) {
  return (
    <div className="relative h-full w-[26px] flex flex-col items-center">
      {/* Label */}
      <motion.div
        className="text-[9px] font-mono text-white/40 uppercase tracking-wider mb-1 whitespace-nowrap"
        style={{
          fontFamily: "Geist Mono, monospace",
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
        }}
      >
        KV
      </motion.div>

      {/* Cache bar container */}
      <div
        className="flex-1 w-[13px] border border-white/20 rounded-sm overflow-hidden relative"
        style={{ background: "rgba(9, 9, 11, 0.9)" }}
      >
        {/* Fill level */}
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(179, 75, 113, 0.8) 0%, rgba(179, 75, 113, 0.4) 100%)",
            boxShadow: "0 -2px 8px rgba(179, 75, 113, 0.4)",
          }}
          animate={{
            height: `${fillLevel}%`,
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
        />

        {/* Segment lines */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 h-[1px] bg-white/10"
            style={{ top: `${(i + 1) * 25}%` }}
          />
        ))}
      </div>
    </div>
  );
}

// Scanning Line - horizontal sweep effect
function ScanningLine({ isActive }: { isActive: boolean }) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="absolute left-0 right-0 h-[1px] pointer-events-none z-20"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(179, 75, 113, 0.8) 50%, transparent 100%)",
            boxShadow: "0 0 10px rgba(179, 75, 113, 0.6), 0 0 20px rgba(179, 75, 113, 0.4)",
          }}
          initial={{ top: "0%", opacity: 0 }}
          animate={{ top: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 0.5,
            ease: "linear",
          }}
        />
      )}
    </AnimatePresence>
  );
}

// Token Log - vertical scrolling list of generated tokens
function TokenLog({ phase, tokens }: { phase: InferencePhase; tokens: string[] }) {
  return (
    <div className="h-full w-full flex flex-col">
      {/* Label */}
      <div
        className="text-[9px] font-mono text-white/40 uppercase tracking-wider mb-1"
        style={{ fontFamily: "Geist Mono, monospace" }}
      >
        LOG
      </div>

      {/* Token list */}
      <div
        className="flex-1 border border-white/10 rounded-sm p-1.5 overflow-hidden"
        style={{ background: "rgba(9, 9, 11, 0.9)" }}
      >
        <div className="space-y-0">
          <AnimatePresence mode="popLayout">
            {tokens.slice(-6).map((token, idx) => (
              <motion.div
                key={`${token}-${idx}`}
                className="text-[9px] font-mono text-white/60 truncate leading-tight"
                style={{ fontFamily: "Geist Mono, monospace" }}
                initial={{ opacity: 0, x: -3 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {token}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Status HUD - displays inference metrics
function StatusHUD({
  phase,
  probability,
}: {
  phase: InferencePhase;
  tokenCount: number;
  temperature: number;
  probability: number;
}) {
  const isVisible = phase === "ffn" || phase === "complete";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute bottom-2 left-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="text-[10px] font-mono text-[#B34B71]"
            style={{ fontFamily: "Geist Mono, monospace" }}
          >
            P:{probability.toFixed(2)}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Bus Activity - rapid horizontal lines for inter-layer communication
function BusActivity({ phase }: { phase: InferencePhase }) {
  const isActive = phase === "attention" || phase === "ffn";

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {isActive &&
        [...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-[1px] bg-white/10"
            style={{
              top: `${10 + i * 7}%`,
              width: "30%",
            }}
            initial={{ left: "-30%" }}
            animate={{ left: "100%" }}
            transition={{
              duration: 0.8 + Math.random() * 0.4,
              delay: i * 0.1,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
    </div>
  );
}

// Main Silicon Inference Component
export default function SiliconInference() {
  const [phase, setPhase] = useState<InferencePhase>("idle");
  const [attentionPattern, setAttentionPattern] = useState<boolean[][]>(
    Array(ATTENTION_GRID_SIZE)
      .fill(null)
      .map(() => Array(ATTENTION_GRID_SIZE).fill(false))
  );
  const [coreLoads, setCoreLoads] = useState([0, 0, 0, 0]);
  const [kvFill, setKvFill] = useState(0);
  const [tokenLog, setTokenLog] = useState<string[]>([]);
  const [showAtomicFlash, setShowAtomicFlash] = useState(false);
  const animationRef = useRef<boolean>(true);

  // Generate random attention pattern for multi-head attention visualization
  const generateAttentionPattern = useCallback(() => {
    const pattern: boolean[][] = Array(ATTENTION_GRID_SIZE)
      .fill(null)
      .map(() => Array(ATTENTION_GRID_SIZE).fill(false));

    // Activate random cells in each attention head region (3x3 per head)
    for (let head = 0; head < ATTENTION_HEADS; head++) {
      const rowStart = Math.floor(head / 2) * 3;
      const colStart = (head % 2) * 3;

      // Activate 2-4 random cells per head
      const activations = 2 + Math.floor(Math.random() * 3);
      for (let a = 0; a < activations; a++) {
        const row = rowStart + Math.floor(Math.random() * 3);
        const col = colStart + Math.floor(Math.random() * 3);
        pattern[row][col] = true;
      }
    }

    return pattern;
  }, []);

  // Main animation loop
  useEffect(() => {
    animationRef.current = true;

    const runInferenceDemo = async () => {
      while (animationRef.current) {
        // Reset state
        setPhase("idle");
        setAttentionPattern(
          Array(ATTENTION_GRID_SIZE)
            .fill(null)
            .map(() => Array(ATTENTION_GRID_SIZE).fill(false))
        );
        setCoreLoads([0, 0, 0, 0]);
        setKvFill(0);
        setTokenLog([]);
        setShowAtomicFlash(false);

        await delay(1000);

        // Phase I: Token Embedding & Bus Injection (0 - 1.5s)
        setPhase("embedding");
        setTokenLog(["INPUT →"]);
        await delay(500);
        setKvFill(10);
        await delay(500);
        setKvFill(20);
        setTokenLog((prev) => [...prev, "0x4f2e"]);
        await delay(500);

        // Phase II: Multi-Head Self-Attention (1.5s - 4s)
        setPhase("attention");

        // Strobe the attention matrix with changing patterns
        for (let i = 0; i < 8; i++) {
          if (!animationRef.current) return;
          setAttentionPattern(generateAttentionPattern());
          setKvFill(20 + i * 5);
          if (i % 2 === 0) {
            setTokenLog((prev) => [...prev, `Q·K^T[${i}]`]);
          }
          await delay(300);
        }

        setKvFill(60);
        setTokenLog((prev) => [...prev, "SOFTMAX"]);
        await delay(500);

        // Phase III: FFN Fire & Convergence (4s - 6s)
        setPhase("ffn");
        setTokenLog((prev) => [...prev, "FFN →"]);

        // Gradually increase core loads
        for (let load = 0; load <= 100; load += 10) {
          if (!animationRef.current) return;
          setCoreLoads([load, load * 0.9, load * 0.95, load * 0.85]);
          setKvFill(60 + load * 0.3);
          await delay(100);
        }

        setTokenLog((prev) => [...prev, "LOGITS"]);
        await delay(500);

        // Phase IV: Atomic Inference - Complete
        setPhase("complete");
        setShowAtomicFlash(true);
        setKvFill(100);
        setTokenLog((prev) => [...prev, "COMMIT ✓"]);

        await delay(300);
        setShowAtomicFlash(false);

        await delay(2000);

        // Loop
      }
    };

    runInferenceDemo();

    return () => {
      animationRef.current = false;
    };
  }, [generateAttentionPattern]);

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
      {/* Atomic Inference Flash */}
      <AnimatePresence>
        {showAtomicFlash && (
          <motion.div
            className="absolute inset-0 z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div
              className="w-full h-full"
              style={{
                background: "rgba(179, 75, 113, 0.3)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chip Layout */}
      <div className="relative w-full h-full max-w-[1014px] max-h-[845px] flex p-4 pt-8">
        {/* Phase Label - sits on top edge */}
        <div className="absolute top-1 left-6 z-30">
          <AnimatePresence mode="wait">
            <motion.span
              key={phase}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] font-mono tracking-[0.15em] text-[#B34B71] uppercase"
              style={{ fontFamily: "Geist Mono, monospace" }}
            >
              {phase === "embedding"
                ? "EMBED"
                : phase === "attention"
                  ? "ATTN"
                  : phase === "ffn"
                    ? "FFN"
                    : phase === "complete"
                      ? "DONE"
                      : "IDLE"}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Left Column: KV Cache */}
        <div className="w-10 h-full py-5 shrink-0">
          <KVCache phase={phase} fillLevel={kvFill} />
        </div>

        {/* Center Column: Main Die */}
        <div className="flex-1 flex flex-col px-3 min-w-0">
          {/* Neural Bus - Top */}
          <div className="space-y-1.5 py-3">
            {[0, 1].map((i) => (
              <NeuralBus key={i} phase={phase} busIndex={i} />
            ))}
          </div>

          {/* Main Processing Area */}
          <div className="flex-1 flex items-center justify-center gap-4 relative">
            {/* Bus Activity Lines */}
            <BusActivity phase={phase} />

            {/* Scanning Line */}
            <ScanningLine isActive={phase === "ffn"} />

            {/* Attention Matrix */}
            <div className="relative z-10 shrink-0">
              <AttentionMatrix phase={phase} activePattern={attentionPattern} />
            </div>

            {/* Compute Cores Area */}
            <div className="relative w-[72px] h-[72px] z-10 shrink-0">
              {[0, 1, 2, 3].map((i) => (
                <ComputeCore key={i} index={i} phase={phase} load={coreLoads[i]} />
              ))}

              {/* Core area label */}
              <div
                className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-white/40 uppercase tracking-wider whitespace-nowrap"
                style={{ fontFamily: "Geist Mono, monospace" }}
              >
                FFN
              </div>
            </div>
          </div>

          {/* Neural Bus - Bottom */}
          <div className="space-y-1.5 py-3">
            {[2, 3].map((i) => (
              <NeuralBus key={i} phase={phase} busIndex={i} />
            ))}
          </div>
        </div>

        {/* Right Column: Token Log */}
        <div className="w-20 h-full py-5 shrink-0">
          <TokenLog phase={phase} tokens={tokenLog} />
        </div>
      </div>

      {/* Status HUD */}
      <StatusHUD
        phase={phase}
        tokenCount={phase === "complete" ? 1 : 0}
        temperature={0.7}
        probability={0.9992}
      />

      {/* Clock frequency indicator */}
      <motion.div
        className="absolute bottom-3 right-3 text-[9px] font-mono text-white/30"
        style={{ fontFamily: "Geist Mono, monospace" }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        83Hz
      </motion.div>

      {/* Grid overlay for chip aesthetic */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]">
        <defs>
          <pattern id="grid" width="26" height="26" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}
