"use client";

import { FileText, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect, useCallback } from "react";
import { SYSTEM_FONT_STACK } from "./pasted-content-types";

interface PastedContentChipProps {
  label: string;
  wordCount: number;
  text: string;
  index: number;
  onOpen: () => void;
  onDiscard?: () => void;
}

export function PastedContentChip({
  label,
  wordCount,
  text,
  index,
  onOpen,
  onDiscard,
}: PastedContentChipProps) {
  const chipRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [flipBelow, setFlipBelow] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTouchDevice = useRef(false);

  // Detect touch to suppress hover on mobile
  useEffect(() => {
    const onTouch = () => {
      isTouchDevice.current = true;
    };
    window.addEventListener("touchstart", onTouch, { once: true });
    return () => window.removeEventListener("touchstart", onTouch);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (isTouchDevice.current) return;
    hoverTimer.current = setTimeout(() => {
      // Check if popup should flip below
      if (chipRef.current) {
        const rect = chipRef.current.getBoundingClientRect();
        // 180px max popup height + 8px gap + some buffer
        setFlipBelow(rect.top < 200);
      }
      setShowPreview(true);
    }, 300);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    setShowPreview(false);
  }, []);

  const previewText = text.slice(0, 500);

  return (
    <motion.div
      ref={chipRef}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15, ease: "easeOut", delay: index * 0.05 }}
      onClick={onOpen}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative",
        "h-[44px] min-w-[200px] max-w-[360px] rounded-[10px] cursor-pointer",
        "inline-flex items-center gap-2 px-3",
        "transition-colors duration-150",
        "border border-white/10 hover:border-white/[0.18]",
        "bg-white/[0.03] hover:bg-white/[0.05]",
        "shrink-0"
      )}
      style={{ fontFamily: SYSTEM_FONT_STACK }}
    >
      <FileText className="size-3.5 opacity-40 text-white shrink-0" />

      <span className="text-[12px] font-medium text-white/70 shrink-0">{label}</span>

      <span className="text-[11px] font-normal text-white/35 shrink-0">
        · {wordCount.toLocaleString()} words
      </span>

      {onDiscard && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDiscard();
          }}
          className="shrink-0 ml-auto p-0.5 rounded text-white/30 hover:text-white/70 transition-colors duration-150 cursor-pointer"
          aria-label={`Discard ${label}`}
        >
          <X className="size-3" />
        </button>
      )}

      {/* Hover preview popup */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute left-1/2 -translate-x-1/2 z-50 pointer-events-none",
              flipBelow ? "top-[calc(100%+8px)]" : "bottom-[calc(100%+8px)]"
            )}
            style={{ width: "min(400px, 80vw)" }}
          >
            <div
              className="relative rounded-xl border border-white/10 overflow-hidden"
              style={{
                background: "rgba(0, 0, 0, 0.85)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                maxHeight: "180px",
                fontFamily: SYSTEM_FONT_STACK,
              }}
            >
              <div className="px-4 py-3.5 overflow-hidden" style={{ maxHeight: "180px" }}>
                <p
                  className="text-[12px] text-white/70 whitespace-pre-wrap"
                  style={{ lineHeight: 1.6 }}
                >
                  {previewText}
                </p>
              </div>
              {/* Fade gradient at bottom */}
              {text.length > 500 && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
                  style={{
                    background: "linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.85))",
                  }}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
