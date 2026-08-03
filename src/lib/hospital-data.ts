/**
 * Static hospital knowledge base.
 *
 * In production this is served by Cloud Firestore (collections: hospitals,
 * departments, doctors, services, waypoints) and consumed by the RAG index
 * powering the MediNav agent. Shapes below mirror the Firestore documents.
 */

export type FloorId = "B1" | "G" | "1" | "2" | "3";

export interface Department {
  id: string;
  name: string;
  floor: FloorId;
  wing: string;
  waitMinutes: number;
  open: boolean;
  tags: string[];
  walkMinutes: number;
  accessible: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  speciality: string;
  departmentId: string;
  room: string;
  floor: FloorId;
  available: boolean;
  nextSlot: string;
  rating: number;
  languages: string[];
}

export interface HospitalService {
  id: string;
  name: string;
  description: string;
  floor: FloorId;
  hours: string;
  icon: string;
}

export interface HistoryEntry {
  id: string;
  destination: string;
  floor: FloorId;
  date: string;
  durationMin: number;
  distanceM: number;
  mode: "standard" | "wheelchair" | "emergency";
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  kind: "info" | "success" | "warning" | "critical";
  unread: boolean;
}

export const FLOORS: { id: FloorId; label: string; short: string }[] = [
  { id: "B1", label: "Basement — Imaging & Parking", short: "B1" },
  { id: "G", label: "Ground — Reception & Emergency", short: "G" },
  { id: "1", label: "Level 1 — Outpatient Clinics", short: "1" },
  { id: "2", label: "Level 2 — Surgery & Wards", short: "2" },
  { id: "3", label: "Level 3 — Maternity & Paediatrics", short: "3" },
];

export const DEPARTMENTS: Department[] = [
  { id: "cardiology", name: "Cardiology", floor: "1", wing: "East Wing", waitMinutes: 18, open: true, tags: ["heart", "ecg", "bp"], walkMinutes: 4, accessible: true },
  { id: "radiology", name: "Radiology & MRI", floor: "B1", wing: "Imaging Block", waitMinutes: 26, open: true, tags: ["mri", "x-ray", "ct scan"], walkMinutes: 6, accessible: true },
  { id: "emergency", name: "Emergency / Casualty", floor: "G", wing: "North Entrance", waitMinutes: 0, open: true, tags: ["trauma", "ambulance", "24x7"], walkMinutes: 2, accessible: true },
  { id: "orthopaedics", name: "Orthopaedics", floor: "2", wing: "West Wing", waitMinutes: 12, open: true, tags: ["bone", "fracture", "physio"], walkMinutes: 7, accessible: true },
  { id: "neurology", name: "Neurology", floor: "2", wing: "East Wing", waitMinutes: 34, open: true, tags: ["brain", "eeg", "stroke"], walkMinutes: 8, accessible: true },
  { id: "paediatrics", name: "Paediatrics", floor: "3", wing: "Sunrise Block", waitMinutes: 9, open: true, tags: ["child", "vaccination"], walkMinutes: 9, accessible: true },
  { id: "maternity", name: "Maternity & OB-GYN", floor: "3", wing: "Sunrise Block", waitMinutes: 15, open: true, tags: ["pregnancy", "scan"], walkMinutes: 9, accessible: true },
  { id: "pharmacy", name: "Pharmacy", floor: "G", wing: "Main Atrium", waitMinutes: 6, open: true, tags: ["medicine", "prescription"], walkMinutes: 3, accessible: true },
  { id: "laboratory", name: "Diagnostic Laboratory", floor: "G", wing: "South Corridor", waitMinutes: 11, open: true, tags: ["blood test", "sample"], walkMinutes: 3, accessible: true },
  { id: "billing", name: "Billing & Insurance", floor: "G", wing: "Main Atrium", waitMinutes: 21, open: true, tags: ["payment", "tpa", "claims"], walkMinutes: 2, accessible: true },
  { id: "dermatology", name: "Dermatology", floor: "1", wing: "West Wing", waitMinutes: 8, open: false, tags: ["skin", "allergy"], walkMinutes: 5, accessible: true },
  { id: "dialysis", name: "Nephrology & Dialysis", floor: "2", wing: "North Wing", waitMinutes: 5, open: true, tags: ["kidney", "dialysis"], walkMinutes: 8, accessible: true },
];

