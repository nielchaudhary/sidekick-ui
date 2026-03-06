"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface CopyButtonProps {
  value: string;
  size?: "sm" | "default" | "lg";
  className?: string;
}

const iconSizes = { sm: "size-3", default: "size-3.5", lg: "size-4.5" };

export function CopyButton({ value, size = "default", className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative inline-flex flex-col items-center group", className)}>
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          "relative inline-flex items-center justify-center rounded-md p-1 cursor-pointer transition-colors hover:bg-white/10",
          "text-white/30 hover:text-white/60"
        )}
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.span
              key="check"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Check className={iconSizes[size]} />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Copy className={iconSizes[size]} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
      <span className="absolute top-full mt-1 z-10 rounded-[6px] border border-white/20 bg-black px-2.5 py-1.5 text-[14px] font-medium leading-none text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        copy
      </span>
    </div>
  );
}
