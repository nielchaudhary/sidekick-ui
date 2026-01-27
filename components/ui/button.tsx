import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-500 ease-out disabled:pointer-events-none disabled:opacity-50 bg-black border border-white/10 text-white hover:bg-white/5 hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95 h-12 px-6 cursor-pointer outline-none focus:outline-none focus:ring-0 ${className || ""}`}
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
