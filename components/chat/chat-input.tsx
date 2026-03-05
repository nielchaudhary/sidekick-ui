"use client";

import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react";
import { useRef, useEffect, KeyboardEvent } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const maxHeight = 6 * 24; // ~6 lines
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSend();
      }
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="bg-black/40 backdrop-blur-sm px-4 py-3">
      <div
        className="max-w-3xl mx-auto relative rounded-3xl border border-white/10 bg-white/5 overflow-hidden transition-colors focus-within:border-white/20"
        style={{ width: "90%" }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Sidekick about anything"
          disabled={disabled}
          rows={1}
          className="w-full resize-none bg-transparent px-6 py-4 pr-12 text-sm text-white placeholder:text-white/30 focus:outline-none scrollbar-hide"
        />
        <button
          onClick={onSend}
          disabled={!canSend}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all duration-200 ease-out",
            canSend
              ? "bg-white/20 text-white/60 hover:bg-white hover:text-black cursor-pointer"
              : "bg-white/10 text-white/20 cursor-pointer"
          )}
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
