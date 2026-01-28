"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { delay } from "@/lib/utils";
import type { ContextAnimationPhase, LogoType, ClusterNode } from "@/types/animations";

/** Canvas dimensions */
const WIDTH = 340;
const HEIGHT = 420;

/** Logo SVG components for graph nodes */
const LogoSVGs: Record<LogoType, (size: number) => React.ReactNode> = {
  notion: (size) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path
        d="M6.017 4.313l55.333 -4.087c6.797 -0.583 8.543 -0.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277 -1.553 6.807 -6.99 7.193L24.467 99.967c-4.08 0.193 -6.023 -0.39 -8.16 -3.113L3.3 79.94c-2.333 -3.113 -3.3 -5.443 -3.3 -8.167V11.113c0 -3.497 1.553 -6.413 6.017 -6.8z"
        fill="#fff"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M61.35 0.227l-55.333 4.087C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723 0.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257 -3.89c5.433 -0.387 6.99 -2.917 6.99 -7.193V20.64c0 -2.21 -0.873 -2.847 -3.443 -4.733L74.167 3.143c-4.273 -3.107 -6.02 -3.5 -12.817 -2.917zM25.92 19.523c-5.247 0.353 -6.437 0.433 -9.417 -1.99L8.927 11.507c-0.77 -0.78 -0.383 -1.753 1.557 -1.947l53.193 -3.887c4.467 -0.39 6.793 1.167 8.54 2.527l9.123 6.61c0.39 0.197 1.36 1.36 0.193 1.36l-54.933 3.307 -0.68 0.047zM19.803 88.3V30.367c0 -2.53 0.777 -3.697 3.103 -3.893L86 22.78c2.14 -0.193 3.107 1.167 3.107 3.693v57.547c0 2.53 -0.39 4.67 -3.883 4.863l-60.377 3.5c-3.493 0.193 -5.043 -0.97 -5.043 -4.083zm59.6 -54.827c0.387 1.75 0 3.5 -1.75 3.7l-2.91 0.577v42.773c-2.527 1.36 -4.853 2.137 -6.797 2.137 -3.107 0 -3.883 -0.973 -6.21 -3.887l-19.03 -29.94v28.967l6.02 1.363s0 3.5 -4.857 3.5l-13.39 0.777c-0.39 -0.78 0 -2.723 1.357 -3.11l3.497 -0.97v-38.3L30.48 40.667c-0.39 -1.75 0.58 -4.277 3.3 -4.473l14.367 -0.967 19.8 30.327v-26.83l-5.047 -0.58c-0.39 -2.143 1.163 -3.7 3.103 -3.89l13.4 -0.78z"
        fill="#000"
      />
    </svg>
  ),
  slack: (size) => (
    <svg width={size} height={size} viewBox="0 0 128 128" fill="none">
      <path
        d="M27.255 80.719c0 7.33-5.978 13.317-13.309 13.317C6.616 94.036.63 88.049.63 80.719s5.987-13.317 13.317-13.317h13.309zm6.709 0c0-7.33 5.987-13.317 13.317-13.317s13.317 5.986 13.317 13.317v33.335c0 7.33-5.986 13.317-13.317 13.317-7.33 0-13.317-5.987-13.317-13.317z"
        fill="#DE1C59"
      />
      <path
        d="M47.281 27.255c-7.33 0-13.317-5.978-13.317-13.309C33.964 6.616 39.951.63 47.281.63s13.317 5.987 13.317 13.317v13.309zm0 6.709c7.33 0 13.317 5.987 13.317 13.317s-5.986 13.317-13.317 13.317H13.946C6.616 60.598.63 54.612.63 47.281c0-7.33 5.987-13.317 13.317-13.317z"
        fill="#35C5F0"
      />
      <path
        d="M100.745 47.281c0-7.33 5.978-13.317 13.309-13.317 7.33 0 13.317 5.987 13.317 13.317s-5.987 13.317-13.317 13.317h-13.309zm-6.709 0c0 7.33-5.987 13.317-13.317 13.317s-13.317-5.986-13.317-13.317V13.946C67.402 6.616 73.388.63 80.719.63c7.33 0 13.317 5.987 13.317 13.317z"
        fill="#2EB67D"
      />
      <path
        d="M80.719 100.745c7.33 0 13.317 5.978 13.317 13.309 0 7.33-5.987 13.317-13.317 13.317s-13.317-5.987-13.317-13.317v-13.309zm0-6.709c-7.33 0-13.317-5.987-13.317-13.317s5.986-13.317 13.317-13.317h33.335c7.33 0 13.317 5.986 13.317 13.317 0 7.33-5.987 13.317-13.317 13.317z"
        fill="#ECB22D"
      />
    </svg>
  ),
  gmail: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
        fill="#EA4335"
      />
    </svg>
  ),
  sheets: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M19.5 24h-15A2.5 2.5 0 0 1 2 21.5v-19A2.5 2.5 0 0 1 4.5 0h10l7.5 7.5v14a2.5 2.5 0 0 1-2.5 2.5z"
        fill="#0F9D58"
      />
      <path d="M14.5 0v5a2.5 2.5 0 0 0 2.5 2.5h5" fill="#87CEAC" />
      <path d="M6 12h12v9H6z" fill="#fff" />
      <path d="M6 15h12M6 18h12M10 12v9M14 12v9" stroke="#0F9D58" strokeWidth="0.5" />
    </svg>
  ),
  github: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
        fill="#FFFFFF"
      />
    </svg>
  ),
};

