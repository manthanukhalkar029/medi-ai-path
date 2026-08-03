import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Lock, ShieldCheck, UserRound } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — MediNav AI" },
      {
        name: "description",
        content: "Sign in with Google or continue as a guest to start navigating the hospital with MediNav AI.",
      },
      { property: "og:title", content: "Sign in — MediNav AI" },
      { property: "og:description", content: "Google Sign-In or one-tap guest access, secured by role-based access control." },
    ],
  }),
  component: AuthScreen,
});

function AuthScreen() {
  const { signIn } = useAppState();
  const navigate = useNavigate();
  const [pending, setPending] = useState<"google" | "guest" | null>(null);

  // Firebase Authentication placeholder — replace with signInWithPopup(auth, googleProvider).
  function enter(kind: "google" | "guest") {
    setPending(kind);
    window.setTimeout(() => {
      signIn(
        kind === "google"
          ? { name: "Aarav Sharma", email: "aarav.sharma@gmail.com", guest: false }
          : { name: "Guest Visitor", email: "guest@medinav.ai", guest: true },
      );
      navigate({ to: "/home" });
    }, 850);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background px-6 py-10">
      <div className="mx-auto w-full max-w-md">
        <BrandMark className="size-14" />
        <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">Welcome to MediNav AI</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Sign in to sync your navigation history, appointment reminders and accessibility preferences across devices.
        </p>

        <div className="surface-card mt-8 space-y-3 p-5">
          <Button
            size="lg"
            variant="outline"
            className="ripple h-13 w-full justify-start gap-3 rounded-2xl text-base"
            onClick={() => enter("google")}
            disabled={pending !== null}
          >
            <GoogleGlyph />
            {pending === "google" ? "Signing in…" : "Continue with Google"}
            <ArrowRight className="ml-auto size-4 opacity-50" />
          </Button>

          <Button
            size="lg"
            className="ripple h-13 w-full justify-start gap-3 rounded-2xl text-base"
            onClick={() => enter("guest")}
            disabled={pending !== null}
          >
            <UserRound className="size-5" />
            {pending === "guest" ? "Preparing session…" : "Continue as guest"}
            <ArrowRight className="ml-auto size-4 opacity-70" />
          </Button>

          <p className="pt-1 text-xs leading-relaxed text-muted-foreground">
            Guests get full navigation. Personal health context and saved routes require a signed-in account.
          </p>
        </div>

        <ul className="mt-6 space-y-2.5">
          {[
            { icon: ShieldCheck, text: "Role-based access control with Firebase Security Rules" },
            { icon: Lock, text: "All traffic encrypted over HTTPS — no location data leaves the hospital tenant" },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="flex gap-2.5 text-xs leading-relaxed text-muted-foreground">
              <Icon className="mt-0.5 size-4 shrink-0 text-accent" />
              {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.6Z" />
      <path fill="#34A853" d="M12 23.5c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v3A11.5 11.5 0 0 0 12 23.5Z" />
      <path fill="#FBBC05" d="M5.6 14.2a6.9 6.9 0 0 1 0-4.4v-3H1.8a11.5 11.5 0 0 0 0 10.4l3.8-3Z" />
      <path fill="#EA4335" d="M12 5.4c1.7 0 3.2.6 4.4 1.7l3.3-3.3A11.5 11.5 0 0 0 1.8 6.8l3.8 3c.9-2.7 3.4-4.4 6.4-4.4Z" />
    </svg>
  );
}
