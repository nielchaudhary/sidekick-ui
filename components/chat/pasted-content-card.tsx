"use client";

import { FileText, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const SYSTEM_FONT_STACK =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';

interface PastedContentCardProps {
  content: string;
  onOpen: () => void;
  onDiscard?: () => void;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function PastedContentCard({ content, onOpen, onDiscard }: PastedContentCardProps) {
  const wordCount = countWords(content);
  const preview = content.slice(0, 80).replace(/\n/g, " ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={onOpen}
      className={cn(
        "h-[72px] w-full rounded-xl cursor-pointer",
        "flex items-center gap-3 px-4",
        "transition-colors duration-150",
        "border border-white/10 hover:border-white/[0.18]",
        "bg-white/[0.03] hover:bg-white/[0.05]"
      )}
      style={{ fontFamily: SYSTEM_FONT_STACK }}
    >
      <FileText className="size-4 opacity-40 text-white shrink-0" />

      <div className="flex flex-col min-w-0 shrink-0">
        <span className="text-[13px] font-medium text-white/70">Pasted content</span>
        <span className="text-[12px] font-normal text-white/35">{wordCount.toLocaleString()} words</span>
      </div>

      <span className="hidden md:block text-[12px] text-white/25 truncate min-w-0 flex-1">
        {preview}
      </span>

      {onDiscard && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDiscard();
          }}
          className="shrink-0 p-1 rounded-md text-white/30 hover:text-white/70 transition-colors duration-150 cursor-pointer"
          aria-label="Discard pasted content"
        >
          <X className="size-3.5" />
        </button>
      )}
    </motion.div>
  );
}
