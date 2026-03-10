"use client";

import { cn } from "@/lib/utils";
import { ArrowUp, Mic } from "lucide-react";
import { useRef, useEffect, useState, useCallback, KeyboardEvent } from "react";
import { AIVoiceInput } from "./ai-voice-input";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [voiceMode, setVoiceMode] = useState(false);
  const voiceHasStartedRef = useRef(false);

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
  const showMic = !value.trim() && !disabled;

  const handleVoiceStart = useCallback(() => {
    voiceHasStartedRef.current = true;
  }, []);

  const handleVoiceStop = useCallback(() => {
    if (!voiceHasStartedRef.current) return;
    voiceHasStartedRef.current = false;
    setVoiceMode(false);
  }, []);

  return (
    <div className="backdrop-blur-sm px-4 py-3">
      <div
        className={cn(
          "max-w-3xl mx-auto relative rounded-3xl border border-white/10 overflow-hidden transition-colors",
          voiceMode ? "bg-transparent" : "bg-white/5 focus-within:border-white/20"
        )}
        style={{ width: "90%" }}
      >
        {voiceMode ? (
          <AIVoiceInput autoStart onStart={handleVoiceStart} onStop={handleVoiceStop} />
        ) : (
          <>
            <textarea
              id="chat-input"
              name="chat-input"
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Sidekick about anything"
              disabled={disabled}
              rows={1}
              className="w-full resize-none bg-transparent px-6 py-4 pr-12 text-sm text-white placeholder:text-white/30 focus:outline-none scrollbar-hide"
              style={{ fontFamily: 'pplxSans, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif', fontWeight: 400 }}
            />
            {showMic ? (
              <button
                onClick={() => setVoiceMode(true)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all duration-200 ease-out bg-white/10 text-white/40 hover:bg-white/20 hover:text-white/70 cursor-pointer"
              >
                <Mic className="w-4 h-4" />
              </button>
            ) : (
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
            )}
          </>
        )}
      </div>
    </div>
  );
}
