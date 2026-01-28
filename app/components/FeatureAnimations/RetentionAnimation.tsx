"use client";

import { useState, useEffect, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { delay } from "@/lib/utils";
import { PULSE } from "@/lib/animation-constants";
import type { RetentionAnimationPhase, StorageCell } from "@/types/animations";

/** Grid dimensions */
const GRID_COLS = 8;
const GRID_ROWS = 6;

/** Generate random hex string */
const generateHex = (length: number): string => {
  const chars = "0123456789ABCDEF";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * 16)]).join("");
};

/** Generate WAL log entries */
const generateLogEntry = (): string => {
  return `0x${generateHex(2)} 0x${generateHex(2)} 0x${generateHex(2)}`;
};

/**
 * RetentionAnimation Component
 * Displays a Chronos Vault visualization with WAL logging, block allocation, and encryption
 */
const RetentionAnimation = memo(function RetentionAnimation() {
  const [phase, setPhase] = useState<RetentionAnimationPhase>("idle");
  const [cycleKey, setCycleKey] = useState(0);
  const [logEntries, setLogEntries] = useState<string[]>([]);
  const [encryptionProgress, setEncryptionProgress] = useState(0);
  const [pageRef, setPageRef] = useState("0x00000000");
  const [integrityHash, setIntegrityHash] = useState("________________");
  const [iopsValue, setIopsValue] = useState(0);
  const [persistenceFlash, setPersistenceFlash] = useState(false);
  const [filledCells, setFilledCells] = useState<Set<number>>(new Set());
  const [encryptedCells, setEncryptedCells] = useState<Set<number>>(new Set());

  /** Initialize grid cells */
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

  /** Fragmentation fill order - non-sequential to mimic memory allocation */
  const fillOrder = useMemo(() => {
    const order = [
      3, 17, 8, 24, 12, 1, 29, 5, 21, 14, 33, 7, 19, 2, 26, 11, 35, 4, 22, 15, 30, 9, 27, 0, 18, 13,
      31, 6, 23, 10, 34, 16, 20, 28, 32, 25, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
    ];
    return order.filter((i) => i < GRID_COLS * GRID_ROWS);
  }, []);

  /** Main animation cycle */
  useEffect(() => {
    let cancelled = false;

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

      // Phase I: WAL Log
      if (cancelled) return;
      setPhase("log");
      for (let i = 0; i < 8; i++) {
        if (cancelled) return;
        setLogEntries((prev) => [generateLogEntry(), ...prev].slice(0, 12));
        setPageRef(`0x${generateHex(8)}`);
        setIopsValue(Math.floor(Math.random() * 4000 + 2000));
        await delay(100);
      }

      await delay(200);

      // Phase II: Block Allocation
      if (cancelled) return;
      setPhase("allocate");
      const cellsToFill = fillOrder.slice(0, 32);
      const localFilledCells = new Set<number>();
      for (let i = 0; i < cellsToFill.length; i++) {
        if (cancelled) return;
        localFilledCells.add(cellsToFill[i]);
        setFilledCells(new Set(localFilledCells));
        setIopsValue(Math.floor(Math.random() * 6000 + 4000));
        await delay(50);
      }

      await delay(300);

      // Phase III: Encryption Sweep / Flush
      if (cancelled) return;
      setPhase("flush");
      const totalRows = GRID_ROWS;
      for (let row = 0; row <= totalRows; row++) {
        if (cancelled) return;
        setEncryptionProgress((row / totalRows) * 100);
        for (let col = 0; col < GRID_COLS; col++) {
          const cellId = (row - 1) * GRID_COLS + col;
          if (row > 0 && localFilledCells.has(cellId)) {
            setEncryptedCells((prev) => new Set([...prev, cellId]));
          }
        }
        await delay(250);
      }

      // Generate final hash
      if (cancelled) return;
      setIntegrityHash(generateHex(16));

      // Persistence flash effect
      setPersistenceFlash(true);
      await delay(200);
      if (cancelled) return;
      setPersistenceFlash(false);

      setPhase("done");
      await delay(2500);

      // Restart cycle
      if (!cancelled) {
        setCycleKey((prev) => prev + 1);
      }
    };

    runCycle();

    return () => {
      cancelled = true;
    };
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

      {/* Main Layout */}
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
          <div className="relative">
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
                    transition={{ duration: PULSE.duration, repeat: Infinity }}
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
        {/* IOPS Meter */}
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

        {/* Page ID */}
        <div className="absolute top-3 left-[78px]">
          <span
            className="font-mono text-[6px] tracking-[0.1em]"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            PAGE_REF:{" "}
            <span style={{ color: "rgba(255,255,255,0.5)" }}>{pageRef.slice(0, 10)}...</span>
          </span>
        </div>

        {/* Integrity Hash */}
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

        {/* Status Label */}
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
});

export default RetentionAnimation;
