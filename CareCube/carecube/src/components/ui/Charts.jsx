import { useTheme } from "../../context/ThemeContext";

// ─── StatCard ──────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, icon, color, delay = "s1" }) {
  const { T } = useTheme();
  const c = color || T.teal;

  return (
    <div className={`card-lift ${delay}`} style={{
      background: T.card, border: `1px solid ${T.border}`,
      borderRadius: 12, padding: "22px 24px", boxShadow: T.shadow,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 9,
          background: `${c}18`, color: c,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {icon}
        </div>
        <span style={{ fontSize: 12, color: T.muted }}>{sub}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: T.text, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: T.muted, marginTop: 5 }}>{label}</div>
    </div>
  );
}

// ─── ResourceBar ──────────────────────────────────────────────────────────────
export function ResourceBar({ label, used, total, color }) {
  const { T } = useTheme();
  const c = color || T.teal;
  const pct = Math.min(100, Math.round((used / total) * 100));
  const bc = pct > 85 ? T.danger : pct > 65 ? T.warning : c;

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: T.text }}>{label}</span>
        <span style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>{used}/{total}</span>
      </div>
      <div style={{ background: T.border, borderRadius: 99, height: 7, overflow: "hidden" }}>
        <div className="rbar" style={{ width: `${pct}%`, height: "100%", background: bc, borderRadius: 99 }}/>
      </div>
    </div>
  );
}

// ─── DonutChart ───────────────────────────────────────────────────────────────
export function DonutChart({ value, max, color, size = 80, label }) {
  const { T } = useTheme();
  const c = color || T.teal;
  const r = 30, cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  const pct = value / max;

  return (
    <div style={{ textAlign: "center" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.border} strokeWidth="6"/>
        <circle
          cx={cx} cy={cy} r={r} fill="none" stroke={c} strokeWidth="6"
          strokeDasharray={`${circ * pct} ${circ * (1 - pct)}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: "stroke-dasharray 1.2s ease" }}
        />
        <text
          x={cx} y={cy + 5} textAnchor="middle" fill={T.text}
          style={{ fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 600 }}
        >
          {Math.round(pct * 100)}%
        </text>
      </svg>
      {label && <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>{label}</div>}
    </div>
  );
}

// ─── Sparkline ────────────────────────────────────────────────────────────────
export function Sparkline({ data, color, h = 44, w = 180 }) {
  const { T } = useTheme();
  const c = color || T.teal;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min + 1)) * h * 0.8 - h * 0.1}`)
    .join(" ");
  const gid = `sg${c.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c} stopOpacity=".18"/>
          <stop offset="100%" stopColor={c} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${gid})`}/>
      <polyline points={pts} fill="none" stroke={c} strokeWidth="2"/>
    </svg>
  );
}
