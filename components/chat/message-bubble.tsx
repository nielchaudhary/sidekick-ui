"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ThumbsUp, ThumbsDown, RotateCcw, Globe } from "lucide-react";
import { ShimmerText } from "@/components/ui/shimmer-text";
import { CopyButton } from "@/components/ui/copy-button";
import { MarkdownRenderer } from "./markdown-renderer";
import { ActionTooltip } from "@/components/ui/action-tooltip";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface MessageBubbleProps {
  message: Message;
  isLoading?: boolean;
  isStreaming?: boolean;
  isWebSearching?: boolean;
  didWebSearch?: boolean;
  onRegenerate?: () => void;
}

export const MessageBubble = memo(function MessageBubble({
  message,
  isLoading,
  isStreaming,
  isWebSearching,
  didWebSearch,
  onRegenerate,
}: MessageBubbleProps) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [thinkingDuration, setThinkingDuration] = useState<number | null>(null);
  const isUser = message.role === "user";

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

  const renderedContent = useMemo(() => {
    if (isLoading) return null;

    if (isUser) {
      return <p className="whitespace-pre-wrap font-matter">{message.content}</p>;
    }

    return <MarkdownRenderer content={message.content} isStreaming={isStreaming} />;
  }, [isLoading, isUser, isStreaming, message.content]);

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
            "rounded-2xl px-3 py-2 text-md leading-relaxed min-w-0 wrap-break-word overflow-hidden",
            isUser ? "bg-neutral-800 text-white" : "text-white/90"
          )}
        >
          {thinkingIndicator}
          {renderedContent}
        </div>
        {!isLoading && !isStreaming && isUser && (
          <div className="flex items-center gap-0.5 mt-1">
            <ActionTooltip label="Copy">
              <CopyButton value={message.content} size="lg" />
            </ActionTooltip>
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
    </div>
  );
});
