import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Accessibility,
  ArrowUpRight,
  Clock,
  Footprints,
  Layers,
  Navigation,
  ScanEye,
  Siren,
  Volume2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { FloorMap } from "@/components/floor-map";
import { SectionHeading } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { FLOORS, type FloorId } from "@/lib/hospital-data";
import { speak, useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/navigate")({
  head: () => ({
    meta: [
      { title: "Indoor Navigation — MediNav AI" },
      {
        name: "description",
        content: "Turn-by-turn indoor navigation with live floor maps, ETA, remaining distance and voice guidance.",
      },
      { property: "og:title", content: "Indoor Navigation — MediNav AI" },
      { property: "og:description", content: "A* routed hospital wayfinding with a floor selector and AR handoff." },
    ],
  }),
  component: NavigateScreen,
});

const STEPS = [
  "Head straight past the reception desk for 20 metres.",
  "Turn right at the pharmacy and continue to the lift lobby.",
  "Take Lift 2 to Level 1.",
  "Exit right, follow the East Wing corridor for 30 metres.",
  "Cardiology is on your left — Room 1-E-114.",
];

function NavigateScreen() {
  const { destination, a11y } = useAppState();
  const target = destination ?? { name: "Cardiology", floor: "1" as FloorId, room: "1-E-114" };
  const [floor, setFloor] = useState<FloorId>(target.floor);
  const [step, setStep] = useState(0);
  const [remaining, setRemaining] = useState(214);

  useEffect(() => {
    const id = window.setInterval(() => setRemaining((r) => (r > 12 ? r - 7 : 214)), 2200);
    return () => window.clearInterval(id);
  }, []);

  const eta = Math.max(1, Math.round(remaining / 62));

  return (
    <AppShell title={`To ${target.name}`} subtitle={target.room ? `Room ${target.room} · Level ${target.floor}` : `Level ${target.floor}`}>
      <section className="surface-card animate-rise overflow-hidden p-0">
        <FloorMap floor={floor} destination={target.name} wheelchair={a11y.wheelchair} className="h-64 rounded-none border-0 sm:h-80" />
        <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
          {[
            { icon: Clock, label: "ETA", value: `${eta} min` },
            { icon: Footprints, label: "Remaining", value: `${remaining} m` },
            { icon: Layers, label: "Floor", value: `Level ${target.floor}` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="px-3 py-3 text-center">
              <Icon className="mx-auto size-4 text-primary" />
              <p className="mt-1 font-display text-base font-semibold">{value}</p>
              <p className="text-[11px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Floor selector">
        {FLOORS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFloor(f.id)}
            aria-pressed={floor === f.id}
            className="ripple shrink-0 rounded-2xl border border-border bg-surface px-4 py-2.5 text-left text-xs font-medium text-muted-foreground aria-pressed:border-primary aria-pressed:bg-primary-container aria-pressed:text-primary-container-foreground"
          >
            <span className="block font-display text-sm font-semibold">{f.short}</span>
            <span className="block max-w-[9rem] truncate">{f.label.split("—")[1]?.trim()}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Button
          className="ripple h-12 rounded-2xl"
          onClick={() => speak(STEPS[step] ?? "You have arrived at your destination.", true)}
        >
          <Volume2 className="size-4" /> Voice
        </Button>
        <Button asChild variant="outline" className="ripple h-12 rounded-2xl">
          <Link to="/ar">
            <ScanEye className="size-4" /> AR mode
          </Link>
        </Button>
        <Button asChild variant="outline" className="ripple h-12 rounded-2xl">
          <Link to="/accessibility">
            <Accessibility className="size-4" /> Access
          </Link>
        </Button>
        <Button asChild variant="destructive" className="ripple h-12 rounded-2xl">
          <Link to="/emergency">
            <Siren className="size-4" /> Emergency
          </Link>
        </Button>
      </div>

      <section className="mt-6">
        <SectionHeading
          title="Turn-by-turn"
          action={
            <button
              type="button"
              className="text-xs font-semibold text-primary"
              onClick={() => setStep((s) => (s + 1) % STEPS.length)}
            >
              Next step
            </button>
          }
        />
        <ol className="space-y-2.5">
          {STEPS.map((s, i) => (
            <li
              key={s}
              className={`surface-card flex gap-3 p-3.5 transition-colors ${
                i === step ? "border-primary bg-primary-container/50" : ""
              }`}
              aria-current={i === step ? "step" : undefined}
            >
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                  i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed">{s}</p>
            </li>
          ))}
        </ol>
      </section>

      <Link
        to="/assistant"
        className="ripple gradient-hero fixed bottom-24 right-5 z-40 grid size-14 place-items-center rounded-2xl text-primary-foreground shadow-glow"
        aria-label="Ask the MediNav assistant"
      >
        <Navigation className="size-6" />
        <ArrowUpRight className="sr-only" />
      </Link>
    </AppShell>
  );
}
