"use client";

import { memo, useMemo } from "react";
import { cn } from "@/lib/utils";
import { BarsSpinner } from "@/components/ui/bars-spinner";
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
}

export const MessageBubble = memo(function MessageBubble({
  message,
  isLoading,
  isStreaming,
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  const renderedContent = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2 py-1">
          <BarsSpinner size={22} color="rgba(255,255,255,0.5)" />
        </div>
      );
    }

    if (isUser) {
      return <p className="whitespace-pre-wrap">{message.content}</p>;
    }

    return (
      <MarkdownRenderer
        content={message.content}
        isStreaming={isStreaming}
      />
    );
  }, [isLoading, isUser, isStreaming, message.content]);

  return (
    <div
      className={cn(
        "flex gap-3 max-w-3xl w-full min-w-0",
        isUser ? "ml-auto justify-end" : "mr-auto justify-start"
      )}
    >
      <div
        className={cn(
          "flex flex-col min-w-0 max-w-[85%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-3 py-2 text-md leading-relaxed min-w-0 wrap-break-word overflow-hidden",
            isUser ? "bg-white/10 text-white" : "text-white/90"
          )}
        >
          {renderedContent}
        </div>
        {!isLoading && !isStreaming && (
          <CopyButton value={message.content} size="lg" className="mt-1" />
        )}
      </div>
    </div>
  );
});
