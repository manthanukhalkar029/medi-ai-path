import { cn } from "@/lib/utils";
import type { FloorId } from "@/lib/hospital-data";

interface FloorMapProps {
  floor: FloorId;
  destination?: string;
  className?: string;
  /** Draws the animated A* route + live position puck. */
  showRoute?: boolean;
  wheelchair?: boolean;
}

const ROOMS: Record<FloorId, { x: number; y: number; w: number; h: number; label: string }[]> = {
  B1: [
    { x: 18, y: 20, w: 90, h: 60, label: "MRI" },
    { x: 120, y: 20, w: 74, h: 60, label: "CT" },
    { x: 206, y: 20, w: 86, h: 60, label: "X-Ray" },
    { x: 18, y: 132, w: 120, h: 66, label: "Parking B1" },
    { x: 152, y: 132, w: 140, h: 66, label: "Blood Bank" },
  ],
  G: [
    { x: 18, y: 20, w: 96, h: 62, label: "Emergency" },
    { x: 126, y: 20, w: 78, h: 62, label: "Pharmacy" },
    { x: 216, y: 20, w: 76, h: 62, label: "Billing" },
    { x: 18, y: 132, w: 110, h: 66, label: "Reception" },
    { x: 142, y: 132, w: 150, h: 66, label: "Laboratory" },
  ],
  "1": [
    { x: 18, y: 20, w: 104, h: 62, label: "Cardiology" },
    { x: 134, y: 20, w: 70, h: 62, label: "Derma" },
    { x: 216, y: 20, w: 76, h: 62, label: "Cafeteria" },
    { x: 18, y: 132, w: 130, h: 66, label: "OPD Waiting" },
    { x: 162, y: 132, w: 130, h: 66, label: "Consult 1–8" },
  ],
  "2": [
    { x: 18, y: 20, w: 96, h: 62, label: "Neurology" },
    { x: 126, y: 20, w: 82, h: 62, label: "Ortho" },
    { x: 220, y: 20, w: 72, h: 62, label: "Dialysis" },
    { x: 18, y: 132, w: 140, h: 66, label: "Operation Theatres" },
    { x: 172, y: 132, w: 120, h: 66, label: "Wards 201–216" },
  ],
  "3": [
    { x: 18, y: 20, w: 108, h: 62, label: "Maternity" },
    { x: 138, y: 20, w: 82, h: 62, label: "Paediatrics" },
    { x: 232, y: 20, w: 60, h: 62, label: "NICU" },
    { x: 18, y: 132, w: 128, h: 66, label: "Labour Rooms" },
    { x: 160, y: 132, w: 132, h: 66, label: "Family Lounge" },
  ],
};

export function FloorMap({ floor, destination, className, showRoute = true, wheelchair }: FloorMapProps) {
  const rooms = ROOMS[floor];

  return (
    <div className={cn("relative overflow-hidden rounded-3xl border border-border bg-surface-variant", className)}>
      <div className="grid-blueprint absolute inset-0 opacity-60" aria-hidden="true" />
      <svg
        viewBox="0 0 310 220"
        className="relative h-full w-full"
        role="img"
        aria-label={`Floor plan of level ${floor}${destination ? `, route to ${destination}` : ""}`}
      >
        {/* corridor */}
        <rect x="12" y="92" width="286" height="32" rx="12" className="fill-surface" />
        <rect x="150" y="14" width="26" height="192" rx="12" className="fill-surface" />

        {rooms.map((r) => {
          const isTarget = destination
            ? destination.toLowerCase().includes(r.label.toLowerCase().split(" ")[0]!.toLowerCase())
            : false;
          return (
            <g key={r.label}>
              <rect
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                rx="12"
                className={cn(
                  "stroke-[1.5]",
                  isTarget ? "fill-primary-container stroke-primary" : "fill-card stroke-border",
                )}
              />
              <text
                x={r.x + r.w / 2}
                y={r.y + r.h / 2 + 4}
                textAnchor="middle"
                className={cn(
                  "text-[9px] font-medium",
                  isTarget ? "fill-primary-container-foreground" : "fill-muted-foreground",
                )}
              >
                {r.label}
              </text>
            </g>
          );
        })}

        {showRoute && (
          <>
            <path
              d="M62 190 L62 150 L163 150 L163 108 L250 108 L250 74"
              className="stroke-primary/25"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M62 190 L62 150 L163 150 L163 108 L250 108 L250 74"
              className="animate-route-dash stroke-primary"
              strokeWidth="3.5"
              strokeDasharray="10 10"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* live position */}
            <circle cx="62" cy="190" r="9" className="animate-pulse-ring fill-secondary/50" />
            <circle cx="62" cy="190" r="6" className="fill-secondary stroke-surface" strokeWidth="2.5" />
            {/* destination marker */}
            <circle cx="250" cy="74" r="7.5" className="fill-accent stroke-surface" strokeWidth="2.5" />
          </>
        )}
      </svg>

      <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 text-[10px] font-medium">
        <span className="rounded-full bg-surface/90 px-2.5 py-1 text-muted-foreground shadow-elevation-1">
          You are here
        </span>
        {destination && (
          <span className="rounded-full bg-accent-container px-2.5 py-1 text-accent-container-foreground shadow-elevation-1">
            {destination}
          </span>
        )}
        {wheelchair && (
          <span className="rounded-full bg-secondary-container px-2.5 py-1 text-secondary-container-foreground shadow-elevation-1">
            Step-free route
          </span>
        )}
      </div>
    </div>
  );
}
