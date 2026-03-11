"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageBubble, type Message } from "./message-bubble";
import { ChatInput } from "./chat-input";
import { FONTS } from "@/lib/theme";

interface ChatAreaProps {
  messages: Message[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  streamingMsgId: string | null;
  isWebSearching?: boolean;
  didWebSearch?: boolean;
}

export function ChatArea({
  messages,
  input,
  onInputChange,
  onSend,
  isLoading,
  streamingMsgId,
  isWebSearching,
  didWebSearch,
}: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isEmpty = messages.length === 0;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div
      className="flex-1 flex flex-col min-w-0 h-full overflow-x-hidden relative"
      style={{
        background: "transparent",
      }}
    >
      {isEmpty ? (
        /* Empty state: hero heading + vertically centered input */
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <h1
            className="text-[26px] sm:text-[28px] md:text-[28px] tracking-[0.012em] leading-[1.15] text-center mb-3 select-none"
            style={{
              fontFamily: "Matter",
              fontWeight: 400,
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.6)" }}>
              your thinking partner, powered by your context
            </span>
          </h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full"
          >
            <ChatInput
              value={input}
              onChange={onInputChange}
              onSend={onSend}
              isStreaming={isLoading}
            />
          </motion.div>
        </div>
      ) : (
        <>
          {/* Messages area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
            <div className="max-w-3xl mx-auto w-full px-4 py-6 space-y-5">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isStreaming={msg.id === streamingMsgId}
                  isLoading={msg.id === streamingMsgId && msg.content === ""}
                  isWebSearching={msg.id === streamingMsgId ? isWebSearching : undefined}
                  didWebSearch={msg.didWebSearch ?? (msg.id === streamingMsgId ? didWebSearch : undefined)}
                />
              ))}
            </div>
          </div>

          {/* Input bar */}
          <ChatInput
            value={input}
            onChange={onInputChange}
            onSend={onSend}
            isStreaming={isLoading}
          />
        </>
      )}
    </div>
  );
}
