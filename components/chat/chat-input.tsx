"use client";

import { cn } from "@/lib/utils";
import { ArrowUp, Mic } from "lucide-react";
import { useRef, useEffect, useState, useCallback, KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AIVoiceInput } from "./ai-voice-input";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

const placeholders = [
  "Ask Sidekick anything...",
  "Search through your memories...",
  "Research across your files & memories...",
  "Summarize, draft, or brainstorm ideas...",
];

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

  // Rotating placeholder
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAnimation = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
  }, []);

  useEffect(() => {
    startAnimation();

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible" && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      } else if (document.visibilityState === "visible") {
        startAnimation();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [startAnimation]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "44px"; // reset to min-height
    const maxHeight = 6 * 24; // ~6 lines
    const newHeight = Math.max(44, Math.min(textarea.scrollHeight, maxHeight));
    textarea.style.height = `${newHeight}px`;
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
      <HoverBorderGradient
        as="div"
        containerClassName={cn(
          "max-w-3xl mx-auto rounded-3xl border-none w-[90%]",
          voiceMode ? "bg-transparent" : "bg-black"
        )}
        className="w-full relative rounded-3xl bg-black px-0 py-0"
      >
        {voiceMode ? (
          <AIVoiceInput autoStart onStart={handleVoiceStart} onStop={handleVoiceStop} />
        ) : (
          <>
            <div className="relative w-full">
              <textarea
                id="chat-input"
                name="chat-input"
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={disabled}
                rows={1}
                className="w-full resize-none bg-transparent px-6 pr-12 text-[15px] leading-normal text-white focus:outline-none scrollbar-hide relative z-10 flex items-center"
                style={{
                  fontFamily:
                    'pplxSans, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                  fontWeight: 400,
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  lineHeight: '20px',
                  minHeight: '44px',
                  boxSizing: 'border-box',
                }}
              />
              <div className="absolute inset-0 flex items-center px-6 pointer-events-none overflow-hidden">
                <AnimatePresence mode="wait">
                  {!value && !isFocused && (
                    <motion.p
                      key={`placeholder-${currentPlaceholder}`}
                      initial={{ y: 5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -15, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "linear" }}
                      className="text-[15px] text-white/36 truncate"
                      style={{
                        fontFamily:
                          'pplxSans, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                        fontWeight: 400,
                      }}
                    >
                      {placeholders[currentPlaceholder]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
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
      </HoverBorderGradient>
    </div>
  );
}
