"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Check } from "lucide-react";
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

export function ModelSelector({
  selectedModel,
  onModelChange,
  models = DEFAULT_MODELS,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [activeProvider, setActiveProvider] = useState<Provider>(() => {
    const model = models.find((m) => m.id === selectedModel);
    return model?.provider ?? "anthropic";
  });
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const changeProvider = useCallback((provider: Provider) => {
    setActiveProvider(provider);
    setFocusedIndex(0);
  }, []);
  const [panelPos, setPanelPos] = useState({ bottom: 0, right: 0 });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const providerModels = models.filter((m) => m.provider === activeProvider);
  const selectedModelObj = models.find((m) => m.id === selectedModel);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", check);
    const id = setTimeout(() => {
      setMounted(true);
      check();
    }, 0);
    return () => {
      window.removeEventListener("resize", check);
      clearTimeout(id);
    };
  }, []);

  // Compute panel position from trigger rect
  const computePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPanelPos({
      bottom: window.innerHeight - rect.top + 8,
      right: window.innerWidth - rect.right,
    });
  }, []);

  const handleOpen = useCallback(() => {
    computePosition();
    setOpen((v) => !v);
  }, [computePosition]);

  // Click outside
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      const t = e.target as Node;
      const inPanel = panelRef.current?.contains(t);
      const inTrigger = triggerRef.current?.contains(t);
      if (!inPanel && !inTrigger) setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const handleSelectModel = useCallback(
    (id: string) => {
      onModelChange(id);
      setTimeout(() => setOpen(false), 120);
    },
    [onModelChange]
  );

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!open) handleOpen();
    }
  };

  const handlePanelKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((i) => (i + 1) % providerModels.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((i) => (i - 1 + providerModels.length) % providerModels.length);
        break;
      case "ArrowLeft":
      case "ArrowRight": {
        e.preventDefault();
        const ids = PROVIDERS.map((p) => p.id);
        const cur = ids.indexOf(activeProvider);
        const next =
          e.key === "ArrowRight" ? (cur + 1) % ids.length : (cur - 1 + ids.length) % ids.length;
        changeProvider(ids[next] as Provider);
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

  const [chipHovered, setChipHovered] = useState(false);
  const [chipFocused, setChipFocused] = useState(false);
  const chipActive = chipHovered || chipFocused || open;

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
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProvider}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="px-1"
            >
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
        className="fixed inset-0 z-9998 bg-black/50"
        onClick={() => setOpen(false)}
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
        className="fixed inset-x-0 bottom-0 z-9999 rounded-t-2xl border-t border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl"
        style={{ maxHeight: "50vh" }}
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

        {/* Model list */}
        <div className="overflow-y-auto py-1.5 px-2" style={{ maxHeight: "calc(50vh - 64px)" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProvider}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              {providerModels.map((model, idx) => {
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
              })}
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
