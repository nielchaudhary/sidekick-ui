"use client";

import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { TYPEWRITER, ANIMATION_DELAY } from "@/lib/animation-constants";

interface TypewriterTextProps {
  text: string;
  className?: string;
  onComplete?: () => void;
}

// Typewriter effect component - character by character with variable speed
const TypewriterText = memo(function TypewriterText({
  text,
  className,
  onComplete,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    setDisplayedText("");
    setIsComplete(false);

    const typeNextChar = () => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
        // Smoother, more consistent speed
        const char = text[index - 1];
        const delay =
          char === " "
            ? TYPEWRITER.baseDelay * TYPEWRITER.spaceMultiplier
            : [".", ",", "!", "?"].includes(char)
              ? TYPEWRITER.baseDelay * TYPEWRITER.punctuationMultiplier
              : TYPEWRITER.baseDelay + Math.random() * TYPEWRITER.randomVariation;
        setTimeout(typeNextChar, delay);
      } else {
        setIsComplete(true);
        onComplete?.();
      }
    };

    const timer = setTimeout(typeNextChar, ANIMATION_DELAY.instant);
    return () => clearTimeout(timer);
  }, [text, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && (
        <motion.span
          className="inline-block w-[2px] h-[10px] bg-white/80 ml-[1px] align-middle"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </span>
  );
});

export default TypewriterText;
