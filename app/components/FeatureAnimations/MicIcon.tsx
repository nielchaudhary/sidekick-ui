"use client";

import { motion } from "framer-motion";

interface MicIconProps {
  isActive: boolean;
}

// Mic icon with breathing pulse animation
export default function MicIcon({ isActive }: MicIconProps) {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      animate={isActive ? { scale: [1, 1.08, 1] } : {}}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full bg-gray-400/30"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    </motion.div>
  );
}
