import { createFileRoute } from "@tanstack/react-router";
import { Accessibility, Contrast, Ear, Eye, Type, Vibrate, Volume2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { speak, useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/accessibility")({
  head: () => ({
    meta: [
      { title: "Accessibility — MediNav AI" },
      {
        name: "description",
        content: "Large text, high contrast, wheelchair routing, voice guidance and screen reader support for every patient.",
      },
      { property: "og:title", content: "Accessibility — MediNav AI" },
      { property: "og:description", content: "WCAG AA accessibility controls that apply instantly across the app." },
    ],
  }),
  component: AccessibilityScreen,
});

function AccessibilityScreen() {
  const { a11y, setA11y } = useAppState();

  const toggles = [
    { key: "largeText", icon: Type, label: "Large text", hint: "Increase base type size across every screen." },
    { key: "highContrast", icon: Contrast, label: "High contrast", hint: "Stronger borders and darker body text." },
    { key: "voiceGuidance", icon: Volume2, label: "Voice guidance", hint: "Speak every turn instruction aloud." },
    { key: "wheelchair", icon: Accessibility, label: "Wheelchair routing", hint: "Avoid stairs and narrow corridors." },
    { key: "haptics", icon: Vibrate, label: "Haptic turn alerts", hint: "Vibrate the device before each turn." },
  ] as const;

  return (
    <AppShell title="Accessibility" subtitle="Applies instantly to navigation and the assistant">
      <section className="surface-card animate-rise p-5">
        <h2 className="font-display text-base font-semibold">Comfort settings</h2>
        <ul className="mt-3 divide-y divide-border">
          {toggles.map(({ key, icon: Icon, label, hint }) => (
            <li key={key} className="flex items-center gap-3 py-3.5">
              <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-secondary-container text-secondary-container-foreground">
                <Icon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <label htmlFor={key} className="block text-sm font-medium">
                  {label}
                </label>
                <p className="text-xs text-muted-foreground">{hint}</p>
              </div>
              <Switch
                id={key}
                checked={a11y[key]}
                onCheckedChange={(v) => setA11y({ [key]: v })}
                aria-label={label}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="surface-card mt-4 p-5">
        <h2 className="font-display text-base font-semibold">Assistive support</h2>
        <ul className="mt-3 space-y-3">
          {[
            { icon: Ear, text: "Every screen is screen-reader labelled with ARIA landmarks and live regions." },
            { icon: Eye, text: "Contrast ratios meet WCAG AA (4.5:1 for body text, 3:1 for large text)." },
            { icon: Accessibility, text: "Step-free routes prefer wide lifts and ramps verified by facilities." },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
              <Icon className="mt-0.5 size-4 shrink-0 text-accent" />
              {text}
            </li>
          ))}
        </ul>
        <Button
          className="ripple mt-4 w-full rounded-2xl"
          onClick={() => speak("Voice guidance is working. MediNav will read every turn aloud.", true)}
        >
          <Volume2 className="size-4" /> Test voice guidance
        </Button>
      </section>
    </AppShell>
  );
}
