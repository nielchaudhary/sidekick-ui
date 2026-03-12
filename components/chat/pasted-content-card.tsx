"use client";

import { FileText, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const SYSTEM_FONT_STACK =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';

interface PastedContentChipProps {
  label: string;
  wordCount: number;
  index: number;
  onOpen: () => void;
  onDiscard?: () => void;
}

export function PastedContentChip({
  label,
  wordCount,
  index,
  onOpen,
  onDiscard,
}: PastedContentChipProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15, ease: "easeOut", delay: index * 0.05 }}
      onClick={onOpen}
      className={cn(
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
    </motion.div>
  );
}
