"use client";

import { useState, type ReactNode } from "react";

interface ActionTooltipProps {
  label: string;
  children: ReactNode;
}

export function ActionTooltip({ label, children }: ActionTooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <div
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none z-50 flex flex-col items-center transition-opacity duration-150 ease-out"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <span
          className="whitespace-nowrap rounded-sm px-3 py-1.5 text-[11px] font-semibold leading-tight text-white"
          style={{ backgroundColor: "#000000" }}
        >
          {label}
        </span>
        <svg
          width="8"
          height="4"
          viewBox="0 0 8 4"
          className="block -mt-px"
          style={{ color: "#000000" }}
        >
          <path d="M0 0L4 4L8 0" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}
