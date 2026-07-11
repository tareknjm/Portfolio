import * as React from "react";
import { cn } from "@/lib/utils";

const variants = {
  default: "bg-primary/20 text-primary-light border border-primary/30",
  accent: "bg-accent/20 text-accent border border-accent/30",
  outline: "border border-white/20 text-white",
};

function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };