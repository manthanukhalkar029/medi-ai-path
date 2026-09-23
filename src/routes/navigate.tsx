import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Accessibility,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Footprints,
  Layers,
  MapPin,
  Navigation,
  QrCode,
  RotateCw,
  ScanEye,
  ShieldCheck,
  Siren,
  Sparkles,
  Users,
  Volume2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/app-shell";
import { FloorMap } from "@/components/floor-map";
import { AgenticBadge, ExplainCard, SectionHeading, StatPill } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { FLOORS, type FloorId } from "@/lib/hospital-data";
import { speak, useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/navigate")({
  head: () => ({
    meta: [
      { title: "Indoor Navigation — MediNav AI" },
      {
        name: "description",
        content: "Turn-by-turn indoor navigation with live floor maps, ETA, remaining distance, compass and voice guidance.",
      },
      { property: "og:title", content: "Indoor Navigation — MediNav AI" },
      { property: "og:description", content: "A* routed hospital wayfinding with level switching and AR handoff." },
    ],
  }),
  component: NavigateScreen,
});

const STEPS = [
  { id: 1, text: "Head straight past the Main Atrium reception desk for 20 metres.", dist: "20 m", floor: "G" },
  { id: 2, text: "Turn right at 24×7 Pharmacy and continue to Lift Lobby 2.", dist: "45 m", floor: "G" },
  { id: 3, text: "Take Lift 2 (Wheelchair accessible) to Level 1.", dist: "Elevator", floor: "1" },
  { id: 4, text: "Exit right from Lift 2 into the East Wing corridor, walk 30 metres.", dist: "30 m", floor: "1" },
  { id: 5, text: "Cardiology is on your left — Room 1-E-114.", dist: "10 m", floor: "1" },
];

