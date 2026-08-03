import { cn } from "@/lib/utils";

/** MediNav AI identity mark — a wayfinding pin fused with a care cross. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn("gradient-hero grid place-items-center rounded-2xl text-primary-foreground shadow-elevation-2", className)}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-[62%]">
        <path
          d="M12 21.5s7-5.6 7-11.1A7 7 0 1 0 5 10.4c0 5.5 7 11.1 7 11.1Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path d="M12 6.6v6.6M8.7 9.9h6.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display text-xl font-semibold tracking-tight", className)}>
      Medi<span className="text-gradient-brand">Nav</span>{" "}
      <span className="text-muted-foreground text-sm font-medium align-middle">AI</span>
    </span>
  );
}
