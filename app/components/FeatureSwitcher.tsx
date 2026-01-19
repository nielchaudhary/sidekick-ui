"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const features = [
  {
    id: "memory",
    label: "Memory",
    title: "Never lose a thread",
    description:
      "Sidekick archives every meeting, note, and thought in a searchable neural net that grows smarter over time.",
    icon: MemoryAnimation,
  },
  {
    id: "context",
    label: "Context",
    title: "Beyond keywords",
    description:
      "It understands the 'why' behind your projects, linking disparate ideas automatically across your entire knowledge base.",
    icon: ContextAnimation,
  },
  {
    id: "retention",
    label: "Retention",
    title: "Long-term storage",
    description:
      "High-stakes decisions preserved forever. Your data stays fresh, indexed, and accessible when you need it most.",
    icon: RetentionAnimation,
  },
  {
    id: "retrieval",
    label: "Retrieval",
    title: "Instant access",
    description:
      "Query your past thoughts with natural language and get precise answers in milliseconds, not minutes.",
    icon: RetrievalAnimation,
  },
  {
    id: "reasoning",
    label: "Reasoning",
    title: "A second brain",
    description:
      "Stress-test your logic and surface blind spots. Let AI challenge your assumptions before reality does.",
    icon: ReasoningAnimation,
  },
];

