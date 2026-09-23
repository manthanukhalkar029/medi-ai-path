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
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
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
    <div className="min-h-dvh bg-background pb-28 text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-2xl focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground shadow-glow"
      >
        Skip to content
      </a>

      {!bare && (
        <header className="sticky top-0 z-30 border-b border-border/80 bg-surface/85 backdrop-blur-xl transition-all">
          <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Link to="/home" className="shrink-0 transition-transform active:scale-95">
                <BrandMark className="size-10 shadow-elevation-2" />
              </Link>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="truncate font-display text-base font-bold tracking-tight sm:text-lg">{title}</h1>
                  <span className="hidden items-center gap-1 rounded-full bg-accent-container px-2 py-0.5 text-[10px] font-semibold text-accent-container-foreground sm:inline-flex border border-accent/20">
                    <span className="size-1.5 rounded-full bg-accent animate-pulse" /> Live Hospital
                  </span>
                </div>
                {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {action}
              <Button asChild variant="ghost" size="icon" className="size-10 rounded-full hover:bg-muted" aria-label="Notifications">
                <Link to="/notifications">
                  <span className="relative">
                    <Bell className="size-5" />
                    <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-destructive ring-2 ring-surface animate-pulse" />
                  </span>
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="size-10 rounded-full text-destructive hover:bg-destructive-container hover:text-destructive-container-foreground transition-colors"
                aria-label="Emergency navigation"
              >
                <Link to="/emergency">
                  <Siren className="size-5 animate-pulse" />
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
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl shadow-elevation-3"
      >
        <ul className="mx-auto flex max-w-5xl items-stretch justify-between px-3 py-1.5 sm:px-6">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || (to !== "/home" && pathname.startsWith(`${to}/`));
            return (
              <li key={to} className="flex-1">
                <Link
                  to={to}
                  aria-current={active ? "page" : undefined}
                  className="relative flex flex-col items-center justify-center gap-1 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-primary"
                >
                  <span className="relative flex h-8 w-14 items-center justify-center rounded-full">
                    {active && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-full bg-primary-container border border-primary/20"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Icon className={cn("relative z-10 size-5 transition-transform duration-200", active && "scale-110 text-primary")} />
                  </span>
                  <span className={cn("relative z-10 transition-colors", active && "font-bold text-primary")}>
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

