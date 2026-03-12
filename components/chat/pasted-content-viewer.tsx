"use client";

import { useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const SYSTEM_FONT_STACK =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';

interface PastedContentViewerProps {
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function PastedContentViewer({ content, isOpen, onClose }: PastedContentViewerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  // Focus trap + Escape
  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    panelRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  // Prevent body scroll when open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const wordCount = countWords(content);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-[4px]"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{
              duration: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative z-10 bg-black border border-white/[0.12] rounded-2xl flex flex-col outline-none
                       w-[90vw] h-[100dvh] rounded-none md:rounded-2xl md:w-[min(720px,90vw)] md:h-[min(600px,80vh)]"
            style={{ fontFamily: SYSTEM_FONT_STACK }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 h-12 shrink-0 border-b border-white/[0.08]">
              <div className="flex items-baseline gap-2">
                <span className="text-[13px] font-medium text-white/70">Pasted content</span>
                <span className="text-[12px] font-normal text-white/35">
                  {wordCount.toLocaleString()} words
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-md text-white/30 hover:text-white/70 transition-colors duration-150 cursor-pointer"
                aria-label="Close viewer"
              >
                <X className="size-[18px]" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide px-7 py-6">
              <p
                className="text-[14px] text-white/85 whitespace-pre-wrap"
                style={{ lineHeight: 1.7, fontFamily: SYSTEM_FONT_STACK }}
              >
                {content}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