export const DOCTORS: Doctor[] = [
  { id: "d1", name: "Dr. Ananya Raghavan", speciality: "Interventional Cardiologist", departmentId: "cardiology", room: "1-E-114", floor: "1", available: true, nextSlot: "10:40 AM", rating: 4.9, languages: ["English", "Hindi", "Tamil"] },
  { id: "d2", name: "Dr. Vikram Sethi", speciality: "Consultant Radiologist", departmentId: "radiology", room: "B1-IM-03", floor: "B1", available: true, nextSlot: "11:15 AM", rating: 4.7, languages: ["English", "Hindi"] },
  { id: "d3", name: "Dr. Meera Nair", speciality: "Neurologist — Stroke Unit", departmentId: "neurology", room: "2-E-208", floor: "2", available: false, nextSlot: "2:30 PM", rating: 4.8, languages: ["English", "Malayalam"] },
  { id: "d4", name: "Dr. Rohit Deshmukh", speciality: "Orthopaedic Surgeon", departmentId: "orthopaedics", room: "2-W-221", floor: "2", available: true, nextSlot: "12:05 PM", rating: 4.6, languages: ["English", "Marathi", "Hindi"] },
  { id: "d5", name: "Dr. Fatima Qureshi", speciality: "Paediatrician", departmentId: "paediatrics", room: "3-S-306", floor: "3", available: true, nextSlot: "10:20 AM", rating: 5.0, languages: ["English", "Urdu", "Hindi"] },
  { id: "d6", name: "Dr. Sandeep Iyer", speciality: "Emergency Physician", departmentId: "emergency", room: "G-N-002", floor: "G", available: true, nextSlot: "Walk-in", rating: 4.8, languages: ["English", "Kannada"] },
  { id: "d7", name: "Dr. Kavya Menon", speciality: "Obstetrician & Gynaecologist", departmentId: "maternity", room: "3-S-312", floor: "3", available: false, nextSlot: "4:00 PM", rating: 4.9, languages: ["English", "Malayalam", "Hindi"] },
  { id: "d8", name: "Dr. Arjun Bhatt", speciality: "Nephrologist", departmentId: "dialysis", room: "2-N-240", floor: "2", available: true, nextSlot: "1:10 PM", rating: 4.5, languages: ["English", "Gujarati"] },
];

export const SERVICES: HospitalService[] = [
  { id: "s1", name: "24×7 Pharmacy", description: "In-house dispensary with insurance-linked billing.", floor: "G", hours: "Open 24 hours", icon: "pill" },
  { id: "s2", name: "Diagnostic Laboratory", description: "Blood, pathology and rapid sample collection.", floor: "G", hours: "6:00 AM – 10:00 PM", icon: "flask" },
  { id: "s3", name: "Cafeteria & Nutrition", description: "Dietitian-approved meals, wheelchair accessible.", floor: "1", hours: "7:00 AM – 9:00 PM", icon: "coffee" },
  { id: "s4", name: "Billing & TPA Desk", description: "Cashless claims, estimates and discharge settlement.", floor: "G", hours: "8:00 AM – 8:00 PM", icon: "receipt" },
  { id: "s5", name: "Blood Bank", description: "Component separation unit and donor registration.", floor: "B1", hours: "Open 24 hours", icon: "droplet" },
  { id: "s6", name: "Prayer & Quiet Room", description: "Multi-faith reflection space near the atrium.", floor: "1", hours: "Open 24 hours", icon: "heart" },
  { id: "s7", name: "Wheelchair & Attendant Help", description: "Request assistance to any waypoint in the campus.", floor: "G", hours: "Open 24 hours", icon: "accessibility" },
  { id: "s8", name: "Parking & Valet", description: "Level B1, 420 slots with EV charging bays.", floor: "B1", hours: "Open 24 hours", icon: "car" },
];

export const HISTORY: HistoryEntry[] = [
  { id: "h1", destination: "Cardiology — Room 1-E-114", floor: "1", date: "Today, 9:42 AM", durationMin: 4, distanceM: 210, mode: "standard" },
  { id: "h2", destination: "Diagnostic Laboratory", floor: "G", date: "Today, 8:55 AM", durationMin: 3, distanceM: 140, mode: "standard" },
  { id: "h3", destination: "Radiology & MRI", floor: "B1", date: "Yesterday, 5:10 PM", durationMin: 7, distanceM: 380, mode: "wheelchair" },
  { id: "h4", destination: "Emergency / Casualty", floor: "G", date: "12 Mar, 11:20 PM", durationMin: 2, distanceM: 95, mode: "emergency" },
  { id: "h5", destination: "Pharmacy", floor: "G", date: "12 Mar, 6:30 PM", durationMin: 3, distanceM: 160, mode: "standard" },
];

export const NOTIFICATIONS: AppNotification[] = [
  { id: "n1", title: "Your token is next at Cardiology", body: "Token C-042 — please proceed to Room 1-E-114. Estimated 3 min walk from your position.", time: "2 min ago", kind: "success", unread: true },
  { id: "n2", title: "Lift 3 temporarily out of service", body: "MediNav re-routed 14 active journeys via Lift 2 and the East ramp.", time: "18 min ago", kind: "warning", unread: true },
  { id: "n3", title: "Lab report ready", body: "Complete Blood Count report is available for pickup at the Ground floor lab desk.", time: "1 hr ago", kind: "info", unread: false },
  { id: "n4", title: "Code Blue drill — Level 2", body: "Corridor 2-W will be restricted between 3:00 PM and 3:20 PM.", time: "3 hrs ago", kind: "critical", unread: false },
];

export const HOSPITAL_UPDATES = [
  { id: "u1", title: "New Cath Lab now live", body: "24×7 interventional cardiology on Level 1, East Wing.", tone: "primary" as const },
  { id: "u2", title: "Free health camp — Saturday", body: "Diabetes and BP screening at the Ground floor atrium.", tone: "accent" as const },
  { id: "u3", title: "Visiting hours updated", body: "Wards now open to visitors from 4:00 PM to 7:00 PM.", tone: "secondary" as const },
];

export const SUGGESTED_QUESTIONS = [
  "Where is the nearest pharmacy?",
  "Take me to Cardiology",
  "Which lift is wheelchair accessible?",
  "How long is the wait at Radiology?",
  "I need emergency help",
  "Where can I pay my bill?",
];

export function findDepartment(id: string) {
  return DEPARTMENTS.find((d) => d.id === id);
}
