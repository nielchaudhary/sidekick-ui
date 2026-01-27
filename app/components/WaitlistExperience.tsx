"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactElement } from "react";
import { Spotlight } from "./Spotlight";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";

// --- Enhanced Sub-components with focus-ring removal ---

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-12 w-full rounded-xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white placeholder:text-white/50 backdrop-blur-sm transition-all duration-500 ease-out outline-none focus:border-white/40 hover:border-white/30 hover:bg-black/50 focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-500 ease-out disabled:pointer-events-none disabled:opacity-50 bg-black border border-white/10 text-white hover:bg-white/5 hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95 h-12 px-6 cursor-pointer outline-none focus:outline-none focus:ring-0 ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

// --- Main Experience ---

export function WaitlistExperience(): ReactElement {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Engineering Note: Use a target date for the countdown to avoid drift
  const targetDate = useMemo(() => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), []);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    const timer = setInterval(() => setTimeLeft(calculateTime()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && role) {
      setIsSubmitted(true);
      // Logic for backend submission goes here
    }
  };

  return (
    <section className="relative w-full overflow-hidden py-20 lg:py-40 bg-black flex items-center justify-center">
      {/* Cinematic Spotlight Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Spotlight
          gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, rgba(255, 51, 26, 0.15) 0%, rgba(204, 26, 153, 0.05) 50%, transparent 80%)"
          gradientSecond="radial-gradient(50% 50% at 50% 50%, rgba(204, 26, 153, 0.12) 0%, rgba(102, 13, 204, 0.06) 80%, transparent 100%)"
          translateY={-200}
          width={600}
          height={1400}
        />
      </div>

      <div className="relative z-20 w-full max-w-[440px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
        >
          {/* Subtle Glass Reflection */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div key="form" exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }}>
                <header className="mb-10 text-center">
                  <h1 className="text-4xl font-light text-white mb-4 tracking-tight font-serif">Join the waitlist</h1>
                  <p className="text-white/60 text-base font-medium">
                    Early access to Sidekick. <br />
                    Your second brain in action.
                  </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                  {/* Role Dropdown - Cinematic Smooth Feel with No Persistent Focus */}
                  <Select onValueChange={setRole} required>
                    <SelectTrigger className="w-full bg-white/[0.05] border-white/10 text-white h-12 rounded-xl">
                      <SelectValue placeholder="What is your role?" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0A0A0A] border-white/10 text-white rounded-xl shadow-2xl">
                      <SelectItem value="engineer" className="hover:bg-white/5 focus:bg-white/10">
                        Software Engineer
                      </SelectItem>
                      <SelectItem value="pm" className="hover:bg-white/5 focus:bg-white/10">
                        Product Manager
                      </SelectItem>
                      <SelectItem value="executive" className="hover:bg-white/5 focus:bg-white/10">
                        Executive
                      </SelectItem>
                      <SelectItem value="founder" className="hover:bg-white/5 focus:bg-white/10">
                        Founder
                      </SelectItem>
                      <SelectItem value="student" className="hover:bg-white/5 focus:bg-white/10">
                        Student
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex flex-col gap-3">
                    <Input
                      type="email"
                      placeholder="tech@sidekick.ai"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Button type="submit" className="w-full">
                      Get Notified
                    </Button>
                  </div>
                </form>

                {/* Countdown Timer */}
                <div className="grid grid-cols-4 gap-2 border-t border-white/5 pt-8">
                  {Object.entries(timeLeft).map(([label, value]) => (
                    <div key={label} className="text-center">
                      <div className="text-2xl font-light text-white tabular-nums">
                        {value.toString().padStart(2, "0")}
                      </div>
                      <div className="text-[10px] text-white/40 uppercase tracking-[0.1em] font-medium">{label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <motion.svg
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </motion.svg>
                </div>
                <h3 className="text-2xl font-light text-white mb-2 font-serif">You&apos;re in.</h3>
                <p className="text-white/50 text-sm">
                  We&apos;ll reach out soon. Welcome to the future of productivity.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Outer ambient glow */}
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-r from-red-500/5 to-purple-600/5 blur-3xl -z-10 scale-110" />
      </div>
    </section>
  );
}
