import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Keyboard, QrCode, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan QR Code — MediNav AI" },
      {
        name: "description",
        content: "Scan any MediNav QR anchor placed across the hospital to pinpoint your indoor position instantly.",
      },
      { property: "og:title", content: "Scan QR Code — MediNav AI" },
      { property: "og:description", content: "QR-based indoor positioning that launches the PWA in under a second." },
    ],
  }),
  component: ScanScreen,
});

function ScanScreen() {
  const navigate = useNavigate();
  const [locked, setLocked] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    const id = window.setTimeout(() => setLocked(true), 2600);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!locked) return;
    const id = window.setTimeout(() => navigate({ to: "/auth" }), 1300);
    return () => window.clearTimeout(id);
  }, [locked, navigate]);

  return (
    <div className="flex min-h-dvh flex-col bg-foreground/95 px-5 py-6 text-background">
      <header className="flex items-center gap-3">
        <QrCode className="size-5" />
        <div className="min-w-0">
          <h1 className="truncate font-display text-lg font-semibold">Scan QR anchor</h1>
          <p className="truncate text-xs text-background/70">Point at any MediNav sticker on a wall or pillar</p>
        </div>
      </header>

      <div className="relative mx-auto mt-8 aspect-square w-full max-w-sm overflow-hidden rounded-[2rem] border border-background/20 bg-background/5">
        <div className="grid-blueprint absolute inset-0 opacity-10" aria-hidden="true" />
        {[
          "left-5 top-5 border-l-4 border-t-4 rounded-tl-2xl",
          "right-5 top-5 border-r-4 border-t-4 rounded-tr-2xl",
          "left-5 bottom-5 border-b-4 border-l-4 rounded-bl-2xl",
          "right-5 bottom-5 border-b-4 border-r-4 rounded-br-2xl",
        ].map((c) => (
          <span key={c} className={`absolute size-14 border-secondary ${c}`} aria-hidden="true" />
        ))}

        {!locked ? (
          <div className="animate-scanline absolute inset-x-10 top-1/2 h-1 rounded-full bg-secondary shadow-glow" aria-hidden="true" />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <div className="flex flex-col items-center gap-2 text-center">
              <CheckCircle2 className="size-14 text-accent" />
              <p className="font-display text-lg font-semibold">Anchor G-ATR-014 locked</p>
              <p className="text-xs text-background/70">Ground Floor · Main Atrium · ±0.4 m accuracy</p>
            </div>
          </div>
        )}
      </div>

      <div
        className="mt-6 rounded-2xl bg-background/10 p-4 text-sm"
        role="status"
        aria-live="polite"
      >
        <p className="flex items-center gap-2 font-medium">
          <Zap className="size-4 text-secondary" />
          {locked ? "Position fixed — launching MediNav…" : "Detecting anchor and fusing IMU data…"}
        </p>
        <p className="mt-1 text-xs text-background/70">
          Visual Inertial Odometry + Extended Kalman Filter keep your position accurate between anchors.
        </p>
      </div>

      <div className="mt-auto space-y-3 pt-6">
        <label htmlFor="manual-code" className="flex items-center gap-2 text-xs font-medium text-background/80">
          <Keyboard className="size-4" /> Can&apos;t scan? Enter the anchor code
        </label>
        <div className="flex gap-2">
          <Input
            id="manual-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. G-ATR-014"
            className="h-12 rounded-2xl border-background/25 bg-background/10 text-background placeholder:text-background/50"
          />
          <Button className="ripple h-12 rounded-2xl px-5" onClick={() => navigate({ to: "/auth" })}>
            Go
          </Button>
        </div>
      </div>
    </div>
  );
}
