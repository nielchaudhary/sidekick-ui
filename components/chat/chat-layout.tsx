"use client";

import { useState, useCallback } from "react";
import { Sidebar, type Thread } from "./sidebar";
import { ChatArea } from "./chat-area";
import type { Message } from "./message-bubble";

// Simulated response — replace with real AI integration later
async function simulateResponse(userMessage: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return `This is a simulated response to: "${userMessage}"\n\nHere's some **markdown** to demonstrate rendering:\n\n- Item one\n- Item two\n- Item three\n\n\`\`\`typescript\nconst greeting = "Hello from Sidekick!";\nconsole.log(greeting);\n\`\`\``;
}

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
    setMessagesByThread((prev) => ({
      ...prev,
      [threadId!]: [...(prev[threadId!] ?? []), userMsg],
    }));
    setInput("");
    setIsLoading(true);

    try {
      const response = await simulateResponse(text);
      const assistantMsg: Message = { id: generateId(), role: "assistant", content: response };
      setMessagesByThread((prev) => ({
        ...prev,
        [threadId!]: [...(prev[threadId!] ?? []), assistantMsg],
      }));
      setThreads((prev) =>
        prev.map((t) => (t.id === threadId ? { ...t, updatedAt: new Date() } : t))
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, activeThreadId, createThread]);

  const handleSend = useCallback(() => {
    sendText(input.trim());
  }, [input, sendText]);

  const handleSendMessage = useCallback((text: string) => {
    sendText(text.trim());
  }, [sendText]);

  const handleNewThread = useCallback(() => {
    setActiveThreadId(null);
    setInput("");
  }, []);

  const handleSelectThread = useCallback((id: string) => {
    setActiveThreadId(id);
    setInput("");
  }, []);

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
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}
