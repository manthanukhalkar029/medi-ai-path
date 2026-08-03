import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accessibility,
  Building2,
  Compass,
  CreditCard,
  FlaskConical,
  History,
  MessagesSquare,
  Pill,
  Search,
  Siren,
  Stethoscope,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AgenticBadge, SectionHeading, StatPill } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { HISTORY, HOSPITAL_UPDATES } from "@/lib/hospital-data";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Dashboard — MediNav AI" },
      {
        name: "description",
        content: "Your hospital dashboard: quick navigation, AI assistant, departments, doctors and live updates.",
      },
      { property: "og:title", content: "Dashboard — MediNav AI" },
      { property: "og:description", content: "One-tap access to navigation, the AI assistant and emergency routing." },
    ],
  }),
  component: HomeScreen,
});

const QUICK = [
  { to: "/navigate", label: "Navigate", icon: Compass, tone: "primary" },
  { to: "/assistant", label: "AI Assistant", icon: MessagesSquare, tone: "secondary" },
  { to: "/emergency", label: "Emergency", icon: Siren, tone: "destructive" },
  { to: "/departments", label: "Departments", icon: Building2, tone: "accent" },
  { to: "/doctors", label: "Doctors", icon: Stethoscope, tone: "secondary" },
  { to: "/services", label: "Pharmacy", icon: Pill, tone: "accent" },
  { to: "/services", label: "Laboratory", icon: FlaskConical, tone: "primary" },
  { to: "/services", label: "Billing", icon: CreditCard, tone: "secondary" },
  { to: "/accessibility", label: "Accessibility", icon: Accessibility, tone: "accent" },
] as const;

const TONE: Record<string, string> = {
  primary: "bg-primary-container text-primary-container-foreground",
  secondary: "bg-secondary-container text-secondary-container-foreground",
  accent: "bg-accent-container text-accent-container-foreground",
  destructive: "bg-destructive-container text-destructive-container-foreground",
};

function HomeScreen() {
  const { user } = useAppState();
  const firstName = (user?.name ?? "there").split(" ")[0];

  return (
    <AppShell title="Apollo Metro Institute" subtitle="Ground Floor · Main Atrium · anchor G-ATR-014">
      <section className="gradient-hero animate-rise relative overflow-hidden rounded-[2rem] p-6 text-primary-foreground shadow-glow">
        <div className="grid-blueprint absolute inset-0 opacity-10" aria-hidden="true" />
        <div className="relative">
          <AgenticBadge className="bg-surface/20 text-primary-foreground" label="Agentic AI · Live" />
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Hello {firstName}, where would you like to go?
          </h2>
          <p className="mt-1.5 max-w-md text-sm text-primary-foreground/85">
            Your appointment at Cardiology starts in 22 minutes. It&apos;s a 4 minute walk from here.
          </p>

          <Link
            to="/departments"
            className="ripple mt-5 flex items-center gap-3 rounded-2xl bg-surface px-4 py-3.5 text-sm text-muted-foreground shadow-elevation-2"
          >
            <Search className="size-5 shrink-0 text-primary" />
            Search departments, doctors or rooms
          </Link>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="secondary" className="ripple rounded-full">
              <Link to="/navigate">Resume route to Cardiology</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="ripple rounded-full text-primary-foreground hover:bg-surface/20 hover:text-primary-foreground"
            >
              <Link to="/assistant">Ask the assistant</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <SectionHeading title="Quick actions" />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {QUICK.map(({ to, label, icon: Icon, tone }) => (
            <Link
              key={label}
              to={to}
              className="surface-card ripple flex min-h-24 flex-col items-center justify-center gap-2 p-3 text-center transition-shadow hover:shadow-elevation-3"
            >
              <span className={`grid size-11 place-items-center rounded-2xl ${TONE[tone]}`}>
                <Icon className="size-5" />
              </span>
              <span className="text-xs font-medium leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-7">
        <SectionHeading
          title="Recent destinations"
          action={
            <Link to="/history" className="flex items-center gap-1 text-xs font-semibold text-primary">
              <History className="size-3.5" /> View all
            </Link>
          }
        />
        <ul className="space-y-2.5">
          {HISTORY.slice(0, 3).map((h) => (
            <li key={h.id}>
              <Link
                to="/navigate"
                className="surface-card ripple flex items-center gap-3 p-3.5 transition-shadow hover:shadow-elevation-2"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-muted text-muted-foreground">
                  <Compass className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{h.destination}</span>
                  <span className="block truncate text-xs text-muted-foreground">{h.date}</span>
                </span>
                <StatPill label="min" value={String(h.durationMin)} tone="primary" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-7">
        <SectionHeading title="Hospital updates" />
        <div className="grid gap-3 sm:grid-cols-3">
          {HOSPITAL_UPDATES.map((u) => (
            <article key={u.id} className={`rounded-3xl p-4 ${TONE[u.tone]}`}>
              <h3 className="font-display text-sm font-semibold">{u.title}</h3>
              <p className="mt-1 text-xs leading-relaxed opacity-90">{u.body}</p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
