"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { delay } from "@/lib/utils";
import type { DataPoint } from "@/types/animations";

/** Data points configuration - one will be "the answer" */
const DATA_POINTS: DataPoint[] = [
  { x: 60, y: 80, isAnswer: false, label: "Meeting.doc" },
  { x: 120, y: 140, isAnswer: false, label: "Budget_v2.xlsx" },
  { x: 180, y: 100, isAnswer: true, label: "Approval_Q3.pdf" },
  { x: 240, y: 160, isAnswer: false, label: "Notes_draft.md" },
  { x: 100, y: 200, isAnswer: false, label: "Slack_export.json" },
  { x: 200, y: 60, isAnswer: false, label: "PR_review.diff" },
  { x: 280, y: 120, isAnswer: false, label: "Config.yaml" },
];

/**
 * RetrievalAnimation Component
 * Displays a quantum scan laser beam sweeping over data to find matches
 */
export default function RetrievalAnimation() {
  const [scanComplete, setScanComplete] = useState(false);
  const [cycleKey, setCycleKey] = useState(0);

  const dataPoints = useMemo(() => DATA_POINTS, []);

  /** Animation cycle */
  useEffect(() => {
    let cancelled = false;

    const runCycle = async () => {
      setScanComplete(false);
      await delay(3000); // Scan duration
      if (cancelled) return;
      setScanComplete(true);
      await delay(3000); // Display answer
      if (!cancelled) {
        setCycleKey((prev) => prev + 1);
      }
    };

    runCycle();

    return () => {
      cancelled = true;
    };
  }, [cycleKey]);

  return (
    <div className="relative w-[340px] h-[280px] overflow-hidden rounded-2xl">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 340 280"
        key={`scan-${cycleKey}`}
      >
        <defs>
          {/* Laser beam gradient */}
          <linearGradient id="laserGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="40%" stopColor="#B34B71" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#B34B71" stopOpacity="1" />
            <stop offset="60%" stopColor="#B34B71" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* Glow for answer node */}
          <filter id="answerGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Blur filter for unfocused data */}
          <filter id="dataBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" />
          </filter>

          {/* Scan line clip path */}
          <clipPath id="scanReveal">
            <motion.rect
              x="0"
              y="0"
              width="340"
              height="280"
              initial={{ x: -340 }}
              animate={{ x: 0 }}
              transition={{ duration: 3, ease: [0.45, 0, 0.55, 1] }}
            />
          </clipPath>
        </defs>

        {/* Background grid pattern */}
        {[...Array(8)].map((_, i) => (
          <line
            key={`vline-${i}`}
            x1={40 + i * 40}
            y1="20"
            x2={40 + i * 40}
            y2="260"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}
        {[...Array(6)].map((_, i) => (
          <line
            key={`hline-${i}`}
            x1="20"
            y1={40 + i * 40}
            x2="320"
            y2={40 + i * 40}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}

        {/* Blurred data points (before scan) */}
        {dataPoints.map((point, i) => (
          <g key={`blur-point-${i}`}>
            <motion.circle
              cx={point.x}
              cy={point.y}
              r={point.isAnswer ? 8 : 5}
              fill="rgba(255,255,255,0.2)"
              filter="url(#dataBlur)"
              initial={{ opacity: 1 }}
              animate={{ opacity: scanComplete ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            />
          </g>
        ))}

        {/* Scanning laser beam */}
        <motion.g
          initial={{ x: -60 }}
          animate={{ x: 340 }}
          transition={{ duration: 3, ease: [0.45, 0, 0.55, 1] }}
        >
          {/* Vertical laser line */}
          <rect x="-30" y="0" width="60" height="280" fill="url(#laserGradient)" />

          {/* Bright center line */}
          <motion.line
            x1="0"
            y1="0"
            x2="0"
            y2="280"
            stroke="#B34B71"
            strokeWidth="2"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 0.1, repeat: Infinity }}
          />

          {/* Scanning particles */}
          {[...Array(5)].map((_, i) => (
            <motion.circle
              key={`scan-particle-${i}`}
              cx="0"
              cy={50 + i * 45}
              r="2"
              fill="#FFFFFF"
              animate={{
                opacity: [0, 1, 0],
                cy: [50 + i * 45, 60 + i * 45, 50 + i * 45],
              }}
              transition={{
                duration: 0.3,
                delay: i * 0.05,
                repeat: Infinity,
              }}
            />
          ))}
        </motion.g>

        {/* Revealed data points (after scan passes) */}
        <g clipPath="url(#scanReveal)">
          {dataPoints.map((point, i) => (
            <g key={`reveal-point-${i}`}>
              {/* Non-answer points */}
              {!point.isAnswer && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: scanComplete ? 0.3 : 0.6 }}
                  transition={{ duration: 0.5, delay: scanComplete ? 0 : 0.5 }}
                >
                  <circle cx={point.x} cy={point.y} r="5" fill="rgba(255,255,255,0.4)" />
                  <text
                    x={point.x}
                    y={point.y + 18}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.3)"
                    fontSize="7"
                    fontFamily="monospace"
                  >
                    {point.label}
                  </text>
                </motion.g>
              )}

              {/* THE ANSWER */}
              {point.isAnswer && (
                <motion.g
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{
                    scale: scanComplete ? 1.2 : 1,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.5,
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                >
                  {/* Ruby bloom effect */}
                  {scanComplete && (
                    <>
                      <motion.circle
                        cx={point.x}
                        cy={point.y}
                        r="20"
                        fill="none"
                        stroke="#B34B71"
                        strokeWidth="2"
                        initial={{ scale: 0.5, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <motion.circle
                        cx={point.x}
                        cy={point.y}
                        r="30"
                        fill="rgba(179, 75, 113, 0.3)"
                        filter="url(#answerGlow)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.4, 0.2] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </>
                  )}

                  {/* Answer node */}
                  <motion.circle
                    cx={point.x}
                    cy={point.y}
                    r={scanComplete ? 12 : 8}
                    fill={scanComplete ? "#B34B71" : "rgba(255,255,255,0.6)"}
                    filter={scanComplete ? "url(#answerGlow)" : "none"}
                    animate={{
                      fill: scanComplete ? "#B34B71" : "rgba(255,255,255,0.6)",
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Inner glow */}
                  <motion.circle
                    cx={point.x}
                    cy={point.y}
                    r={scanComplete ? 6 : 4}
                    fill="#FFFFFF"
                    animate={{ scale: scanComplete ? [1, 1.2, 1] : 1 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />

                  {/* Answer label */}
                  <motion.text
                    x={point.x}
                    y={point.y + 28}
                    textAnchor="middle"
                    fill={scanComplete ? "#FFFFFF" : "rgba(255,255,255,0.5)"}
                    fontSize={scanComplete ? "9" : "7"}
                    fontFamily="monospace"
                    fontWeight={scanComplete ? "bold" : "normal"}
                    animate={{
                      fill: scanComplete ? "#FFFFFF" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {point.label}
                  </motion.text>

                  {/* "MATCH" indicator */}
                  {scanComplete && (
                    <motion.g
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      <rect
                        x={point.x - 22}
                        y={point.y - 30}
                        width="44"
                        height="14"
                        rx="2"
                        fill="#B34B71"
                      />
                      <text
                        x={point.x}
                        y={point.y - 20}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="8"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        MATCH
                      </text>
                    </motion.g>
                  )}
                </motion.g>
              )}
            </g>
          ))}
        </g>

        {/* Latency indicator */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: scanComplete ? 1 : 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <text
            x="170"
            y="265"
            textAnchor="middle"
            fill="rgba(255,255,255,0.7)"
            fontSize="10"
            fontFamily="monospace"
            letterSpacing="0.1em"
          >
            <tspan fill="#B34B71" fontWeight="bold">
              47ms
            </tspan>
            <tspan fill="rgba(255,255,255,0.5)"> — INSTANT RETRIEVAL</tspan>
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
