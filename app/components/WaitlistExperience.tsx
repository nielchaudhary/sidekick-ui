"use client";

import React from "react";
import { motion } from "framer-motion";
import type { ReactElement } from "react";
import { useState, useEffect } from "react";
import { Spotlight } from "./Spotlight";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
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
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export function WaitlistExperience(): ReactElement {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 30,
    hours: 24,
    minutes: 60,
    seconds: 60,
  });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && role) {
      setIsSubmitted(true);
      console.log("Submission:", { email, role });
    }
  };

  return (
    <section className="relative w-full overflow-hidden py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 2xl:py-40">
      {/* Cinematic Spotlight Background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: "circOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="absolute inset-0 z-0"
        style={{ mixBlendMode: "screen" }}
      >
        <Spotlight
          gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, rgba(255, 51, 26, 0.12) 0%, rgba(204, 26, 153, 0.04) 50%, transparent 80%)"
          gradientSecond="radial-gradient(50% 50% at 50% 50%, rgba(204, 26, 153, 0.10) 0%, rgba(102, 13, 204, 0.04) 80%, transparent 100%)"
          gradientThird="radial-gradient(50% 50% at 50% 50%, rgba(102, 13, 204, 0.08) 0%, rgba(102, 13, 204, 0.02) 80%, transparent 100%)"
          translateY={-200}
          width={560}
          height={1380}
          smallWidth={240}
          duration={7}
          xOffset={100}
        />
      </motion.div>

      {/* Content Layer */}
      <div className="relative z-20">
        <div className="flex items-center justify-center px-4">
          <div className="relative">
            <div className="relative backdrop-blur-xl bg-black border border-white/20 rounded-3xl p-6 sm:p-8 w-full max-w-[420px] shadow-2xl">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

              <div className="relative z-10">
                {!isSubmitted ? (
                  <>
                    <div className="mb-6 sm:mb-8 text-center">
                      <h1
                        className="text-3xl sm:text-4xl font-light text-white mb-3 sm:mb-4 tracking-wide"
                        style={{
                          color: "#FFFFFF",
                          fontFamily: '"Editorial New", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
                          fontWeight: 300,
                        }}
                      >
                        Join the waitlist
                      </h1>
                      <p className="text-white/70 text-sm sm:text-base leading-relaxed font-semibold">
                        Get early access to Sidekick,
                        <br className="hidden sm:block" />
                        <span className="sm:hidden font-semibold"> </span>
                        your second brain in action!
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
                      {/* Role Dropdown */}
                      <Select onValueChange={setRole} required>
                        <SelectTrigger className="w-full bg-black/40 border-white/20 text-white h-12 rounded-xl focus:ring-white/20 backdrop-blur-sm">
                          <SelectValue placeholder="What is your role?" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/20 text-white">
                          <SelectItem value="engineer">Software Engineer</SelectItem>
                          <SelectItem value="pm">Product Manager</SelectItem>
                          <SelectItem value="executive">Executive</SelectItem>
                          <SelectItem value="founder">Founder</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                          type="email"
                          placeholder="tech@sidekick.ai"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="flex-1 bg-black/40 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20 h-12 rounded-xl backdrop-blur-sm"
                        />
                        <Button
                          type="submit"
                          className="h-12 px-6 bg-black border  border-gray-600  text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 cursor-pointer"
                        >
                          Get Notified
                        </Button>
                      </div>
                    </form>

                    <div className="flex items-center justify-center gap-4 sm:gap-6 text-center">
                      <div>
                        <div className="text-xl sm:text-2xl font-light text-white">{timeLeft.days}</div>
                        <div className="text-xs text-white/60 uppercase tracking-wide">days</div>
                      </div>
                      <div className="text-white/40">|</div>
                      <div>
                        <div className="text-xl sm:text-2xl font-light text-white">{timeLeft.hours}</div>
                        <div className="text-xs text-white/60 uppercase tracking-wide">hours</div>
                      </div>
                      <div className="text-white/40">|</div>
                      <div>
                        <div className="text-xl sm:text-2xl font-light text-white">{timeLeft.minutes}</div>
                        <div className="text-xs text-white/60 uppercase tracking-wide">minutes</div>
                      </div>
                      <div className="text-white/40">|</div>
                      <div>
                        <div className="text-xl sm:text-2xl font-light text-white">{timeLeft.seconds}</div>
                        <div className="text-xs text-white/60 uppercase tracking-wide">seconds</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-400/30 to-emerald-500/30 flex items-center justify-center border border-green-400/40">
                      <svg
                        className="w-8 h-8 text-green-400 drop-shadow-lg"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-lg">you&apos;re on the list!</h3>
                    <p className="text-white/90 text-sm drop-shadow-md">
                      We&apos;ll notify you when we launch. Thanks for joining!
                    </p>
                  </div>
                )}
              </div>

              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-transparent via-white/[0.02] to-white/[0.05] pointer-events-none" />
            </div>

            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-500/10 to-purple-600/10 blur-xl scale-110 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
