/**
 * Animation Types
 * Shared type definitions for animation components
 */

/** Animation phase for the Memory feature animation */
export type MemoryAnimationPhase =
  | "idle"
  | "input"
  | "sending"
  | "thinking"
  | "responding"
  | "collapse"
  | "storage";

/** Animation phase for the Context feature animation (Semantic Graph) */
export type ContextAnimationPhase = "idle" | "scanning" | "connecting" | "synthesis";

/** Animation phase for the Retention feature animation (Chronos Vault) */
export type RetentionAnimationPhase = "idle" | "log" | "allocate" | "flush" | "done";

/** Animation phase for the Retrieval Nexus component */
export type RetrievalNexusPhase =
  | "idle"
  | "sending"
  | "intentExtraction"
  | "retrieving"
  | "ingestion"
  | "crossReferencing"
  | "judgment"
  | "calendar"
  | "execution"
  | "responding"
  | "storing";

/** Animation phase for the Silicon Inference component */
export type InferencePhase = "idle" | "embedding" | "attention" | "ffn" | "complete";

/** Logo types for brand icons */
export type LogoType = "notion" | "sheets" | "gmail" | "slack" | "github";

/** Processor block for Silicon Inference */
export interface ProcessorBlock {
  id: "attention" | "ffn" | "kv_cache";
  status: "idle" | "processing" | "committed";
  load: number;
}

/** Memory source for data connections */
export interface MemorySource {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
}

/** Cluster node for Context animation */
export interface ClusterNode {
  id: number;
  x: number;
  y: number;
  label: string;
  logoType: LogoType;
  labelId: string;
}

/** Storage cell for Retention animation */
export interface StorageCell {
  id: number;
  row: number;
  col: number;
  status: "empty" | "writing" | "encrypted";
  bitstream: string;
}

/** Bullet point for chat messages */
export interface BulletPoint {
  text: string;
  keyword: string;
  suffix: string;
}

/** Calendar event for scheduling */
export interface CalendarEvent {
  date: string;
  day: number;
  month: string;
  year: number;
  time: string;
  title: string;
}

/** Chat message type */
export interface ChatMessage {
  role: "user" | "assistant";
  content?: string;
  bullets?: BulletPoint[];
  calendarEvent?: CalendarEvent;
  hasLiveCard?: boolean;
}

/** Data point for retrieval scanning */
export interface DataPoint {
  x: number;
  y: number;
  isAnswer: boolean;
  label: string;
}

/** Feature definition for FeatureSwitcher */
export interface Feature {
  id: string;
  label: string;
  title: string;
  icon: React.ComponentType;
  points: string[];
}

/** Grid dot position */
export interface GridDot {
  x: number;
  y: number;
  distance: number;
}

/** Animation transition config */
export interface AnimationTransition {
  type?: "spring" | "tween";
  stiffness?: number;
  damping?: number;
  duration?: number;
  delay?: number;
  ease?: string | number[];
}
