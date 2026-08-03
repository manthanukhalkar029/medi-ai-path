import { createFileRoute, Link } from "@tanstack/react-router";
import { Accessibility, ChevronRight, History, LifeBuoy, LogOut, MessageSquareHeart, Settings } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — MediNav AI" },
      { name: "description", content: "Your MediNav profile, saved preferences, navigation history and support shortcuts." },
      { property: "og:title", content: "Profile — MediNav AI" },
      { property: "og:description", content: "Manage your hospital navigation account and preferences." },
    ],
  }),
  component: ProfileScreen,
});

const LINKS = [
  { to: "/history", label: "Navigation history", icon: History },
  { to: "/accessibility", label: "Accessibility", icon: Accessibility },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/feedback", label: "Send feedback", icon: MessageSquareHeart },
  { to: "/help", label: "Help center", icon: LifeBuoy },
];

function ProfileScreen() {
  const { user, signOut } = useAppState();

  return (
    <AppShell title="Profile" subtitle={user?.guest ? "Guest session" : "Signed in"}>
      <section className="surface-card animate-rise flex items-center gap-4 p-5">
        <span className="gradient-hero grid size-16 shrink-0 place-items-center rounded-3xl font-display text-xl font-semibold text-primary-foreground">
          {(user?.name ?? "Guest").charAt(0)}
        </span>
        <div className="min-w-0">
          <h2 className="truncate font-display text-lg font-semibold">{user?.name ?? "Guest Visitor"}</h2>
          <p className="truncate text-xs text-muted-foreground">{user?.email ?? "guest@medinav.ai"}</p>
          <span className="mt-2 inline-block rounded-full bg-accent-container px-2.5 py-1 text-[11px] font-semibold text-accent-container-foreground">
            {user?.guest === false ? "Google account" : "Guest access"}
          </span>
        </div>
      </section>

      <ul className="mt-4 space-y-2.5">
        {LINKS.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link to={to} className="surface-card ripple flex items-center gap-3 p-4">
              <Icon className="size-5 shrink-0 text-primary" />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{label}</span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>

      <Button asChild variant="outline" className="ripple mt-5 h-12 w-full rounded-2xl" onClick={signOut}>
        <Link to="/auth">
          <LogOut className="size-4" /> Sign out
        </Link>
      </Button>
    </AppShell>
  );
}
