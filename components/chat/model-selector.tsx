"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { SYSTEM_FONT_STACK } from "./pasted-content-types";

type Provider = "anthropic" | "openai";

export interface ModelOption {
  id: string;
  label: string;
  subtitle: string;
  provider: Provider;
}

export interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (id: string) => void;
  models?: ModelOption[];
}

const DEFAULT_MODELS: ModelOption[] = [
  { id: "sonnet-4.5", label: "Sonnet 4.5", subtitle: "Fast, capable, great for most tasks", provider: "anthropic" },
  { id: "opus-4.6", label: "Opus 4.6", subtitle: "Most intelligent, best for complex work", provider: "anthropic" },
  { id: "gpt-5", label: "GPT-5", subtitle: "OpenAI's latest frontier reasoning model", provider: "openai" },
];

const PROVIDERS: { id: Provider; label: string }[] = [
  { id: "anthropic", label: "Anthropic" },
  { id: "openai", label: "OpenAI" },
];

const PROVIDER_IDS = PROVIDERS.map((p) => p.id);

const BRAND_COLORS: Record<Provider, string> = {
  anthropic: "#D97757",
  openai: "#10A37F",
};

function AnthropicLogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style} aria-hidden="true">
      <path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H6.042L4.652 20H1L6.57 3.52zm2.55 4.71-1.74 4.54h3.544l-1.804-4.54z" />
    </svg>
  );
}

function OpenAILogo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style} aria-hidden="true">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </svg>
  );
}

function ProviderLogo({ provider, className, style }: { provider: Provider; className?: string; style?: React.CSSProperties }) {
  return provider === "anthropic" ? (
    <AnthropicLogo className={className} style={style} />
  ) : (
    <OpenAILogo className={className} style={style} />
  );
}

/** Build a case-insensitive regex from query, falling back to literal match on invalid patterns. */
function buildMatcher(query: string): (text: string) => boolean {
  if (!query) return () => true;
  try {
    const re = new RegExp(query, "i");
    return (text: string) => re.test(text);
  } catch {
    const lower = query.toLowerCase();
    return (text: string) => text.toLowerCase().includes(lower);
  }
}

function modelMatches(model: ModelOption, matcher: (text: string) => boolean): boolean {
  return matcher(model.label) || matcher(model.id) || matcher(model.subtitle);
}

