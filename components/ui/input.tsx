import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-12 w-full rounded-xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white placeholder:text-white/50 backdrop-blur-sm transition-all duration-500 ease-out outline-none focus:border-white/40 hover:border-white/30 hover:bg-black/50 focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
