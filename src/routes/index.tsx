import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { QrCode, ScanLine, ShieldCheck, Sparkles, Waypoints } from "lucide-react";
import { BrandMark, BrandWordmark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediNav AI — Agentic Indoor Hospital Navigation" },
      {
        name: "description",
        content:
          "Scan a QR code and navigate any hospital instantly with agentic AI, AR wayfinding and explainable voice guidance. No app install required.",
      },
      { property: "og:title", content: "MediNav AI — Agentic Indoor Hospital Navigation" },
      {
        property: "og:description",
        content: "QR positioning, AR routes and an explainable AI assistant for patients and visitors.",
      },
    ],
  }),
  component: Splash,
});

const BOOT_STEPS = [
  "Initialising sensor fusion",
  "Loading hospital graph",
  "Calibrating QR anchors",
  "Waking MediNav agent",
];

function Splash() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setStep((s) => (s < BOOT_STEPS.length - 1 ? s + 1 : s)), 700);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background">
      <div className="gradient-hero absolute inset-x-0 top-0 h-[62dvh] rounded-b-[3rem]" aria-hidden="true" />
      <div className="grid-blueprint absolute inset-x-0 top-0 h-[62dvh] rounded-b-[3rem] opacity-15" aria-hidden="true" />

      <div className="relative mx-auto flex w-full max-w-lg flex-1 flex-col px-6 pb-10 pt-16">
        <div className="animate-rise flex flex-col items-center text-center text-primary-foreground">
          <BrandMark className="size-20 rounded-[1.75rem] shadow-glow" />
          <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight">MediNav AI</h1>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-primary-foreground/85">
            Agentic, explainable AI indoor navigation for hospitals — powered by QR positioning and AR guidance.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2 text-[11px] font-medium">
            {[
              { icon: Sparkles, label: "Agentic AI" },
              { icon: Waypoints, label: "A* Routing" },
              { icon: ShieldCheck, label: "HIPAA-ready" },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 rounded-full bg-surface/20 px-3 py-1.5 backdrop-blur">
                <Icon className="size-3.5" />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="surface-card animate-rise mt-auto space-y-4 p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-container text-primary-container-foreground">
              <QrCode className="size-5" />
            </span>
            <div className="min-w-0">
              <BrandWordmark />
              <p className="text-xs text-muted-foreground">Apollo Metro Institute of Medical Sciences</p>
            </div>
          </div>

          <div className="rounded-2xl bg-muted p-3">
            <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <ScanLine className="size-4 animate-blink text-primary" />
              {BOOT_STEPS[step]}…
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
              <div
                className="gradient-hero h-full rounded-full transition-all duration-500"
                style={{ width: `${((step + 1) / BOOT_STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Button asChild size="lg" className="ripple h-13 rounded-2xl text-base">
              <Link to="/scan">
                <QrCode className="size-5" /> Scan hospital QR code
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="ripple h-13 rounded-2xl text-base">
              <Link to="/auth">Continue without scanning</Link>
            </Button>
          </div>

          <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
            Installable PWA · works on any phone browser · no download required
          </p>
        </div>
      </div>
    </div>
  );
}
