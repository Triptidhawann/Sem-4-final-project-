import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Ic } from "./icons";
import ThemeToggle from "./ThemeToggle";

export default function Nav({ user, page, setPage, setUser }) {
  const { T } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);

  const links = user
    ? user.role === "admin"
      ? ["dashboard", "hospitals", "allocations", "requests", "tracking", "users"]
      : user.role === "hospital"
      ? ["dashboard", "inventory", "requests", "allocations", "tracking"]
      : ["dashboard", "requests", "tracking", "alerts"]
    : ["home", "hospitals", "alerts"];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      background: T.navBg, backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${T.border}`,
      display: "flex", alignItems: "center",
      padding: "0 32px", height: 62,
      boxShadow: T.shadow,
      transition: "background .3s, border-color .3s",
    }}>
      {/* ── Logo ─────────────────────────────────────────────────────────────── */}
      <div
        onClick={() => setPage("home")}
        style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginRight: 36, flexShrink: 0 }}
      >
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: T.teal, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {Ic.pulse(18)}
        </div>
        <span style={{ fontSize: 17, fontWeight: 700, color: T.text, letterSpacing: "-.3px", transition: "color .3s" }}>
          Care<span style={{ color: T.teal }}>cube</span>
        </span>
      </div>

      {/* ── Page links ───────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 2, flex: 1 }}>
        {links.map((l) => (
          <button
            key={l}
            onClick={() => setPage(l)}
            className={`nav-link ${page === l ? "active" : ""}`}
            style={{ color: page === l ? T.teal : T.muted }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* ── Right side ───────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <ThemeToggle />

        {user ? (
          <>
            {/* Bell */}
            <button
              onClick={() => setPage("alerts")}
              style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: T.muted, display: "flex", transition: "color .2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = T.teal)}
              onMouseLeave={(e) => (e.currentTarget.style.color = T.muted)}
            >
              {Ic.bell(20)}
              <span style={{
                position: "absolute", top: -3, right: -3,
                width: 16, height: 16, borderRadius: "50%",
                background: T.danger, color: "#fff",
                fontSize: 9, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>3</span>
            </button>

            {/* User dropdown menu */}
            <div style={{ position: "relative" }}>
              <div 
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: T.bgSub, border: `1px solid ${T.border}`,
                  borderRadius: 99, padding: "5px 14px 5px 6px",
                  cursor: "pointer", transition: "background .3s, border-color .3s",
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: user.role === "admin" ? T.danger : user.role === "hospital" ? T.teal : T.warning,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 12, fontWeight: 700,
                }}>
                  {user.name?.[0] || 'U'}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text, lineHeight: 1.2 }}>{user.name}</div>
                  <div style={{ fontSize: 11, color: T.muted, textTransform: "capitalize" }}>{user.role}</div>
                </div>
              </div>

              {showDropdown && (
                <div style={{
                  position: "absolute", top: "100%", right: 0, marginTop: 8,
                  background: T.card, border: `1px solid ${T.border}`,
                  borderRadius: 12, padding: "8px", width: 160,
                  boxShadow: T.shadowMd, display: "flex", flexDirection: "column", gap: 4
                }}>
                  <button
                    onClick={() => { setPage("profile"); setShowDropdown(false); }}
                    style={{
                      background: "none", border: "none", borderRadius: 8,
                      padding: "10px 12px", textAlign: "left", color: T.text,
                      cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans'",
                      transition: "background .2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = T.bgSub}
                    onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => { setUser(null); setPage("home"); setShowDropdown(false); }}
                    style={{
                      background: "none", border: "none", borderRadius: 8,
                      padding: "10px 12px", textAlign: "left", color: T.danger,
                      cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans'",
                      transition: "background .2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = T.dangerLt}
                    onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <button
            onClick={() => setPage("login")}
            className="btn-primary"
            style={{
              background: T.teal, color: "#fff", border: "none",
              padding: "8px 20px", borderRadius: 8,
              fontSize: 13, fontWeight: 600,
              fontFamily: "'DM Sans'", cursor: "pointer",
            }}
          >
            SignUp / SignIn
          </button>
        )}
      </div>
    </nav>
  );
}
