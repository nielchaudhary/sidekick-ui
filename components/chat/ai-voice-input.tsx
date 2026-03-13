"use client";

import { Mic } from "lucide-react";
import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

function generateBarHeights(count: number): number[] {
  return Array.from(
    { length: count },
    (_, i) => 20 + ((((i * 7 + 13) * 2654435761) >>> 0) % 100) * 0.8
  );
}

interface AIVoiceInputProps {
  onStart?: () => void;
  onStop?: (duration: number) => void;
  visualizerBars?: number;
  demoMode?: boolean;
  demoInterval?: number;
  autoStart?: boolean;
  className?: string;
}

export function AIVoiceInput({
  onStart,
  onStop,
  visualizerBars = 48,
  demoMode = false,
  demoInterval = 3000,
  autoStart = false,
  className,
}: AIVoiceInputProps) {
  const [submitted, setSubmitted] = useState(autoStart);
  const [time, setTime] = useState(0);
  const [isDemo, setIsDemo] = useState(demoMode);
  const [barHeights] = useState(() => generateBarHeights(visualizerBars));

  const subscribeNoop = useCallback(() => () => {}, []);
  const getSnapshotClient = useCallback(() => true, []);
  const getSnapshotServer = useCallback(() => false, []);
  const mounted = useSyncExternalStore(subscribeNoop, getSnapshotClient, getSnapshotServer);

  useEffect(() => {
    if (!submitted) return;

    onStart?.();
    const intervalId = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [submitted, onStart]);

  const handleStop = useCallback(() => {
    setSubmitted(false);
    onStop?.(time);
    setTime(0);
  }, [time, onStop]);

  useEffect(() => {
    if (!isDemo) return;

    let timeoutId: NodeJS.Timeout;
    const runAnimation = () => {
      setSubmitted(true);
      timeoutId = setTimeout(() => {
        setSubmitted(false);
        timeoutId = setTimeout(runAnimation, 1000);
      }, demoInterval);
    };

    const initialTimeout = setTimeout(runAnimation, 100);
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(initialTimeout);
    };
  }, [isDemo, demoInterval]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClick = () => {
    if (isDemo) {
      setIsDemo(false);
      setSubmitted(false);
    } else if (submitted) {
      handleStop();
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-2">
        <button
          className={cn(
            "group w-16 h-16 rounded-xl flex items-center justify-center transition-colors",
            submitted ? "bg-none" : "bg-none hover:bg-black/10 dark:hover:bg-white/10"
          )}
          type="button"
          onClick={handleClick}
        >
          {submitted ? (
            <div
              className="w-6 h-6 rounded-sm animate-spin bg-black dark:bg-white cursor-pointer pointer-events-auto"
              style={{ animationDuration: "3s" }}
            />
          ) : (
            <Mic className="w-6 h-6 text-black/70 dark:text-white/70" />
          )}
        </button>

        <span
          className={cn(
            "font-mono text-sm transition-opacity duration-300",
            submitted ? "text-black/70 dark:text-white/70" : "text-black/30 dark:text-white/30"
          )}
        >
          {formatTime(time)}
        </span>

        <div className="h-4 w-64 flex items-center justify-center gap-0.5">
          {barHeights.map((height, i) => (
            <div
              key={i}
              className={cn(
                "w-0.5 rounded-full transition-all duration-300",
                submitted
                  ? "bg-black/50 dark:bg-white/50 animate-pulse"
                  : "bg-black/10 dark:bg-white/10 h-1"
              )}
              style={
                submitted && mounted
                  ? {
                      height: `${height}%`,
                      animationDelay: `${i * 0.05}s`,
                    }
                  : undefined
              }
            />
          ))}
        </div>

        <p className="h-4 text-xs text-black/70 dark:text-white/70">
          {submitted ? "Listening..." : "Click to speak"}
        </p>
      </div>
    </div>
  );
}
