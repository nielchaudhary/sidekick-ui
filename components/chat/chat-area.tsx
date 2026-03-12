"use client";

import { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageBubble, type Message } from "./message-bubble";
import { ChatInput } from "./chat-input";
import { PastedContentChip } from "./pasted-content-card";
import { PastedContentViewer } from "./pasted-content-viewer";
import type { PasteEntry } from "./pasted-content-types";

interface ChatAreaProps {
  messages: Message[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  streamingMsgId: string | null;
  isWebSearching?: boolean;
  didWebSearch?: boolean;
  onEditMessage?: (messageId: string, newContent: string) => void;
  pastedContents: PasteEntry[];
  onLongContent: (content: string) => void;
  onDiscardPaste: (id: string) => void;
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
  onEditMessage,
  pastedContents,
  onLongContent,
  onDiscardPaste,
}: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isEmpty = messages.length === 0;
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const hasPastes = pastedContents.length > 0;

  const chipShelf = hasPastes ? (
    <div className="max-w-3xl mx-auto w-full md:w-[90%] px-4 md:px-0">
      <div className="flex flex-nowrap md:flex-wrap gap-2 py-2 overflow-x-auto md:overflow-x-visible scrollbar-hide">
        <AnimatePresence mode="popLayout">
          {pastedContents.map((entry, i) => (
            <PastedContentChip
              key={entry.id}
              label={pastedContents.length === 1 ? "Pasted content" : entry.label}
              wordCount={entry.wordCount}
              index={i}
              onOpen={() => {
                setViewerIndex(i);
                setViewerOpen(true);
              }}
              onDiscard={() => onDiscardPaste(entry.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  ) : null;

  return (
    <div
      className="flex-1 flex flex-col min-w-0 h-full overflow-x-hidden relative"
      style={{ background: "transparent" }}
    >
      {isEmpty ? (
        /* Empty state: hero heading + vertically centered input */
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <h1
            className="text-[26px] sm:text-[28px] md:text-[28px] tracking-[0.012em] leading-[1.15] text-center mb-3 select-none"
            style={{ fontFamily: "Matter", fontWeight: 400 }}
          >
            <span style={{ color: "rgba(255,255,255,0.8)" }}>
              your thinking partner, powered by your context
            </span>
          </h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full"
          >
            {chipShelf}
            <ChatInput
              value={input}
              onChange={onInputChange}
              onSend={onSend}
              onLongContent={onLongContent}
              isStreaming={isLoading}
              hasPastedContent={hasPastes}
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
                  didWebSearch={
                    msg.didWebSearch ?? (msg.id === streamingMsgId ? didWebSearch : undefined)
                  }
                  onEditMessage={msg.role === "user" ? onEditMessage : undefined}
                />
              ))}
            </div>
          </div>

          {/* Chip shelf + Input bar */}
          {chipShelf}
          <ChatInput
            value={input}
            onChange={onInputChange}
            onSend={onSend}
            onLongContent={onLongContent}
            isStreaming={isLoading}
            hasPastedContent={hasPastes}
          />
        </>
      )}

      {/* Pasted content viewer overlay */}
      {hasPastes && (
        <PastedContentViewer
          entries={pastedContents}
          initialIndex={viewerIndex}
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </div>
  );
}
