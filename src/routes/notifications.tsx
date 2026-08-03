import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCheck, CircleAlert, Info, TriangleAlert } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { NOTIFICATIONS } from "@/lib/hospital-data";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — MediNav AI" },
      {
        name: "description",
        content: "Token alerts, lift outages, lab reports and hospital advisories delivered in real time.",
      },
      { property: "og:title", content: "Notifications — MediNav AI" },
      { property: "og:description", content: "Real-time hospital alerts powered by Firebase Cloud Messaging." },
    ],
  }),
  component: NotificationsScreen,
});

const KIND = {
  info: { icon: Info, cls: "bg-secondary-container text-secondary-container-foreground" },
  success: { icon: CheckCheck, cls: "bg-success-container text-success-foreground" },
  warning: { icon: TriangleAlert, cls: "bg-warning-container text-warning-foreground" },
  critical: { icon: CircleAlert, cls: "bg-destructive-container text-destructive-container-foreground" },
} as const;

function NotificationsScreen() {
  return (
    <AppShell title="Notifications" subtitle={`${NOTIFICATIONS.filter((n) => n.unread).length} unread`}>
      <ul className="space-y-3">
        {NOTIFICATIONS.map((n) => {
          const { icon: Icon, cls } = KIND[n.kind];
          return (
            <li key={n.id} className={`surface-card animate-rise p-4 ${n.unread ? "border-primary/40" : ""}`}>
              <div className="flex gap-3">
                <span className={`grid size-10 shrink-0 place-items-center rounded-2xl ${cls}`}>
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-2">
                    <h2 className="min-w-0 flex-1 font-display text-sm font-semibold">{n.title}</h2>
                    {n.unread && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{n.body}</p>
                  <p className="mt-1.5 text-[11px] text-muted-foreground">{n.time}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Bell className="size-3.5" /> Delivered via Firebase Cloud Messaging
      </p>
    </AppShell>
  );
}
