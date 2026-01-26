"use client";

import { ChevronDown } from "lucide-react";
import { SplineScene } from "@/components/ui/splite";

export default function NexusHero() {
  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col md:flex-row items-center px-6 md:px-20">
      {/* Left: Content */}
      <div className="z-10 w-full md:w-1/2 flex flex-col gap-8 pt-24 md:pt-0">
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
        <SplineScene scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" className="w-full h-full" />
      </div>
    </div>
  );
}
