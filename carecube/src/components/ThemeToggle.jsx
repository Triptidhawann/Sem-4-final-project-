import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const MonitorIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);
const SunIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

export default function ThemeToggle() {
  const { T, mode, setMode, sysDark } = useTheme();
  const [open, setOpen] = useState(false);

  const opts = [
    { id: "system", label: "System", desc: sysDark ? "Currently dark" : "Currently light", Icon: MonitorIcon },
    { id: "light",  label: "Light",  desc: "Always light",   Icon: SunIcon  },
    { id: "dark",   label: "Dark",   desc: "Always dark",    Icon: MoonIcon },
  ];
  const cur = opts.find((o) => o.id === mode);

  return (
    <div style={{ position: "relative" }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        title="Change appearance"
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 12px", borderRadius: 99,
          background: T.tealLt, border: `1px solid ${T.tealMd}`,
          color: T.teal, fontSize: 12, fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
          transition: "all .2s",
        }}
      >
        <span style={{ display: "flex", alignItems: "center" }}><cur.Icon /></span>
        <span>{cur.label}</span>
        <svg
          width={10} height={10} viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <>
          {/* Click-away backdrop */}
          <div
            style={{ position: "fixed", inset: 0, zIndex: 998 }}
            onClick={() => setOpen(false)}
          />

          {/* Dropdown panel */}
          <div style={{
            position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 999,
            background: T.card, border: `1px solid ${T.border}`,
            borderRadius: 14, padding: 6, minWidth: 192,
            boxShadow: T.shadowLg, animation: "fadeIn .15s ease",
          }}>
            <p style={{
              fontSize: 10, fontWeight: 700, color: T.faint,
              textTransform: "uppercase", letterSpacing: ".09em",
              padding: "6px 12px 4px",
            }}>
              Appearance
            </p>

            {opts.map((o) => {
              const active = mode === o.id;
              return (
                <button
                  key={o.id}
                  className="theme-opt"
                  onClick={() => { setMode(o.id); setOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    width: "100%", padding: "9px 12px",
                    border: "none", borderRadius: 9, cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    background: active ? T.tealLt : "transparent",
                    color: active ? T.teal : T.text,
                    textAlign: "left",
                  }}
                >
                  <span style={{ color: active ? T.teal : T.muted, display: "flex" }}>
                    <o.Icon />
                  </span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: active ? 600 : 400 }}>{o.label}</div>
                    <div style={{ fontSize: 11, color: T.muted }}>{o.desc}</div>
                  </div>
                  {active && (
                    <span style={{ marginLeft: "auto", color: T.teal }}>
                      <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
