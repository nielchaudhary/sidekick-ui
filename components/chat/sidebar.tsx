"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { PanelLeftClose, PanelLeft, SquarePen, LogOut, Pencil, Check, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export interface Thread {
  id: string;
  title: string;
  updatedAt: Date;
}

interface SidebarProps {
  threads: Thread[];
  activeThreadId: string | null;
  onSelectThread: (id: string) => void;
  onNewThread: () => void;
  onRenameThread: (id: string, title: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

function groupThreads(threads: Thread[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const weekAgo = new Date(today.getTime() - 7 * 86400000);

  const groups: { label: string; threads: Thread[] }[] = [
    { label: "Recent Chats", threads: [] },
    { label: "Yesterday", threads: [] },
    { label: "Previous 7 Days", threads: [] },
    { label: "Older", threads: [] },
  ];

  for (const thread of threads) {
    const d = new Date(thread.updatedAt);
    if (d >= today) groups[0].threads.push(thread);
    else if (d >= yesterday) groups[1].threads.push(thread);
    else if (d >= weekAgo) groups[2].threads.push(thread);
    else groups[3].threads.push(thread);
  }

  return groups.filter((g) => g.threads.length > 0);
}

const sidebarButtonClass = (isOpen: boolean) =>
  cn(
    "flex items-center rounded-lg text-white hover:bg-white/10 transition-all duration-200 cursor-pointer",
    isOpen ? "w-full gap-2 px-3 py-2 text-sm" : "w-10 h-10 mx-auto justify-center"
  );

const sidebarLabelClass = (isOpen: boolean) =>
  cn(
    "transition-opacity duration-200 whitespace-nowrap",
    isOpen ? "opacity-100 delay-100" : "opacity-0 w-0 overflow-hidden"
  );

export function Sidebar({
  threads,
  activeThreadId,
  onSelectThread,
  onNewThread,
  onRenameThread,
  isOpen,
  onToggle,
}: SidebarProps) {
  const groups = useMemo(() => groupThreads(threads), [threads]);
  const supabase = createClient();
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const startEditing = (thread: Thread) => {
    setEditingId(thread.id);
    setEditValue(thread.title);
  };

  const confirmEdit = () => {
    if (editingId && editValue.trim()) {
      onRenameThread(editingId, editValue.trim());
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar — always visible on desktop as either expanded (280px) or collapsed rail (64px) */}
      <aside
        className={cn(
          "z-50 top-0 left-0 h-full flex flex-col bg-transparent border-r border-white/6 transition-all duration-200 ease-out overflow-hidden",
          // Mobile: fixed overlay, hidden when closed
          "fixed lg:relative",
          isOpen ? "w-70 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-16"
        )}
      >
        {/* Top section */}
        <div className="shrink-0 p-3">
          {/* Logo + collapse toggle */}
          <div
            className={cn(
              "flex items-center mb-4",
              isOpen ? "justify-between px-1" : "justify-center"
            )}
          >
            {isOpen ? (
              <>
                <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
                  <Image
                    src="/favicon.png"
                    alt="Sidekick"
                    width={26}
                    height={26}
                    className="size-6 shrink-0"
                  />
                  <span className="text-white text-[18px] tracking-wide opacity-100 delay-100 transition-opacity duration-200 font-matter font-semibold -ml-1">
                    sidekick
                  </span>
                </div>
                <button
                  onClick={onToggle}
                  className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer shrink-0"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={onToggle}
                className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <PanelLeft className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* New thread button */}
          <button onClick={onNewThread} className={cn(sidebarButtonClass(isOpen), "group/new")}>
            <SquarePen className="w-4 h-4 shrink-0" />
            <span className={sidebarLabelClass(isOpen)}>
              <span className="font-matter">New Thread</span>
            </span>
            {isOpen && (
              <span className="opacity-0 group-hover/new:opacity-100 transition-opacity duration-150 text-[11px] font-semibold text-white/30 font-matter tracking-wide ml-auto">
                ⌘ ⌥ O
              </span>
            )}
          </button>
        </div>

        <div className={cn("h-2", isOpen ? "" : "hidden")} />

        {/* Thread list — only visible when expanded */}
        <div
          className={cn(
            "flex-1 overflow-y-auto scrollbar-hide px-2 pb-2 transition-opacity duration-200",
            isOpen ? "opacity-100 delay-100" : "opacity-0 pointer-events-none"
          )}
        >
          {groups.map((group) => (
            <div key={group.label} className="mb-3 flex flex-col gap-0.5">
              <p className="text-[11px] font-medium text-white/30 uppercase tracking-wider px-2 mb-1 font-matter">
                {group.label}
              </p>
              {group.threads.map((thread) =>
                editingId === thread.id ? (
                  <div
                    key={thread.id}
                    className="flex items-center gap-1 px-1 py-1"
                  >
                    <input
                      ref={editInputRef}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") confirmEdit();
                        if (e.key === "Escape") cancelEdit();
                      }}
                      onBlur={confirmEdit}
                      className="flex-1 min-w-0 bg-white/10 text-white text-sm px-2 py-1.5 rounded-lg outline-none font-matter"
                    />
                    <button
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={confirmEdit}
                      className="p-1 rounded text-white/50 hover:text-white hover:bg-white/10 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={cancelEdit}
                      className="p-1 rounded text-white/50 hover:text-white hover:bg-white/10 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div
                    key={thread.id}
                    className={cn(
                      "group/thread flex items-center rounded-lg transition-colors duration-150",
                      activeThreadId === thread.id
                        ? "bg-white/10 text-white"
                        : "text-white hover:bg-white/10"
                    )}
                  >
                    <button
                      onClick={() => onSelectThread(thread.id)}
                      className="flex-1 min-w-0 text-left px-3 py-2 text-sm truncate cursor-pointer font-matter"
                    >
                      {thread.title}
                    </button>
                    <button
                      onClick={() => startEditing(thread)}
                      className="opacity-0 group-hover/thread:opacity-100 p-1.5 mr-1 rounded text-white/40 hover:text-white hover:bg-white/10 cursor-pointer transition-opacity duration-150"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                  </div>
                )
              )}
            </div>
          ))}
        </div>

        {/* Bottom section: expand toggle (collapsed) + logout */}
        <div className="shrink-0">
          {/* Logout */}
          <div className={cn("p-2", isOpen && "px-3 py-3")}>
            <button onClick={handleLogout} className={sidebarButtonClass(isOpen)}>
              <LogOut className="w-4 h-4 shrink-0" />
              <span className={sidebarLabelClass(isOpen)}>
                <span className="font-matter">Log out</span>
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