/** Cluster nodes configuration */
const CLUSTER_NODES: ClusterNode[] = [
  { id: 0, x: 70, y: 130, label: "Q3 Budget", logoType: "notion", labelId: "BUDGET_REF" },
  { id: 1, x: 45, y: 220, label: "Spend Report", logoType: "sheets", labelId: "SPEND_DOC" },
  { id: 2, x: 95, y: 300, label: "Approval", logoType: "gmail", labelId: "APPROVE_01" },
  { id: 3, x: 270, y: 110, label: "Nov Thread", logoType: "slack", labelId: "SLACK_COMM" },
  { id: 4, x: 250, y: 200, label: "Decision", logoType: "slack", labelId: "DEC_THREAD" },
  { id: 5, x: 290, y: 290, label: "Follow-up", logoType: "github", labelId: "GH_ISSUE" },
];

/** Connection pair for the graph */
const CONNECTION_PAIR = { from: 0, to: 3 };

/**
 * ContextAnimation Component
 * Displays a semantic graph visualization showing context mapping and connections
 */
export default function ContextAnimation() {
  const [phase, setPhase] = useState<ContextAnimationPhase>("idle");
  const [cycleKey, setCycleKey] = useState(0);
  const [queryPosition, setQueryPosition] = useState({ x: -30, y: 210 });
  const [activeInfluenceNodes, setActiveInfluenceNodes] = useState<Set<number>>(new Set());
  const [connectionProgress, setConnectionProgress] = useState(0);
  const [sparkProgress, setSparkProgress] = useState(0);
  const [similarityScore, setSimilarityScore] = useState(0);
  const [warpIntensity, setWarpIntensity] = useState(0);
  const [showLabels, setShowLabels] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  const node1 = CLUSTER_NODES[CONNECTION_PAIR.from];
  const node2 = CLUSTER_NODES[CONNECTION_PAIR.to];
  const midPoint = { x: (node1.x + node2.x) / 2, y: (node1.y + node2.y) / 2 };

  /** Check if node is within influence radius */
  const isWithinInfluence = (
    nodeX: number,
    nodeY: number,
    queryX: number,
    queryY: number,
    radius: number = 90
  ): boolean => {
    const distance = Math.sqrt(Math.pow(nodeX - queryX, 2) + Math.pow(nodeY - queryY, 2));
    return distance <= radius;
  };

  /** Update influence nodes based on query position */
  const updateInfluenceRadius = useCallback((queryX: number, queryY: number) => {
    const influenced = new Set<number>();
    CLUSTER_NODES.forEach((node) => {
      if (isWithinInfluence(node.x, node.y, queryX, queryY)) {
        influenced.add(node.id);
      }
    });
    setActiveInfluenceNodes(influenced);
  }, []);

  /** Check if node is part of the connection pair */
  const isConnectedNode = (nodeId: number): boolean => {
    return nodeId === CONNECTION_PAIR.from || nodeId === CONNECTION_PAIR.to;
  };

  /** Generate dot grid positions */
  const dotGrid = useMemo(() => {
    const dots: { x: number; y: number; id: number }[] = [];
    const spacing = 20;
    let id = 0;
    for (let y = spacing / 2; y < HEIGHT; y += spacing) {
      for (let x = spacing / 2; x < WIDTH; x += spacing) {
        dots.push({ x, y, id: id++ });
      }
    }
    return dots;
  }, []);

  /** Calculate warp displacement for grid dots */
  const getWarpedPosition = (dotX: number, dotY: number) => {
    if (warpIntensity === 0) return { x: dotX, y: dotY };
    const distance = Math.sqrt(Math.pow(dotX - midPoint.x, 2) + Math.pow(dotY - midPoint.y, 2));
    if (distance > 120) return { x: dotX, y: dotY };

    const pullStrength = (1 - distance / 120) * (warpIntensity / 100) * 10;
    const angle = Math.atan2(midPoint.y - dotY, midPoint.x - dotX);

    return {
      x: dotX + Math.cos(angle) * pullStrength,
      y: dotY + Math.sin(angle) * pullStrength,
    };
  };

  /** Animation cycle */
  useEffect(() => {
    let cancelled = false;

    const runCycle = async () => {
      // Reset state
      setPhase("idle");
      setQueryPosition({ x: -30, y: 210 });
      setActiveInfluenceNodes(new Set());
      setConnectionProgress(0);
      setSparkProgress(0);
      setSimilarityScore(0);
      setWarpIntensity(0);
      setShowLabels(false);
      setShowRipple(false);

      await delay(400);

      // Phase I: Spatial Scan
      if (cancelled) return;
      setPhase("scanning");

      const scanPath = [
        { x: 50, y: 280, wait: 400 },
        { x: 100, y: 150, wait: 350 },
        { x: 170, y: 240, wait: 400 },
        { x: 240, y: 130, wait: 350 },
        { x: 280, y: 200, wait: 400 },
        { x: 170, y: 160, wait: 0 },
      ];

      for (const waypoint of scanPath) {
        if (cancelled) return;
        setQueryPosition({ x: waypoint.x, y: waypoint.y });
        updateInfluenceRadius(waypoint.x, waypoint.y);
        if (waypoint.wait > 0) await delay(waypoint.wait);
      }

      await delay(500);

      // Phase II: Connection Pulse
      if (cancelled) return;
      setPhase("connecting");
      setActiveInfluenceNodes(new Set([CONNECTION_PAIR.from, CONNECTION_PAIR.to]));

      for (let i = 0; i <= 100; i += 5) {
        if (cancelled) return;
        setConnectionProgress(i);
        await delay(20);
      }

      await delay(150);
      if (cancelled) return;
      setShowLabels(true);
      await delay(300);

      for (let i = 0; i <= 100; i += 3) {
        if (cancelled) return;
        setSparkProgress(i);
        await delay(12);
      }

      await delay(400);

      // Phase III: Synthesis
      if (cancelled) return;
      setPhase("synthesis");

      for (let i = 0; i <= 94; i += 2) {
        if (cancelled) return;
        setSimilarityScore(Math.min(i, 94));
        await delay(20);
      }
      setSimilarityScore(94);

      for (let i = 0; i <= 100; i += 5) {
        if (cancelled) return;
        setWarpIntensity(i);
        await delay(25);
      }

      if (cancelled) return;
      setShowRipple(true);
      await delay(3000);

      // Reset and loop
      if (!cancelled) {
        setCycleKey((prev) => prev + 1);
      }
    };

    runCycle();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycleKey]);

  return (
    <div className="relative w-[340px] h-[420px] overflow-hidden rounded-2xl p-4">
      <svg
        className="absolute inset-4 w-[calc(100%-32px)] h-[calc(100%-32px)]"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        key={`semantic-${cycleKey}`}
      >
        <defs>
          <filter id="ctx-queryGlow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="ctx-synapseGlow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="ctx-nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="ctx-lineGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="ctx-connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B34B71" />
            <stop offset="50%" stopColor="#E05A8D" />
            <stop offset="100%" stopColor="#B34B71" />
          </linearGradient>
          <radialGradient id="ctx-influenceGradient">
            <stop offset="0%" stopColor="#B34B71" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#B34B71" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#B34B71" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ctx-rippleGradient">
            <stop offset="0%" stopColor="white" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#B34B71" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#B34B71" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Dot Grid Background */}
        <g className="dot-grid">
          {dotGrid.map((dot) => {
            const warped = getWarpedPosition(dot.x, dot.y);
            return (
              <circle
                key={`grid-${dot.id}`}
                cx={warped.x}
                cy={warped.y}
                r="1"
                fill="rgba(255,255,255,0.15)"
              />
            );
          })}
        </g>

        {/* Cluster Nodes */}
        {CLUSTER_NODES.map((node) => {
          const isInfluenced = activeInfluenceNodes.has(node.id);
          const isConnected = isConnectedNode(node.id);
          const shouldExpand = phase === "synthesis" && isConnected;

          return (
            <g key={`node-${node.id}`}>
              {/* Pulse ring for connected nodes */}
              {shouldExpand && (
                <>
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r="16"
                    fill="none"
                    stroke="#B34B71"
                    strokeWidth="1.5"
                    initial={{ scale: 0.8, opacity: 0.9 }}
                    animate={{ scale: 3, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                  />
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r="16"
                    fill="none"
                    stroke="#B34B71"
                    strokeWidth="1"
                    initial={{ scale: 0.8, opacity: 0.7 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
                  />
                </>
              )}

              {/* Node outer ring */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="14"
                fill="none"
                strokeWidth="2"
                filter={isConnected || isInfluenced ? "url(#ctx-nodeGlow)" : "none"}
                initial={{ opacity: 0.4, scale: 1 }}
                animate={{
                  opacity: isInfluenced ? [0.3, 0.9, 0.3] : isConnected ? 1 : 0.4,
                  scale: shouldExpand ? 1.2 : 1,
                  stroke: isConnected
                    ? "#E05A8D"
                    : isInfluenced
                      ? "rgba(224, 90, 141, 0.8)"
                      : "rgba(255,255,255,0.4)",
                }}
                transition={{
                  opacity: isInfluenced
                    ? { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.3 },
                  scale: { type: "spring", stiffness: 600, damping: 20 },
                  stroke: { duration: 0.2 },
                }}
              />

              {/* Node inner core */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="5"
                initial={{ opacity: 0.5 }}
                animate={{
                  opacity: isConnected ? 1 : isInfluenced ? 0.8 : 0.5,
                  fill: isConnected
                    ? "#FFFFFF"
                    : isInfluenced
                      ? "rgba(224, 90, 141, 0.9)"
                      : "rgba(255,255,255,0.5)",
                  scale: isConnected ? [1, 1.3, 1] : 1,
                }}
                transition={{
                  duration: 0.3,
                  scale: isConnected
                    ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
                    : undefined,
                }}
              />

              {/* Node label with logo */}
              <motion.g
                animate={{ opacity: isConnected ? 1 : isInfluenced ? 0.85 : 0.6 }}
                transition={{ duration: 0.3 }}
              >
                <foreignObject x={node.x - 50} y={node.y + 20} width="18" height="18">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      opacity: isConnected ? 1 : isInfluenced ? 0.9 : 0.7,
                    }}
                  >
                    {LogoSVGs[node.logoType](16)}
                  </div>
                </foreignObject>
                <motion.text
                  x={node.x - 28}
                  y={node.y + 34}
                  textAnchor="start"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight={isConnected ? "bold" : "normal"}
                  style={{ letterSpacing: "0.02em" }}
                  animate={{
                    fill: isConnected
                      ? "rgba(255,255,255,0.95)"
                      : isInfluenced
                        ? "rgba(255,255,255,0.8)"
                        : "rgba(255,255,255,0.5)",
                  }}
                >
                  {node.label}
                </motion.text>
              </motion.g>
            </g>
          );
        })}

        {/* Query Node with Crosshair (Phase I) */}
        {phase === "scanning" && (
          <motion.g
            initial={{ x: -30, y: 210, opacity: 0 }}
            animate={{ x: queryPosition.x, y: queryPosition.y, opacity: 1 }}
            transition={{
              x: { type: "tween", ease: "easeOut", duration: 0.4 },
              y: { type: "tween", ease: "easeOut", duration: 0.4 },
              opacity: { duration: 0.3 },
            }}
          >
            <motion.circle
              cx="0"
              cy="0"
              r="90"
              fill="url(#ctx-influenceGradient)"
              animate={{ scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <circle cx="0" cy="0" r="12" fill="none" stroke="#E05A8D" strokeWidth="3" filter="url(#ctx-queryGlow)" />
            <circle cx="0" cy="0" r="4" fill="#FFFFFF" opacity="0.9" />
            <line x1="-22" y1="0" x2="-8" y2="0" stroke="#E05A8D" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="8" y1="0" x2="22" y2="0" stroke="#E05A8D" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="0" y1="-22" x2="0" y2="-8" stroke="#E05A8D" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="0" y1="8" x2="0" y2="22" stroke="#E05A8D" strokeWidth="2.5" strokeLinecap="round" />
            <motion.g animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
              <circle cx="0" cy="-30" r="2" fill="#E05A8D" opacity="0.6" />
            </motion.g>
          </motion.g>
        )}

        {/* Connection Line (Phase II-III) */}
        {(phase === "connecting" || phase === "synthesis") && (
          <>
            <motion.line
              x1={node1.x}
              y1={node1.y}
              x2={node1.x + (node2.x - node1.x) * (connectionProgress / 100)}
              y2={node1.y + (node2.y - node1.y) * (connectionProgress / 100)}
              stroke="#B34B71"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.3"
              filter="url(#ctx-lineGlow)"
            />
            <motion.line
              x1={node1.x}
              y1={node1.y}
              x2={node1.x + (node2.x - node1.x) * (connectionProgress / 100)}
              y2={node1.y + (node2.y - node1.y) * (connectionProgress / 100)}
              stroke="url(#ctx-connectionGradient)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {sparkProgress > 0 && sparkProgress < 100 && (
              <>
                <motion.circle
                  r="12"
                  fill="#E05A8D"
                  opacity="0.3"
                  filter="url(#ctx-synapseGlow)"
                  cx={node1.x + (node2.x - node1.x) * (sparkProgress / 100)}
                  cy={node1.y + (node2.y - node1.y) * (sparkProgress / 100)}
                />
                <motion.circle
                  r="6"
                  fill="#FFFFFF"
                  filter="url(#ctx-synapseGlow)"
                  cx={node1.x + (node2.x - node1.x) * (sparkProgress / 100)}
                  cy={node1.y + (node2.y - node1.y) * (sparkProgress / 100)}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.15, scale: { duration: 0.2 } }}
                />
              </>
            )}
          </>
        )}

        {/* Node ID Labels (Phase II-III) */}
        {showLabels && (
          <>
            <motion.rect
              x={node1.x - 45}
              y={node1.y - 38}
              width="90"
              height="16"
              rx="3"
              fill="rgba(0,0,0,0.6)"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.text
              x={node1.x}
              y={node1.y - 26}
              textAnchor="middle"
              fill="rgba(255,255,255,0.9)"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
              style={{ letterSpacing: "0.05em" }}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              ID: {node1.labelId}
            </motion.text>
            <motion.rect
              x={node2.x - 45}
              y={node2.y - 38}
              width="90"
              height="16"
              rx="3"
              fill="rgba(0,0,0,0.6)"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            />
            <motion.text
              x={node2.x}
              y={node2.y - 26}
              textAnchor="middle"
              fill="rgba(255,255,255,0.9)"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
              style={{ letterSpacing: "0.05em" }}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              ID: {node2.labelId}
            </motion.text>
          </>
        )}

        {/* Waveform Ripple (Phase III) */}
        {showRipple && (
          <>
            <motion.circle
              cx={midPoint.x}
              cy={midPoint.y}
              fill="url(#ctx-rippleGradient)"
              initial={{ r: 0, opacity: 1 }}
              animate={{ r: 150, opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            <motion.circle
              cx={midPoint.x}
              cy={midPoint.y}
              fill="none"
              stroke="#B34B71"
              strokeWidth="2"
              initial={{ r: 0, opacity: 0.8 }}
              animate={{ r: 120, opacity: 0 }}
              transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
            />
          </>
        )}

        {/* HUD Overlay */}
        {phase === "scanning" && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <rect x="110" y="12" width="120" height="22" rx="4" fill="rgba(0,0,0,0.5)" />
            <motion.circle
              cx="120"
              cy="23"
              r="3"
              fill="#E05A8D"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            <text
              x="175"
              y="28"
              textAnchor="middle"
              fill="rgba(255,255,255,0.7)"
              fontSize="10"
              fontFamily="monospace"
              style={{ letterSpacing: "0.1em" }}
            >
              SCANNING...
            </text>
          </motion.g>
        )}

        {phase === "synthesis" && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <rect x="100" y="365" width="140" height="24" rx="4" fill="rgba(0,0,0,0.5)" />
            <text
              x="170"
              y="382"
              textAnchor="middle"
              fill="rgba(255,255,255,0.7)"
              fontSize="11"
              fontFamily="monospace"
              style={{ letterSpacing: "0.08em" }}
            >
              SIMILARITY:{" "}
              <tspan fill="#E05A8D" fontWeight="bold">
                {similarityScore}%
              </tspan>
            </text>
          </motion.g>
        )}

        {phase === "synthesis" && similarityScore >= 94 && (
          <>
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <rect x="85" y="392" width="170" height="18" rx="3" fill="rgba(0,0,0,0.4)" />
              <text
                x="170"
                y="405"
                textAnchor="middle"
                fill="rgba(255,255,255,0.7)"
                fontSize="9"
                fontFamily="monospace"
                style={{ letterSpacing: "0.1em" }}
              >
                RELATION_STRENGTH: 0.98
              </text>
            </motion.g>
            <motion.g
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 500, damping: 20 }}
            >
              <rect
                x="95"
                y="10"
                width="150"
                height="26"
                rx="4"
                fill="rgba(179, 75, 113, 0.3)"
                stroke="#B34B71"
                strokeWidth="1"
              />
              <text
                x="170"
                y="28"
                textAnchor="middle"
                fill="#E05A8D"
                fontSize="12"
                fontFamily="monospace"
                fontWeight="bold"
                style={{ letterSpacing: "0.12em" }}
              >
                LINK: ESTABLISHED
              </text>
            </motion.g>
          </>
        )}
      </svg>
    </div>
  );
}
