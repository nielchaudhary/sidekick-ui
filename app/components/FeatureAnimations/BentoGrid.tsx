"use client";

import { useMemo, memo } from "react";
import { motion } from "framer-motion";
import { GRID, ANIMATION_DURATION } from "@/lib/animation-constants";

interface BentoGridProps {
  isActive: boolean;
}

// Bento Grid Background with gravitational well effect
const BentoGrid = memo(function BentoGrid({ isActive }: BentoGridProps) {
  const dots = useMemo(() => {
    const result: { x: number; y: number; distance: number }[] = [];
    for (let x = 0; x <= GRID.width; x += GRID.size) {
      for (let y = 0; y <= GRID.height; y += GRID.size) {
        const centerX = GRID.width / 2;
        const centerY = GRID.height / 2;
        const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        result.push({ x, y, distance });
      }
    }
    return result;
  }, []);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 340 420">
      <defs>
        <radialGradient id="wellGlow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.35" />
          <stop offset="40%" stopColor="white" stopOpacity="0.15" />
          <stop offset="100%" stopColor="white" stopOpacity="0.05" />
        </radialGradient>
      </defs>
      {dots.map((dot, i) => {
        const maxDistance = 100;
        const brightness =
          dot.distance < maxDistance ? 0.3 - (dot.distance / maxDistance) * 0.25 : 0.05;

        return (
          <motion.circle
            key={`grid-dot-${i}`}
            cx={dot.x}
            cy={dot.y}
            r="1"
            fill="white"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isActive ? brightness * 1.5 : brightness * 0.5,
            }}
            transition={{
              duration: ANIMATION_DURATION.slow,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </svg>
  );
});

export default BentoGrid;
