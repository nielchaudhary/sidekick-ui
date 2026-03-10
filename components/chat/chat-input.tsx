"use client";

import { cn } from "@/lib/utils";
import { ArrowUp, Mic, Square } from "lucide-react";
import { useRef, useEffect, useState, useCallback, KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AIVoiceInput } from "./ai-voice-input";
import { ChatInputPlusMenu } from "./chat-input-plus-menu";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

const placeholders = [
  "What's on my calendar today?",
  "Search through your memories and past chats",
  "Find insights across your files and documents",
  "Summarize notes, draft content, or brainstorm ideas",
  "Ask anything… research, code, or think with AI",
];

type SearchMode = "github" | "reddit" | "x";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onStop?: () => void;
  onFilesSelected?: (files: File[]) => void;
  searchModes?: Set<SearchMode>;
  onSearchModesChange?: (modes: Set<SearchMode>) => void;
  isStreaming?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  onStop,
  onFilesSelected,
  searchModes: controlledSearchModes,
  onSearchModesChange: controlledOnSearchModesChange,
  isStreaming,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [voiceMode, setVoiceMode] = useState(false);
  const voiceHasStartedRef = useRef(false);
  const isComposingRef = useRef(false);

  // Internal state for search modes when uncontrolled
  const [internalSearchModes, setInternalSearchModes] = useState<Set<SearchMode>>(new Set());
  const searchModes = controlledSearchModes ?? internalSearchModes;
  const handleSearchModesChange = controlledOnSearchModesChange ?? setInternalSearchModes;
  const handleFilesSelected = onFilesSelected ?? (() => {});

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

  // Auto-resize textarea
  const MIN_HEIGHT = 56;
  const MAX_HEIGHT = 200;
  const MOBILE_MAX_HEIGHT = 160;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = `${MIN_HEIGHT}px`;
    const isMobile = window.innerWidth < 768;
    const maxH = isMobile ? MOBILE_MAX_HEIGHT : MAX_HEIGHT;
    const newHeight = Math.max(MIN_HEIGHT, Math.min(textarea.scrollHeight, maxH));
    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxH ? "auto" : "hidden";
  }, [value]);

  // IME composition handling
  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = () => {
    isComposingRef.current = false;
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (isComposingRef.current) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isStreaming) {
        onSend();
      }
    }
    if (e.key === "Escape") {
      textareaRef.current?.blur();
    }
  };

  // Auto-focus on alphanumeric keypress (desktop QoL)
  useEffect(() => {
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      if (window.innerWidth < 768) return;
      if (document.activeElement === textareaRef.current) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      )
        return;
      if (e.key.length === 1 && /^[a-zA-Z0-9]$/.test(e.key)) {
        textareaRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  const canSend = value.trim().length > 0 && !isStreaming;
  const showMic = !value.trim() && !isStreaming;

  const handleVoiceStart = useCallback(() => {
    voiceHasStartedRef.current = true;
  }, []);

  const handleVoiceStop = useCallback(() => {
    if (!voiceHasStartedRef.current) return;
    voiceHasStartedRef.current = false;
    setVoiceMode(false);
  }, []);

  const handleSendClick = () => {
    if (isStreaming && onStop) {
      onStop();
    } else if (canSend) {
      onSend();
    }
  };

  return (
    <div className="backdrop-blur-sm px-4 md:px-0 py-3">
      <HoverBorderGradient
        as="div"
        containerClassName={cn(
          "max-w-3xl mx-auto rounded-2xl border-none w-full md:w-[90%]",
          voiceMode ? "bg-transparent" : "bg-black"
        )}
        className="w-full relative rounded-2xl bg-black px-0 py-0"
      >
        <div ref={containerRef} className="relative w-full" style={{ minHeight: `${MIN_HEIGHT}px` }}>
          {voiceMode ? (
            <AIVoiceInput autoStart onStart={handleVoiceStart} onStop={handleVoiceStop} />
          ) : (
            <>
              {/* Text area zone */}
              <div className="relative w-full">
                <textarea
                  id="chat-input"
                  name="chat-input"
                  ref={textareaRef}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onCompositionStart={handleCompositionStart}
                  onCompositionEnd={handleCompositionEnd}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  aria-label="Chat message input"
                  rows={1}
                  className="w-full resize-none bg-transparent text-[15px] text-white focus:outline-none scrollbar-hide relative z-10"
                  style={{
                    fontFamily:
                      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                    fontWeight: 400,
                    lineHeight: "1.5",
                    paddingTop: "14px",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    paddingBottom: "50px",
                    minHeight: `${MIN_HEIGHT}px`,
                    boxSizing: "border-box",
                  }}
                />
                {/* Animated placeholder */}
                <div className="absolute top-[14px] left-[16px] right-[16px] pointer-events-none overflow-hidden z-0">
                  <AnimatePresence mode="wait">
                    {!value && !isFocused && (
                      <motion.p
                        key={`placeholder-${currentPlaceholder}`}
                        initial={{ y: 5, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -15, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "linear" }}
                        className="text-[15px] text-[#9CA3AF] truncate"
                        style={{
                          fontFamily:
                            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                          fontWeight: 500,
                          lineHeight: "1.5",
                        }}
                      >
                        {placeholders[currentPlaceholder]}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Action bar - pinned to bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-[48px] flex items-center justify-between px-3 z-20">
                {/* Left: attachment menu */}
                <div className="text-white/60">
                  <ChatInputPlusMenu
                    onFilesSelected={handleFilesSelected}
                    searchModes={searchModes}
                    onSearchModesChange={handleSearchModesChange}
                  />
                </div>

                {/* Right: mic & send */}
                <div className="flex items-center gap-1.5">
                  <AnimatePresence mode="wait" initial={false}>
                    {showMic ? (
                      <motion.button
                        key="mic"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        onClick={() => setVoiceMode(true)}
                        aria-label="Start voice recording"
                        className="size-9 rounded-full flex items-center justify-center transition-colors duration-150 bg-white/10 text-white/50 hover:bg-white/20 hover:text-white/80 cursor-pointer"
                      >
                        <Mic className="size-[18px]" />
                      </motion.button>
                    ) : (
                      <motion.button
                        key="send"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        onClick={handleSendClick}
                        disabled={!canSend && !isStreaming}
                        aria-label={isStreaming ? "Stop response" : "Send message"}
                        className={cn(
                          "size-9 rounded-full flex items-center justify-center transition-colors duration-150 cursor-pointer",
                          isStreaming
                            ? "bg-white/20 text-white/70 hover:bg-red-500/80 hover:text-white"
                            : canSend
                              ? "bg-white text-black hover:bg-white/90"
                              : "bg-white/10 text-white/20"
                        )}
                      >
                        {isStreaming ? (
                          <Square className="size-3.5" fill="currentColor" />
                        ) : (
                          <ArrowUp className="size-[18px]" strokeWidth={2.5} />
                        )}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </>
          )}
        </div>
      </HoverBorderGradient>
    </div>
  );
}
