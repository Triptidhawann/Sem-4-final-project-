import { createContext, useContext, useState, useEffect } from "react";

// ─── Token palettes ────────────────────────────────────────────────────────────

export const LIGHT = {
  isDark: false,
  bg: "#F7F9FC",        bgSub: "#F1F5F9",
  card: "#FFFFFF",      cardHov: "#F8FAFC",
  border: "#E2E8F0",
  teal: "#0D6E6E",      tealLt: "#E6F4F4",                 tealMd: "#B2D8D8",  tealDk: "#0A5758",
  text: "#1A2332",      muted: "#64748B",                  faint: "#94A3B8",
  danger: "#C0392B",    dangerLt: "#FEF2F2",               dangerBd: "#FECACA",
  warning: "#D97706",   warnLt: "#FFFBEB",                 warnBd: "#FDE68A",
  success: "#15803D",   successLt: "#F0FDF4",              successBd: "#BBF7D0",
  navBg: "rgba(255,255,255,0.96)",
  shadow: "0 1px 4px rgba(0,0,0,0.06)",
  shadowMd: "0 4px 16px rgba(0,0,0,0.08)",
  shadowLg: "0 16px 48px rgba(0,0,0,0.12)",
  inputBg: "#FFFFFF",
  statsBg: "#0D6E6E",   statsText: "#FFFFFF",
  statsLabel: "rgba(255,255,255,0.72)",
  statsDivider: "rgba(255,255,255,0.2)",
  cardHover: "0 8px 28px rgba(13,110,110,0.10)",
  tableHover: "#F0F9F8",
  criticalBorder: "#FECACA",
};

export const DARK = {
  isDark: true,
  bg: "#0D1520",        bgSub: "#111E2D",
  card: "#162030",      cardHov: "#1C2A3D",
  border: "#1F3045",
  teal: "#2DD4BF",      tealLt: "rgba(45,212,191,0.12)",   tealMd: "rgba(45,212,191,0.25)", tealDk: "#1BA89A",
  text: "#DDE6F0",      muted: "#7A94AC",                  faint: "#2D4560",
  danger: "#F87171",    dangerLt: "rgba(248,113,113,0.12)", dangerBd: "rgba(248,113,113,0.28)",
  warning: "#FBBF24",   warnLt: "rgba(251,191,36,0.12)",   warnBd: "rgba(251,191,36,0.28)",
  success: "#34D399",   successLt: "rgba(52,211,153,0.12)", successBd: "rgba(52,211,153,0.28)",
  navBg: "rgba(13,21,32,0.97)",
  shadow: "0 1px 4px rgba(0,0,0,0.40)",
  shadowMd: "0 4px 16px rgba(0,0,0,0.45)",
  shadowLg: "0 16px 48px rgba(0,0,0,0.65)",
  inputBg: "#162030",
  statsBg: "#111E2D",   statsText: "#DDE6F0",
  statsLabel: "rgba(221,230,240,0.55)",
  statsDivider: "rgba(45,212,191,0.15)",
  cardHover: "0 8px 28px rgba(0,0,0,0.50)",
  tableHover: "#1C2A3D",
  criticalBorder: "rgba(248,113,113,0.30)",
};

// ─── Context ───────────────────────────────────────────────────────────────────

const ThemeCtx = createContext(null);

/**
 * Wraps the app. Reads the OS preference on mount, then listens for changes.
 * The user can override with "light" | "dark" | "system" (default).
 * The choice is persisted in localStorage under the key "cc-theme".
 */
export function ThemeProvider({ children }) {
  const [mode, setModeRaw] = useState(() => {
    try { return localStorage.getItem("cc-theme") || "system"; }
    catch { return "system"; }
  });

  const [sysDark, setSysDark] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false
  );

  // ── Real-time OS preference listener ────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setSysDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const setMode = (val) => {
    setModeRaw(val);
    try { localStorage.setItem("cc-theme", val); } catch {}
  };

  // Resolve the effective dark state
  const isDark =
    mode === "dark"  ? true  :
    mode === "light" ? false :
    sysDark; // "system" follows the OS

  const T = isDark ? DARK : LIGHT;

  // Keep <body> background in sync to prevent flash on initial render
  useEffect(() => {
    document.body.style.backgroundColor = T.bg;
    document.body.style.color = T.text;
  }, [isDark, T.bg, T.text]);

  return (
    <ThemeCtx.Provider value={{ T, isDark, mode, setMode, sysDark }}>
      {children}
    </ThemeCtx.Provider>
  );
}

/** Consume theme tokens and controls anywhere inside ThemeProvider. */
export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
