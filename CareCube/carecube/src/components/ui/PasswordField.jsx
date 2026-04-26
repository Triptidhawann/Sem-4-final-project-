import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Ic } from "../icons";

const getCriteria = (pw) => [
  { label: "At least 8 characters",  met: pw.length >= 8 },
  { label: "One uppercase letter",   met: /[A-Z]/.test(pw) },
  { label: "One lowercase letter",   met: /[a-z]/.test(pw) },
  { label: "One number",             met: /[0-9]/.test(pw) },
  { label: "One special character",  met: /[^A-Za-z0-9]/.test(pw) },
  { label: "No spaces",              met: pw.length > 0 && !/\s/.test(pw) },
];

const getStrength = (criteria, T) => {
  const n = criteria.filter((c) => c.met).length;
  if (n <= 1) return { n, label: "Very weak", color: T.danger  };
  if (n === 2) return { n, label: "Weak",     color: T.warning };
  if (n === 3) return { n, label: "Fair",     color: T.warning };
  if (n === 4) return { n, label: "Good",     color: T.success };
  return              { n, label: "Strong",   color: T.teal    };
};

export default function PasswordField({ value, onChange, showCriteria = false }) {
  const { T } = useTheme();
  const [visible, setVisible] = useState(false);
  const [focused, setFocused]  = useState(false);

  const criteria = getCriteria(value);
  const strength = getStrength(criteria, T);
  const allMet   = criteria.every((c) => c.met);
  const showPanel = showCriteria && (focused || value.length > 0);

  return (
    <div style={{ marginBottom: 18 }}>
      {/* Label + strength label */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: T.text }}>Password</label>
        {value.length > 0 && (
          <span style={{ fontSize: 12, color: strength.color, fontWeight: 600, transition: "color .3s" }}>
            {strength.label}
          </span>
        )}
      </div>

      {/* Input + eye toggle */}
      <div style={{ position: "relative" }}>
        <input
          className="field"
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Create a password"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ paddingRight: 42 }}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          style={{
            position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer",
            color: visible ? T.teal : T.faint,
            display: "flex", padding: 0, transition: "color .2s",
          }}
        >
          {visible ? Ic.eyeOff(16) : Ic.eyeOn(16)}
        </button>
      </div>

      {/* Strength bar */}
      {value.length > 0 && (
        <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 99,
              background: i <= strength.n ? strength.color : T.border,
              transition: "background .3s",
            }}/>
          ))}
        </div>
      )}

      {/* Criteria checklist panel */}
      {showPanel && (
        <div style={{
          marginTop: 12,
          background: T.bgSub, border: `1px solid ${T.border}`,
          borderRadius: 10, padding: "14px 16px",
          animation: "fadeIn .2s ease",
        }}>
          <p style={{
            fontSize: 11, fontWeight: 700, color: T.muted,
            textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10,
          }}>
            Password requirements
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px 16px" }}>
            {criteria.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{
                  width: 17, height: 17, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: c.met ? T.teal : T.border,
                  color: c.met ? "#fff" : T.faint,
                  transition: "background .25s",
                }}>
                  {c.met
                    ? <svg width={9} height={9} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    : <svg width={7} height={7} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  }
                </span>
                <span style={{ fontSize: 12, color: c.met ? T.text : T.muted, transition: "color .25s" }}>
                  {c.label}
                </span>
              </div>
            ))}
          </div>

          {allMet && (
            <div style={{
              marginTop: 12, paddingTop: 10, borderTop: `1px solid ${T.border}`,
              display: "flex", alignItems: "center", gap: 7,
              animation: "fadeIn .3s ease",
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.success, display: "inline-block" }}/>
              <span style={{ fontSize: 12, color: T.success, fontWeight: 500 }}>
                Password meets all requirements
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
