"use client";

import { useState, useCallback, useEffect } from "react";
import { Sidebar, type Thread } from "./sidebar";
import { ChatArea } from "./chat-area";
import type { Message } from "./message-bubble";
import { CHAT_URL } from "@/lib/api-constants";

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

const SYSTEM_PROMPT = `Format all responses using GitHub-Flavored Markdown.

Rules:
- Use fenced code blocks with language identifiers (e.g. \`\`\`python).
- Use headings (##, ###) to structure sections.
- Use bullet lists for explanations and numbered lists for steps.
- Use inline code for variables, functions, and commands.
- Use tables where comparison is helpful.
- Use blockquotes for important notes or callouts.
- Maintain proper blank lines between paragraphs and sections.
- Use bold and italic for emphasis where appropriate.
- Never output plain text blocks when Markdown formatting would improve readability.`;

export function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messagesByThread, setMessagesByThread] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState("");
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);
  const [isWebSearching, setIsWebSearching] = useState(false);
  const [didWebSearch, setDidWebSearch] = useState(false);
  const isLoading = streamingMsgId !== null;

  const activeMessages = activeThreadId ? (messagesByThread[activeThreadId] ?? []) : [];

  const createThread = useCallback((firstMessage: string) => {
    const id = generateId();
    const title = firstMessage.slice(0, 50) + (firstMessage.length > 50 ? "..." : "");
    const newThread: Thread = { id, title, updatedAt: new Date() };
    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(id);
    setMessagesByThread((prev) => ({ ...prev, [id]: [] }));
    return id;
  }, []);

  const sendText = useCallback(
    async (text: string) => {
      if (!text || isLoading) return;

      const threadId = activeThreadId ?? createThread(text);

      const userMsg: Message = { id: generateId(), role: "user", content: text };
      const assistantMsgId = generateId();
      const assistantMsg: Message = { id: assistantMsgId, role: "assistant", content: "" };

      setMessagesByThread((prev) => ({
        ...prev,
        [threadId]: [...(prev[threadId] ?? []), userMsg, assistantMsg],
      }));
      setInput("");
      setStreamingMsgId(assistantMsgId);
      setIsWebSearching(false);
      setDidWebSearch(false);

      try {
        const response = await fetch(`${CHAT_URL}?llmProvider=claude`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: text, systemPrompt: SYSTEM_PROMPT }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data: ")) continue;

            const data = trimmed.slice(6);
            if (data === "[DONE]") continue;

            let parsed: { type?: string; status?: string; text?: string; error?: string };
            try {
              parsed = JSON.parse(data);
            } catch {
              continue;
            }
            if (parsed.error) throw new Error(parsed.error);

            if (parsed.type === "status" && parsed.status === "web_search_active") {
              setIsWebSearching(true);
              setDidWebSearch(true);
              setMessagesByThread((prev) => {
                const msgs = prev[threadId] ?? [];
                return {
                  ...prev,
                  [threadId]: msgs.map((m) =>
                    m.id === assistantMsgId ? { ...m, didWebSearch: true } : m
                  ),
                };
              });
            }

            if (parsed.text) {
              setIsWebSearching(false);
              setMessagesByThread((prev) => {
                const msgs = prev[threadId] ?? [];
                return {
                  ...prev,
                  [threadId]: msgs.map((m) =>
                    m.id === assistantMsgId ? { ...m, content: m.content + parsed.text } : m
                  ),
                };
              });
            }
          }
        }

        setThreads((prev) =>
          prev.map((t) => (t.id === threadId ? { ...t, updatedAt: new Date() } : t))
        );
      } catch (error) {
        setMessagesByThread((prev) => {
          const msgs = prev[threadId] ?? [];
          return {
            ...prev,
            [threadId]: msgs.map((m) =>
              m.id === assistantMsgId
                ? { ...m, content: "Sorry, something went wrong. Please try again." }
                : m
            ),
          };
        });
      } finally {
        setStreamingMsgId(null);
      }
    },
    [streamingMsgId, activeThreadId, createThread]
  );

  const handleSend = useCallback(() => {
    sendText(input.trim());
  }, [input, sendText]);

  const handleNewThread = useCallback(() => {
    setActiveThreadId(null);
    setInput("");
  }, []);

  const handleSelectThread = useCallback((id: string) => {
    setActiveThreadId(id);
    setInput("");
  }, []);

  // Global ⌘+N shortcut for new thread
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.altKey && e.code === "KeyO") {
        e.preventDefault();
        handleNewThread();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNewThread]);

  return (
    <div className="flex h-svh overflow-hidden" style={{ background: "radial-gradient(125% 125% at 50% 10%, #000000 40%, #2b0707 100%)" }}>
      <Sidebar
        threads={threads}
        activeThreadId={activeThreadId}
        onSelectThread={handleSelectThread}
        onNewThread={handleNewThread}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <ChatArea
        messages={activeMessages}
        input={input}
        onInputChange={setInput}
        onSend={handleSend}
        isLoading={isLoading}
        streamingMsgId={streamingMsgId}
        isWebSearching={isWebSearching}
        didWebSearch={didWebSearch}
      />
    </div>
  );
}
