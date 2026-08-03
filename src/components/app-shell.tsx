import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Compass,
  Home,
  MessagesSquare,
  Search,
  Siren,
  User,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BrandMark } from "./brand-mark";

const NAV: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/departments", label: "Search", icon: Search },
  { to: "/navigate", label: "Navigate", icon: Compass },
  { to: "/assistant", label: "Assistant", icon: MessagesSquare },
  { to: "/profile", label: "Profile", icon: User },
];

interface AppShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** Hide the sticky top bar for immersive screens (AR, emergency). */
  bare?: boolean;
  action?: ReactNode;
}

export function AppShell({ title, subtitle, children, bare, action }: AppShellProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-dvh bg-background pb-24">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      {!bare && (
        <header className="sticky top-0 z-30 border-b border-border/70 bg-surface/85 backdrop-blur-xl">
          <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <BrandMark className="size-9 shrink-0" />
              <div className="min-w-0">
                <h1 className="truncate font-display text-lg font-semibold tracking-tight">{title}</h1>
                {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {action}
              <Button asChild variant="ghost" size="icon" className="min-h-11 min-w-11 rounded-full" aria-label="Notifications">
                <Link to="/notifications">
                  <span className="relative">
                    <Bell className="size-5" />
                    <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-destructive" />
                  </span>
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="min-h-11 min-w-11 rounded-full text-destructive hover:bg-destructive-container"
                aria-label="Emergency navigation"
              >
                <Link to="/emergency">
                  <Siren className="size-5" />
                </Link>
              </Button>
            </div>
          </div>
        </header>
      )}

      <main id="main" className="mx-auto max-w-5xl px-4 py-5 sm:px-6">
        {children}
      </main>

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
      >
        <ul className="mx-auto flex max-w-5xl items-stretch justify-between px-2 sm:px-6">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || pathname.startsWith(`${to}/`);
            return (
              <li key={to} className="flex-1">
                <Link
                  to={to}
                  aria-current={active ? "page" : undefined}
                  className="ripple flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl py-2 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-primary"
                >
                  <span
                    className={cn(
                      "flex h-7 w-14 items-center justify-center rounded-full transition-colors",
                      active && "bg-primary-container text-primary-container-foreground",
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
