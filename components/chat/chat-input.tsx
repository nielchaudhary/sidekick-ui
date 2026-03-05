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
      <div className="max-w-3xl mx-auto relative rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition-colors focus-within:border-white/20">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Sidekick..."
          disabled={disabled}
          rows={1}
          className="w-full resize-none bg-transparent px-4 py-3 pr-12 text-sm text-white placeholder:text-white/30 focus:outline-none scrollbar-hide"
        />
        <button
          onClick={onSend}
          disabled={!canSend}
          className={cn(
            "absolute right-2 bottom-2 p-1.5 rounded-lg transition-all duration-200 ease-out",
            canSend
              ? "bg-white text-black hover:bg-white/90 cursor-pointer"
              : "bg-white/10 text-white/20 cursor-default"
          )}
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