export function ModelSelector({
  selectedModel,
  onModelChange,
  models = DEFAULT_MODELS,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [providerOverride, setProviderOverride] = useState<Provider | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [panelPos, setPanelPos] = useState({ bottom: 0, right: 0 });
  const [chipHovered, setChipHovered] = useState(false);
  const [chipFocused, setChipFocused] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const activeProvider = providerOverride ?? models.find((m) => m.id === selectedModel)?.provider ?? "anthropic";

  const changeProvider = useCallback((provider: Provider) => {
    setProviderOverride(provider);
    setFocusedIndex(0);
  }, []);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const providerModels = useMemo(
    () => models.filter((m) => m.provider === activeProvider),
    [models, activeProvider]
  );
  const selectedModelObj = useMemo(
    () => models.find((m) => m.id === selectedModel),
    [models, selectedModel]
  );

  // Debounce search input
  useEffect(() => {
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 200);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchQuery]);

  // Auto-navigate: when debounced query changes, update provider + focus via the search handler
  const lastNavigatedQueryRef = useRef("");
  const applySearchNavigation = useCallback((query: string) => {
    if (!query) return;
    const matcher = buildMatcher(query);
    const firstMatch = models.find((m) => modelMatches(m, matcher));
    if (firstMatch) {
      setProviderOverride(firstMatch.provider);
      const provModels = models.filter((m) => m.provider === firstMatch.provider);
      const idx = provModels.findIndex((m) => m.id === firstMatch.id);
      setFocusedIndex(idx >= 0 ? idx : 0);
    } else {
      setFocusedIndex(0);
    }
  }, [models]);

  // Trigger navigation when debouncedQuery changes (called from debounce timer callback)
  useEffect(() => {
    if (debouncedQuery && open && debouncedQuery !== lastNavigatedQueryRef.current) {
      lastNavigatedQueryRef.current = debouncedQuery;
      // Use setTimeout(0) to avoid synchronous setState-in-effect
      const id = setTimeout(() => applySearchNavigation(debouncedQuery), 0);
      return () => clearTimeout(id);
    }
  }, [debouncedQuery, open, applySearchNavigation]);

  // Check if current provider has any matches for empty-state display
  const hasMatchesInActiveProvider = useMemo(() => {
    if (!debouncedQuery) return true;
    const matcher = buildMatcher(debouncedQuery);
    return providerModels.some((m) => modelMatches(m, matcher));
  }, [debouncedQuery, providerModels]);

  // Track mobile breakpoint via matchMedia
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handleChange);
    const id = setTimeout(() => {
      setMounted(true);
      setIsMobile(mq.matches);
    }, 0);
    return () => {
      mq.removeEventListener("change", handleChange);
      clearTimeout(id);
    };
  }, []);

  const handleOpen = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPanelPos({
        bottom: window.innerHeight - rect.top + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen((v) => {
      if (v) {
        // Closing — reset search state
        setSearchQuery("");
        setDebouncedQuery("");
        lastNavigatedQueryRef.current = "";
      }
      return !v;
    });
  }, []);

  const closePanel = useCallback(() => {
    setOpen(false);
    setSearchQuery("");
    setDebouncedQuery("");
    lastNavigatedQueryRef.current = "";
  }, []);

  // Auto-focus search input on desktop when panel opens
  useEffect(() => {
    if (open && !isMobile) {
      // Slight delay to ensure the panel has rendered
      const id = setTimeout(() => searchInputRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
  }, [open, isMobile]);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !triggerRef.current?.contains(t)) closePanel();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // If search has text, clear it first; otherwise close panel
        if (searchQuery) {
          setSearchQuery("");
          setDebouncedQuery("");
          setProviderOverride(null);
          setFocusedIndex(0);
          searchInputRef.current?.focus();
        } else {
          closePanel();
          triggerRef.current?.focus();
        }
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, searchQuery, closePanel]);

  const handleSelectModel = useCallback(
    (id: string) => {
      onModelChange(id);
      setProviderOverride(null);
      setTimeout(() => closePanel(), 120);
    },
    [onModelChange, closePanel]
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setDebouncedQuery("");
    setProviderOverride(null);
    setFocusedIndex(0);
    searchInputRef.current?.focus();
  }, []);

  const handleSearchInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      // Move focus to model list — panel keydown handler will take over
      panelRef.current?.focus();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const model = providerModels[focusedIndex];
      if (model) handleSelectModel(model.id);
    }
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!open) handleOpen();
    }
  };

  const handlePanelKeyDown = (e: React.KeyboardEvent) => {
    // Redirect printable characters to search input (typeahead capture)
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      setSearchQuery((q) => (q + e.key).slice(0, 100));
      searchInputRef.current?.focus();
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((i) => (i + 1) % providerModels.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (focusedIndex === 0) {
          // Move focus back to search input
          searchInputRef.current?.focus();
        } else {
          setFocusedIndex((i) => (i - 1 + providerModels.length) % providerModels.length);
        }
        break;
      case "ArrowLeft":
      case "ArrowRight": {
        e.preventDefault();
        const cur = PROVIDER_IDS.indexOf(activeProvider);
        const next =
          e.key === "ArrowRight" ? (cur + 1) % PROVIDER_IDS.length : (cur - 1 + PROVIDER_IDS.length) % PROVIDER_IDS.length;
        changeProvider(PROVIDER_IDS[next] as Provider);
        break;
      }
      case "Enter": {
        e.preventDefault();
        const model = providerModels[focusedIndex];
        if (model) handleSelectModel(model.id);
        break;
      }
    }
  };

  const triggerLabel = selectedModelObj?.label ?? "Sonnet 4.5";
  const triggerProvider = selectedModelObj?.provider ?? "anthropic";
  const brandColor = BRAND_COLORS[triggerProvider];

  const chipActive = chipHovered || chipFocused || open;

  const searchInput = (mobile: boolean) => (
    <div
      className={cn(
        "flex items-center gap-2",
        mobile ? "px-4 h-10" : "px-4 h-8"
      )}
      style={{
        borderBottom: searchQuery
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid transparent",
        transition: "border-color 150ms ease-out",
      }}
    >
      {searchQuery ? (
        <button
          onClick={handleClearSearch}
          className={cn(
            "shrink-0 cursor-pointer focus:outline-none transition-colors duration-150",
            mobile ? "p-2 -m-2" : ""
          )}
          style={{ minWidth: mobile ? 44 : undefined, minHeight: mobile ? 44 : undefined, display: "flex", alignItems: "center", justifyContent: "center" }}
          aria-label="Clear search"
        >
          <X className="size-3 text-white/40 hover:text-white/60 transition-colors duration-150" />
        </button>
      ) : (
        <Search className="size-3 text-white/20 shrink-0" />
      )}
      <input
        ref={searchInputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value.slice(0, 100))}
        onKeyDown={handleSearchInputKeyDown}
        placeholder="Search models…"
        maxLength={100}
        className={cn(
          "flex-1 bg-transparent border-none outline-none placeholder:text-white/20 font-medium min-w-0",
          mobile ? "text-sm" : "text-[11px]"
        )}
        style={{
          fontFamily: SYSTEM_FONT_STACK,
          color: "rgba(255,255,255,0.8)",
          caretColor: "rgba(255,255,255,0.5)",
        }}
      />
    </div>
  );

  const emptyState = (
    <div
      className="flex items-center justify-center py-6"
      style={{ fontFamily: SYSTEM_FONT_STACK }}
    >
      <span className="text-[10px] text-white/25 italic">
        No models match &ldquo;{debouncedQuery}&rdquo;
      </span>
    </div>
  );

  const desktopPanel = (
    <motion.div
      key="desktop-panel"
      ref={panelRef}
      role="dialog"
      aria-label="Select model"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      onKeyDown={handlePanelKeyDown}
      tabIndex={-1}
      style={{
        position: "fixed",
        bottom: panelPos.bottom,
        right: panelPos.right,
        width: 360,
        zIndex: 9999,
      }}
      className="rounded-xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden"
    >
      <div className="flex">
        {/* Provider sidebar */}
        <div
          role="tablist"
          aria-label="Providers"
          className="w-16 flex flex-col items-center py-2 gap-1 border-r border-white/5 shrink-0"
        >
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={activeProvider === p.id}
              aria-label={p.label}
              onClick={() => changeProvider(p.id)}
              className={cn(
                "relative w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer focus:outline-none",
                activeProvider === p.id ? "bg-white/10" : "hover:bg-white/5"
              )}
            >
              {activeProvider === p.id && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                  style={{ backgroundColor: BRAND_COLORS[p.id] }}
                />
              )}
              <ProviderLogo
                provider={p.id}
                className={cn(
                  "size-5 transition-opacity duration-150",
                  activeProvider === p.id ? "opacity-90" : "opacity-50"
                )}
              />
            </button>
          ))}
        </div>

        {/* Model list */}
        <div role="listbox" aria-label="Models" className="flex-1 py-2 mt-1 min-w-0">
          {searchInput(false)}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProvider}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="px-1"
            >
              {debouncedQuery && !hasMatchesInActiveProvider ? emptyState : (
              <div className="flex flex-col gap-1">
              {providerModels.map((model, idx) => {
                const rowActive = focusedIndex === idx || model.id === selectedModel;
                const rowBrand = BRAND_COLORS[model.provider];
                return (
                <button
                  key={model.id}
                  role="option"
                  aria-selected={model.id === selectedModel}
                  onClick={() => handleSelectModel(model.id)}
                  onMouseEnter={() => setFocusedIndex(idx)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-4 h-12 rounded-lg transition-colors duration-100 cursor-pointer text-left focus:outline-none",
                    rowActive ? "bg-white/8" : "hover:bg-white/8"
                  )}
                >
                  <ProviderLogo
                    provider={model.provider}
                    className="size-3.5 shrink-0"
                    style={{
                      color: rowActive ? rowBrand : undefined,
                      opacity: rowActive ? 1 : 0.4,
                      filter: rowActive
                        ? `drop-shadow(0 0 4px ${rowBrand}4D) grayscale(0%)`
                        : "grayscale(40%)",
                      transition: "color 180ms ease-out, opacity 180ms ease-out, filter 180ms ease-out",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-[11px] font-medium truncate"
                      style={{
                        fontFamily: SYSTEM_FONT_STACK,
                        color: rowActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)",
                        transition: "color 180ms ease-out",
                      }}
                    >
                      {model.label}
                    </div>
                    <div
                      className="text-[9px] text-white/30 truncate"
                      style={{ fontFamily: SYSTEM_FONT_STACK }}
                    >
                      {model.subtitle}
                    </div>
                  </div>
                  {model.id === selectedModel && (
                    <Check className="size-3 shrink-0" style={{ color: rowBrand, opacity: 0.8 }} />
                  )}
                </button>
                );
              })}
              </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );

  const mobileSheet = (
    <div key="mobile-sheet-root">
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 bg-black/50"
        style={{ zIndex: 9998 }}
        onClick={() => closePanel()}
      />
      <motion.div
        key="sheet"
        ref={panelRef}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onKeyDown={handlePanelKeyDown}
        role="dialog"
        aria-label="Select model"
        className="fixed inset-x-0 bottom-0 rounded-t-2xl border-t border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl"
        style={{ maxHeight: "50vh", zIndex: 9999 }}
      >
        {/* Provider row */}
        <div className="flex gap-2 px-4 pt-4 pb-3 border-b border-white/5 overflow-x-auto">
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => changeProvider(p.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 h-8 rounded-full text-sm font-medium transition-all duration-150 shrink-0 cursor-pointer focus:outline-none",
                activeProvider === p.id
                  ? "bg-white/10 text-white/90"
                  : "text-white/40 hover:bg-white/5 hover:text-white/60"
              )}
              style={{ fontFamily: SYSTEM_FONT_STACK }}
            >
              <ProviderLogo provider={p.id} className="size-3.5" />
              {p.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        {searchInput(true)}

        {/* Model list */}
        <div className="overflow-y-auto py-1.5 px-2" style={{ maxHeight: "calc(50vh - 108px)" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProvider}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              {debouncedQuery && !hasMatchesInActiveProvider ? emptyState : (
              providerModels.map((model, idx) => {
                const rowActive = focusedIndex === idx || model.id === selectedModel;
                const rowBrand = BRAND_COLORS[model.provider];
                return (
                <button
                  key={model.id}
                  onClick={() => handleSelectModel(model.id)}
                  onMouseEnter={() => setFocusedIndex(idx)}
                  className="w-full flex items-center gap-3 px-3 h-12 rounded-xl transition-colors duration-100 hover:bg-white/8 cursor-pointer text-left focus:outline-none"
                >
                  <ProviderLogo
                    provider={model.provider}
                    className="size-4.5 shrink-0"
                    style={{
                      color: rowActive ? rowBrand : undefined,
                      opacity: rowActive ? 1 : 0.4,
                      filter: rowActive
                        ? `drop-shadow(0 0 4px ${rowBrand}4D) grayscale(0%)`
                        : "grayscale(40%)",
                      transition: "color 180ms ease-out, opacity 180ms ease-out, filter 180ms ease-out",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-sm font-medium"
                      style={{
                        fontFamily: SYSTEM_FONT_STACK,
                        color: rowActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)",
                        transition: "color 180ms ease-out",
                      }}
                    >
                      {model.label}
                    </div>
                    <div
                      className="text-xs text-white/30"
                      style={{ fontFamily: SYSTEM_FONT_STACK }}
                    >
                      {model.subtitle}
                    </div>
                  </div>
                  {model.id === selectedModel && (
                    <Check className="size-3.5 shrink-0" style={{ color: rowBrand, opacity: 0.8 }} />
                  )}
                </button>
                );
              })
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        onClick={handleOpen}
        onKeyDown={handleTriggerKeyDown}
        onMouseEnter={() => setChipHovered(true)}
        onMouseLeave={() => setChipHovered(false)}
        onFocus={() => setChipFocused(true)}
        onBlur={() => setChipFocused(false)}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Model: ${triggerLabel}`}
        className="inline-flex items-center gap-1.5 px-1.5 rounded-full cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-white/20"
      >
        <ProviderLogo
          provider={triggerProvider}
          className="size-3.5 shrink-0"
          style={{
            color: brandColor,
            opacity: chipActive ? 1 : 0.75,
            filter: chipActive ? `drop-shadow(0 0 5px ${brandColor}4D)` : "none",
            transition: "opacity 180ms ease-out, filter 180ms ease-out",
          }}
        />
        <span className="hidden md:inline-flex items-center">
          <span
            className="text-[11px] font-medium truncate"
            style={{
              fontFamily: SYSTEM_FONT_STACK,
              lineHeight: 1,
              color: chipActive ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.5)",
              transition: "color 180ms ease-out",
            }}
          >
            {triggerLabel}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "size-3 shrink-0 transition-all duration-150",
            open ? "rotate-180 text-white/70" : "text-white/40"
          )}
          strokeWidth={2.5}
        />
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>{open && (isMobile ? mobileSheet : desktopPanel)}</AnimatePresence>,
          document.body
        )}
    </>
  );
}
