import { useState } from "react";
import { Sparkles, Info, ChevronRight, CheckCircle2, AlertTriangle, ShieldCheck, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function SectionHeading({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-3 flex items-end justify-between gap-3", className)}>
      <div>
        <h2 className="font-display text-base font-bold tracking-tight text-foreground sm:text-lg">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
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
  title = "Why this recommendation",
  className,
}: {
  reasons: string[];
  confidence: number;
  title?: string;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("rounded-2xl border border-secondary/30 bg-secondary-container/40 p-4 shadow-elevation-1 backdrop-blur-md", className)}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-secondary-container-foreground">
          <span className="grid size-7 place-items-center rounded-xl bg-secondary/15 text-secondary">
            <Zap className="size-4" />
          </span>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-secondary-container-foreground">{title}</span>
            <p className="text-[11px] text-muted-foreground">MediNav Agentic XAI Reasoner v2.4</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-secondary-container px-2.5 py-1 text-[11px] font-semibold text-secondary-container-foreground border border-secondary/20">
            {Math.round(confidence * 100)}% confidence
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs font-medium text-secondary-container-foreground hover:bg-secondary/10"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Hide trace" : "View reasoning"}
            <ChevronRight className={cn("ml-1 size-3.5 transition-transform duration-200", expanded && "rotate-90")} />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {(expanded || reasons.length <= 2) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 overflow-hidden border-t border-secondary/20 pt-3"
          >
            <ol className="space-y-2">
              {reasons.map((r, i) => (
                <li key={r} className="flex items-start gap-2.5 text-xs leading-relaxed text-foreground">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-secondary/20 text-[10px] font-bold text-secondary">
                    {i + 1}
                  </span>
                  <span>{r}</span>
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function AgenticBadge({ label = "Agentic AI Active", className }: { label?: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-primary-container/90 px-3 py-1 text-[11px] font-semibold text-primary-container-foreground border border-primary/20 shadow-elevation-1 backdrop-blur-md",
        className,
      )}
    >
      <Sparkles className="size-3.5 text-primary animate-pulse" />
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
  tone?: "muted" | "primary" | "accent" | "warning" | "destructive" | "secondary";
}) {
  const tones = {
    muted: "bg-muted text-muted-foreground border-border",
    primary: "bg-primary-container text-primary-container-foreground border-primary/20",
    accent: "bg-accent-container text-accent-container-foreground border-accent/20",
    secondary: "bg-secondary-container text-secondary-container-foreground border-secondary/20",
    warning: "bg-warning-container text-warning-foreground border-warning/20",
    destructive: "bg-destructive-container text-destructive-container-foreground border-destructive/20",
  } as const;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium shadow-elevation-1", tones[tone])}>
      <span className="font-bold">{value}</span>
      <span className="opacity-80">{label}</span>
    </span>
  );
}

export function EmptyState({ title, body, icon }: { title: string; body: string; icon?: ReactNode }) {
  return (
    <div className="surface-card flex flex-col items-center gap-2 px-6 py-12 text-center shadow-elevation-1">
      {icon || <Info className="size-10 text-muted-foreground/60" />}
      <p className="font-display text-base font-bold text-foreground">{title}</p>
      <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("surface-card shimmer-bg h-28 w-full rounded-2xl p-4", className)}>
      <div className="h-4 w-1/3 rounded-md bg-muted-foreground/20" />
      <div className="mt-3 h-3 w-2/3 rounded-md bg-muted-foreground/15" />
      <div className="mt-4 h-3 w-1/2 rounded-md bg-muted-foreground/10" />
    </div>
  );
}

