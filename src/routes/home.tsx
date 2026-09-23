import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Accessibility,
  Activity,
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  Clock,
  Compass,
  CreditCard,
  DoorOpen,
  FlaskConical,
  Footprints,
  History,
  Layers,
  MapPin,
  MessagesSquare,
  Mic,
  Navigation,
  Pill,
  QrCode,
  Radio,
  RefreshCw,
  Search,
  ShieldCheck,
  Siren,
  Sparkles,
  Stethoscope,
  Users,
  Volume2,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/app-shell";
import { AgenticBadge, ExplainCard, SectionHeading, StatPill } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { HISTORY, HOSPITAL_UPDATES } from "@/lib/hospital-data";
import { speak, useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "MediNav AI — Intelligent Hospital Dashboard" },
      {
        name: "description",
        content: "Agentic indoor navigation, explainable AI guidance, live wait times, and QR positioning dashboard.",
      },
      { property: "og:title", content: "MediNav AI — Hospital Dashboard" },
      { property: "og:description", content: "One-tap access to indoor navigation, AI recommendations, and hospital intelligence." },
    ],
  }),
  component: HomeScreen,
});

const QUICK_ACTIONS = [
  {
    to: "/navigate",
    title: "Indoor Navigation",
    subtitle: "Turn-by-turn map & route",
    icon: Compass,
    gradient: "from-blue-600 to-indigo-600",
    badge: "Active Route",
  },
  {
    to: "/assistant",
    title: "AI Assistant",
    subtitle: "Voice & XAI guidance",
    icon: MessagesSquare,
    gradient: "from-cyan-500 to-blue-600",
    badge: "Agentic",
  },
  {
    to: "/scan",
    title: "QR Position",
    subtitle: "Scan wall/pillar anchor",
    icon: QrCode,
    gradient: "from-emerald-500 to-teal-600",
    badge: "±0.4m Precision",
  },
  {
    to: "/emergency",
    title: "Emergency Care",
    subtitle: "Priority ER routing",
    icon: Siren,
    gradient: "from-rose-500 to-red-600",
    badge: "24×7 Rapid",
  },
  {
    to: "/departments",
    title: "Departments",
    subtitle: "Wait times & floors",
    icon: Building2,
    gradient: "from-sky-500 to-blue-600",
  },
  {
    to: "/doctors",
    title: "Doctor Directory",
    subtitle: "Schedule & OPD rooms",
    icon: Stethoscope,
    gradient: "from-teal-500 to-emerald-600",
  },
  {
    to: "/services",
    title: "24×7 Pharmacy",
    subtitle: "Sample pickup & meds",
    icon: Pill,
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    to: "/services",
    title: "Diagnostic Lab",
    subtitle: "Blood test & pathology",
    icon: FlaskConical,
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    to: "/accessibility",
    title: "Accessibility Mode",
    subtitle: "Step-free & screen reader",
    icon: Accessibility,
    gradient: "from-purple-500 to-indigo-600",
  },
];

const HOSPITAL_METRICS = [
  {
    title: "Emergency Status",
    value: "Operational",
    subtext: "2 min triage wait · 14 doctors on duty",
    icon: Siren,
    tone: "emerald",
  },
  {
    title: "Lift Status",
    value: "4 / 5 Active",
    subtext: "Lift 2 optimal · Lift 3 maintenance",
    icon: Layers,
    tone: "blue",
  },
  {
    title: "Crowd Density",
    value: "Moderate (42%)",
    subtext: "Main Atrium clear · OPD Wing moderate",
    icon: Users,
    tone: "cyan",
  },
  {
    title: "Doctor Delays",
    value: "On Schedule",
    subtext: "Dr. Ananya Raghavan (+2 min lag)",
    icon: Stethoscope,
    tone: "emerald",
  },
  {
    title: "Department Alerts",
    value: "Cath Lab Live",
    subtext: "Code Blue drill scheduled 3:00 PM @ Level 2",
    icon: Radio,
    tone: "amber",
  },
];

function HomeScreen() {
  const { user, a11y } = useAppState();
  const navigate = useNavigate();
  const firstName = (user?.name ?? "Patient").split(" ")[0];
  const [searchQuery, setSearchQuery] = useState("");
  const [showXaiDetails, setShowXaiDetails] = useState(false);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/departments", search: { q: searchQuery } as any });
    }
  }

  return (
    <AppShell
      title="Apollo Metro Institute"
      subtitle="Ground Floor · Main Atrium · Anchor G-ATR-014"
      action={<AgenticBadge label="Agentic AI Live" />}
    >
      {/* Top System Status Bar */}
      <section className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border/80 bg-surface/90 px-4 py-2.5 shadow-elevation-1 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 font-medium text-foreground">
            <Building2 className="size-3.5 text-primary" />
            <strong className="font-semibold">Apollo Metro Institute</strong>
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="size-3.5 text-secondary" /> Level G · Main Atrium
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="inline-flex items-center gap-1 text-accent font-medium">
            <Radio className="size-3 animate-pulse" /> Anchor G-ATR-014 (±0.4m VIO)
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-container px-2 py-0.5 text-primary-container-foreground">
            <Bot className="size-3" /> Agentic XAI Active
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-container px-2 py-0.5 text-accent-container-foreground">
            <Volume2 className="size-3" /> Voice Ready
          </span>
        </div>
      </section>

      {/* Main Hero & Appointment Dashboard Card */}
      <section className="relative overflow-hidden rounded-3xl gradient-hero p-6 text-primary-foreground shadow-glow sm:p-8">
        <div className="grid-blueprint absolute inset-0 opacity-10" aria-hidden="true" />
        
        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface/20 px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-md">
                <Sparkles className="size-3.5 animate-pulse text-cyan-300" />
                Healthcare Intelligence System
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-medium text-emerald-200">
                <CheckCircle2 className="size-3" /> Verified Route
              </span>
            </div>

            <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Good day, {firstName}.
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-blue-100 sm:text-base">
              Your appointment with <strong className="text-white font-semibold">Dr. Ananya Raghavan</strong> at Cardiology is today at <strong className="text-white font-semibold">10:40 AM</strong>.
            </p>

            {/* Quick Metrics Bar */}
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {[
                { label: "Next Destination", val: "Cardiology", sub: "Room 1-E-114" },
                { label: "Est. Walk Time", val: "4 mins", sub: "210 metres" },
                { label: "Token Queue", val: "Token C-042", sub: "3 ahead" },
                { label: "Floor Level", val: "Level 1", sub: "Via Lift 2" },
              ].map((m) => (
                <div key={m.label} className="rounded-2xl bg-surface/15 p-3 backdrop-blur-md border border-white/10">
                  <p className="text-[11px] font-medium text-blue-100/80">{m.label}</p>
                  <p className="font-display text-base font-bold text-white">{m.val}</p>
                  <p className="text-[10px] text-blue-200">{m.sub}</p>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="ripple rounded-2xl bg-white text-primary hover:bg-white/95 font-semibold shadow-elevation-2"
              >
                <Link to="/navigate">
                  <Navigation className="size-4" /> Start Turn-by-Turn Route
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="ripple rounded-2xl text-white hover:bg-white/15 hover:text-white"
              >
                <Link to="/assistant">
                  <MessagesSquare className="size-4" /> Ask MediNav AI
                </Link>
              </Button>
            </div>
          </div>

          {/* AI Recommendation Spotlight Card inside Hero */}
          <div className="flex flex-col justify-between rounded-2xl bg-surface/10 p-4 border border-white/15 backdrop-blur-md">
            <div>
              <div className="flex items-center justify-between text-xs text-blue-100">
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-cyan-200">
                  <Zap className="size-3.5 text-cyan-300 animate-pulse" /> Live AI Recommendation
                </span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white">
                  99.8% Precision
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-white sm:text-sm">
                &ldquo;MediNav AI recommends taking <strong className="text-cyan-200 underline underline-offset-2">Lift 2</strong> because it is operational and currently less crowded, reducing your walking time by <strong className="text-emerald-300">2 minutes</strong>.&rdquo;
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowXaiDetails(!showXaiDetails)}
                className="h-8 w-full justify-between rounded-xl text-xs font-semibold text-cyan-100 hover:bg-white/15 hover:text-white"
              >
                <span>Why Lift 2? (View XAI Reasoning)</span>
                <ArrowRight className={`size-3.5 transition-transform ${showXaiDetails ? "rotate-90" : ""}`} />
              </Button>
              {showXaiDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2 space-y-1.5 text-[11px] leading-relaxed text-blue-100/90"
                >
                  <p>• Lift 3 is currently under routine maintenance.</p>
                  <p>• Lift 2 has 24% occupancy compared to Lift 1 (78%).</p>
                  <p>• Step-free A* routing optimization active for Level 1 transition.</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Multi-modal Intelligent Search Bar */}
      <section className="mt-6">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="surface-card flex items-center gap-2 p-2 shadow-elevation-2 focus-within:ring-2 focus-within:ring-primary">
            <Search className="ml-3 size-5 shrink-0 text-primary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search departments, doctors, rooms, labs or services..."
              className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground"
            />

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="ripple size-9 rounded-xl text-primary hover:bg-primary-container"
                onClick={() => speak("Where would you like to navigate?", a11y.voiceGuidance)}
                aria-label="Voice input search"
              >
                <Mic className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="ripple size-9 rounded-xl text-secondary hover:bg-secondary-container"
                onClick={() => navigate({ to: "/scan" })}
                aria-label="Scan QR code"
              >
                <QrCode className="size-4" />
              </Button>
              <Button
                type="submit"
                className="ripple h-9 rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-elevation-1"
              >
                Search
              </Button>
            </div>
          </div>
        </form>
      </section>

      {/* Live Hospital Intelligence Metrics Grid */}
      <section className="mt-7">
        <SectionHeading
          title="Live Hospital Intelligence"
          subtitle="Real-time campus telemetry & facility monitors"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {HOSPITAL_METRICS.map((m) => (
            <motion.div
              key={m.title}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="surface-card flex flex-col justify-between p-4 shadow-elevation-1 transition-all hover:shadow-elevation-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{m.title}</span>
                  <m.icon className="size-4 text-primary" />
                </div>
                <p className="mt-2 font-display text-base font-bold text-foreground">{m.value}</p>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{m.subtext}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Action Cards Grid */}
      <section className="mt-8">
        <SectionHeading
          title="Hospital Navigation & Services"
          subtitle="One-tap access to all hospital amenities and wayfinding"
        />
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} to={action.to}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="surface-card group relative flex items-start gap-4 p-4 transition-all duration-200 hover:shadow-elevation-3"
                >
                  <span className={`grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${action.gradient} text-white shadow-elevation-2`}>
                    <Icon className="size-6 transition-transform group-hover:scale-110" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      {action.badge && (
                        <span className="rounded-full bg-primary-container px-2 py-0.5 text-[10px] font-bold text-primary-container-foreground">
                          {action.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{action.subtitle}</p>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Destinations & Hospital Announcements */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <SectionHeading
            title="Recent Destinations"
            action={
              <Link to="/history" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                <History className="size-3.5" /> View all
              </Link>
            }
          />
          <ul className="space-y-2.5">
            {HISTORY.slice(0, 3).map((h) => (
              <li key={h.id}>
                <Link
                  to="/navigate"
                  className="surface-card flex items-center gap-3.5 p-3.5 transition-all hover:shadow-elevation-2"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary-container text-primary">
                    <Compass className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-foreground">{h.destination}</p>
                    <p className="truncate text-xs text-muted-foreground">{h.date} · Level {h.floor}</p>
                  </div>
                  <StatPill label="min walk" value={String(h.durationMin)} tone="primary" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionHeading title="Hospital Updates & Bulletins" />
          <div className="space-y-3">
            {HOSPITAL_UPDATES.map((u) => (
              <article key={u.id} className="surface-card p-4 transition-all hover:shadow-elevation-2">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary" />
                  <h3 className="font-display text-sm font-bold text-foreground">{u.title}</h3>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{u.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

