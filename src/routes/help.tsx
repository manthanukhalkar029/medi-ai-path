import { createFileRoute, Link } from "@tanstack/react-router";
import { LifeBuoy, MessagesSquare, PhoneCall, QrCode } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help Center — MediNav AI" },
      { name: "description", content: "Answers about QR scanning, AR navigation, accessibility routing and privacy in MediNav AI." },
      { property: "og:title", content: "Help Center — MediNav AI" },
      { property: "og:description", content: "Guides and support for patients and visitors using MediNav AI." },
    ],
  }),
  component: HelpScreen,
});

const FAQ = [
  { q: "How does MediNav know where I am?", a: "Each QR sticker in the hospital is a surveyed anchor. Scanning one fixes your position to within half a metre; motion sensors and an Extended Kalman Filter keep it accurate as you walk." },
  { q: "Do I need to install an app?", a: "No. MediNav is a Progressive Web App — it opens instantly in your browser and can be added to your home screen if you want an app icon." },
  { q: "Is AR navigation supported on my phone?", a: "AR mode uses WebXR. Most recent Android and iOS browsers support it; if yours doesn't, the 2D floor map gives the same turn-by-turn guidance." },
  { q: "Can I get a step-free route?", a: "Yes. Turn on wheelchair routing in Accessibility and MediNav avoids stairs, narrow corridors and out-of-service lifts." },
  { q: "What happens to my location data?", a: "Waypoints are anonymised and stay inside your hospital's secured tenant, protected by role-based security rules." },
];

function HelpScreen() {
  return (
    <AppShell title="Help center" subtitle="Guides, FAQs and human support">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { icon: QrCode, label: "Scan a QR anchor", to: "/scan" },
          { icon: MessagesSquare, label: "Ask the assistant", to: "/assistant" },
          { icon: LifeBuoy, label: "Send feedback", to: "/feedback" },
        ].map(({ icon: Icon, label, to }) => (
          <Link key={label} to={to} className="surface-card ripple flex items-center gap-3 p-4">
            <Icon className="size-5 shrink-0 text-primary" />
            <span className="min-w-0 truncate text-sm font-medium">{label}</span>
          </Link>
        ))}
      </div>

      <section className="surface-card mt-4 p-2">
        <Accordion type="single" collapsible>
          {FAQ.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="px-3 text-left text-sm font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="px-3 text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <Button asChild className="ripple mt-4 h-12 w-full rounded-2xl">
        <a href="tel:+911800123456">
          <PhoneCall className="size-4" /> Call the hospital help desk
        </a>
      </Button>
    </AppShell>
  );
}
