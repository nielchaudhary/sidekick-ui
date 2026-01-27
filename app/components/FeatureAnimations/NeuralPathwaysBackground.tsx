"use client";

import { motion } from "framer-motion";
import { PULSE } from "@/lib/animation-constants";

interface NeuralPathwaysBackgroundProps {
  isActive: boolean;
}

// Background Vector Neural Pathways - Animated during "thinking" state
export default function NeuralPathwaysBackground({ isActive }: NeuralPathwaysBackgroundProps) {
  // Generate neural pathway points
  const pathways = [
    { d: "M50,200 Q100,150 150,180 T250,160", delay: 0 },
    { d: "M80,220 Q130,170 180,200 T280,180", delay: 0.2 },
    { d: "M30,240 Q90,190 140,220 T240,200", delay: 0.4 },
    { d: "M100,260 Q150,210 200,240 T300,220", delay: 0.1 },
    { d: "M60,280 Q120,230 170,260 T270,240", delay: 0.3 },
  ];

  const nodes = [
    { cx: 100, cy: 180, delay: 0 },
    { cx: 180, cy: 200, delay: 0.15 },
    { cx: 140, cy: 240, delay: 0.3 },
    { cx: 220, cy: 220, delay: 0.45 },
    { cx: 260, cy: 190, delay: 0.2 },
    { cx: 80, cy: 260, delay: 0.35 },
  ];

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 340 420"
      fill="none"
      style={{ opacity: isActive ? 1 : 0.3, transition: "opacity 0.5s ease" }}
    >
      {/* Neural pathways */}
      {pathways.map((path, i) => (
        <motion.path
          key={`path-${i}`}
          d={path.d}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            isActive
              ? {
                  pathLength: [0, 1, 1, 0],
                  opacity: [0, 0.6, 0.6, 0],
                }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{
            duration: PULSE.duration * 3,
            delay: path.delay,
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Neural nodes */}
      {nodes.map((node, i) => (
        <g key={`node-${i}`}>
          {/* Pulse ring */}
          <motion.circle
            cx={node.cx}
            cy={node.cy}
            r="3"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
            initial={{ scale: 1, opacity: 0 }}
            animate={
              isActive
                ? {
                    scale: [1, 2.5],
                    opacity: [0.6, 0],
                  }
                : { scale: 1, opacity: 0 }
            }
            transition={{
              duration: PULSE.duration,
              delay: node.delay,
              repeat: isActive ? Infinity : 0,
              ease: "easeOut",
            }}
          />
          {/* Core node */}
          <motion.circle
            cx={node.cx}
            cy={node.cy}
            r="2"
            fill="rgba(255,255,255,0.5)"
            initial={{ scale: 0.8, opacity: 0.3 }}
            animate={
              isActive
                ? {
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.3, 0.8, 0.3],
                  }
                : { scale: 0.8, opacity: 0.3 }
            }
            transition={{
              duration: PULSE.duration,
              delay: node.delay,
              repeat: isActive ? Infinity : 0,
              ease: "easeInOut",
            }}
          />
        </g>
      ))}

      {/* Connecting data streams during active state */}
      {isActive && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.circle
              key={`stream-${i}`}
              r="1.5"
              fill="rgba(255,255,255,0.8)"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
                cx: [80 + i * 30, 170, 260 - i * 20],
                cy: [260 - i * 20, 200 + i * 10, 180 + i * 15],
              }}
              transition={{
                duration: PULSE.duration * 2,
                delay: i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </>
      )}
    </svg>
  );
}
