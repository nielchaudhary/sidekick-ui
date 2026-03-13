"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { delay } from "@/lib/utils";
import type { ContextAnimationPhase, ClusterNode } from "@/types/animations";
import { LogoSVGs } from "@/app/components/icons/brand-logos";

/** Canvas dimensions */
const WIDTH = 340;
const HEIGHT = 420;

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
const ContextAnimation = memo(function ContextAnimation() {
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
            <circle
              cx="0"
              cy="0"
              r="12"
              fill="none"
              stroke="#E05A8D"
              strokeWidth="3"
              filter="url(#ctx-queryGlow)"
            />
            <circle cx="0" cy="0" r="4" fill="#FFFFFF" opacity="0.9" />
            <line
              x1="-22"
              y1="0"
              x2="-8"
              y2="0"
              stroke="#E05A8D"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="8"
              y1="0"
              x2="22"
              y2="0"
              stroke="#E05A8D"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="0"
              y1="-22"
              x2="0"
              y2="-8"
              stroke="#E05A8D"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="0"
              y1="8"
              x2="0"
              y2="22"
              stroke="#E05A8D"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
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
});

export default ContextAnimation;
