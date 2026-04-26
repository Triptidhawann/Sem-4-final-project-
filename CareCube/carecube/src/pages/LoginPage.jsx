import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Ic } from "../components/icons";
import PasswordField from "../components/ui/PasswordField";

export default function LoginPage({ setUser, setPage }) {
  const { T } = useTheme();
  const [role,    setRole]    = useState(null);
  const [step,    setStep]    = useState(1);
  const [form,    setForm]    = useState({ name: "", email: "", password: "", confirmPassword: "", city: "", address: "", phone: "" });
  const [isSignup, setSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const roles = [
    {
      id: "admin",
      icon: Ic.shield(28),
      title: "System Administrator",
      desc: "Full platform access: users, analytics, and global resource management.",
      color: T.danger, bg: T.dangerLt, bd: T.dangerBd,
    },
    {
      id: "hospital",
      icon: Ic.hospital(28),
      title: "Hospital / Institution",
      desc: "Manage inventory, respond to requests, and update resource availability.",
      color: T.teal, bg: T.tealLt, bd: T.tealMd,
    },
    {
      id: "ngo",
      icon: Ic.users(28),
      title: "NGO / Public Organisation",
      desc: "Search resources, submit requests, and track allocation progress.",
      color: T.warning, bg: T.warnLt, bd: T.warnBd,
    },
  ];
  const sel = roles.find((r) => r.id === role);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    
    if (isSignup) {
      // Register
      try {
        const res = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            confirmPassword: form.confirmPassword,
            role: role || "hospital",
            city: form.city
          })
        });
        const data = await res.json();
        
        if (!res.ok) {
          setError(data.message || "Registration failed");
          setLoading(false);
          return;
        }
        
        if (data.token) {
          localStorage.setItem('carecube_token', data.token);
        }

        if (role === "hospital") {
          setSuccess("Registration successful! Please wait for Admin approval.");
          setTimeout(() => {
            setSignup(false);
            setLoading(false);
          }, 3000);
          return;
        }

        setSuccess("Registration successful! Redirecting...");
        
        // Auto login on successful registration
        const userData = {
          name: form.name,
          email: form.email,
          role: role || "user"
        };
        
        setTimeout(() => {
          setUser(userData);
          setPage("dashboard");
        }, 1200);

      } catch (err) {
        setError("An error occurred during registration");
        setLoading(false);
      }
    } else {
      // Login
      try {
        const res = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
            role: role || "hospital",
          })
        });
        const data = await res.json();
        
        if (!res.ok) {
          setError(data.message || "Invalid credentials");
          setLoading(false);
          return;
        }

        if (data.token) {
          localStorage.setItem('carecube_token', data.token);
        }
        
        // Success
        const userData = {
          name: data.name,
          email: data.email,
          role: role || "user"
        };
        
        setUser(userData);
        setPage("dashboard");
      } catch (err) {
        setError("An error occurred during login");
        setLoading(false);
      }
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: T.bg, paddingTop: 62,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "100px 24px 40px", transition: "background .3s",
    }}>
      <div style={{ width: "100%", maxWidth: step === 1 ? 820 : 460 }}>

        {/* Title */}
        <div className="s1" style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, background: T.teal,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", margin: "0 auto 16px",
          }}>
            {Ic.pulse(24)}
          </div>
          <h2 className="serif" style={{ fontSize: 30, color: T.text, marginBottom: 6 }}>
            {step === 1 ? "Access the Platform" : isSignup ? "Create Your Account" : "Welcome Back"}
          </h2>
          <p style={{ fontSize: 14, color: T.muted }}>
            {step === 1 ? "Select your role to continue" : `Signing in as: ${sel?.title}`}
          </p>
        </div>

        {/* ── Step 1: Role selection ─────────────────────────────────────────── */}
        {step === 1 ? (
          <div className="s2" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {roles.map((r) => (
              <div
                key={r.id}
                className="card-lift"
                onClick={() => { setRole(r.id); setStep(2); }}
                style={{
                  background: T.card, border: `1.5px solid ${T.border}`,
                  borderRadius: 14, padding: 28, cursor: "pointer",
                  textAlign: "center", boxShadow: T.shadow,
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: r.bg, color: r.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px",
                }}>
                  {r.icon}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 8 }}>{r.title}</h3>
                <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.65 }}>{r.desc}</p>
                <div style={{
                  marginTop: 18, display: "flex", alignItems: "center",
                  justifyContent: "center", gap: 4,
                  color: r.color, fontSize: 12, fontWeight: 600,
                }}>
                  Select {Ic.chev(13)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ── Step 2: Auth form ──────────────────────────────────────────────── */
          <div className="s1" style={{
            background: T.card, border: `1px solid ${T.border}`,
            borderRadius: 16, padding: 36, boxShadow: T.shadowMd,
            transition: "background .3s, border-color .3s",
          }}>
            {/* Role badge */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              background: sel?.bg, border: `1px solid ${sel?.bd}`,
              borderRadius: 10, padding: "10px 14px", marginBottom: 24,
            }}>
              <div style={{ color: sel?.color }}>{sel?.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{sel?.title}</div>
                <div style={{ fontSize: 11, color: T.muted }}>Role: {role}</div>
              </div>
              <button
                onClick={() => { setStep(1); setRole(null); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: T.faint, display: "flex" }}
              >
                {Ic.x(15)}
              </button>
            </div>

            {/* Sign In / Register tab toggle */}
            <div style={{ display: "flex", background: T.bgSub, borderRadius: 9, padding: 4, marginBottom: 12 }}>
              {["Sign In", "Register"].map((tab, i) => {
                if (tab === "Register" && role === "admin") return null; // Hide register for admin
                const active = isSignup ? i === 1 : i === 0;
                return (
                  <button
                    key={tab}
                    onClick={() => setSignup(i === 1)}
                    style={{
                      flex: 1, padding: "8px", border: "none", borderRadius: 7,
                      cursor: "pointer", fontSize: 13, fontWeight: 500,
                      fontFamily: "'DM Sans'", transition: "all .18s",
                      background: active ? T.card : "transparent",
                      color: active ? T.text : T.muted,
                      boxShadow: active ? T.shadow : "none",
                    }}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {role === "admin" && (
              <div style={{ fontSize: 12, color: T.muted, textAlign: "center", marginBottom: 18 }}>
                Only authorized admins can log in.
              </div>
            )}

            {error && (
              <div style={{ background: T.dangerLt, color: T.danger, padding: "10px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                {error}
              </div>
            )}
            
            {success && (
              <div style={{ background: T.tealLt, color: T.teal, padding: "10px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                {success}
              </div>
            )}

            {/* Name field (signup only) */}
            {isSignup && (
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: T.text, display: "block", marginBottom: 6 }}>
                  Full Name / Institution
                </label>
                <input
                  className="field" type="text" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Fortis Healthcare Ltd."
                />
              </div>
            )}

            {/* Location/City field for hospitals/institutions */}
            {isSignup && role === "hospital" && (
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: T.text, display: "block", marginBottom: 6 }}>
                  City
                </label>
                <input
                  className="field" type="text" value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="e.g. Mumbai"
                />
              </div>
            )}

            {/* Address & phone for citizens/NGOs */}
            {isSignup && role === "ngo" && (
              <>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: T.text, display: "block", marginBottom: 6 }}>
                    Address
                  </label>
                  <input
                    className="field" type="text" value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Street, City, State, Country"
                  />
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: T.text, display: "block", marginBottom: 6 }}>
                    Phone Number
                  </label>
                  <input
                    className="field" type="tel" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>
              </>
            )}

            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: T.text, display: "block", marginBottom: 6 }}>
                Email Address
              </label>
              <input
                className="field" type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={`${role}@institution.in`}
              />
            </div>

            {/* Password */}
            <PasswordField
              value={form.password}
              onChange={(val) => setForm({ ...form, password: val })}
              showCriteria={isSignup}
            />

            {/* Confirm Password (signup only) */}
            {isSignup && (
              <div style={{ marginTop: 18, marginBottom: 18 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: T.text, display: "block", marginBottom: 6 }}>
                  Confirm Password
                </label>
                <input
                  className="field" type="password" value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Repeat your password"
                />
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary"
              style={{
                width: "100%", background: sel?.color || T.teal, color: "#fff",
                border: "none", padding: "12px", borderRadius: 9,
                fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans'",
                cursor: loading ? "wait" : "pointer",
                marginTop: 6, opacity: loading ? 0.75 : 1,
              }}
            >
              {loading ? "Please wait…" : isSignup ? "Create Account" : "Sign In"}
            </button>

            {!isSignup && (
              <div style={{ textAlign: "center", marginTop: 14 }}>
                <span style={{ fontSize: 13, color: T.faint }}>Don't have an account? </span>
                <button
                  onClick={() => setSignup(true)}
                  style={{ background: "none", border: "none", color: T.teal, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  Register
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
