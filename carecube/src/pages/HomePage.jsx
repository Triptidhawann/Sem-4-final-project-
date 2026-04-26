import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { Ic } from "../components/icons";

export default function HomePage({ setPage }) {
  const { T } = useTheme();

  // Dynamic Stats State
  const [stats, setStats] = useState({
     totalHospitals: 0, criticalRequests: 0, inTransit: 0, deliveredToday: 0,
     averages: { avgBeds: 0, avgVents: 0, avgOx: 0, avgBlood: 0 },
     hospitals: []
  });
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, alertRes] = await Promise.all([
           fetch("http://localhost:5000/api/dashboard"),
           fetch("http://localhost:5000/api/alerts")
        ]);
        const dashData = await dashRes.json();
        const alertData = await alertRes.json();

        setStats(dashData);
        
        // Format alerts for widget
        const formattedAlerts = alertData.slice(0, 5).map(a => {
           let colors = {};
           if (a.type === 'critical') {
              colors = { c: T.danger };
           } else if (a.type === 'high') {
              colors = { c: T.warning };
           } else if (a.type === 'medium') {
              colors = { c: T.teal };
           } else {
              colors = { c: T.success };
           }
           return {
              msg: a.message,
              t: new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              ...colors
           };
        });
        setAlerts(formattedAlerts);

      } catch (err) {
        console.error(err);
      }
    };
    fetchData(); // Fetch immediately on mount
    const timer = setInterval(fetchData, 5000); // Poll every 5s
    return () => clearInterval(timer);
  }, [T]);

  return (
    <div style={{ background: T.bg, minHeight: "100vh", paddingTop: 62, transition: "background .3s" }}>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section style={{ background: T.card, borderBottom: `1px solid ${T.border}`, transition: "background .3s, border-color .3s" }}>
        <div style={{
          maxWidth: 1160, margin: "0 auto", padding: "72px 36px 64px",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center",
        }}>
          {/* Left copy */}
          <div>
            <div className="s1" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: T.tealLt, border: `1px solid ${T.tealMd}`,
              borderRadius: 99, padding: "5px 14px", marginBottom: 28,
            }}>
              <span className="live-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: T.teal, display: "inline-block" }}/>
              <span style={{ fontSize: 12, color: T.teal, fontWeight: 600 }}>Live System — 84 Institutions Online</span>
            </div>

            <h1 className="s2 serif" style={{ fontSize: 50, lineHeight: 1.1, color: T.text, marginBottom: 20 }}>
              Transparent<br/>Hospital Resource<br/><em style={{ color: T.teal }}>Allocation</em>
            </h1>

            <p className="s3" style={{ fontSize: 16, color: T.muted, lineHeight: 1.75, marginBottom: 36, maxWidth: 460 }}>
              Real-time visibility into critical medical resources across connected hospitals and NGOs — enabling faster, fairer decisions during healthcare crises.
            </p>

            <div className="s4" style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setPage("login")} className="btn-primary" style={{
                background: T.teal, color: "#fff", border: "none",
                padding: "12px 28px", borderRadius: 9,
                fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans'", cursor: "pointer",
              }}>
                View Dashboard
              </button>
              <button onClick={() => setPage("hospitals")} className="btn-ghost" style={{
                background: "transparent", color: T.text,
                border: `1.5px solid ${T.border}`,
                padding: "12px 24px", borderRadius: 9,
                fontSize: 14, fontWeight: 500, fontFamily: "'DM Sans'", cursor: "pointer",
              }}>
                Browse Hospitals
              </button>
            </div>
          </div>

          {/* Right — live status panel */}
          <div className="s3" style={{
            background: T.bgSub, border: `1px solid ${T.border}`,
            borderRadius: 16, padding: 28,
            transition: "background .3s, border-color .3s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22 }}>
              <span className="live-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: T.success, display: "inline-block" }}/>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: ".08em" }}>
                All Systems Operational
              </span>
            </div>

            {[
              { label: "Average ICU Beds",            value: Math.round(stats.averages.avgBeds) || 0, bar: Math.min(((stats.averages.avgBeds || 0) / 500) * 100, 100),    c: T.teal    },
              { label: "Average Ventilators",         value: Math.round(stats.averages.avgVents) || 0, bar: Math.min(((stats.averages.avgVents || 0) / 150) * 100, 100),    c: T.warning    },
              { label: "Average Oxygen %",            value: Math.round(stats.averages.avgOx) || 0 + "%",    bar: stats.averages.avgOx || 0,    c: T.teal },
              { label: "Average Blood Units",         value: Math.round(stats.averages.avgBlood) || 0,     bar: Math.min(((stats.averages.avgBlood || 0) / 300) * 100, 100),    c: T.danger  },
            ].map((it, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: T.text }}>{it.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: it.c }}>{it.value}</span>
                </div>
                <div style={{ background: T.border, borderRadius: 99, height: 5 }}>
                  <div style={{ width: `${it.bar}%`, height: "100%", background: it.c, borderRadius: 99, transition: "width .5s ease" }}/>
                </div>
              </div>
            ))}

            <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${T.border}` }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 }}>
                Live Network Alerts
              </p>
              {alerts.length === 0 ? (
                 <div style={{ fontSize: 12, color: T.muted }}>No active alerts.</div>
              ) : alerts.map((a, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "7px 0", borderBottom: i < alerts.length - 1 ? `1px solid ${T.border}` : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: a.c, display: "inline-block", flexShrink: 0, marginTop: 5 }}/>
                    <span style={{ fontSize: 12, color: T.text, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.msg}</span>
                  </div>
                  <span style={{ fontSize: 11, color: T.faint, marginLeft: 12, whiteSpace: "nowrap", alignSelf: "flex-start", marginTop: 2 }}>{a.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────────────── */}
      <section style={{ background: T.statsBg, transition: "background .3s" }}>
        <div style={{
          maxWidth: 1160, margin: "0 auto", padding: "36px",
          display: "grid", gridTemplateColumns: "repeat(4,1fr)",
        }}>
          {[
            { v: stats.totalHospitals,                 l: "Hospitals Connected" },
            { v: stats.criticalRequests,               l: "Critical Requests"  },
            { v: stats.inTransit,                      l: "In Transit"   },
            { v: stats.deliveredToday,                 l: "Delivered Today"      },
          ].map((s, i) => (
            <div key={i} style={{
              textAlign: "center", padding: "0 20px",
              borderRight: i < 3 ? `1px solid ${T.statsDivider}` : "none",
            }}>
              <div className="serif" style={{ fontSize: 40, color: T.statsText, lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontSize: 13, color: T.statsLabel, marginTop: 6 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Dynamic Hospital Table ────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1160, margin: "0 auto", padding: "72px 36px" }}>
        <h2 className="s1 serif" style={{ fontSize: 36, color: T.text, textAlign: "center", marginBottom: 8 }}>
          Live Hospital Network
        </h2>
        <p className="s2" style={{ textAlign: "center", color: T.muted, fontSize: 15, marginBottom: 52 }}>
          Real-time resource availability across all connected institutions.
        </p>
        
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden", boxShadow: T.shadow }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Hospital", "City", "Beds", "Ventilators", "Oxygen %", "Blood Units"].map((h) => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: ".07em", borderBottom: `1px solid ${T.border}`, background: T.bgSub }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.hospitals.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: "40px", textAlign: "center", color: T.muted }}>No hospitals connected.</td>
                </tr>
              ) : stats.hospitals.map((h, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                  <td style={{ padding: "16px 20px", fontSize: 13, fontWeight: 600, color: T.text }}>{h.name}</td>
                  <td style={{ padding: "16px 20px", fontSize: 13, color: T.muted }}>{h.city}</td>
                  <td style={{ padding: "16px 20px", fontSize: 13, fontWeight: 600, color: T.teal }}>{h.beds}</td>
                  <td style={{ padding: "16px 20px", fontSize: 13, fontWeight: 600, color: T.warning }}>{h.ventilators}</td>
                  <td style={{ padding: "16px 20px", fontSize: 13, fontWeight: 600, color: h.oxygen < 70 ? T.danger : T.teal }}>{h.oxygen}%</td>
                  <td style={{ padding: "16px 20px", fontSize: 13, fontWeight: 600, color: T.danger }}>{h.bloodUnits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
