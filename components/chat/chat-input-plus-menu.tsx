"use client";

import { useRef } from "react";
import { Plus, Paperclip, Github, Twitter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type SearchMode = "github" | "reddit" | "x";

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFilesSelected(Array.from(files));
    }
    // Reset so the same file can be selected again
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="size-8 rounded-full flex items-center justify-center bg-transparent hover:bg-white/10 text-white/60 hover:text-white transition-all duration-150 data-[state=open]:rotate-45 cursor-pointer focus:outline-none"
          >
            <Plus className="size-[18px]" strokeWidth={2} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={6}
          className="w-64 bg-black/80 backdrop-blur-md border-white/6"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-[11px] text-white/30 uppercase tracking-wider px-3">Attach</DropdownMenuLabel>
            <DropdownMenuItem
              onSelect={() => fileInputRef.current?.click()}
              className="px-3 py-2 rounded-lg text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer"
            >
              <Paperclip className="size-4" />
              Add PDFs or Images
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-[11px] text-white/30 uppercase tracking-wider px-3">Search modes</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={searchModes.has("github")}
              onCheckedChange={() => toggleSearchMode("github")}
              onSelect={(e) => e.preventDefault()}
              className="px-3 py-2 rounded-lg text-white hover:bg-white/10 focus:bg-white/10 data-[state=checked]:bg-white/10 cursor-pointer"
            >
              <Github className="size-4 text-foreground" />
              GitHub
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={searchModes.has("reddit")}
              onCheckedChange={() => toggleSearchMode("reddit")}
              onSelect={(e) => e.preventDefault()}
              className="px-3 py-2 rounded-lg text-white hover:bg-white/10 focus:bg-white/10 data-[state=checked]:bg-white/10 cursor-pointer"
            >
              <RedditIcon className="size-4 text-[#FF4500]" />
              Reddit
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={searchModes.has("x")}
              onCheckedChange={() => toggleSearchMode("x")}
              onSelect={(e) => e.preventDefault()}
              className="px-3 py-2 rounded-lg text-white hover:bg-white/10 focus:bg-white/10 data-[state=checked]:bg-white/10 cursor-pointer"
            >
              <Twitter className="size-4 text-foreground" />
              X
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
