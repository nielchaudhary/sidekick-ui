"use client";

import { memo, useMemo } from "react";
import { cn } from "@/lib/utils";
import { BarsSpinner } from "@/components/ui/bars-spinner";
import { CopyButton } from "@/components/ui/copy-button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

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

const remarkPlugins = [remarkGfm];
const rehypePlugins = [rehypeHighlight];

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

    // During streaming, render plain text for performance; parse markdown only when done
    if (isStreaming) {
      return (
        <div className="prose prose-invert prose-sm max-w-none wrap-break-word [&_pre]:bg-white/5 [&_pre]:border [&_pre]:border-white/10 [&_pre]:rounded-lg [&_pre]:p-3 [&_pre]:overflow-x-auto [&_code]:text-xs [&_p]:my-2 [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-0.5 [&_a]:text-blue-400 [&_a]:no-underline hover:[&_a]:underline [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_table]:overflow-x-auto [&_img]:max-w-full [&_img]:h-auto">
          <p className="whitespace-pre-wrap">{message.content}<span className="inline-block w-0.75 h-[1.1em] bg-white/70 align-middle ml-0.5 animate-pulse" /></p>
        </div>
      );
    }

    return (
      <div className="prose prose-invert prose-sm max-w-none wrap-break-word [&_pre]:bg-white/5 [&_pre]:border [&_pre]:border-white/10 [&_pre]:rounded-lg [&_pre]:p-3 [&_pre]:overflow-x-auto [&_code]:text-xs [&_p]:my-2 [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-0.5 [&_a]:text-blue-400 [&_a]:no-underline hover:[&_a]:underline [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_table]:overflow-x-auto [&_img]:max-w-full [&_img]:h-auto">
        <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
          {message.content}
        </ReactMarkdown>
      </div>
    );
  }, [isLoading, isUser, isStreaming, message.content]);

  return (
    <div
      className={cn(
        "flex gap-3 max-w-3xl w-full min-w-0",
        isUser ? "ml-auto justify-end" : "mr-auto justify-start"
      )}
    >
      <div className={cn("flex flex-col min-w-0 max-w-[85%]", isUser ? "items-end" : "items-start")}>
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
