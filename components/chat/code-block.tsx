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
    <div className="group relative my-3 max-w-full overflow-hidden rounded-lg border border-white/10">
      <div className="flex items-center justify-between bg-white/5 px-4 py-2 text-xs text-white/50">
        <span>{displayLanguage}</span>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors",
            "text-white/40 hover:bg-white/10 hover:text-white/70",
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
        <pre className="bg-white/3 p-5 text-sm leading-relaxed">
          <code className={cn("font-mono text-white/90", language)}>
            {children}
          </code>
        </pre>
      </div>
    </div>
  );
});
