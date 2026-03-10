import * as React from "react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-500 ease-out disabled:pointer-events-none disabled:opacity-50 active:scale-95 h-12 px-6 cursor-pointer outline-none focus:outline-none focus:ring-0 w-full";

const variants = {
  default:
    "bg-white text-black hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]",
  outline:
    "bg-black border border-white/10 text-white hover:bg-white/5 hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]",
} as const;

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <button
        className={cn(base, variants[variant], className)}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
