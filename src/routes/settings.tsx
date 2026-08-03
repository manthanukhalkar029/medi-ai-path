import { createFileRoute } from "@tanstack/react-router";
import { Bell, Globe, MapPinned, Moon, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — MediNav AI" },
      { name: "description", content: "Control notifications, language, location sharing and privacy in MediNav AI." },
      { property: "og:title", content: "Settings — MediNav AI" },
      { property: "og:description", content: "Notification, language and privacy controls for your hospital navigation." },
    ],
  }),
  component: SettingsScreen,
});

function SettingsScreen() {
  const [prefs, setPrefs] = useState({ push: true, location: true, dark: false, analytics: true });

  const items = [
    { key: "push", icon: Bell, label: "Push notifications", hint: "Token alerts, lift outages and report updates." },
    { key: "location", icon: MapPinned, label: "Indoor positioning", hint: "Use QR anchors and motion sensors to track your position." },
    { key: "dark", icon: Moon, label: "Dark theme", hint: "Easier on the eyes in dim wards and corridors." },
    { key: "analytics", icon: Globe, label: "Usage analytics", hint: "Anonymous journey stats that improve routing quality." },
  ] as const;

  function toggle(key: keyof typeof prefs, value: boolean) {
    setPrefs((p) => ({ ...p, [key]: value }));
    if (key === "dark") document.documentElement.classList.toggle("dark", value);
  }

  return (
    <AppShell title="Settings" subtitle="Preferences saved to your account">
      <section className="surface-card animate-rise p-5">
        <ul className="divide-y divide-border">
          {items.map(({ key, icon: Icon, label, hint }) => (
            <li key={key} className="flex items-center gap-3 py-3.5">
              <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary-container text-primary-container-foreground">
                <Icon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <label htmlFor={key} className="block text-sm font-medium">
                  {label}
                </label>
                <p className="text-xs text-muted-foreground">{hint}</p>
              </div>
              <Switch id={key} checked={prefs[key]} onCheckedChange={(v) => toggle(key, v)} aria-label={label} />
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" />
        MediNav AI stores only anonymised waypoints. Location data never leaves your hospital&apos;s secured tenant and is
        governed by role-based Firebase Security Rules.
      </p>
    </AppShell>
  );
}
