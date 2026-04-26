import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { Ic } from "../components/icons";
import PageShell from "../components/PageShell";
import Badge from "../components/ui/Badge";
import { ResourceBar } from "../components/ui/Charts";

export default function InventoryPage({ user }) {
  const { T } = useTheme();
  const [h, setH] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({ beds: 0, ventilators: 0, oxygen: 0, bloodUnits: 0 });
  const [successMsg, setSuccessMsg] = useState("");
  const [activities, setActivities] = useState([]);

  const fetchData = async () => {
    try {
      const [hospRes, allocRes] = await Promise.all([
        fetch(`http://localhost:5000/api/hospitals?search=${encodeURIComponent(user.name)}`),
        fetch(`http://localhost:5000/api/allocations`)
      ]);
      const hospData = await hospRes.json();
      if (hospData.length > 0) {
        const myHospital = hospData.find(d => d.name === user.name) || hospData[0];
        setH(myHospital);
        setEditData({ beds: myHospital.beds || 0, ventilators: myHospital.ventilators || 0, oxygen: myHospital.oxygen || 0, bloodUnits: myHospital.bloodUnits || 0 });
      }

      const allAllocs = await allocRes.json();
      setActivities(allAllocs.filter(a => a.fromHospital === user.name).slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleUpdate = async () => {
    if (!h) return;
    try {
      await fetch(`http://localhost:5000/api/hospitals/${h._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      setSuccessMsg("Inventory updated successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <PageShell title="Resource Management"><div style={{ padding: 40, textAlign: "center", color: T.muted }}>Loading...</div></PageShell>;
  if (!h) return <PageShell title="Resource Management"><div style={{ padding: 40, textAlign: "center", color: T.muted }}>No hospital profile found. Please contact an Admin.</div></PageShell>;

  return (
    <PageShell 
      title="Resource Management" 
      sub={`${h.name} — Last Sync: ${new Date(h.updatedAt).toLocaleTimeString()}`}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 24 }}>
        
        {/* Left Column: Update Form */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 28, boxShadow: T.shadow }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: T.text, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
            {Ic.edit(18)} Update Inventory
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: T.muted, display: "block", marginBottom: 8 }}>ICU Beds Available</label>
              <input 
                className="field" type="number" 
                value={editData.beds} 
                onChange={e => setEditData({...editData, beds: e.target.value === "" ? "" : Number(e.target.value)})} 
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgSub, color: T.text, fontSize: 14 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: T.muted, display: "block", marginBottom: 8 }}>Ventilators</label>
              <input 
                className="field" type="number" 
                value={editData.ventilators} 
                onChange={e => setEditData({...editData, ventilators: e.target.value === "" ? "" : Number(e.target.value)})} 
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgSub, color: T.text, fontSize: 14 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: T.muted, display: "block", marginBottom: 8 }}>Oxygen Supply (%)</label>
              <input 
                className="field" type="number" 
                value={editData.oxygen} 
                onChange={e => setEditData({...editData, oxygen: e.target.value === "" ? "" : Number(e.target.value)})} 
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgSub, color: T.text, fontSize: 14 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: T.muted, display: "block", marginBottom: 8 }}>Blood Bank Units</label>
              <input 
                className="field" type="number" 
                value={editData.bloodUnits} 
                onChange={e => setEditData({...editData, bloodUnits: e.target.value === "" ? "" : Number(e.target.value)})} 
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgSub, color: T.text, fontSize: 14 }}
              />
            </div>
          </div>

          <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 12 }}>
            <button 
              onClick={handleUpdate} 
              className="btn-primary" 
              style={{ width: "100%", background: T.teal, color: "#fff", border: "none", borderRadius: 9, padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'", display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}
            >
              {Ic.check(18)} Save Changes
            </button>
            {successMsg && (
              <div style={{ padding: "10px", background: T.success + "22", color: T.success, borderRadius: 8, fontSize: 13, textAlign: "center", fontWeight: 600, animation: "fadeIn .3s ease" }}>
                {successMsg}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Current Status & Audit Log */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Current Live Stats */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 28, boxShadow: T.shadow }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: T.text }}>Current Status</h3>
              <Badge type={h.oxygen < 60 ? "Critical" : h.oxygen < 80 ? "Moderate" : "Stable"} />
            </div>
            
            <ResourceBar label="ICU Beds" used={h.beds} total={500} />
            <ResourceBar label="Ventilators" used={h.ventilators} total={150} color={T.warning} />
            <ResourceBar label="Oxygen %" used={h.oxygen} total={100} />
            <ResourceBar label="Blood Units" used={h.bloodUnits} total={300} color={T.danger} />
          </div>

          {/* Allocation Audit Log */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 28, boxShadow: T.shadow, flex: 1 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 18 }}>Recent Dispatches</h3>
            {activities.length === 0 ? (
              <p style={{ fontSize: 13, color: T.muted }}>No resources dispatched recently.</p>
            ) : activities.map((a) => (
              <div key={a._id} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: T.bgSub, display: "flex", alignItems: "center", justifyContent: "center", color: T.teal, flexShrink: 0 }}>
                  {Ic.truck(16)}
                </div>
                <div>
                  <p style={{ fontSize: 13, color: T.text, margin: "0 0 4px 0", lineHeight: 1.4 }}>
                    Allocated <b>{a.quantity} {a.resourceType}</b> to {a.toHospital}
                  </p>
                  <p style={{ fontSize: 11, color: T.muted, margin: 0 }}>{new Date(a.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PageShell>
  );
}
