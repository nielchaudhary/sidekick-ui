"use client";

import { useRef, useState, useEffect } from "react";
import { Plus, Paperclip, Github, Twitter } from "lucide-react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";

import type { SearchMode } from "./chat-input";

function RedditIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="14" r="7" />
      <circle cx="9" cy="12.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12.5" r="1" fill="currentColor" stroke="none" />
      <path d="M9.5 16.5c1 1 4 1 5 0" />
      <path d="M19 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M14 3l3.5 3" />
    </svg>
  );
}

const itemClass =
  "px-3 py-2 rounded-lg text-sm text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer relative flex items-center gap-1.5 outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0";

const checkboxItemClass =
  "px-3 py-2 pr-8 rounded-lg text-sm text-white hover:bg-white/10 focus:bg-white/10 data-[state=checked]:bg-white/10 cursor-pointer relative flex items-center gap-1.5 outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0";

const contentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -4,
    transition: { duration: 0.12, ease: [0.4, 0, 1, 1] as const },
  },
};

interface ChatInputPlusMenuProps {
  onFilesSelected: (files: File[]) => void;
  searchModes: Set<SearchMode>;
  onSearchModesChange: (modes: Set<SearchMode>) => void;
}

export function ChatInputPlusMenu({
  onFilesSelected,
  searchModes,
  onSearchModesChange,
}: ChatInputPlusMenuProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFilesSelected(Array.from(files));
    }
    e.target.value = "";
  };

  const toggleSearchMode = (mode: SearchMode) => {
    const next = new Set(searchModes);
    if (next.has(mode)) {
      next.delete(mode);
    } else {
      next.add(mode);
    }
    onSearchModesChange(next);
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.webp"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
      {mounted ? (
        <DropdownMenuPrimitive.Root open={open} onOpenChange={setOpen}>
          <DropdownMenuPrimitive.Trigger asChild>
            <button
              className="size-8 rounded-full flex items-center justify-center bg-transparent hover:bg-white/10 text-white/60 hover:text-white transition-all duration-150 cursor-pointer focus:outline-none"
            >
              <Plus
                className="size-4.5 transition-transform duration-200 ease-out"
                style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
                strokeWidth={2}
              />
            </button>
          </DropdownMenuPrimitive.Trigger>

          <AnimatePresence>
            {open && (
              <DropdownMenuPrimitive.Portal forceMount>
                <DropdownMenuPrimitive.Content
                  align="start"
                  sideOffset={6}
                  asChild
                  onCloseAutoFocus={(e) => e.preventDefault()}
                >
                  <motion.div
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="w-64 rounded-lg p-1 shadow-md z-50 bg-black/80 backdrop-blur-md border border-white/6 origin-(--radix-dropdown-menu-content-transform-origin)"
                  >
                    <DropdownMenuPrimitive.Group>
                      <DropdownMenuPrimitive.Label className="text-[11px] text-white/30 uppercase tracking-wider px-3 py-1 font-medium">
                        Attach
                      </DropdownMenuPrimitive.Label>
                      <DropdownMenuPrimitive.Item
                        onSelect={() => fileInputRef.current?.click()}
                        className={itemClass}
                      >
                        <Paperclip className="size-4" />
                        Add PDFs or Images
                      </DropdownMenuPrimitive.Item>
                    </DropdownMenuPrimitive.Group>

                    <DropdownMenuPrimitive.Separator className="bg-white/6 -mx-1 my-1 h-px" />

                    <DropdownMenuPrimitive.Group>
                      <DropdownMenuPrimitive.Label className="text-[11px] text-white/30 uppercase tracking-wider px-3 py-1 font-medium">
                        Search modes
                      </DropdownMenuPrimitive.Label>
                      {([
                        { mode: "github" as const, icon: <Github className="size-4 text-foreground" />, label: "GitHub" },
                        { mode: "reddit" as const, icon: <RedditIcon className="size-4 text-[#FF4500]" />, label: "Reddit" },
                        { mode: "x" as const, icon: <Twitter className="size-4 text-foreground" />, label: "X" },
                      ]).map(({ mode, icon, label }) => (
                        <DropdownMenuPrimitive.CheckboxItem
                          key={mode}
                          checked={searchModes.has(mode)}
                          onCheckedChange={() => toggleSearchMode(mode)}
                          onSelect={(e) => e.preventDefault()}
                          className={checkboxItemClass}
                        >
                          {icon}
                          {label}
                          <span className="absolute right-2 flex items-center justify-center pointer-events-none">
                            <DropdownMenuPrimitive.ItemIndicator>
                              <CheckIcon />
                            </DropdownMenuPrimitive.ItemIndicator>
                          </span>
                        </DropdownMenuPrimitive.CheckboxItem>
                      ))}
                    </DropdownMenuPrimitive.Group>
                  </motion.div>
                </DropdownMenuPrimitive.Content>
              </DropdownMenuPrimitive.Portal>
            )}
          </AnimatePresence>
        </DropdownMenuPrimitive.Root>
      ) : (
        <button
          className="size-8 rounded-full flex items-center justify-center bg-transparent hover:bg-white/10 text-white/60 hover:text-white transition-all duration-150 cursor-pointer focus:outline-none"
        >
          <Plus className="size-4.5" strokeWidth={2} />
        </button>
      )}
    </>
  );
}

function CheckIcon() {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      <path d="M20 6 9 17l-5-5" />
    </motion.svg>
  );
}
