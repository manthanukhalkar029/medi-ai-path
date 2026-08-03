import { createFileRoute } from "@tanstack/react-router";
import { Accessibility, Compass, Siren } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatPill } from "@/components/primitives";
import { HISTORY } from "@/lib/hospital-data";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Navigation History — MediNav AI" },
      { name: "description", content: "Every route you have walked in the hospital, with distance, duration and mode." },
      { property: "og:title", content: "Navigation History — MediNav AI" },
      { property: "og:description", content: "Replay any previous hospital route in one tap." },
    ],
  }),
  component: HistoryScreen,
});

function HistoryScreen() {
  return (
    <AppShell title="Navigation history" subtitle={`${HISTORY.length} journeys recorded`}>
      <ul className="space-y-3">
        {HISTORY.map((h) => (
          <li key={h.id} className="surface-card animate-rise flex items-center gap-3 p-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-muted text-muted-foreground">
              {h.mode === "emergency" ? (
                <Siren className="size-5 text-destructive" />
              ) : h.mode === "wheelchair" ? (
                <Accessibility className="size-5" />
              ) : (
                <Compass className="size-5" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-medium">{h.destination}</h2>
              <p className="truncate text-xs text-muted-foreground">
                {h.date} · Level {h.floor}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <StatPill label="min" value={String(h.durationMin)} tone="primary" />
              <StatPill label="m" value={String(h.distanceM)} />
            </div>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
