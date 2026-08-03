import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Accessibility,
  Car,
  Coffee,
  Droplet,
  FlaskConical,
  Heart,
  Pill,
  Receipt,
  type LucideIcon,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/lib/hospital-data";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Hospital Services — MediNav AI" },
      {
        name: "description",
        content: "Pharmacy, laboratory, billing, blood bank, cafeteria and assistance desks with opening hours and routes.",
      },
      { property: "og:title", content: "Hospital Services — MediNav AI" },
      { property: "og:description", content: "Every patient-facing service in the campus, one tap from navigation." },
    ],
  }),
  component: ServicesScreen,
});

const ICONS: Record<string, LucideIcon> = {
  pill: Pill,
  flask: FlaskConical,
  coffee: Coffee,
  receipt: Receipt,
  droplet: Droplet,
  heart: Heart,
  accessibility: Accessibility,
  car: Car,
};

function ServicesScreen() {
  const { setDestination } = useAppState();
  const navigate = useNavigate();

  return (
    <AppShell title="Hospital services" subtitle="Support facilities across the campus">
      <ul className="grid gap-3 sm:grid-cols-2">
        {SERVICES.map((s) => {
          const Icon = ICONS[s.icon] ?? Heart;
          return (
            <li key={s.id} className="surface-card animate-rise p-4 transition-shadow hover:shadow-elevation-3">
              <div className="flex items-start gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent-container text-accent-container-foreground">
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="truncate font-display text-sm font-semibold">{s.name}</h2>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{s.description}</p>
                  <p className="mt-1.5 text-[11px] font-medium text-muted-foreground">
                    Level {s.floor} · {s.hours}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="ripple mt-3 w-full rounded-full"
                onClick={() => {
                  setDestination({ name: s.name, floor: s.floor });
                  navigate({ to: "/navigate" });
                }}
              >
                Navigate here
              </Button>
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