function NavigateScreen() {
  const { destination, a11y, setA11y } = useAppState();
  const target = destination ?? { name: "Cardiology", floor: "1" as FloorId, room: "1-E-114" };
  const [floor, setFloor] = useState<FloorId>(target.floor);
  const [step, setStep] = useState(0);
  const [remaining, setRemaining] = useState(214);
  const [showRerouteAlert, setShowRerouteAlert] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setRemaining((r) => (r > 12 ? r - 6 : 214)), 2200);
    return () => window.clearInterval(id);
  }, []);

  const totalDist = 214;
  const progressPercent = Math.min(100, Math.max(5, Math.round(((totalDist - remaining) / totalDist) * 100)));
  const eta = Math.max(1, Math.round(remaining / 55));

  return (
    <AppShell
      title={`Navigating to ${target.name}`}
      subtitle={target.room ? `Room ${target.room} · Level ${target.floor}` : `Level ${target.floor}`}
      action={<AgenticBadge label="Live Guidance" />}
    >
      {/* Emergency / Dynamic Reroute Alert Banner */}
      <AnimatePresence>
        {showRerouteAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 flex items-center justify-between rounded-2xl border border-warning/30 bg-warning-container/80 p-3.5 text-warning-foreground shadow-elevation-1"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-warning/20 text-warning">
                <AlertTriangle className="size-4 animate-bounce" />
              </span>
              <div className="text-xs">
                <p className="font-bold">Lift 3 Out of Service — Auto Rerouted</p>
                <p className="opacity-90">MediNav rerouted your path via Lift 2 (step-free, +0 min delay).</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowRerouteAlert(false)}
              className="h-8 text-xs font-semibold hover:bg-warning/20"
            >
              Dismiss
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumb Navigation Trail */}
      <div className="mb-4 flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-border/80 bg-surface/90 px-4 py-2 text-xs font-medium text-muted-foreground shadow-elevation-1">
        <span className="flex items-center gap-1 font-bold text-foreground">
          <MapPin className="size-3.5 text-primary" /> Main Atrium (G)
        </span>
        <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
        <span>Lift Lobby 2</span>
        <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
        <span>East Corridor (L1)</span>
        <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="font-bold text-primary">{target.name}</span>
      </div>

      {/* Main Floor Map & Interactive Visualization */}
      <section className="surface-card overflow-hidden p-0 shadow-elevation-2">
        {/* Map Header Status Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface px-4 py-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-bold text-foreground">
              <Compass className="size-4 text-primary animate-spin" style={{ animationDuration: "12s" }} />
              Heading 340° NNW
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="flex items-center gap-1 font-medium text-emerald-600">
              <Users className="size-3.5" /> Low Corridor Crowd (18%)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={a11y.wheelchair ? "secondary" : "outline"}
              onClick={() => setA11y({ wheelchair: !a11y.wheelchair })}
              className="h-8 rounded-full text-xs font-semibold"
            >
              <Accessibility className="size-3.5" />
              {a11y.wheelchair ? "Step-Free Active" : "Wheelchair Route"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowRerouteAlert(!showRerouteAlert)}
              className="h-8 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Simulate Reroute
            </Button>
          </div>
        </div>

        <FloorMap
          floor={floor}
          destination={target.name}
          wheelchair={a11y.wheelchair}
          className="h-64 sm:h-80"
        />

        {/* Dynamic Metric Bar */}
        <div className="grid grid-cols-3 divide-x divide-border border-t border-border bg-surface">
          <div className="px-3 py-3 text-center">
            <div className="flex items-center justify-center gap-1 text-primary">
              <Clock className="size-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">ETA</span>
            </div>
            <p className="mt-0.5 font-display text-lg font-bold text-foreground">{eta} min</p>
            <p className="text-[10px] text-muted-foreground">Normal walking pace</p>
          </div>

          <div className="px-3 py-3 text-center">
            <div className="flex items-center justify-center gap-1 text-secondary">
              <Footprints className="size-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Distance</span>
            </div>
            <p className="mt-0.5 font-display text-lg font-bold text-foreground">{remaining} m</p>
            <p className="text-[10px] text-muted-foreground">{progressPercent}% complete</p>
          </div>

          <div className="px-3 py-3 text-center">
            <div className="flex items-center justify-center gap-1 text-accent">
              <Layers className="size-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Floor</span>
            </div>
            <p className="mt-0.5 font-display text-lg font-bold text-foreground">Level {target.floor}</p>
            <p className="text-[10px] text-muted-foreground">Via Lift 2</p>
          </div>
        </div>

        {/* Live Route Progress Bar */}
        <div className="h-2 w-full bg-border/60">
          <motion.div
            className="gradient-hero h-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </section>

      {/* Floor Level Switcher Pills */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Floor selector">
        {FLOORS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFloor(f.id)}
            aria-pressed={floor === f.id}
            className="ripple shrink-0 rounded-2xl border border-border bg-surface px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground transition-all aria-pressed:border-primary aria-pressed:bg-primary-container aria-pressed:text-primary-container-foreground shadow-elevation-1"
          >
            <span className="block font-display text-sm font-bold">{f.short}</span>
            <span className="block max-w-[9rem] truncate text-[11px] opacity-80">{f.label.split("—")[1]?.trim()}</span>
          </button>
        ))}
      </div>

      {/* Quick Action Navigation Toolbar */}
      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <Button
          className="ripple h-12 rounded-2xl font-semibold shadow-elevation-1"
          onClick={() => speak(STEPS[step]?.text ?? "You have arrived at your destination.", true)}
        >
          <Volume2 className="size-4" /> Voice Guidance
        </Button>
        <Button asChild variant="outline" className="ripple h-12 rounded-2xl font-semibold shadow-elevation-1">
          <Link to="/ar">
            <ScanEye className="size-4 text-primary" /> AR Overlay Mode
          </Link>
        </Button>
        <Button asChild variant="outline" className="ripple h-12 rounded-2xl font-semibold shadow-elevation-1">
          <Link to="/scan">
            <QrCode className="size-4 text-secondary" /> Scan Anchor
          </Link>
        </Button>
        <Button asChild variant="destructive" className="ripple h-12 rounded-2xl font-semibold shadow-elevation-1">
          <Link to="/emergency">
            <Siren className="size-4" /> Emergency Reroute
          </Link>
        </Button>
      </div>

      {/* Turn-by-turn Directions Timeline */}
      <section className="mt-7">
        <SectionHeading
          title="Turn-by-Turn Directions"
          subtitle="Step-by-step guidance computed by A* indoor graph engine"
          action={
            <Button
              size="sm"
              variant="outline"
              className="h-8 rounded-full text-xs font-semibold"
              onClick={() => setStep((s) => (s + 1) % STEPS.length)}
            >
              Next Step <ArrowRight className="ml-1 size-3.5" />
            </Button>
          }
        />
        <ol className="space-y-3">
          {STEPS.map((s, i) => {
            const isCurrent = i === step;
            return (
              <motion.li
                key={s.id}
                whileHover={{ scale: 1.01 }}
                className={`surface-card flex items-start gap-4 p-4 transition-all duration-200 ${
                  isCurrent ? "border-2 border-primary bg-primary-container/40 shadow-elevation-2" : ""
                }`}
                aria-current={isCurrent ? "step" : undefined}
              >
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-2xl font-display text-sm font-bold shadow-elevation-1 ${
                    isCurrent ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold leading-relaxed text-foreground">{s.text}</p>
                    <span className="ml-2 shrink-0 rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-bold text-muted-foreground border border-border">
                      {s.dist}
                    </span>
                  </div>
                  {isCurrent && (
                    <div className="mt-2 flex items-center gap-2 text-xs font-bold text-primary">
                      <span className="size-2 rounded-full bg-primary animate-ping" />
                      Active Instruction — Turn right in 5m
                    </div>
                  )}
                </div>
              </motion.li>
            );
          })}
        </ol>
      </section>

      {/* Floating AI Assistant FAB */}
      <Link
        to="/assistant"
        className="ripple gradient-hero fixed bottom-24 right-5 z-40 grid size-14 place-items-center rounded-2xl text-primary-foreground shadow-glow transition-transform hover:scale-105 active:scale-95"
        aria-label="Ask the MediNav AI Assistant"
      >
        <Navigation className="size-6" />
        <span className="absolute -top-1 -right-1 size-3.5 rounded-full bg-cyan-400 border-2 border-white animate-pulse" />
      </Link>
    </AppShell>
  );
}

