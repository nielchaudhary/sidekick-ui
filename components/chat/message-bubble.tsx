"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ThumbsUp, ThumbsDown, RotateCcw, Globe, Pencil, Check, X } from "lucide-react";
import { ShimmerText } from "@/components/ui/shimmer-text";
import { CopyButton } from "@/components/ui/copy-button";
import { MarkdownRenderer } from "./markdown-renderer";
import { ActionTooltip } from "@/components/ui/action-tooltip";
import { PastedContentChip } from "./pasted-content-card";
import { PastedContentViewer } from "./pasted-content-viewer";
import { countWords, type PasteEntry } from "./pasted-content-types";

const LONG_CONTENT_WORD_THRESHOLD = 3000;

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  didWebSearch?: boolean;
}

interface MessageBubbleProps {
  message: Message;
  isLoading?: boolean;
  isStreaming?: boolean;
  isWebSearching?: boolean;
  didWebSearch?: boolean;
  onRegenerate?: () => void;
  onEditMessage?: (messageId: string, newContent: string) => void;
}

export const MessageBubble = memo(function MessageBubble({
  message,
  isLoading,
  isStreaming,
  isWebSearching,
  didWebSearch,
  onRegenerate,
  onEditMessage,
}: MessageBubbleProps) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [thinkingDuration, setThinkingDuration] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const editInputRef = useRef<HTMLInputElement>(null);
  const isUser = message.role === "user";
  const isLongContent =
    isUser && countWords(message.content) >= LONG_CONTENT_WORD_THRESHOLD;

  // Parse long content into paste entries for chip display in message bubble
  const longContentEntries: PasteEntry[] = useMemo(() => {
    if (!isLongContent) return [];
    const sections = message.content.split("\n\n---\n\n");
    const longSections = sections.filter(
      (s) => countWords(s) >= LONG_CONTENT_WORD_THRESHOLD
    );
    if (longSections.length <= 1) {
      return [
        {
          id: message.id,
          text: message.content,
          label: "Pasted content",
          wordCount: countWords(message.content),
        },
      ];
    }
    return longSections.map((s, i) => ({
      id: `${message.id}-${i}`,
      text: s,
      label: `Paste ${i + 1}`,
      wordCount: countWords(s),
    }));
  }, [isLongContent, message.content, message.id]);

  const startEditing = () => {
    setEditValue(message.content);
    setIsEditing(true);
  };

  const confirmEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== message.content && onEditMessage) {
      onEditMessage(message.id, trimmed);
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isLoading) return;

    const startTime = Date.now();

    const update = () => {
      setElapsedSeconds(Math.max(1, Math.round((Date.now() - startTime) / 1000)));
    };

    const firstTick = setTimeout(update, 0);
    const interval = setInterval(update, 1000);

    return () => {
      clearTimeout(firstTick);
      clearInterval(interval);
      setThinkingDuration(Math.max(1, Math.round((Date.now() - startTime) / 1000)));
    };
  }, [isLoading]);

  const thinkingIndicator = isLoading ? (
    <div className="flex items-center gap-2 py-1">
      <ShimmerText className="font-semibold">
        {isWebSearching
          ? `Sidekick web search active (${elapsedSeconds}s)`
          : `Sidekick is thinking . . . (${elapsedSeconds}s)`}
      </ShimmerText>
      {isWebSearching && <Globe className="size-4 text-white/50 animate-pulse" />}
    </div>
  ) : thinkingDuration !== null ? (
    <div className="flex items-center gap-2 py-1">
      <span className="font-semibold text-white/50 text-sm">
        Sidekick thought for {thinkingDuration}s{didWebSearch && " · searched the web"}
      </span>
      {didWebSearch && <Globe className="size-4 text-white/50" />}
    </div>
  ) : null;

  const webSearchIndicator = !isLoading && !thinkingDuration && didWebSearch ? (
    <div className="flex items-center gap-2 py-1">
      <Globe className="size-4 text-white/50" />
      <span className="font-semibold text-white/50 text-sm">searched the web</span>
    </div>
  ) : null;

  const renderedContent = useMemo(() => {
    if (isLoading) return null;

    if (isUser) {
      if (isLongContent) {
        return (
          <div className="flex flex-wrap gap-2">
            {longContentEntries.map((entry, i) => (
              <PastedContentChip
                key={entry.id}
                label={entry.label}
                wordCount={entry.wordCount}
                index={i}
                onOpen={() => {
                  setViewerIndex(i);
                  setViewerOpen(true);
                }}
              />
            ))}
          </div>
        );
      }
      return <p className="whitespace-pre-wrap font-matter">{message.content}</p>;
    }

    return <MarkdownRenderer content={message.content} isStreaming={isStreaming} />;
  }, [isLoading, isUser, isLongContent, isStreaming, message.content, longContentEntries]);

  return (
    <div
      className={cn(
        "flex gap-3 max-w-3xl w-full min-w-0",
        isUser ? "ml-auto justify-end" : "mr-auto justify-start"
      )}
    >
      <div
        className={cn("flex flex-col min-w-0 max-w-[85%]", isUser ? "items-end" : "items-start")}
      >
        <div
          className={cn(
            "rounded-2xl text-md leading-relaxed min-w-0 wrap-break-word overflow-hidden",
            isUser && isLongContent
              ? "px-0 py-0 text-white"
              : isUser
                ? "px-3 py-2 bg-neutral-800 text-white"
                : "px-3 py-2 text-white/90"
          )}
        >
          {thinkingIndicator}
          {webSearchIndicator}
          {isEditing ? (
            <div className="flex items-center gap-1.5">
              <input
                ref={editInputRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmEdit();
                  if (e.key === "Escape") cancelEdit();
                }}
                className="flex-1 bg-transparent text-white text-md font-matter outline-none"
              />
              <button
                type="button"
                onClick={confirmEdit}
                className="inline-flex items-center justify-center rounded-md p-1 cursor-pointer text-white/50 hover:text-white/80 transition-colors"
              >
                <Check className="size-4" />
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="inline-flex items-center justify-center rounded-md p-1 cursor-pointer text-white/50 hover:text-white/80 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            renderedContent
          )}
        </div>
        {!isLoading && !isStreaming && isUser && !isEditing && (
          <div className="flex items-center gap-0.5 mt-1">
            <ActionTooltip label="Copy">
              <CopyButton value={message.content} size="lg" />
            </ActionTooltip>
            {onEditMessage && (
              <button
                type="button"
                onClick={startEditing}
                className="inline-flex items-center justify-center rounded-md p-1 cursor-pointer transition-colors text-white/30 hover:text-white/60 hover:bg-white/10"
              >
                <Pencil className="size-4.5" />
              </button>
            )}
          </div>
        )}
        {!isLoading && !isStreaming && !isUser && (
          <div className="flex items-center gap-0.5 mt-1">
            <ActionTooltip label="Copy">
              <CopyButton value={message.content} size="lg" />
            </ActionTooltip>
            {[
              { icon: ThumbsUp, value: "up" as const, label: "Good response" },
              { icon: ThumbsDown, value: "down" as const, label: "Bad response" },
            ].map(({ icon: Icon, value, label }) => (
              <ActionTooltip key={value} label={label}>
                <button
                  type="button"
                  onClick={() => setFeedback((prev) => (prev === value ? null : value))}
                  className={cn(
                    "inline-flex items-center justify-center rounded-md p-1 cursor-pointer transition-colors",
                    feedback === value
                      ? "text-white/60"
                      : "text-white/30 hover:text-white/60 hover:bg-white/10"
                  )}
                >
                  <Icon className="size-4.5" />
                </button>
              </ActionTooltip>
            ))}
            {onRegenerate && (
              <ActionTooltip label="Regenerate">
                <button
                  type="button"
                  onClick={onRegenerate}
                  className="inline-flex items-center justify-center rounded-md p-1 cursor-pointer transition-colors text-white/30 hover:text-white/60 hover:bg-white/10"
                >
                  <RotateCcw className="size-4.5" />
                </button>
              </ActionTooltip>
            )}
          </div>
        )}
      </div>
      {isLongContent && (
        <PastedContentViewer
          entries={longContentEntries}
          initialIndex={viewerIndex}
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </div>
  );
});
