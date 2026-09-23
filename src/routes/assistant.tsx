import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Bot,
  CheckCircle2,
  ChevronRight,
  Compass,
  Cpu,
  Mic,
  Navigation,
  Radio,
  RotateCcw,
  Send,
  Sparkles,
  Square,
  Volume2,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/app-shell";
import { AgenticBadge, ExplainCard } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { SUGGESTED_QUESTIONS } from "@/lib/hospital-data";
import { speak, useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "MediNav AI Assistant — Agentic & Explainable" },
      {
        name: "description",
        content:
          "Chat or speak with the MediNav agent for wayfinding, wait times and hospital services — every answer is explainable with transparent reasoning.",
      },
      { property: "og:title", content: "MediNav AI Assistant" },
      { property: "og:description", content: "Agentic AI with voice input, knowledge graph retrieval, and explainable answers." },
    ],
  }),
  component: AssistantScreen,
});

interface Msg {
  id: string;
  role: "user" | "agent";
  text: string;
  reasons?: string[];
  confidence?: number;
  actions?: string[];
  timestamp: string;
}

const SEED: Msg[] = [
  {
    id: "m0",
    role: "agent",
    text: "Hello! I am the MediNav Agentic AI Assistant. I have fused your current position (Anchor G-ATR-014, Main Atrium) with live hospital graph telemetry. How may I assist your hospital visit today?",
    reasons: [
      "Scanned anchor G-ATR-014 (Ground Floor · Main Atrium) 2 minutes ago.",
      "Profile indicates upcoming appointment with Dr. Ananya Raghavan at 10:40 AM (Cardiology).",
      "Live A* pathfinder and queue tokens active.",
    ],
    confidence: 0.98,
    actions: ["Take me to Cardiology", "Nearest pharmacy", "Wheelchair route", "Check wait times"],
    timestamp: "10:02 AM",
  },
];

function generateReply(question: string): Msg {
  const q = question.toLowerCase();
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (q.includes("pharmacy")) {
    return {
      id: crypto.randomUUID(),
      role: "agent",
      text: "The 24×7 Pharmacy is located on the Ground floor, Main Atrium — exactly 130 metres away (approx. 3 minute step-free walk). The live counter queue duration is 6 minutes.",
      reasons: [
        "Retrieved 'Pharmacy' node from the hospital knowledge graph (Ground · Main Atrium).",
        "A* pathfinder returned 132 m from anchor G-ATR-014 with no elevator transitions required.",
        "Live queue length pulled from pharmacy token dispatch service.",
      ],
      confidence: 0.97,
      actions: ["Start turn-by-turn navigation", "Show on map", "Check open counters"],
      timestamp: time,
    };
  }
  if (q.includes("emergency") || q.includes("help") || q.includes("er")) {
    return {
      id: crypto.randomUUID(),
      role: "agent",
      text: "Emergency / Trauma Care is 95 metres away at the North Entrance on this floor. I have initialized the fastest obstacle-free emergency corridor and dispatched an alert to the triage desk.",
      reasons: [
        "Emergency intent classified — applied high-priority routing policy.",
        "Selected North Entrance corridor: shortest direct path, avoiding elevator bottlenecks.",
        "Triage notification dispatched via Firebase Cloud Messaging.",
      ],
      confidence: 0.99,
      actions: ["Open emergency mode", "Call hospital helpline"],
      timestamp: time,
    };
  }
  if (q.includes("wheelchair") || q.includes("accessible") || q.includes("lift")) {
    return {
      id: crypto.randomUUID(),
      role: "agent",
      text: "Lift 2 near the East Wing lobby is the widest wheelchair-accessible lift and is fully operational. I can route you step-free to any floor without stairs.",
      reasons: [
        "Facilities feed reports Lift 3 out of service.",
        "Lift 2 features 1100 mm door width, tactile buttons, and low-level braille controls.",
        "User profile has step-free routing preference enabled.",
      ],
      confidence: 0.95,
      actions: ["Enable wheelchair mode", "Navigate to Lift 2"],
      timestamp: time,
    };
  }
  if (q.includes("cardio") || q.includes("appointment")) {
    return {
      id: crypto.randomUUID(),
      role: "agent",
      text: "Cardiology is on Level 1, East Wing, Room 1-E-114. It is a 4-minute walk from here via Lift 2. Dr. Ananya Raghavan is running on schedule for your 10:40 AM slot.",
      reasons: [
        "Matched query to department node dept/cardiology on Level 1.",
        "Route computed with 1 floor transition using operational Lift 2.",
        "Doctor status confirmed via live OPD schedule integration.",
      ],
      confidence: 0.98,
      actions: ["Start navigation", "Open AR mode", "View doctor profile"],
      timestamp: time,
    };
  }
  return {
    id: crypto.randomUUID(),
    role: "agent",
    text: "I searched the hospital RAG index for that query. I can guide you there, show live wait times, or connect you with hospital administration.",
    reasons: [
      "Semantic vector search over the hospital RAG index returned candidate nodes.",
      "Confidence level meets standard query response threshold.",
    ],
    confidence: 0.85,
    actions: ["Show departments", "Talk to help desk"],
    timestamp: time,
  };
}

function AssistantScreen() {
  const { a11y } = useAppState();
  const [messages, setMessages] = useState<Msg[]>(SEED);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  function send(text: string) {
    const value = text.trim();
    if (!value || typing) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", text: value, timestamp: time }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      const reply = generateReply(value);
      setMessages((m) => [...m, reply]);
      setTyping(false);
      speak(reply.text, a11y.voiceGuidance);
    }, 1100);
  }

  function toggleVoice() {
    setListening((l) => !l);
    if (!listening) {
      window.setTimeout(() => {
        setListening(false);
        send("Where is the nearest pharmacy?");
      }, 2000);
    }
  }

  return (
    <AppShell
      title="MediNav AI Assistant"
      subtitle="Agentic Reasoning Engine · Explainable AI"
      action={<AgenticBadge label="Claude RAG Active" />}
    >
      {/* Top Reasoning & Telemetry Status Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border/80 bg-surface/90 px-4 py-2 text-xs shadow-elevation-1">
        <div className="flex items-center gap-2 font-medium text-foreground">
          <Cpu className="size-4 text-primary animate-pulse" />
          <span>Knowledge Graph RAG Indexed</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-emerald-600 font-bold">12 ms latency</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setMessages(SEED)}
            className="h-7 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="mr-1 size-3" /> Reset Chat
          </Button>
        </div>
      </div>

      {/* Chat Messages Timeline */}
      <div className="space-y-5 pb-44">
        {messages.map((m) => (
          <motion.article
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
          >
            {m.role === "user" ? (
              <div className="max-w-[85%] rounded-3xl rounded-br-md bg-primary px-4 py-3 text-sm leading-relaxed text-primary-foreground shadow-elevation-1">
                <p>{m.text}</p>
                <span className="mt-1 block text-right text-[10px] opacity-75">{m.timestamp}</span>
              </div>
            ) : (
              <div className="max-w-[92%] space-y-3 sm:max-w-[85%]">
                <div className="flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-elevation-1">
                    <Bot className="size-4" />
                  </span>
                  <div>
                    <span className="font-display text-xs font-bold text-foreground">MediNav Agentic AI</span>
                    <span className="ml-2 text-[10px] text-muted-foreground">{m.timestamp}</span>
                  </div>
                </div>

                <div className="surface-card p-4 shadow-elevation-1">
                  <p className="text-sm leading-relaxed text-foreground">{m.text}</p>

                  {/* Explainable AI Panel */}
                  {m.reasons && m.confidence !== undefined && (
                    <div className="mt-4">
                      <ExplainCard reasons={m.reasons} confidence={m.confidence} />
                    </div>
                  )}

                  {/* Suggested Action Chips inside message */}
                  {m.actions && (
                    <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-border/60">
                      {m.actions.map((a) => (
                        <Button
                          key={a}
                          size="sm"
                          variant="secondary"
                          className="ripple rounded-full text-xs font-semibold shadow-elevation-1"
                          onClick={() => send(a)}
                        >
                          {a}
                          <ChevronRight className="ml-1 size-3" />
                        </Button>
                      ))}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="ripple rounded-full text-xs font-medium text-muted-foreground hover:text-foreground"
                        onClick={() => speak(m.text, true)}
                        aria-label="Read this answer aloud"
                      >
                        <Volume2 className="mr-1 size-3.5" /> Read Aloud
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.article>
        ))}

        {/* Thinking / Reasoning Animation State */}
        {typing && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-2xl border border-secondary/30 bg-secondary-container/40 p-3.5 text-secondary-container-foreground backdrop-blur-md"
          >
            <span className="grid size-8 place-items-center rounded-xl bg-secondary/20 text-secondary">
              <Sparkles className="size-4 animate-spin" />
            </span>
            <div className="text-xs font-medium">
              <p className="font-bold flex items-center gap-1.5">
                <Zap className="size-3.5 text-secondary animate-pulse" /> MediNav Agent is reasoning...
              </p>
              <p className="text-[11px] text-muted-foreground animate-pulse">Evaluating A* graph path, queue tokens & step-free policies...</p>
            </div>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      {/* Fixed Multi-modal Input Drawer Bar */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border/80 bg-surface/95 px-4 pb-3 pt-3 backdrop-blur-xl shadow-elevation-3 sm:px-6">
        <div className="mx-auto max-w-5xl">
          {/* Suggested Prompts Pill Carousel */}
          <div className="mb-2.5 flex gap-2 overflow-x-auto pb-1">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => send(q)}
                className="ripple shrink-0 rounded-full border border-border bg-surface-variant px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-all hover:border-primary hover:bg-primary-container hover:text-primary-container-foreground shadow-elevation-1"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            className="flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <div className="relative flex-1">
              <input
                id="ask"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask MediNav anything about navigation, doctors or wait times..."
                className="h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary shadow-elevation-1"
              />
              {listening && (
                <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 text-xs font-bold text-destructive">
                  <span className="size-2 rounded-full bg-destructive animate-ping" />
                  Listening...
                </div>
              )}
            </div>

            <Button
              type="button"
              size="icon"
              variant={listening ? "destructive" : "outline"}
              onClick={toggleVoice}
              className="ripple size-12 shrink-0 rounded-2xl shadow-elevation-1"
              aria-label={listening ? "Stop voice input" : "Start voice input"}
            >
              {listening ? <Square className="size-5 animate-pulse" /> : <Mic className="size-5 text-primary" />}
            </Button>

            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || typing}
              className="ripple size-12 shrink-0 rounded-2xl bg-primary text-primary-foreground shadow-elevation-1"
              aria-label="Send message"
            >
              <Send className="size-5" />
            </Button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}

