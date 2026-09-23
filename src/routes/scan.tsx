import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Flashlight, Keyboard, MapPin, Navigation, QrCode, ShieldCheck, Sparkles, Zap } from "lucide-react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan QR Anchor — MediNav AI" },
      {
        name: "description",
        content: "Scan any MediNav QR anchor placed across the hospital to pinpoint your indoor position instantly.",
      },
      { property: "og:title", content: "Scan QR Anchor — MediNav AI" },
      { property: "og:description", content: "QR-based indoor positioning that launches the PWA in under a second." },
    ],
  }),
  component: ScanScreen,
});

function ScanScreen() {
  const navigate = useNavigate();
  const [locked, setLocked] = useState(false);
  const [flashlight, setFlashlight] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    const id = window.setTimeout(() => {
      setLocked(true);
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.5 },
          colors: ["#2563EB", "#06B6D4", "#10B981"],
        });
      } catch {
        /* ignore confetti unsupported */
      }
    }, 2400);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-slate-950 px-5 py-6 text-slate-100">
      {/* Top Scanner Bar */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-primary/20 text-primary border border-primary/30">
            <QrCode className="size-5" />
          </span>
          <div>
            <h1 className="font-display text-base font-bold tracking-tight text-white">Scan QR Anchor</h1>
            <p className="text-xs text-slate-400">Point phone camera at wall or pillar anchor sticker</p>
          </div>
        </div>

        <Button
          size="icon"
          variant="outline"
          onClick={() => setFlashlight(!flashlight)}
          className={`size-11 rounded-2xl border-white/10 ${flashlight ? "bg-amber-500/20 text-amber-300 border-amber-500/40" : "bg-white/5 text-slate-300"}`}
          aria-label="Toggle Flashlight"
        >
          <Flashlight className="size-5" />
        </Button>
      </header>

      {/* Main Viewfinder Box */}
      <div className={`relative mx-auto mt-8 aspect-square w-full max-w-sm overflow-hidden rounded-3xl border ${flashlight ? "border-amber-400/40 shadow-glow" : "border-white/15 bg-white/5"}`}>
        <div className="grid-blueprint absolute inset-0 opacity-15" aria-hidden="true" />
        
        {/* Corner Viewfinder Target Brackets */}
        {[
          "left-5 top-5 border-l-4 border-t-4 rounded-tl-2xl",
          "right-5 top-5 border-r-4 border-t-4 rounded-tr-2xl",
          "left-5 bottom-5 border-b-4 border-l-4 rounded-bl-2xl",
          "right-5 bottom-5 border-b-4 border-r-4 rounded-br-2xl",
        ].map((c) => (
          <span key={c} className={`absolute size-14 ${locked ? "border-emerald-400" : "border-cyan-400"} ${c}`} aria-hidden="true" />
        ))}

        {!locked ? (
          <>
            <div className="animate-scanline absolute inset-x-8 top-1/2 h-1 rounded-full bg-cyan-400 shadow-cyan-glow" aria-hidden="true" />
            <div className="absolute inset-0 grid place-items-center">
              <div className="flex flex-col items-center gap-1.5 text-center">
                <Sparkles className="size-6 text-cyan-300 animate-pulse" />
                <p className="font-display text-xs font-semibold text-cyan-200">Align QR code within box</p>
              </div>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 grid place-items-center bg-slate-950/90 p-6 text-center backdrop-blur-md"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="grid size-16 place-items-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-glow">
                <CheckCircle2 className="size-10" />
              </span>
              <p className="font-display text-lg font-bold text-white">Anchor G-ATR-014 Locked</p>
              <p className="text-xs text-slate-300">Ground Floor · Main Atrium Entrance</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-bold text-emerald-300">
                <ShieldCheck className="size-3.5" /> ±0.4m Precision Fixed
              </span>

              <Button
                size="lg"
                onClick={() => navigate({ to: "/navigate" })}
                className="ripple mt-3 h-12 w-full rounded-2xl bg-primary text-primary-foreground font-semibold shadow-glow"
              >
                <Navigation className="size-4" /> Start Turn-by-Turn Route
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Telemetry Status Card */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs backdrop-blur-md">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 font-bold text-slate-200">
            <Zap className="size-4 text-cyan-400" />
            {locked ? "Position Fixed — Sensor Fusion Active" : "Detecting Anchor & Inertial Odometry..."}
          </p>
          <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
            VIO Engine
          </span>
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
          Visual Inertial Odometry + Extended Kalman Filter track your position seamlessly between hospital QR anchors.
        </p>
      </div>

      {/* Manual Code Input Fallback */}
      <div className="mt-auto space-y-3 pt-6">
        <label htmlFor="manual-code" className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Keyboard className="size-4 text-primary" /> Can&apos;t scan? Enter the anchor code manually
        </label>
        <div className="flex gap-2">
          <Input
            id="manual-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. G-ATR-014"
            className="h-12 rounded-2xl border-white/15 bg-white/10 text-white placeholder:text-slate-500 font-mono text-sm"
          />
          <Button
            className="ripple h-12 rounded-2xl bg-primary px-6 font-semibold shadow-glow"
            onClick={() => navigate({ to: "/navigate" })}
          >
            Go <ArrowRight className="ml-1 size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

