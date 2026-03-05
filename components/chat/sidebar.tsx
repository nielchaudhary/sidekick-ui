"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { PanelLeftClose, PanelLeft, SquarePen, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

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
  isOpen: boolean;
  onToggle: () => void;
}

function groupThreads(threads: Thread[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const weekAgo = new Date(today.getTime() - 7 * 86400000);

  const groups: { label: string; threads: Thread[] }[] = [
    { label: "Today", threads: [] },
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

export function Sidebar({
  threads,
  activeThreadId,
  onSelectThread,
  onNewThread,
  isOpen,
  onToggle,
}: SidebarProps) {
  const supabase = createClient();
  const router = useRouter();

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
          "z-50 top-0 left-0 h-full flex flex-col bg-black/80 backdrop-blur-md border-r border-white/6 transition-all duration-200 ease-out overflow-hidden",
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
                <div className="flex items-center gap-1 overflow-hidden whitespace-nowrap">
                  <Image
                    src="/favicon.png"
                    alt="Sidekick"
                    width={34}
                    height={34}
                    className="shrink-0"
                  />
                  <span className="text-white font-semibold text-base tracking-tight opacity-100 delay-100 transition-opacity duration-200">
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
              <button onClick={onToggle} className="group/logo relative w-7.5 h-7.5 cursor-pointer">
                <Image
                  src="/favicon.png"
                  alt="Sidekick"
                  width={30}
                  height={30}
                  className="transition-opacity duration-150 group-hover/logo:opacity-0"
                />
                <PanelLeft className="w-5 h-5 text-white/50 group-hover/logo:text-white absolute inset-0 m-auto opacity-0 group-hover/logo:opacity-100 transition-all duration-150" />
              </button>
            )}
          </div>

          {/* New thread button */}
          <button
            onClick={onNewThread}
            className={cn(
              "flex items-center rounded-lg  text-white/70 hover:text-white hover:bg-white/5  transition-all duration-200 cursor-pointer",
              isOpen ? "w-full gap-2 px-3 py-2 text-sm" : "w-10 h-10 mx-auto justify-center"
            )}
          >
            <SquarePen className="w-4 h-4 shrink-0" />
            <span
              className={cn(
                "transition-opacity duration-200 whitespace-nowrap",
                isOpen ? "opacity-100 delay-100" : "opacity-0 w-0 overflow-hidden"
              )}
            >
              New Thread
            </span>
          </button>
        </div>

        {/* Thread list — only visible when expanded */}
        <div
          className={cn(
            "flex-1 overflow-y-auto scrollbar-hide px-2 pb-2 transition-opacity duration-200",
            isOpen ? "opacity-100 delay-100" : "opacity-0 pointer-events-none"
          )}
        >
          {groupThreads(threads).map((group) => (
            <div key={group.label} className="mb-3">
              <p className="text-[11px] font-medium text-white/30 uppercase tracking-wider px-2 mb-1">
                {group.label}
              </p>
              {group.threads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => onSelectThread(thread.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm truncate transition-colors duration-150 cursor-pointer",
                    activeThreadId === thread.id
                      ? "bg-white/10 text-white"
                      : "text-white/50 hover:text-white/80 hover:bg-white/4"
                  )}
                >
                  {thread.title}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom section: expand toggle (collapsed) + logout */}
        <div className="shrink-0 border-t border-white/6">
          {/* Logout */}
          <div className={cn("p-2", isOpen && "px-3 py-3")}>
            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors cursor-pointer",
                isOpen ? "w-full gap-2 px-3 py-2 text-sm" : "w-10 h-10 mx-auto justify-center"
              )}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span
                className={cn(
                  "transition-opacity duration-200 whitespace-nowrap",
                  isOpen ? "opacity-100 delay-100" : "opacity-0 w-0 overflow-hidden"
                )}
              >
                Log out
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
