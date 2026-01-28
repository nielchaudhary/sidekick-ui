"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { delay } from "@/lib/utils";

interface UseAnimationCycleOptions<T extends string> {
  /** Array of phases in order */
  phases: T[];
  /** Duration for each phase in milliseconds */
  phaseDurations: Record<T, number>;
  /** Initial phase */
  initialPhase?: T;
  /** Auto-start the animation cycle */
  autoStart?: boolean;
  /** Loop the animation */
  loop?: boolean;
  /** Callback when phase changes */
  onPhaseChange?: (phase: T) => void;
  /** Callback when cycle completes */
  onCycleComplete?: () => void;
}

interface UseAnimationCycleReturn<T extends string> {
  currentPhase: T;
  cycleKey: number;
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
  goToPhase: (phase: T) => void;
}

/**
 * Hook for managing animation phase cycles
 * Handles automatic phase transitions with configurable durations
 */
export function useAnimationCycle<T extends string>({
  phases,
  phaseDurations,
  initialPhase,
  autoStart = true,
  loop = true,
  onPhaseChange,
  onCycleComplete,
}: UseAnimationCycleOptions<T>): UseAnimationCycleReturn<T> {
  const [currentPhase, setCurrentPhase] = useState<T>(initialPhase ?? phases[0]);
  const [cycleKey, setCycleKey] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!isRunning) return;

    let isCancelled = false;
    cancelledRef.current = false;

    const executePhases = async () => {
      for (let i = 0; i < phases.length; i++) {
        if (isCancelled || cancelledRef.current) return;

        const phase = phases[i];
        setCurrentPhase(phase);
        onPhaseChange?.(phase);

        const duration = phaseDurations[phase];
        if (duration > 0) {
          await delay(duration);
        }
      }

      if (!isCancelled && !cancelledRef.current) {
        onCycleComplete?.();
        if (loop) {
          setCycleKey((prev) => prev + 1);
        } else {
          setIsRunning(false);
        }
      }
    };

    executePhases();

    return () => {
      isCancelled = true;
      cancelledRef.current = true;
    };
  }, [isRunning, cycleKey, phases, phaseDurations, loop, onPhaseChange, onCycleComplete]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    cancelledRef.current = true;
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    cancelledRef.current = true;
    setCurrentPhase(initialPhase ?? phases[0]);
    setCycleKey(0);
  }, [initialPhase, phases]);

  const goToPhase = useCallback((phase: T) => {
    setCurrentPhase(phase);
    onPhaseChange?.(phase);
  }, [onPhaseChange]);

  return {
    currentPhase,
    cycleKey,
    isRunning,
    start,
    stop,
    reset,
    goToPhase,
  };
}
