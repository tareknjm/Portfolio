import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };