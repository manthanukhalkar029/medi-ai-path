import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Accessibility,
  Bell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Globe,
  HeartPulse,
  History,
  Info,
  LifeBuoy,
  Lock,
  LogOut,
  MessageSquareHeart,
  PhoneCall,
  Settings,
  ShieldCheck,
  UserCheck,
  Volume2,
} from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Patient Profile & Settings — MediNav AI" },
      { name: "description", content: "Your MediNav healthcare profile, appointments, accessibility preferences and security." },
      { property: "og:title", content: "Patient Profile — MediNav AI" },
      { property: "og:description", content: "Manage hospital navigation preferences, appointments, and emergency contacts." },
    ],
  }),
  component: ProfileScreen,
});

export function ProfileScreen() {
  const { user, signOut, a11y, setA11y } = useAppState();

  return (
    <AppShell title="Healthcare Profile" subtitle={user?.guest ? "Guest Patient Session" : "Verified Patient Account"}>
      {/* Patient Identity Header Card */}
      <section className="surface-card overflow-hidden p-6 shadow-elevation-2">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <span className="gradient-hero grid size-20 shrink-0 place-items-center rounded-3xl font-display text-2xl font-bold text-white shadow-glow">
            {(user?.name ?? "Guest").charAt(0)}
          </span>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="truncate font-display text-xl font-bold text-foreground">{user?.name ?? "Guest Patient"}</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 border border-emerald-500/20">
                <CheckCircle2 className="size-3.5" /> HIPAA Verified
              </span>
            </div>
            <p className="mt-1 truncate text-xs text-muted-foreground">{user?.email ?? "guest.patient@medinav.ai"} · UHID #MN-94021</p>

            <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
              <span className="rounded-full bg-primary-container px-3 py-1 text-[11px] font-semibold text-primary-container-foreground">
                Blood Group O+
              </span>
              <span className="rounded-full bg-secondary-container px-3 py-1 text-[11px] font-semibold text-secondary-container-foreground">
                Primary Physician: Dr. Ananya Raghavan
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Appointments Summary */}
      <section className="mt-6">
        <div className="surface-card p-5 shadow-elevation-1">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-display text-sm font-bold text-foreground">
              <Calendar className="size-4 text-primary" /> Today&apos;s Confirmed Appointment
            </span>
            <span className="rounded-full bg-accent-container px-2.5 py-1 text-[11px] font-bold text-accent-container-foreground">
              10:40 AM Today
            </span>
          </div>

          <div className="mt-3 rounded-2xl bg-muted/60 p-3.5 border border-border/80">
            <p className="font-display text-sm font-bold text-foreground">Dr. Ananya Raghavan — Interventional Cardiology</p>
            <p className="mt-1 text-xs text-muted-foreground">Room 1-E-114 · Level 1 East Wing · Token C-042</p>
          </div>

          <div className="mt-3 flex gap-2">
            <Button asChild size="sm" className="ripple flex-1 rounded-xl font-semibold">
              <Link to="/navigate">Navigate Now</Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="ripple flex-1 rounded-xl font-semibold">
              <Link to="/assistant">Reschedule via AI</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Preferences & Quick Settings Controls */}
      <section className="mt-6 space-y-3">
        <h3 className="font-display text-sm font-bold text-foreground">Medical & Accessibility Preferences</h3>

        <div className="surface-card divide-y divide-border/80 p-0 shadow-elevation-1">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl bg-primary-container text-primary">
                <Accessibility className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">Step-Free Wheelchair Routing</p>
                <p className="text-xs text-muted-foreground">Avoid stairs and prioritize wide operational elevators</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setA11y({ wheelchair: !a11y.wheelchair })}
              className={`relative h-6 w-11 rounded-full transition-colors ${a11y.wheelchair ? "bg-primary" : "bg-muted-foreground/30"}`}
              aria-label="Toggle Wheelchair preference"
            >
              <span className={`block size-5 rounded-full bg-white shadow-elevation-1 transition-transform ${a11y.wheelchair ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl bg-secondary-container text-secondary">
                <Volume2 className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">Voice Guidance Aloud</p>
                <p className="text-xs text-muted-foreground">Spoken turn-by-turn prompts during route navigation</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setA11y({ voiceGuidance: !a11y.voiceGuidance })}
              className={`relative h-6 w-11 rounded-full transition-colors ${a11y.voiceGuidance ? "bg-primary" : "bg-muted-foreground/30"}`}
              aria-label="Toggle Voice Guidance"
            >
              <span className={`block size-5 rounded-full bg-white shadow-elevation-1 transition-transform ${a11y.voiceGuidance ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
        </div>
      </section>

      {/* Emergency Contact & Navigation Links */}
      <section className="mt-6">
        <h3 className="font-display text-sm font-bold text-foreground mb-3">Account & Support Shortcuts</h3>
        <ul className="space-y-2.5">
          {[
            { to: "/history", label: "Navigation & Visit History", icon: History },
            { to: "/accessibility", label: "Accessibility Controls", icon: Accessibility },
            { to: "/settings", label: "App & Language Settings", icon: Settings },
            { to: "/feedback", label: "Send Product Feedback", icon: MessageSquareHeart },
            { to: "/help", label: "MediNav Help Center", icon: LifeBuoy },
          ].map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <Link to={to} className="surface-card flex items-center gap-3.5 p-4 transition-all hover:shadow-elevation-2">
                <Icon className="size-5 shrink-0 text-primary" />
                <span className="min-w-0 flex-1 text-sm font-bold text-foreground">{label}</span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Privacy & HIPAA Assurance Box */}
      <section className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs">
        <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
          <ShieldCheck className="size-4 text-emerald-600" />
          <span>Zero-Knowledge Privacy Guarantee</span>
        </div>
        <p className="mt-1 leading-relaxed text-emerald-900/80 dark:text-emerald-200/80">
          MediNav AI processes indoor positional telemetry strictly on device. Medical records and QR anchors are encrypted with AES-256 in compliance with HIPAA guidelines.
        </p>
      </section>

      {/* Sign Out Button */}
      <div className="mt-6">
        <Button asChild variant="outline" className="ripple h-12 w-full rounded-2xl font-semibold" onClick={signOut}>
          <Link to="/auth">
            <LogOut className="mr-2 size-4 text-destructive" /> Sign Out of MediNav Session
          </Link>
        </Button>
      </div>
    </AppShell>
  );
}

