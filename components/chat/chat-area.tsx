"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageBubble, type Message } from "./message-bubble";
import { ChatInput } from "./chat-input";

interface ChatAreaProps {
  messages: Message[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  streamingMsgId: string | null;
}

export function ChatArea({
  messages,
  input,
  onInputChange,
  onSend,
  isLoading,
  streamingMsgId,
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
        background: "radial-gradient(125% 125% at 50% 10%, #000000 40%, #2b0707 100%)",
      }}
    >
      {isEmpty ? (
        /* Empty state: vertically centered input */
        <div className="flex-1 flex flex-col items-center justify-center px-4">
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
