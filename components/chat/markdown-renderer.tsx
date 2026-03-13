"use client";

import { memo, type ComponentPropsWithoutRef } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";

import { cn } from "@/lib/utils";
import { CodeBlock } from "./code-block";
import { sanitizeStreamingMarkdown } from "./streaming-sanitizer";

import type { Options as ReactMarkdownOptions } from "react-markdown";

const remarkPlugins: ReactMarkdownOptions["remarkPlugins"] = [
  remarkGfm,
  [remarkMath, { singleDollarTextMath: false }],
];

const rehypePlugins = [rehypeHighlight, rehypeKatex];

const matterFont = "font-matter";

const proseClasses = cn(
  "prose prose-invert prose-sm max-w-none wrap-break-word",
  matterFont,
  // Paragraphs
  "[&_p]:my-2 [&_p]:leading-relaxed",
  // Lists
  "[&_ul]:my-2 [&_ul]:ml-6 [&_ul]:list-disc",
  "[&_ol]:my-2 [&_ol]:ml-6 [&_ol]:list-decimal",
  "[&_li]:my-0.5",
  // Nested lists
  "[&_ul_ul]:list-[circle] [&_ul_ul_ul]:list-[square]",
  // Task lists
  "[&_input[type=checkbox]]:mr-2 [&_input[type=checkbox]]:accent-blue-500",
  // Headings (capped at h3 visually per PRD)
  "[&_h1]:text-base [&_h1]:font-semibold [&_h1]:mt-4 [&_h1]:mb-2",
  "[&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mt-3 [&_h2]:mb-1.5",
  "[&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1.5",
  "[&_h4]:text-sm [&_h4]:font-semibold [&_h4]:mt-2 [&_h4]:mb-1",
  "[&_h5]:text-sm [&_h5]:font-medium [&_h5]:mt-2 [&_h5]:mb-1",
  "[&_h6]:text-sm [&_h6]:font-medium [&_h6]:mt-2 [&_h6]:mb-1",
  // Blockquotes
  "[&_blockquote]:border-l-4 [&_blockquote]:border-white/20 [&_blockquote]:pl-4 [&_blockquote]:my-3 [&_blockquote]:text-white/70 [&_blockquote]:italic",
  // Horizontal rules
  "[&_hr]:my-6 [&_hr]:border-white/10",
  // Links
  "[&_a]:text-blue-400 [&_a]:no-underline hover:[&_a]:underline hover:[&_a]:text-blue-300",
  // Images
  "[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-3",
  // Tables
  "[&_table]:my-3 [&_table]:w-full [&_table]:text-sm",
  "[&_thead]:border-b [&_thead]:border-white/20",
  "[&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-white/80",
  "[&_td]:px-3 [&_td]:py-2 [&_td]:text-white/70",
  "[&_tr]:border-b [&_tr]:border-white/5",
  "[&_tbody_tr:nth-child(even)]:bg-white/2",
  // Strikethrough
  "[&_del]:text-white/40",
  // Inline code (handled separately for code blocks)
  "[&_:not(pre)>code]:bg-white/10 [&_:not(pre)>code]:px-2 [&_:not(pre)>code]:py-1 [&_:not(pre)>code]:rounded-md [&_:not(pre)>code]:text-xs [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-red-400 [&_:not(pre)>code]:font-semibold",
  // Pre - hide default since we use CodeBlock
  "[&_pre]:bg-transparent [&_pre]:p-0 [&_pre]:m-0",
  // KaTeX
  "[&_.katex-display]:my-3 [&_.katex-display]:overflow-x-auto [&_.katex]:text-white/90"
);

const markdownComponents: Components = {
  code(props: ComponentPropsWithoutRef<"code">) {
    const { children, className, ...rest } = props;
    const match = /language-(\w+)/.exec(className || "");
    const isBlock = Boolean(match || className);

    if (isBlock) {
      return <CodeBlock language={match?.[1] || undefined}>{children}</CodeBlock>;
    }

    return (
      <code className={className} {...rest}>
        {children}
      </code>
    );
  },

  a(props: ComponentPropsWithoutRef<"a">) {
    const { href, children, ...rest } = props;
    if (
      href &&
      !href.startsWith("http://") &&
      !href.startsWith("https://") &&
      !href.startsWith("mailto:")
    ) {
      return <span>{children}</span>;
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  },

  table(props: ComponentPropsWithoutRef<"table">) {
    const { children, ...rest } = props;
    return (
      <div className="my-3 overflow-x-auto rounded-lg border border-white/10">
        <table {...rest}>{children}</table>
      </div>
    );
  },

  pre(props: ComponentPropsWithoutRef<"pre">) {
    const { children } = props;
    return <>{children}</>;
  },
};

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
}

export const MarkdownRenderer = memo(function MarkdownRenderer({
  content,
  isStreaming,
}: MarkdownRendererProps) {
  const processedContent = isStreaming ? sanitizeStreamingMarkdown(content) : content;

  return (
    <div className={proseClasses}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={markdownComponents}
      >
        {processedContent}
      </ReactMarkdown>
      {isStreaming && (
        <span className="inline-block w-0.75 h-[1.1em] bg-white/70 align-middle ml-0.5 animate-pulse" />
      )}
    </div>
  );
});
