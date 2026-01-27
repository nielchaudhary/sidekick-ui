/**
 * Features Data
 * Feature configuration and content for the feature switcher component
 */

import type { ComponentType } from "react";

export interface Feature {
  id: string;
  label: string;
  title: string;
  description: string | null;
  icon: ComponentType<{ isActive: boolean }>;
  points: string[] | null;
}

// Feature metadata (icons will be imported from FeatureAnimations after extraction)
export const FEATURES_METADATA = [
  {
    id: "memory",
    label: "MEMORY",
    title: "Never lose a thread",
    description: null,
    points: [
      "Every conversation, decision, and thought automatically saved.",
      "Nothing slips through. Everything searchable. Always there.",
      "Captures meetings, notes, and stray thoughts instantly.",
    ],
  },
  {
    id: "context",
    label: "CONTEXT",
    title: "Beyond keywords",
    description:
      "It understands the 'why' behind your projects, linking disparate ideas automatically across your entire knowledge base.",
    points: null,
  },
  {
    id: "retention",
    label: "RETENTION",
    title: "Long-term storage",
    description:
      "High-stakes decisions preserved forever. Your data stays fresh, indexed, and accessible when you need it most.",
    points: null,
  },
  {
    id: "retrieval",
    label: "RETRIEVAL",
    title: "Instant access",
    description:
      "Query your past thoughts with natural language and get precise answers in milliseconds, not minutes.",
    points: null,
  },
  {
    id: "reasoning",
    label: "REASONING",
    title: "A second brain",
    description:
      "Stress-test your logic and surface blind spots. Let AI challenge your assumptions before reality does.",
    points: null,
  },
] as const;
