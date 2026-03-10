"use client";

import { memo, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react";
import { ShimmerText } from "@/components/ui/shimmer-text";
import { CopyButton } from "@/components/ui/copy-button";
import { MarkdownRenderer } from "./markdown-renderer";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface MessageBubbleProps {
  message: Message;
  isLoading?: boolean;
  isStreaming?: boolean;
  onRegenerate?: () => void;
}

export const MessageBubble = memo(function MessageBubble({
  message,
  isLoading,
  isStreaming,
  onRegenerate,
}: MessageBubbleProps) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const isUser = message.role === "user";

  const renderedContent = useMemo(() => {
    if (isLoading) {
      return (
        /* use these later
"Thinking alongside you..." — matches the "think alongside someone who remembers" pillar
"Pulling from your context..." — matches the memory/retrieval identity
"Reasoning through this..." — matches the reasoning pillar
"Connecting the dots..."
        */
        <div className="flex items-center gap-2 py-1">
          <ShimmerText className="font-semibold">Sidekick is thinking . . .</ShimmerText>
        </div>
      );
    }

    if (isUser) {
      return <p className="whitespace-pre-wrap">{message.content}</p>;
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
            isUser ? "bg-white/10 text-white" : "text-white/90"
          )}
        >
          {renderedContent}
        </div>
        {!isLoading && !isStreaming && !isUser && (
          <div className="flex items-center gap-0.5 mt-1">
            <CopyButton value={message.content} size="lg" />
            {([
              { icon: ThumbsUp, value: "up" as const },
              { icon: ThumbsDown, value: "down" as const },
            ]).map(({ icon: Icon, value }) => (
              <button
                key={value}
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
            ))}
            {onRegenerate && (
              <button
                type="button"
                onClick={onRegenerate}
                className="inline-flex items-center justify-center rounded-md p-1 cursor-pointer transition-colors text-white/30 hover:text-white/60 hover:bg-white/10"
              >
                <RotateCcw className="size-4.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
