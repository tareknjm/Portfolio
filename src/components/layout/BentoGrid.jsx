import { cn } from "@/lib/utils";

export function BentoGrid({ children, className }) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoItem({ children, className, span = "" }) {
  return (
    <div className={cn("bento-card", span, className)}>{children}</div>
  );
}