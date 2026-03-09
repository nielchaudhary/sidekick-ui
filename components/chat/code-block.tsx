"use client";

import { useState, memo, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Recursively extract plain text from React children.
 * Handles the highlighted spans that rehype-highlight produces.
 */
function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && "props" in node) {
    const element = node as React.ReactElement<{ children?: ReactNode }>;
    return extractText(element.props.children);
  }
  return "";
}

interface CodeBlockProps {
  children: ReactNode;
  language?: string;
}

export const CodeBlock = memo(function CodeBlock({
  children,
  language,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = extractText(children);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayLanguage = language?.replace(/^language-/, "") || "text";

  return (
    <div className="group relative my-5 max-w-full overflow-hidden rounded-lg border border-white/8 bg-white/3">
      <div className="flex items-center justify-between border-b border-white/6 bg-white/4 px-4 py-2.5">
        <span className="text-xs font-medium tracking-wide text-white/40 uppercase">
          {displayLanguage}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-all duration-150",
            "text-white/40 hover:bg-white/8 hover:text-white/70",
            "cursor-pointer"
          )}
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="size-3.5" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto">
        <pre className="px-5 py-4 text-[13px] leading-[1.7]">
          <code className={cn("font-mono text-white/85", language)}>
            {children}
          </code>
        </pre>
      </div>
    </div>
  );
});
