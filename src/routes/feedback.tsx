import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Star } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Feedback — MediNav AI" },
      { name: "description", content: "Rate your wayfinding experience and help improve hospital routes for everyone." },
      { property: "og:title", content: "Feedback — MediNav AI" },
      { property: "og:description", content: "Tell us how your MediNav journey went." },
    ],
  }),
  component: FeedbackScreen,
});

function FeedbackScreen() {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  return (
    <AppShell title="Feedback" subtitle="Your rating tunes our routing model">
      <form
        className="surface-card animate-rise space-y-5 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Thanks! Your feedback reached the MediNav team.");
          setRating(0);
          setText("");
        }}
      >
        <fieldset>
          <legend className="text-sm font-medium">How was your navigation experience?</legend>
          <div className="mt-3 flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                aria-pressed={rating === n}
                className="ripple grid size-12 place-items-center rounded-2xl border border-border transition-colors aria-pressed:border-warning"
              >
                <Star className={`size-6 ${n <= rating ? "fill-warning text-warning" : "text-muted-foreground"}`} />
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="fb" className="text-sm font-medium">
            Tell us more (optional)
          </label>
          <textarea
            id="fb"
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Signage was confusing near Lift 2…"
            className="mt-2 w-full rounded-2xl border border-input bg-background p-3.5 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <Button type="submit" className="ripple h-12 w-full rounded-2xl" disabled={rating === 0}>
          <Send className="size-4" /> Submit feedback
        </Button>
      </form>
    </AppShell>
  );
}