export default function FeatureSwitcher() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeFeature = features[activeIndex];

  return (
    <section id="features" className="relative py-24 px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-headline text-4xl md:text-5xl text-black mb-4 tracking-wide">
            BUILT FOR OPERATORS
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Five core capabilities that transform how you think, remember, and decide.
          </p>
        </motion.div>

        {/* Tab Navigation - Individual buttons above card */}
        <div className="flex justify-center gap-4 mb-8">
          {features.map((feature, index) => (
            <button
              key={feature.id}
              onClick={() => setActiveIndex(index)}
              className={`relative px-6 py-3 text-sm font-medium transition-all duration-300 border-b-2 ${
                activeIndex === index
                  ? "text-black border-black"
                  : "text-gray-400 border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
            >
              {feature.label}
            </button>
          ))}
        </div>

        {/* Feature Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative"
          >
            {/* Card with black border */}
            <div className="relative rounded-none p-8 md:p-12 border border-black bg-white">
              {/* Animation Area */}
              <div className="flex justify-center mb-10">
                <div className="w-72 h-48 flex items-center justify-center">
                  <activeFeature.icon />
                </div>
              </div>

              {/* Content */}
              <div className="text-center">
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="font-headline text-3xl md:text-4xl text-black mb-4 tracking-wide"
                >
                  {activeFeature.title.toUpperCase()}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-600 text-lg max-w-xl mx-auto leading-relaxed"
                >
                  {activeFeature.description}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Feature indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-1 transition-all duration-300 ${
                activeIndex === index
                  ? "w-8 bg-black"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   ANIMATED SVG ICONS - Black Monochrome
   ============================================ */

function MemoryAnimation() {
  const nodes = [
    { id: 1, cx: 60, cy: 40, delay: 0 },
    { id: 2, cx: 140, cy: 30, delay: 0.2 },
    { id: 3, cx: 220, cy: 45, delay: 0.4 },
    { id: 4, cx: 80, cy: 100, delay: 0.6 },
    { id: 5, cx: 200, cy: 95, delay: 0.8 },
    { id: 6, cx: 140, cy: 130, delay: 1.0 },
  ];

  const connections = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 0, to: 3 },
    { from: 2, to: 4 },
    { from: 3, to: 5 },
    { from: 4, to: 5 },
    { from: 1, to: 5 },
  ];

  return (
    <svg
      width="280"
      height="160"
      viewBox="0 0 280 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Connection lines with animated pulse */}
      {connections.map((conn, i) => (
        <motion.line
          key={`conn-${i}`}
          x1={nodes[conn.from].cx}
          y1={nodes[conn.from].cy}
          x2={nodes[conn.to].cx}
          y2={nodes[conn.to].cy}
          stroke="#000000"
          strokeWidth="1"
          initial={{ opacity: 0.1 }}
          animate={{
            opacity: [0.1, 0.4, 0.1],
            strokeWidth: [1, 1.5, 1],
          }}
          transition={{
            duration: 3,
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Memory nodes */}
      {nodes.map((node) => (
        <g key={`node-${node.id}`}>
          {/* Outer glow ring */}
          <motion.circle
            cx={node.cx}
            cy={node.cy}
            r="8"
            fill="none"
            stroke="#000000"
            strokeWidth="1"
            initial={{ scale: 1, opacity: 0 }}
            animate={{
              scale: [1, 2.5],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 2.5,
              delay: node.delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />

          {/* Main node */}
          <motion.circle
            cx={node.cx}
            cy={node.cy}
            r="6"
            initial={{ fill: "#e5e5e5" }}
            animate={{
              fill: ["#e5e5e5", "#000000", "#e5e5e5"],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2.5,
              delay: node.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Inner core */}
          <circle cx={node.cx} cy={node.cy} r="2" fill="#000000" opacity="0.8" />
        </g>
      ))}

      {/* Central brain icon */}
      <motion.g
        initial={{ scale: 0.9 }}
        animate={{ scale: [0.9, 1, 0.9] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="140" cy="80" r="20" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
        <path
          d="M132 80 Q140 70 148 80 Q140 90 132 80"
          stroke="#000000"
          strokeWidth="1.5"
          fill="none"
        />
      </motion.g>
    </svg>
  );
}

function ContextAnimation() {
  return (
    <svg
      width="280"
      height="160"
      viewBox="0 0 280 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Layered context circles */}
      <motion.circle
        cx="140"
        cy="80"
        r="60"
        stroke="#000000"
        strokeWidth="1"
        fill="none"
        opacity="0.2"
        initial={{ scale: 0.8 }}
        animate={{ scale: [0.8, 1, 0.8], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="140"
        cy="80"
        r="45"
        stroke="#000000"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
        initial={{ scale: 0.9 }}
        animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.circle
        cx="140"
        cy="80"
        r="30"
        stroke="#000000"
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Orbiting data points */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <motion.g
          key={`orbit-${i}`}
          initial={{ rotate: angle }}
          animate={{ rotate: angle + 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "140px 80px" }}
        >
          <motion.circle
            cx="140"
            cy="20"
            r="4"
            fill="#000000"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
          />
        </motion.g>
      ))}

      {/* Center hub */}
      <motion.circle
        cx="140"
        cy="80"
        r="12"
        fill="#ffffff"
        stroke="#000000"
        strokeWidth="2"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle cx="140" cy="80" r="4" fill="#000000" />

      {/* Connection spokes */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <motion.line
          key={`spoke-${i}`}
          x1="140"
          y1="80"
          x2={140 + Math.cos((angle * Math.PI) / 180) * 55}
          y2={80 + Math.sin((angle * Math.PI) / 180) * 55}
          stroke="#000000"
          strokeWidth="1"
          strokeDasharray="4 4"
          initial={{ opacity: 0.1 }}
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
        />
      ))}
    </svg>
  );
}

function RetentionAnimation() {
  const layers = [
    { y: 130, delay: 0 },
    { y: 105, delay: 0.15 },
    { y: 80, delay: 0.3 },
    { y: 55, delay: 0.45 },
    { y: 30, delay: 0.6 },
  ];

  return (
    <svg
      width="280"
      height="160"
      viewBox="0 0 280 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Stacked storage layers */}
      {layers.map((layer, i) => (
        <g key={`layer-${i}`}>
          {/* Layer shadow/depth */}
          <motion.ellipse
            cx="140"
            cy={layer.y}
            rx="70"
            ry="18"
            fill="none"
            stroke="#000000"
            strokeWidth="1.5"
            initial={{ opacity: 0.2 + i * 0.15 }}
            animate={{
              opacity: [0.2 + i * 0.15, 0.4 + i * 0.15, 0.2 + i * 0.15],
              strokeWidth: [1.5, 2, 1.5],
            }}
            transition={{
              duration: 3,
              delay: layer.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Data particles on layer */}
          {i === 0 && (
            <motion.g
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <circle cx="110" cy={layer.y - 5} r="2" fill="#000000" opacity="0.6" />
              <circle cx="140" cy={layer.y - 5} r="2" fill="#000000" opacity="0.6" />
              <circle cx="170" cy={layer.y - 5} r="2" fill="#000000" opacity="0.6" />
            </motion.g>
          )}
        </g>
      ))}

      {/* Vertical connecting lines */}
      <line x1="70" y1="30" x2="70" y2="130" stroke="#000000" strokeWidth="1" opacity="0.3" />
      <line x1="210" y1="30" x2="210" y2="130" stroke="#000000" strokeWidth="1" opacity="0.3" />

      {/* Data flow animation */}
      <motion.circle
        cx="140"
        cy="30"
        r="3"
        fill="#000000"
        initial={{ cy: 30, opacity: 1 }}
        animate={{ cy: [30, 130], opacity: [1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeIn", repeatDelay: 1 }}
      />

      {/* Lock icon at top */}
      <motion.g
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="130" y="5" width="20" height="14" rx="2" stroke="#000000" strokeWidth="1.5" fill="none" />
        <path d="M134 5 V0 A6 6 0 0 1 146 0 V5" stroke="#000000" strokeWidth="1.5" fill="none" />
        <circle cx="140" cy="12" r="2" fill="#000000" />
      </motion.g>
    </svg>
  );
}

function RetrievalAnimation() {
  return (
    <svg
      width="280"
      height="160"
      viewBox="0 0 280 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Search magnifying glass */}
      <motion.g
        animate={{ x: [0, 10, 0], y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="110" cy="70" r="35" stroke="#000000" strokeWidth="2" fill="none" />
        <motion.line
          x1="135"
          y1="95"
          x2="160"
          y2="120"
          stroke="#000000"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{ strokeWidth: [3, 4, 3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.g>

      {/* Data points being found */}
      {[
        { cx: 95, cy: 60, delay: 0 },
        { cx: 110, cy: 75, delay: 0.3 },
        { cx: 125, cy: 65, delay: 0.6 },
        { cx: 105, cy: 85, delay: 0.9 },
      ].map((point, i) => (
        <motion.circle
          key={`point-${i}`}
          cx={point.cx}
          cy={point.cy}
          r="3"
          fill="#000000"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 1, 0],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: point.delay,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      ))}

      {/* Speed/retrieval lines */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
      >
        <line x1="170" y1="50" x2="220" y2="35" stroke="#000000" strokeWidth="1.5" />
        <line x1="175" y1="70" x2="230" y2="70" stroke="#000000" strokeWidth="1.5" />
        <line x1="170" y1="90" x2="220" y2="105" stroke="#000000" strokeWidth="1.5" />
      </motion.g>

      {/* Result indicators */}
      <motion.g
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: [20, 0], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
      >
        <circle cx="230" cy="35" r="5" fill="#000000" />
        <circle cx="245" cy="70" r="5" fill="#000000" />
        <circle cx="230" cy="105" r="5" fill="#000000" />
      </motion.g>

      {/* Milliseconds indicator */}
      <motion.text
        x="200"
        y="145"
        fontSize="10"
        fill="#000000"
        opacity="0.7"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        &lt;100ms
      </motion.text>
    </svg>
  );
}

function ReasoningAnimation() {
  return (
    <svg
      width="280"
      height="160"
      viewBox="0 0 280 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Brain outline */}
      <motion.path
        d="M140 20 C100 20 70 50 70 85 C70 120 100 145 140 145 C180 145 210 120 210 85 C210 50 180 20 140 20"
        stroke="#000000"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* Brain hemispheres divider */}
      <motion.path
        d="M140 25 C140 50 120 80 140 145"
        stroke="#000000"
        strokeWidth="1"
        fill="none"
        opacity="0.4"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Neural pathways */}
      {[
        { d: "M90 60 Q110 70 100 90", delay: 0 },
        { d: "M100 100 Q120 110 110 130", delay: 0.3 },
        { d: "M180 50 Q160 65 170 85", delay: 0.6 },
        { d: "M175 95 Q155 110 165 125", delay: 0.9 },
      ].map((path, i) => (
        <motion.path
          key={`path-${i}`}
          d={path.d}
          stroke="#000000"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 1, 0],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: 2.5,
            delay: path.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Decision nodes */}
      {[
        { cx: 100, cy: 65, delay: 0 },
        { cx: 170, cy: 60, delay: 0.4 },
        { cx: 140, cy: 100, delay: 0.8 },
      ].map((node, i) => (
        <g key={`decision-${i}`}>
          <motion.circle
            cx={node.cx}
            cy={node.cy}
            r="8"
            fill="none"
            stroke="#000000"
            strokeWidth="1"
            initial={{ scale: 1, opacity: 0 }}
            animate={{
              scale: [1, 1.8],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: 2,
              delay: node.delay,
              repeat: Infinity,
            }}
          />
          <motion.circle
            cx={node.cx}
            cy={node.cy}
            r="5"
            fill="#000000"
            animate={{
              scale: [1, 1.2, 1],
              fill: ["#000000", "#333333", "#000000"],
            }}
            transition={{
              duration: 2,
              delay: node.delay,
              repeat: Infinity,
            }}
          />
        </g>
      ))}

      {/* Thought bubbles */}
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="220" cy="35" r="12" stroke="#000000" strokeWidth="1.5" fill="none" opacity="0.6" />
        <circle cx="235" cy="20" r="7" stroke="#000000" strokeWidth="1" fill="none" opacity="0.4" />
        <circle cx="245" cy="10" r="4" stroke="#000000" strokeWidth="1" fill="none" opacity="0.3" />
      </motion.g>

      {/* Question mark in thought */}
      <motion.text
        x="216"
        y="40"
        fontSize="14"
        fill="#000000"
        fontWeight="bold"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ?
      </motion.text>
    </svg>
  );
}
