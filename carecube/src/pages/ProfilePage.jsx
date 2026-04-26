import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import PageShell from "../components/PageShell";
import { Ic } from "../components/icons";

export default function ProfilePage({ user, setUser }) {
  const { T } = useTheme();
  const [profile, setProfile] = useState({ name: "", email: "", organization: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [id, setId] = useState(null);
  
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passMessage, setPassMessage] = useState({ type: "", text: "" });
  const [passSaving, setPassSaving] = useState(false);

  useEffect(() => {
    if (user?.email) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/auth/profile/${user.email}`);
      const data = await res.json();
      if (res.ok) {
        setProfile({
          name: data.name || "",
          email: data.email || "",
          organization: data.organization || "",
          phone: data.phone || ""
        });
        setId(data._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await fetch(`http://localhost:5000/api/auth/profile/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        // Update global user state (also saves to localStorage)
        setUser({
          ...user,
          name: data.name,
          email: data.email,
        });
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update profile" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An error occurred" });
    }
    setSaving(false);
  };

  const handlePasswordSave = async () => {
    if (!id) return;
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPassMessage({ type: "error", text: "New passwords do not match" });
      return;
    }
    setPassSaving(true);
    setPassMessage({ type: "", text: "" });
    try {
      const res = await fetch(`http://localhost:5000/api/auth/profile/${id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        setPassMessage({ type: "success", text: "Password updated successfully!" });
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setPassMessage({ type: "error", text: data.message || "Failed to update password" });
      }
    } catch (err) {
      setPassMessage({ type: "error", text: "An error occurred" });
    }
    setPassSaving(false);
  };

  return (
    <PageShell title="Your Profile" sub="Manage your personal and organization details">
      <div style={{ width: "100%", background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 32, boxShadow: T.shadow }}>
        {loading ? (
          <div style={{ color: T.muted }}>Loading profile...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Avatar Section */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: user.role === "admin" ? T.danger : user.role === "hospital" ? T.teal : T.warning,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 28, fontWeight: 700,
              }}>
                {profile.name?.[0] || user.name?.[0] || 'U'}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, color: T.text }}>{profile.name || user.name}</h3>
                <p style={{ margin: 0, fontSize: 13, color: T.muted, textTransform: "capitalize" }}>{user.role} Account</p>
              </div>
            </div>

            {message.text && (
              <div style={{
                background: message.type === "success" ? T.tealLt : T.dangerLt,
                color: message.type === "success" ? T.teal : T.danger,
                padding: "12px 16px", borderRadius: 8, fontSize: 14, fontWeight: 500,
                display: "flex", alignItems: "center", gap: 8
              }}>
                {message.type === "success" ? Ic.check(18) : Ic.x(18)}
                {message.text}
              </div>
            )}
            
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: T.text, display: "block", marginBottom: 8 }}>Full Name</label>
              <input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.text, fontSize: 14, fontFamily: "'DM Sans'" }}
              />
            </div>
            
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: T.text, display: "block", marginBottom: 8 }}>Email Address</label>
              <input
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgSub, color: T.muted, fontSize: 14, fontFamily: "'DM Sans'" }}
                readOnly
                disabled
              />
            </div>
            
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: T.text, display: "block", marginBottom: 8 }}>Phone Number</label>
              <input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="e.g. +91 98765 43210"
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.text, fontSize: 14, fontFamily: "'DM Sans'" }}
              />
            </div>
            
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: T.text, display: "block", marginBottom: 8 }}>Organization (Optional)</label>
              <input
                value={profile.organization}
                onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                placeholder="e.g. Fortis Healthcare"
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.text, fontSize: 14, fontFamily: "'DM Sans'" }}
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary"
              style={{
                marginTop: 10,
                background: T.teal, color: "#fff", border: "none", borderRadius: 8,
                padding: "12px", fontSize: 14, fontWeight: 600, cursor: saving ? "wait" : "pointer",
                opacity: saving ? 0.7 : 1, fontFamily: "'DM Sans'"
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <hr style={{ border: 0, borderTop: `1px solid ${T.border}`, margin: "16px 0" }} />
            
            <h3 style={{ fontSize: 16, color: T.text, margin: "0 0 12px 0" }}>Change Password</h3>
            
            {passMessage.text && (
              <div style={{
                background: passMessage.type === "success" ? T.tealLt : T.dangerLt,
                color: passMessage.type === "success" ? T.teal : T.danger,
                padding: "12px 16px", borderRadius: 8, fontSize: 14, fontWeight: 500,
                display: "flex", alignItems: "center", gap: 8
              }}>
                {passMessage.type === "success" ? Ic.check(18) : Ic.x(18)}
                {passMessage.text}
              </div>
            )}
            
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: T.text, display: "block", marginBottom: 8 }}>Current Password</label>
              <input
                type="password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.text, fontSize: 14, fontFamily: "'DM Sans'" }}
              />
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: T.text, display: "block", marginBottom: 8 }}>New Password</label>
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.text, fontSize: 14, fontFamily: "'DM Sans'" }}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: T.text, display: "block", marginBottom: 8 }}>Confirm New Password</label>
                <input
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.text, fontSize: 14, fontFamily: "'DM Sans'" }}
                />
              </div>
            </div>

            <button
              onClick={handlePasswordSave}
              disabled={passSaving || !passwords.currentPassword || !passwords.newPassword}
              className="btn-primary"
              style={{
                marginTop: 10,
                background: T.text, color: T.bg, border: "none", borderRadius: 8,
                padding: "12px", fontSize: 14, fontWeight: 600, cursor: (passSaving || !passwords.currentPassword || !passwords.newPassword) ? "not-allowed" : "pointer",
                opacity: (passSaving || !passwords.currentPassword || !passwords.newPassword) ? 0.5 : 1, fontFamily: "'DM Sans'"
              }}
            >
              {passSaving ? "Updating Password..." : "Update Password"}
            </button>
          </div>
        )}
      </div>
    </PageShell>
  );
}
