"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactElement } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// --- Main Experience ---

export function WaitlistExperience(): ReactElement {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const calculateTime = useCallback(() => {
    // Target date: March 1st, 2026 at 12:00 PM (noon)
    const targetDate = new Date("2026-03-01T12:00:00");
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, []);

  const [timeLeft, setTimeLeft] = useState(calculateTime);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTime()), 1000);
    return () => clearInterval(timer);
  }, [calculateTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Check if role is selected
    if (!role) {
      toast.error("Selection Required", {
        description: "Please choose a role before joining the waitlist.",
      });
      return;
    }

    // Validation: Check if email is provided
    if (!email) {
      toast.error("Email Required", {
        description: "Please enter your email address to continue.",
      });
      return;
    }

    // Validation: Check if email format is valid
    if (!email.includes("@") || !email.includes(".")) {
      toast.error("Invalid Email", {
        description: "Please enter a valid email address (e.g., tech@sidekick.ai).",
      });
      return;
    }

    // Success: Submit the form
    setIsSubmitted(true);
    toast.success("Welcome to the future", {
      description: "You've been added to the waitlist. We'll reach out soon.",
    });

    // Logic for backend submission goes here
  };

  return (
    <section className="relative w-full overflow-hidden pt-12 pb-8 lg:pt-20 lg:pb-12 bg-black flex flex-col items-center justify-center">
      {/* Section Header */}
      <h2
        className="text-center text-zinc-600 text-2xl sm:text-3xl md:text-3xl lg:text-5xl tracking-[-0.02em] leading-[0.9] mb-12 px-6"
        style={{
          fontFamily:
            '"Editorial New", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
          fontWeight: 300,
          backgroundClip: "text",
        }}
      >
        Memory is leverage, build yours first{" "}
      </h2>

      <div className="relative z-20 w-full max-w-[600px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 51, 26, 0.08) 0%, rgba(204, 26, 153, 0.06) 50%, rgba(102, 13, 204, 0.04) 100%)",
          }}
        >
          {/* Subtle Glass Reflection */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <header className="mb-10 text-center">
                  <h1 className="text-4xl font-light text-white mb-4 tracking-tight font-serif">
                    Join the waitlist
                  </h1>
                  <p className="text-white/60 text-base font-medium">
                    Get Early access to Sidekick, <br />
                    <span className="font-semibold">your second brain in action</span>
                  </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-4 mb-8 flex flex-col items-center">
                  {/* Role Dropdown - Cinematic Smooth Feel with No Persistent Focus */}
                  <Select onValueChange={setRole}>
                    <SelectTrigger className="w-[75%] bg-black/40 border border-white/20 text-white h-12 rounded-xl backdrop-blur-sm hover:border-white/30 hover:bg-black/50 transition-all duration-500 ease-out">
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

                  <div className="flex flex-col gap-3 w-[75%] items-center">
                    <Input
                      type="text"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="off"
                      className="w-full"
                    />
                    <Button
                      type="submit"
                      className="w-[75%] bg-black border border-white/20 hover:bg-black/80"
                    >
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
                      <div className="text-[10px] text-white/40 uppercase tracking-[0.1em] font-medium">
                        {label}
                      </div>
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M5 13l4 4L19 7"
                    />
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
