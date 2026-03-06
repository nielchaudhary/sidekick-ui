"use client";

import { cn } from "@/lib/utils";
import { BarsSpinner } from "@/components/ui/bars-spinner";
import { CopyButton } from "@/components/ui/copy-button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { motion } from "framer-motion";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface MessageBubbleProps {
  message: Message;
  isLoading?: boolean;
}

export function MessageBubble({ message, isLoading }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex gap-3 max-w-3xl w-full min-w-0",
        isUser ? "ml-auto justify-end" : "mr-auto justify-start"
      )}
    >
      <div className={cn("flex flex-col min-w-0 max-w-[85%]", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-3 py-2 text-md leading-relaxed min-w-0 wrap-break-word overflow-hidden",
            isUser ? "bg-white/10 text-white" : "text-white/90"
          )}
        >
          {isLoading ? (
            <div className="flex items-center gap-2 py-1">
              <BarsSpinner size={22} color="rgba(255,255,255,0.5)" />
            </div>
          ) : isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <>
              <div className="prose prose-invert prose-sm max-w-none wrap-break-word [&_pre]:bg-white/5 [&_pre]:border [&_pre]:border-white/10 [&_pre]:rounded-lg [&_pre]:p-3 [&_pre]:overflow-x-auto [&_code]:text-xs [&_p]:my-2 [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-0.5 [&_a]:text-blue-400 [&_a]:no-underline hover:[&_a]:underline [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_table]:overflow-x-auto [&_img]:max-w-full [&_img]:h-auto">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                  {message.content}
                </ReactMarkdown>
              </div>
              <CopyButton value={message.content} size="lg" className="mt-1" />
            </>
          )}
        </div>
        {!isLoading && isUser && (
          <CopyButton value={message.content} size="lg" className="mt-1" />
        )}
      </div>
    </motion.div>
  );
}
