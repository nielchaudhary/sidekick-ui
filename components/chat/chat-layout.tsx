"use client";

import { useState, useCallback } from "react";
import { Sidebar, type Thread } from "./sidebar";
import { ChatArea } from "./chat-area";
import type { Message } from "./message-bubble";
import { CHAT_URL } from "@/lib/api-constants";

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

export function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messagesByThread, setMessagesByThread] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);

  const activeMessages = activeThreadId ? messagesByThread[activeThreadId] ?? [] : [];

  const createThread = useCallback((firstMessage: string) => {
    const id = generateId();
    const title = firstMessage.slice(0, 50) + (firstMessage.length > 50 ? "..." : "");
    const newThread: Thread = { id, title, updatedAt: new Date() };
    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(id);
    setMessagesByThread((prev) => ({ ...prev, [id]: [] }));
    return id;
  }, []);

  const sendText = useCallback(async (text: string) => {
    if (!text || isLoading) return;

    let threadId = activeThreadId;
    if (!threadId) {
      threadId = createThread(text);
    }

    const userMsg: Message = { id: generateId(), role: "user", content: text };
    const assistantMsgId = generateId();
    const assistantMsg: Message = { id: assistantMsgId, role: "assistant", content: "" };

    setMessagesByThread((prev) => ({
      ...prev,
      [threadId!]: [...(prev[threadId!] ?? []), userMsg, assistantMsg],
    }));
    setInput("");
    setIsLoading(true);
    setStreamingMsgId(assistantMsgId);

    try {
      const response = await fetch(`${CHAT_URL}?llmProvider=claude`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
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

          const parsed = JSON.parse(data);
          if (parsed.error) throw new Error(parsed.error);

          if (parsed.text) {
            setMessagesByThread((prev) => {
              const msgs = prev[threadId!] ?? [];
              return {
                ...prev,
                [threadId!]: msgs.map((m) =>
                  m.id === assistantMsgId
                    ? { ...m, content: m.content + parsed.text }
                    : m
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
        const msgs = prev[threadId!] ?? [];
        return {
          ...prev,
          [threadId!]: msgs.map((m) =>
            m.id === assistantMsgId
              ? { ...m, content: "Sorry, something went wrong. Please try again." }
              : m
          ),
        };
      });
    } finally {
      setStreamingMsgId(null);
      setIsLoading(false);
    }
  }, [isLoading, activeThreadId, createThread]);

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

  return (
    <div className="flex h-svh overflow-hidden bg-black">
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
      />
    </div>
  );
}
