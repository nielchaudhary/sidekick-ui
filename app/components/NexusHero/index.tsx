"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SplineScene } from "@/components/ui/splite";

const PROCESS_STEPS = ["CAPTURE", "STORE", "INDEX", "RECALL", "REASON"];

function ProcessAnimation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), 4000);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % PROCESS_STEPS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative flex flex-col items-center">
        {/* Step indicator dots */}
        <div className="flex gap-2 mb-4">
          {PROCESS_STEPS.map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              animate={{
                backgroundColor: i === currentStep ? "#B34B71" : "rgba(255,255,255,0.3)",
                scale: i === currentStep ? 1.2 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* Animated word */}
        <div className="relative h-16 w-48 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentStep}
              initial={{ y: 40, opacity: 0, filter: "blur(8px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -40, opacity: 0, filter: "blur(8px)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute text-2xl md:text2xl font-bold tracking-[0.2em] text-white"
              style={{
                textShadow: "0 0 30px rgba(179, 75, 113, 0.8), 0 0 60px rgba(139, 45, 90, 0.5)",
              }}
            >
              {PROCESS_STEPS[currentStep]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Step number */}
        <motion.span
          key={`step-${currentStep}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          className="text-xs tracking-[0.3em] text-white/60 mt-2"
        >
          STEP {currentStep + 1}/5
        </motion.span>
      </div>
    </motion.div>
  );
}

export default function NexusHero() {
  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col md:flex-row items-center px-6 md:px-20">
      {/* Left: Content */}
      <div className="z-10 w-full md:w-1/2 flex flex-col gap-8 pt-24 md:pt-0 md:ml-20 lg:ml-32">
        <header className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-white leading-tight">
            Stop starting <br />
            <span className="text-zinc-600">from zero.</span>
          </h1>
          <p className="max-w-md text-zinc-400 text-lg leading-relaxed">
            Intelligent memory for operators who make high-stakes decisions under cognitive overload.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 border-l border-white/10 pl-6">
          {[
            { title: "Capture", desc: "WhatsApp-fast tradeoffs & reasoning." },
            { title: "Retrieve", desc: "Proactive recall of buried context." },
            { title: "Reason", desc: "A partner that challenges your bias." },
          ].map((item, i) => (
            <div key={i} className="group cursor-default">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <span className="text-[10px] text-zinc-600">0{i + 1}</span> {item.title}
              </h3>
              <p className="text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-6 mt-4">
          <button className="bg-[#4A0404] hover:bg-[#6B0606] text-white px-8 py-3 rounded-sm text-sm font-medium transition-all shadow-[0_0_20px_rgba(74,4,4,0.3)]">
            Start Your Sidekick
          </button>
          <button className="text-zinc-500 hover:text-white text-sm transition-colors flex items-center gap-2">
            Watch reasoning in action <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Right: Interactive 3D Scene */}
      <div className="absolute inset-0 md:relative md:w-1/2 h-full opacity-60 md:opacity-100">
        <div className="relative w-full h-full">
          <SplineScene scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" className="w-full h-full" />
          {/* Gradient overlay to colorize Spline character */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, #B34B71 0%, #8B2D5A 50%, #4A0404 100%)",
              mixBlendMode: "color",
            }}
          />
          {/* Process steps animation on robot chest */}
          <ProcessAnimation />
        </div>
      </div>
    </div>
  );
}
