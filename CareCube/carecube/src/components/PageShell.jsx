import { useTheme } from "../context/ThemeContext";
import { Ic } from "./icons";

/**
 * PageShell — consistent page layout with page title, subtitle, and optional action slot.
 *
 * Props:
 *   title    — page heading
 *   sub      — optional subtitle / description
 *   action   — optional JSX rendered top-right (e.g. a CTA button)
 *   children — page body
 *   wide     — if true, maxWidth is 1320px instead of 1160px
 */
export default function PageShell({ title, sub, children, action, wide = false }) {
  const { T } = useTheme();

  return (
    <div style={{ background: T.bg, minHeight: "100vh", paddingTop: 62, transition: "background .3s" }}>
      <div style={{ maxWidth: wide ? 1320 : 1160, margin: "0 auto", padding: "36px 36px 56px" }}>
        {/* Header row */}
        <div
          className="s1"
          style={{
            display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            marginBottom: 28, paddingBottom: 20,
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button 
              onClick={() => window.dispatchEvent(new Event("goBack"))}
              style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, display: "flex", alignItems: "center", justifyContent: "center", padding: 8, borderRadius: "50%", transition: "background .2s", flexShrink: 0 }}
              onMouseEnter={(e) => { e.currentTarget.style.background = T.bgSub; e.currentTarget.style.color = T.text; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = T.muted; }}
              title="Go Back"
            >
              {Ic.chevLeft(22)}
            </button>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: T.text, marginBottom: 3 }}>{title}</h1>
              {sub && <p style={{ fontSize: 13, color: T.muted }}>{sub}</p>}
            </div>
          </div>
          {action && <div style={{ flexShrink: 0 }}>{action}</div>}
        </div>

        {children}
      </div>
    </div>
  );
}
