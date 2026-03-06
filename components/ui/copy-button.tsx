"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

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
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={cn("relative inline-flex flex-col items-center group", className)}>
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          "inline-flex items-center justify-center rounded-md p-1 cursor-pointer transition-colors hover:bg-white/10",
          "text-white/30 hover:text-white/60"
        )}
      >
        {copied ? <Check className={iconSizes[size]} /> : <Copy className={iconSizes[size]} />}
      </button>
      <span className="absolute top-full mt-1 rounded-lg border border-white/20 bg-black px-2 py-1.5 text-[13px] font-medium leading-none text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {copied ? "copied" : "copy"}
      </span>
    </div>
  );
}
