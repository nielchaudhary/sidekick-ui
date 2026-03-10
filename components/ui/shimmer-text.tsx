"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const gradients = {
  default:
    "linear-gradient(90deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.5) 100%)",
  subtle:
    "linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.4) 100%)",
  destructive:
    "linear-gradient(90deg, rgba(179,75,113,0.5) 0%, rgba(179,75,113,1) 50%, rgba(179,75,113,0.5) 100%)",
  rose:
    "linear-gradient(90deg, rgba(244,63,94,0.5) 0%, rgba(244,63,94,1) 50%, rgba(244,63,94,0.5) 100%)",
};

interface ShimmerTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "subtle" | "destructive" | "rose";
  duration?: number;
  delay?: number;
  spread?: number;
}

export function ShimmerText({
  children,
  className,
  variant = "default",
  duration = 2,
  delay = 0,
  spread = 200,
}: ShimmerTextProps) {

  return (
    <motion.span
      className={cn("inline-block bg-clip-text text-transparent", className)}
      style={{
        backgroundImage: gradients[variant],
        backgroundSize: `${spread}% 100%`,
      }}
      animate={{
        backgroundPosition: ["-100% 0%", "200% 0%"],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {children}
    </motion.span>
  );
}
