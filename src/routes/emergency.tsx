import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Ambulance, HeartPulse, PhoneCall, Siren, TriangleAlert, Volume2 } from "lucide-react";
import { FloorMap } from "@/components/floor-map";
import { Button } from "@/components/ui/button";
import { speak } from "@/lib/app-state";

export const Route = createFileRoute("/emergency")({
  head: () => ({
    meta: [
      { title: "Emergency Navigation — MediNav AI" },
      {
        name: "description",
        content: "Priority routing to Casualty with triage alerting, step-free path selection and continuous voice guidance.",
      },
      { property: "og:title", content: "Emergency Navigation — MediNav AI" },
      { property: "og:description", content: "Fastest step-free route to Emergency, with the triage desk notified." },
    ],
  }),
  component: EmergencyScreen,
});

function EmergencyScreen() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    speak("Emergency mode active. Follow the red route to Casualty at the North Entrance, 95 metres ahead.", true);
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="min-h-dvh bg-destructive-container pb-10">
      <header className="bg-destructive px-5 py-4 text-destructive-foreground">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <Siren className="size-6 shrink-0 animate-pulse" />
          <div className="min-w-0">
            <h1 className="truncate font-display text-lg font-semibold">Emergency mode active</h1>
            <p className="truncate text-xs opacity-90">Triage desk notified · {seconds}s elapsed</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-4 px-5 pt-5">
        <section className="surface-card animate-rise border-destructive/30 p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-destructive">
            <TriangleAlert className="size-5" /> Emergency / Casualty — 95 m away
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Ground floor, North Entrance. Fastest step-free route selected — no lifts required. Staff have been alerted to
            expect you.
          </p>
          <FloorMap floor="G" destination="Emergency" className="mt-4 h-56" />
        </section>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button asChild size="lg" variant="destructive" className="ripple h-14 rounded-2xl text-base">
            <a href="tel:108">
              <PhoneCall className="size-5" /> Call ambulance (108)
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="ripple h-14 rounded-2xl bg-surface text-base"
            onClick={() => speak("Continue straight for 40 metres, then turn left towards the North Entrance.", true)}
          >
            <Volume2 className="size-5" /> Repeat voice guidance
          </Button>
        </div>

        <section className="surface-card p-5">
          <h2 className="font-display text-sm font-semibold">While you walk</h2>
          <ul className="mt-3 space-y-3">
            {[
              { icon: HeartPulse, text: "Keep the patient still and seated if they feel faint." },
              { icon: Ambulance, text: "A porter with a wheelchair has been dispatched to the atrium." },
              { icon: Siren, text: "Show this screen at the triage desk to skip registration." },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <Icon className="mt-0.5 size-4 shrink-0 text-destructive" />
                {text}
              </li>
            ))}
          </ul>
        </section>

        <Link to="/home" className="block py-2 text-center text-sm font-semibold text-destructive">
          Exit emergency mode
        </Link>
      </div>
    </div>
  );
}
