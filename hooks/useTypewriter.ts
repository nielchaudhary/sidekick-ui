"use client";

import { useState, useEffect, useCallback } from "react";
import { TYPEWRITER, ANIMATION_DELAY } from "@/lib/animation-constants";

interface UseTypewriterOptions {
  text: string;
  onComplete?: () => void;
  baseDelay?: number;
  spaceMultiplier?: number;
  punctuationMultiplier?: number;
  randomVariation?: number;
}

interface UseTypewriterReturn {
  displayedText: string;
  isComplete: boolean;
  reset: () => void;
}

/**
 * Hook for typewriter text animation effect
 * Displays text character by character with variable timing
 */
export function useTypewriter({
  text,
  onComplete,
  baseDelay = TYPEWRITER.baseDelay,
  spaceMultiplier = TYPEWRITER.spaceMultiplier,
  punctuationMultiplier = TYPEWRITER.punctuationMultiplier,
  randomVariation = TYPEWRITER.randomVariation,
}: UseTypewriterOptions): UseTypewriterReturn {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const reset = useCallback(() => {
    setDisplayedText("");
    setIsComplete(false);
  }, []);

  useEffect(() => {
    let index = 0;
    let timeoutId: NodeJS.Timeout;
    setDisplayedText("");
    setIsComplete(false);

    const typeNextChar = () => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;

        const char = text[index - 1];
        const delay =
          char === " "
            ? baseDelay * spaceMultiplier
            : [".", ",", "!", "?"].includes(char)
              ? baseDelay * punctuationMultiplier
              : baseDelay + Math.random() * randomVariation;

        timeoutId = setTimeout(typeNextChar, delay);
      } else {
        setIsComplete(true);
        onComplete?.();
      }
    };

    timeoutId = setTimeout(typeNextChar, ANIMATION_DELAY.instant);

    return () => clearTimeout(timeoutId);
  }, [text, onComplete, baseDelay, spaceMultiplier, punctuationMultiplier, randomVariation]);

  return { displayedText, isComplete, reset };
}
