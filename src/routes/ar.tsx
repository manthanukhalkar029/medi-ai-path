import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUp, CornerUpRight, Map, ScanEye, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { speak, useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/ar")({
  head: () => ({
    meta: [
      { title: "AR Navigation — MediNav AI" },
      {
        name: "description",
        content: "WebXR augmented reality wayfinding that paints the route onto the corridor in front of you.",
      },
      { property: "og:title", content: "AR Navigation — MediNav AI" },
      { property: "og:description", content: "Three.js + WebXR AR arrows anchored by QR positioning and sensor fusion." },
    ],
  }),
  component: ArScreen,
});

function ArScreen() {
  const { destination, a11y } = useAppState();
  const target = destination?.name ?? "Cardiology";
  const [distance, setDistance] = useState(46);

  useEffect(() => {
    const id = window.setInterval(() => setDistance((d) => (d > 5 ? d - 3 : 46)), 1400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative min-h-dvh overflow-hidden bg-foreground text-background">
      {/* WebXR camera passthrough placeholder */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,oklch(0.42_0.05_255)_0%,oklch(0.18_0.03_264)_70%)]" aria-hidden="true" />
      <div className="grid-blueprint absolute inset-0 opacity-10" aria-hidden="true" />

      {/* AR route chevrons */}
      <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center gap-6" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <ArrowUp
            key={i}
            className="size-16 text-secondary drop-shadow-[0_0_18px_oklch(0.71_0.13_214/0.6)]"
            style={{ opacity: 1 - i * 0.22, transform: `scale(${1 - i * 0.16})`, animation: `rise 1.6s ${i * 0.2}s infinite` }}
          />
        ))}
      </div>

      <header className="relative z-10 flex items-center justify-between gap-3 px-5 pt-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-background/15 px-3 py-1.5 text-xs font-semibold backdrop-blur">
          <ScanEye className="size-4 text-secondary" /> AR mode · WebXR
        </span>
        <span className="rounded-full bg-background/15 px-3 py-1.5 text-xs font-medium backdrop-blur">
          VIO tracking: stable
        </span>
      </header>

      <div className="absolute inset-x-5 top-28 z-10 rounded-3xl bg-background/15 p-4 backdrop-blur-xl">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <CornerUpRight className="size-5 text-accent" /> Turn right in {distance} m
        </p>
        <p className="mt-1 text-xs text-background/75">Continue along the East corridor towards {target}</p>
      </div>

      <div className="absolute inset-x-5 bottom-8 z-10 space-y-3">
        <div className="rounded-3xl bg-background/15 p-4 backdrop-blur-xl">
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: "Destination", value: target },
              { label: "Remaining", value: `${distance + 120} m` },
              { label: "ETA", value: "3 min" },
            ].map((s) => (
              <div key={s.label}>
                <p className="truncate font-display text-sm font-semibold">{s.value}</p>
                <p className="text-[11px] text-background/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            className="ripple h-13 rounded-2xl"
            onClick={() => speak(`Turn right in ${distance} metres, then continue towards ${target}`, a11y.voiceGuidance)}
          >
            <Volume2 className="size-5" /> Voice guidance
          </Button>
          <Button asChild variant="secondary" className="ripple h-13 rounded-2xl">
            <Link to="/navigate">
              <Map className="size-5" /> Back to map
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
