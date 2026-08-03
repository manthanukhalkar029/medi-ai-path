import { Sparkles, Info } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  action,
  className,
}: {
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-3 flex items-center justify-between gap-3", className)}>
      <h2 className="font-display text-base font-semibold tracking-tight">{title}</h2>
      {action}
    </div>
  );
}

/**
 * Explainable AI panel — surfaces why the agent produced a recommendation.
 * Fed by the reasoning trace returned from the Claude function-calling layer.
 */
export function ExplainCard({
  reasons,
  confidence,
  className,
}: {
  reasons: string[];
  confidence: number;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-secondary/30 bg-secondary-container/60 p-3.5", className)}>
      <div className="mb-2 flex items-center gap-2 text-secondary-container-foreground">
        <Info className="size-4 shrink-0" />
        <span className="text-xs font-semibold uppercase tracking-wide">Why this answer</span>
        <span className="ml-auto rounded-full bg-surface/80 px-2 py-0.5 text-[11px] font-semibold text-secondary-container-foreground">
          {Math.round(confidence * 100)}% confidence
        </span>
      </div>
      <ul className="space-y-1.5">
        {reasons.map((r) => (
          <li key={r} className="flex gap-2 text-xs leading-relaxed text-secondary-container-foreground">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-secondary" />
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AgenticBadge({ label = "Agentic AI", className }: { label?: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-primary-container px-2.5 py-1 text-[11px] font-semibold text-primary-container-foreground",
        className,
      )}
    >
      <Sparkles className="size-3.5" />
      {label}
    </span>
  );
}

export function StatPill({
  label,
  value,
  tone = "muted",
}: {
  label: string;
  value: string;
  tone?: "muted" | "primary" | "accent" | "warning" | "destructive";
}) {
  const tones = {
    muted: "bg-muted text-muted-foreground",
    primary: "bg-primary-container text-primary-container-foreground",
    accent: "bg-accent-container text-accent-container-foreground",
    warning: "bg-warning-container text-warning-foreground",
    destructive: "bg-destructive-container text-destructive-container-foreground",
  } as const;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium", tones[tone])}>
      <span className="font-semibold">{value}</span>
      <span className="opacity-80">{label}</span>
    </span>
  );
}

export function EmptyState({ title, body, icon }: { title: string; body: string; icon?: ReactNode }) {
  return (
    <div className="surface-card flex flex-col items-center gap-2 px-6 py-12 text-center">
      {icon}
      <p className="font-display text-base font-semibold">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
