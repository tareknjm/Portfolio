import * as React from "react";
import { cn } from "@/lib/utils";

const variants = {
  default: "bg-primary text-white hover:bg-primary-dark shadow-glow",
  outline: "border border-white/20 bg-transparent hover:bg-white/10 text-white",
  ghost: "hover:bg-white/10 text-white",
  accent: "bg-accent text-background hover:bg-accent/90 shadow-glow-cyan",
};

const sizes = {
  default: "h-11 px-6 py-2",
  sm: "h-9 px-4 text-sm",
  lg: "h-14 px-8 text-lg",
  icon: "h-10 w-10",
};

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };