import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Mic, Send, Sparkles, Square, Volume2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AgenticBadge, ExplainCard } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { SUGGESTED_QUESTIONS } from "@/lib/hospital-data";
import { speak, useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant — MediNav AI" },
      {
        name: "description",
        content:
          "Chat or speak with the MediNav agent for wayfinding, wait times and hospital services — every answer is explainable.",
      },
      { property: "og:title", content: "AI Assistant — MediNav AI" },
      { property: "og:description", content: "Agentic AI with voice input, function calling and explainable answers." },
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
}

const SEED: Msg[] = [
  {
    id: "m0",
    role: "agent",
    text: "Hi, I'm the MediNav agent. I can guide you anywhere in the hospital, check wait times, or find a doctor. What do you need?",
    reasons: [
      "You scanned anchor G-ATR-014 (Ground floor, Main Atrium) 2 minutes ago.",
      "Your Firestore profile has an appointment at Cardiology at 10:40 AM.",
    ],
    confidence: 0.94,
    actions: ["Take me to Cardiology", "Nearest pharmacy", "Wheelchair route"],
  },
];

/** Placeholder for the Claude function-calling + RAG Cloud Function. */
function generateReply(question: string): Msg {
  const q = question.toLowerCase();
  if (q.includes("pharmacy")) {
    return {
      id: crypto.randomUUID(),
      role: "agent",
      text: "The 24×7 Pharmacy is on the Ground floor, Main Atrium — about 130 m away, roughly a 3 minute walk. Current queue is 6 minutes.",
      reasons: [
        "Retrieved 'Pharmacy' node from the hospital knowledge graph (Ground · Main Atrium).",
        "A* pathfinding returned 132 m from anchor G-ATR-014 with no stairs.",
        "Live queue length pulled from the pharmacy token service.",
      ],
      confidence: 0.96,
      actions: ["Start navigation", "Show on map"],
    };
  }
  if (q.includes("emergency") || q.includes("help")) {
    return {
      id: crypto.randomUUID(),
      role: "agent",
      text: "Emergency / Casualty is 95 m away at the North Entrance on this floor. I've prepared the fastest step-free route and alerted the triage desk.",
      reasons: [
        "Emergency intent detected — priority routing policy applied.",
        "Selected North Entrance corridor: shortest path, no lifts required.",
        "Triage notification dispatched via Firebase Cloud Messaging.",
      ],
      confidence: 0.99,
      actions: ["Open emergency mode"],
    };
  }
  if (q.includes("wheelchair") || q.includes("accessible")) {
    return {
      id: crypto.randomUUID(),
      role: "agent",
      text: "Lift 2 near the East corridor is the widest accessible lift and is currently operational. I can route you step-free to any floor.",
      reasons: [
        "Lift 3 is flagged out of service in the facilities feed.",
        "Lift 2 has 1100 mm door width — meets accessibility policy.",
        "Your profile has step-free routing preference enabled.",
      ],
      confidence: 0.92,
      actions: ["Enable wheelchair mode"],
    };
  }
  if (q.includes("cardio")) {
    return {
      id: crypto.randomUUID(),
      role: "agent",
      text: "Cardiology is on Level 1, East Wing, Room 1-E-114. It's a 4 minute walk — lift lobby, then right. Dr. Ananya Raghavan is available at 10:40 AM.",
      reasons: [
        "Matched 'Cardiology' to department node dept/cardiology on Level 1.",
        "Route computed with 1 floor transition via Lift 2.",
        "Doctor availability read from the live OPD schedule.",
      ],
      confidence: 0.97,
      actions: ["Start navigation", "AR mode"],
    };
  }
  return {
    id: crypto.randomUUID(),
    role: "agent",
    text: "I've searched the hospital directory for that. I can take you there, show live wait times, or connect you with the help desk — just tell me which.",
    reasons: [
      "Semantic search over the hospital RAG index returned 3 candidate nodes.",
      "Confidence below the auto-navigate threshold, so I asked to confirm.",
    ],
    confidence: 0.71,
    actions: ["Show departments", "Talk to help desk"],
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
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", text: value }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      const reply = generateReply(value);
      setMessages((m) => [...m, reply]);
      setTyping(false);
      speak(reply.text, a11y.voiceGuidance);
    }, 1000);
  }

  /** Whisper API placeholder — capture audio, transcribe, then send. */
  function toggleVoice() {
    setListening((l) => !l);
    if (!listening) {
      window.setTimeout(() => {
        setListening(false);
        send("Where is the nearest pharmacy?");
      }, 1600);
    }
  }

  return (
    <AppShell title="MediNav Assistant" subtitle="Agentic AI · Explainable answers" action={<AgenticBadge />}>
      <div className="space-y-4 pb-40">
        {messages.map((m) => (
          <article key={m.id} className={m.role === "user" ? "flex justify-end" : "animate-rise"}>
            {m.role === "user" ? (
              <p className="max-w-[85%] rounded-3xl rounded-br-lg bg-primary px-4 py-3 text-sm leading-relaxed text-primary-foreground">
                {m.text}
              </p>
            ) : (
              <div className="max-w-[92%] space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <Sparkles className="size-3.5 text-primary" /> MediNav agent
                </div>
                <p className="text-sm leading-relaxed">{m.text}</p>
                {m.reasons && m.confidence !== undefined && (
                  <ExplainCard reasons={m.reasons} confidence={m.confidence} />
                )}
                {m.actions && (
                  <div className="flex flex-wrap gap-2">
                    {m.actions.map((a) => (
                      <Button
                        key={a}
                        size="sm"
                        variant="outline"
                        className="ripple rounded-full text-xs"
                        onClick={() => send(a)}
                      >
                        {a}
                      </Button>
                    ))}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ripple rounded-full text-xs"
                      onClick={() => speak(m.text, true)}
                      aria-label="Read this answer aloud"
                    >
                      <Volume2 className="size-3.5" /> Listen
                    </Button>
                  </div>
                )}
              </div>
            )}
          </article>
        ))}

        {typing && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground" role="status" aria-live="polite">
            <Sparkles className="size-4 animate-pulse text-primary" />
            <span className="animate-blink">MediNav is reasoning…</span>
          </p>
        )}
        <div ref={endRef} />
      </div>

      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border/70 bg-surface/95 px-4 pb-3 pt-3 backdrop-blur-xl sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => send(q)}
                className="ripple shrink-0 rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary-container hover:text-primary-container-foreground"
              >
                {q}
              </button>
            ))}
          </div>
          <form
            className="flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <label htmlFor="ask" className="sr-only">
              Ask the MediNav assistant
            </label>
            <input
              id="ask"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about the hospital…"
              className="h-12 min-w-0 flex-1 rounded-2xl border border-input bg-background px-4 text-sm outline-none placeholder:text-muted-foreground"
            />
            <Button
              type="button"
              size="icon"
              variant={listening ? "destructive" : "outline"}
              onClick={toggleVoice}
              className="ripple size-12 shrink-0 rounded-2xl"
              aria-label={listening ? "Stop voice input" : "Start voice input"}
            >
              {listening ? <Square className="size-4" /> : <Mic className="size-5" />}
            </Button>
            <Button type="submit" size="icon" className="ripple size-12 shrink-0 rounded-2xl" aria-label="Send message">
              <Send className="size-5" />
            </Button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
