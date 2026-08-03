import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { FloorId } from "./hospital-data";

export interface Destination {
  name: string;
  floor: FloorId;
  room?: string;
}

export interface A11ySettings {
  largeText: boolean;
  highContrast: boolean;
  voiceGuidance: boolean;
  wheelchair: boolean;
  haptics: boolean;
}

export interface SessionUser {
  name: string;
  email: string;
  guest: boolean;
}

interface AppState {
  user: SessionUser | null;
  signIn: (user: SessionUser) => void;
  signOut: () => void;
  destination: Destination | null;
  setDestination: (d: Destination | null) => void;
  a11y: A11ySettings;
  setA11y: (patch: Partial<A11ySettings>) => void;
}

const DEFAULT_A11Y: A11ySettings = {
  largeText: false,
  highContrast: false,
  voiceGuidance: true,
  wheelchair: false,
  haptics: true,
};

const AppStateContext = createContext<AppState | null>(null);

const STORAGE_KEY = "medinav.session.v1";

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [a11y, setA11yState] = useState<A11ySettings>(DEFAULT_A11Y);

  // Hydrate after mount so SSR markup and first client render match.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<{
        user: SessionUser | null;
        destination: Destination | null;
        a11y: A11ySettings;
      }>;
      if (parsed.user) setUser(parsed.user);
      if (parsed.destination) setDestination(parsed.destination);
      if (parsed.a11y) setA11yState({ ...DEFAULT_A11Y, ...parsed.a11y });
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, destination, a11y }));
    } catch {
      /* storage unavailable */
    }
  }, [user, destination, a11y]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("a11y-large", a11y.largeText);
    root.classList.toggle("a11y-contrast", a11y.highContrast);
  }, [a11y.largeText, a11y.highContrast]);

  const setA11y = useCallback((patch: Partial<A11ySettings>) => {
    setA11yState((prev) => ({ ...prev, ...patch }));
  }, []);

  const value = useMemo<AppState>(
    () => ({
      user,
      signIn: setUser,
      signOut: () => setUser(null),
      destination,
      setDestination,
      a11y,
      setA11y,
    }),
    [user, destination, a11y, setA11y],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used inside <AppStateProvider>");
  return ctx;
}

/** Speech synthesis helper used by voice guidance across navigation screens. */
export function speak(text: string, enabled = true) {
  if (!enabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.98;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}
