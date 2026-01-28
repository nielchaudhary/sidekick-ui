"use client";

import { useState, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Check } from "lucide-react";
import { delay } from "@/lib/utils";
import type { RetrievalNexusPhase } from "@/types";

interface ChronosCalendarProps {
  phase: RetrievalNexusPhase;
  targetDay: number;
  targetMonth: string;
  onComplete?: () => void;
}

function ChronosCalendarComponent({
  phase,
  targetDay,
  targetMonth,
  onComplete,
}: ChronosCalendarProps) {
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

export const ChronosCalendar = memo(ChronosCalendarComponent);
