import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Accessibility, Clock, MapPin, Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EmptyState, StatPill } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { DEPARTMENTS, FLOORS } from "@/lib/hospital-data";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/departments")({
  head: () => ({
    meta: [
      { title: "Department Search — MediNav AI" },
      {
        name: "description",
        content: "Search every hospital department with live wait times, floor level and step-free walking estimates.",
      },
      { property: "og:title", content: "Department Search — MediNav AI" },
      { property: "og:description", content: "Find any department and start turn-by-turn indoor navigation." },
    ],
  }),
  component: DepartmentsScreen,
});

function DepartmentsScreen() {
  const [query, setQuery] = useState("");
  const [floor, setFloor] = useState<string>("all");
  const { setDestination } = useAppState();
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DEPARTMENTS.filter((d) => {
      const matchesFloor = floor === "all" || d.floor === floor;
      const matchesQuery =
        !q || d.name.toLowerCase().includes(q) || d.tags.some((t) => t.includes(q)) || d.wing.toLowerCase().includes(q);
      return matchesFloor && matchesQuery;
    });
  }, [query, floor]);

  return (
    <AppShell title="Departments" subtitle={`${results.length} of ${DEPARTMENTS.length} matching`}>
      <div className="surface-card sticky top-[4.6rem] z-20 flex items-center gap-3 px-4 py-3">
        <Search className="size-5 shrink-0 text-muted-foreground" />
        <label htmlFor="dept-search" className="sr-only">
          Search departments
        </label>
        <input
          id="dept-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cardiology, MRI, blood test…"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {[{ id: "all", short: "All floors" }, ...FLOORS.map((f) => ({ id: f.id as string, short: f.short }))].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFloor(f.id)}
            aria-pressed={floor === f.id}
            className="ripple shrink-0 rounded-full border border-border px-3.5 py-2 text-xs font-medium text-muted-foreground transition-colors aria-pressed:border-primary aria-pressed:bg-primary-container aria-pressed:text-primary-container-foreground"
          >
            {f.short}
          </button>
        ))}
      </div>

      <ul className="mt-4 space-y-3">
        {results.map((d) => (
          <li key={d.id} className="surface-card animate-rise p-4 transition-shadow hover:shadow-elevation-3">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <h3 className="truncate font-display text-base font-semibold">{d.name}</h3>
                <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0" />
                  Level {d.floor} · {d.wing}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  d.open ? "bg-success-container text-success-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {d.open ? "Open now" : "Closed"}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <StatPill label="min walk" value={String(d.walkMinutes)} tone="primary" />
              <StatPill label="min wait" value={String(d.waitMinutes)} tone={d.waitMinutes > 20 ? "warning" : "accent"} />
              {d.accessible && (
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container px-2.5 py-1 text-[11px] font-medium text-secondary-container-foreground">
                  <Accessibility className="size-3.5" /> Step-free
                </span>
              )}
            </div>

            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                className="ripple rounded-full"
                onClick={() => {
                  setDestination({ name: d.name, floor: d.floor });
                  navigate({ to: "/navigate" });
                }}
              >
                Navigate
              </Button>
              <Button asChild size="sm" variant="outline" className="ripple rounded-full">
                <Link to="/doctors">See doctors</Link>
              </Button>
              <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3.5" /> Updated live
              </span>
            </div>
          </li>
        ))}
      </ul>

      {results.length === 0 && (
        <div className="mt-4">
          <EmptyState
            title="No departments matched"
            body="Try a symptom or service instead — the assistant can also find it for you."
            icon={<Search className="size-8 text-muted-foreground" />}
          />
        </div>
      )}
    </AppShell>
  );
}
