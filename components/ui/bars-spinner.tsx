"use client";

import { cn } from "@/lib/utils";

interface BarsSpinnerProps {
  className?: string;
  size?: number;
  color?: string;
}

export function BarsSpinner({
  className,
  size = 20,
  color = "rgba(255,255,255,0.7)",
}: BarsSpinnerProps) {
  const bars = Array.from({ length: 12 });
  return (
    <div className={cn("relative inline-block", className)} style={{ width: size, height: size }}>
      {bars.map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: `${size * 0.08}px`,
            height: `${size * 0.24}px`,
            borderRadius: "9999px",
            backgroundColor: color,
            transform: `rotate(${i * 30}deg) translateY(-${size * 0.34}px)`,
            transformOrigin: "0 0",
            animation: `bars-spinner-fade 0.7s ease-in-out ${(i * 0.058).toFixed(3)}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
