import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Languages, Search, Star, Stethoscope } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { DEPARTMENTS, DOCTORS, findDepartment } from "@/lib/hospital-data";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/doctors")({
  head: () => ({
    meta: [
      { title: "Doctor Search — MediNav AI" },
      {
        name: "description",
        content: "Find consultants by name, speciality or department, see live availability and walk straight to their room.",
      },
      { property: "og:title", content: "Doctor Search — MediNav AI" },
      { property: "og:description", content: "Live consultant availability with one-tap indoor navigation to the room." },
    ],
  }),
  component: DoctorsScreen,
});

function DoctorsScreen() {
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("all");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const { setDestination } = useAppState();
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DOCTORS.filter((d) => {
      const matchesQuery = !q || d.name.toLowerCase().includes(q) || d.speciality.toLowerCase().includes(q);
      const matchesDept = dept === "all" || d.departmentId === dept;
      return matchesQuery && matchesDept && (!onlyAvailable || d.available);
    });
  }, [query, dept, onlyAvailable]);

  return (
    <AppShell title="Doctors" subtitle={`${results.length} consultants on duty today`}>
      <div className="surface-card sticky top-[4.6rem] z-20 flex items-center gap-3 px-4 py-3">
        <Search className="size-5 shrink-0 text-muted-foreground" />
        <label htmlFor="doc-search" className="sr-only">
          Search doctors
        </label>
        <input
          id="doc-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Name or speciality…"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setOnlyAvailable((v) => !v)}
          aria-pressed={onlyAvailable}
          className="ripple shrink-0 rounded-full border border-border px-3.5 py-2 text-xs font-medium text-muted-foreground aria-pressed:border-accent aria-pressed:bg-accent-container aria-pressed:text-accent-container-foreground"
        >
          Available now
        </button>
        {[{ id: "all", name: "All departments" }, ...DEPARTMENTS].map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setDept(d.id)}
            aria-pressed={dept === d.id}
            className="ripple shrink-0 rounded-full border border-border px-3.5 py-2 text-xs font-medium text-muted-foreground aria-pressed:border-primary aria-pressed:bg-primary-container aria-pressed:text-primary-container-foreground"
          >
            {d.name}
          </button>
        ))}
      </div>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {results.map((d) => (
          <li key={d.id} className="surface-card animate-rise p-4 transition-shadow hover:shadow-elevation-3">
            <div className="flex min-w-0 items-start gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary-container text-sm font-semibold text-primary-container-foreground">
                {d.name.split(" ")[1]?.[0] ?? "D"}
                {d.name.split(" ")[2]?.[0] ?? ""}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-display text-sm font-semibold">{d.name}</h3>
                <p className="truncate text-xs text-muted-foreground">{d.speciality}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  Room {d.room} · {findDepartment(d.departmentId)?.name}
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-warning-container px-2 py-1 text-[11px] font-semibold text-warning-foreground">
                <Star className="size-3 fill-current" />
                {d.rating}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  d.available ? "bg-success-container text-success-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {d.available ? `Next: ${d.nextSlot}` : `Back at ${d.nextSlot}`}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <Languages className="size-3.5" />
                {d.languages.join(", ")}
              </span>
            </div>

            <Button
              size="sm"
              className="ripple mt-3 w-full rounded-full"
              onClick={() => {
                setDestination({ name: `${findDepartment(d.departmentId)?.name}`, floor: d.floor, room: d.room });
                navigate({ to: "/navigate" });
              }}
            >
              <Stethoscope className="size-4" /> Navigate to Room {d.room}
            </Button>
          </li>
        ))}
      </ul>

      {results.length === 0 && (
        <div className="mt-4">
          <EmptyState
            title="No consultants found"
            body="Try a broader speciality, or ask the MediNav assistant to check the on-call roster."
            icon={<Stethoscope className="size-8 text-muted-foreground" />}
          />
        </div>
      )}
    </AppShell>
  );
}
