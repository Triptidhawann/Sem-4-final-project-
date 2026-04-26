import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { Ic } from "../components/icons";
import Badge from "../components/ui/Badge";
import { ResourceBar } from "../components/ui/Charts";
import PageShell from "../components/PageShell";

// ─── Hospital card ─────────────────────────────────────────────────────────────
function HospitalCard({ h, delay, isEditing, editData, setEditData, onEditStart, onEditSave, onEditCancel, onDelete, onAllocate, onViewHistory }) {
  const { T } = useTheme();
  const caps = { beds: 500, vents: 150, oxygen: 100, blood: 300 };
  
  // Enhanced dynamic status logic
  let statusLower = "stable";
  if (h.oxygen < 60 || h.beds < 10) statusLower = "critical";
  else if (h.oxygen < 80 || h.beds < 50) statusLower = "moderate";

  if (isEditing) {
    return (
      <div className={`card-lift ${delay}`} style={{ background: T.card, border: `1.5px solid ${T.teal}`, borderRadius: 14, padding: 24, boxShadow: T.shadow, display: "flex", flexDirection: "column", gap: 12 }}>
        <input placeholder="Name" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.text }}/>
        <input placeholder="City" value={editData.city} onChange={e => setEditData({...editData, city: e.target.value})} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.text }}/>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <input type="number" placeholder="Beds" value={editData.beds} onChange={e => setEditData({...editData, beds: e.target.value === "" ? "" : Number(e.target.value)})} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.text }}/>
          <input type="number" placeholder="Ventilators" value={editData.ventilators} onChange={e => setEditData({...editData, ventilators: e.target.value === "" ? "" : Number(e.target.value)})} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.text }}/>
          <input type="number" placeholder="Oxygen %" value={editData.oxygen} onChange={e => setEditData({...editData, oxygen: e.target.value === "" ? "" : Number(e.target.value)})} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.text }}/>
          <input type="number" placeholder="Blood Units" value={editData.bloodUnits} onChange={e => setEditData({...editData, bloodUnits: e.target.value === "" ? "" : Number(e.target.value)})} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.text }}/>
        </div>
        <div style={{ fontSize: 12, color: T.muted, fontStyle: "italic" }}>* Status is auto-calculated based on Oxygen %</div>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button onClick={() => onEditSave(h?._id)} className="btn-primary" style={{ flex: 1, background: T.teal, color: "#fff", border: "none", borderRadius: 8, padding: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} title="Save">{Ic.check(18)}</button>
          <button onClick={onEditCancel} style={{ flex: 1, background: "none", border: `1px solid ${T.border}`, color: T.muted, borderRadius: 8, padding: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} title="Cancel">{Ic.x(18)}</button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`card-lift ${delay}`}
      style={{
        background: T.card,
        border: `1.5px solid ${statusLower === "critical" ? T.criticalBorder : T.border}`,
        borderRadius: 14, padding: 24, boxShadow: T.shadow, position: "relative"
      }}
    >
      <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 4 }}>
        <button onClick={() => onEditStart(h)} style={{ background: "none", border: "none", color: T.teal, cursor: "pointer", padding: "4px" }} title="Edit">{Ic.edit(16)}</button>
        <button onClick={() => onDelete(h._id)} style={{ background: "none", border: "none", color: T.danger, cursor: "pointer", padding: "4px" }} title="Delete">{Ic.trash(16)}</button>
      </div>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, paddingRight: 40 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 4 }}>{h.name}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.muted }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {Ic.pin(12)} {h.city}
            </span>
          </div>
          <div style={{ fontSize: 11, color: T.faint, marginTop: 4 }}>
            Last Updated: {h.updatedAt ? new Date(h.updatedAt).toLocaleString() : "N/A"}
          </div>
        </div>
        <Badge type={statusLower}/>
      </div>

      {/* Resource bars */}
      <ResourceBar label="ICU Beds"    used={h.beds}   total={caps.beds}  />
      <ResourceBar label="Ventilators" used={h.ventilators}  total={caps.vents}  color={T.warning}/>
      <ResourceBar label="Oxygen %"    used={h.oxygen} total={caps.oxygen} />
      <ResourceBar label="Blood Units" used={h.bloodUnits}  total={caps.blood}  color={T.danger}/>

      {/* Inline stats */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4,1fr)",
        gap: 8, marginTop: 14, paddingTop: 14,
        borderTop: `1px solid ${T.border}`,
      }}>
        {[
          ["Beds",   h.beds,           T.teal   ],
          ["Vents",  h.ventilators,    T.warning],
          ["O₂",    `${h.oxygen}%`,   h.oxygen < 70 ? T.danger : T.teal],
          ["Blood",  h.bloodUnits,     T.teal   ],
        ].map(([l, v, c]) => (
          <div key={l} style={{ background: T.bgSub, borderRadius: 8, padding: "8px 10px", textAlign: "center", transition: "background .3s" }}>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 3 }}>{l}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: c }}>{v}</div>
          </div>
        ))}
      </div>
      
      {/* Quick Action Buttons */}
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
         <button onClick={onAllocate} style={{ flex: 1, background: T.tealLt, color: T.teal, border: `1px solid ${T.tealMd}`, borderRadius: 8, padding: "8px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" }}>Allocate Resource</button>
         <button onClick={onViewHistory} style={{ flex: 1, background: "none", color: T.text, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" }}>View History</button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function HospitalsPage() {
  const { T } = useTheme();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", city: "", beds: "", ventilators: "", oxygen: "", bloodUnits: "" });

  const [isAdding, setIsAdding] = useState(false);
  const [addData, setAddData] = useState({ name: "", city: "", beds: "", ventilators: "", oxygen: "", bloodUnits: "" });

  const [allocatingHospital, setAllocatingHospital] = useState(null);
  const [allocationData, setAllocationData] = useState({ resourceType: "", quantity: "", priority: "", toHospital: "" });
  const [allocationSuccess, setAllocationSuccess] = useState("");

  const [historyHospital, setHistoryHospital] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/hospitals");
      const data = await res.json();
      setHospitals(data);
    } catch (error) {
      console.error("Failed to fetch hospitals", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hospital?")) return;
    try {
      await fetch(`http://localhost:5000/api/hospitals/${id}`, { method: "DELETE" });
      fetchHospitals();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditStart = (h) => {
    setEditingId(h._id);
    setEditData({ name: h.name, city: h.city, beds: h.beds, ventilators: h.ventilators, oxygen: h.oxygen, bloodUnits: h.bloodUnits });
  };

  const handleEditSave = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/hospitals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      setEditingId(null);
      fetchHospitals();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSave = async () => {
    try {
      await fetch("http://localhost:5000/api/hospitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addData),
      });
      setIsAdding(false);
      setAddData({ name: "", city: "", beds: "", ventilators: "", oxygen: "", bloodUnits: "" });
      fetchHospitals();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAllocateSubmit = async () => {
    if (!allocationData.resourceType || !allocationData.quantity || !allocationData.toHospital || !allocationData.priority) return;
    try {
      await fetch("http://localhost:5000/api/allocations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...allocationData,
          fromHospital: allocatingHospital.name
        }),
      });
      setAllocationSuccess("Resource allocated successfully!");
      setTimeout(() => {
        setAllocationSuccess("");
        setAllocatingHospital(null);
        setAllocationData({ resourceType: "", quantity: "", priority: "", toHospital: "" });
        fetchHospitals();
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async (h) => {
    try {
      const res = await fetch("http://localhost:5000/api/allocations");
      const data = await res.json();
      setHistoryData(data.filter(a => a.fromHospital === h.name || a.toHospital === h.name));
      setHistoryHospital(h);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <PageShell
      title="Hospital Directory"
      sub="Browse all connected institutions fetching real-time data from backend."
      wide
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 28, alignItems: "start" }}>
        
        <div>
          {/* Results header */}
          <div className="s1" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 14, color: T.muted }}>
                <strong style={{ color: T.text }}>{hospitals.length}</strong> hospital{hospitals.length !== 1 ? "s" : ""} found
              </span>
            </div>
            <button onClick={() => setIsAdding(true)} className="btn-primary" style={{ background: T.teal, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", display: "flex", alignItems: "center", gap: 6, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" }}>
              {Ic.plus(16)} Add Hospital
            </button>
          </div>

          {/* Loading or Hospital grid or empty */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 24px", color: T.muted, fontSize: 18 }}>
              Loading...
            </div>
          ) : hospitals.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 24px" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🏥</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: T.text, marginBottom: 8 }}>No hospitals found</h3>
              <p style={{ fontSize: 14, color: T.muted, marginBottom: 24 }}>Try adding hospitals via the API.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
              {isAdding && (
                <HospitalCard 
                  h={{}}
                  delay="s1"
                  isEditing={true}
                  editData={addData}
                  setEditData={setAddData}
                  onEditSave={handleAddSave}
                  onEditCancel={() => setIsAdding(false)}
                />
              )}
              {hospitals.map((h, i) => (
                <HospitalCard 
                  key={h._id || i} 
                  h={h} 
                  delay={`s${(i % 4) + 1}`}
                  isEditing={editingId === h._id}
                  editData={editData}
                  setEditData={setEditData}
                  onEditStart={handleEditStart}
                  onEditSave={handleEditSave}
                  onEditCancel={() => setEditingId(null)}
                  onDelete={handleDelete}
                  onAllocate={() => {
                    setAllocatingHospital(h);
                    setAllocationData({ resourceType: "", quantity: "", priority: "", toHospital: "" });
                  }}
                  onViewHistory={() => fetchHistory(h)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Allocate Modal */}
      {allocatingHospital && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }} onClick={() => setAllocatingHospital(null)}>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 32, width: 420, boxShadow: T.shadowLg, animation: "fadeIn .2s ease" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: T.text }}>Allocate from {allocatingHospital.name}</h3>
              <button onClick={() => setAllocatingHospital(null)} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted }}>{Ic.x(18)}</button>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: T.text, display: "block", marginBottom: 6 }}>Resource Type</label>
              <select className="field" style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgSub, color: T.text }} value={allocationData.resourceType} onChange={e => setAllocationData({...allocationData, resourceType: e.target.value})}>
                <option value="" disabled hidden>Select resource</option>
                <option value="ICU Beds">ICU Beds</option>
                <option value="Ventilators">Ventilators</option>
                <option value="Oxygen %">Oxygen %</option>
                <option value="Blood Units">Blood Units</option>
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: T.text, display: "block", marginBottom: 6 }}>Quantity</label>
              <input type="number" className="field" placeholder="Amount to deduct..." style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgSub, color: T.text }} value={allocationData.quantity} onChange={e => setAllocationData({...allocationData, quantity: e.target.value})}/>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: T.text, display: "block", marginBottom: 6 }}>Destination (To Hospital)</label>
              <select className="field" style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgSub, color: T.text }} value={allocationData.toHospital} onChange={e => setAllocationData({...allocationData, toHospital: e.target.value})}>
                <option value="" disabled hidden>Select destination hospital</option>
                {hospitals.filter(h => h.name !== allocatingHospital.name).map(h => (
                  <option key={h._id} value={h.name}>{h.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: T.text, display: "block", marginBottom: 6 }}>Priority</label>
              <select className="field" style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgSub, color: T.text }} value={allocationData.priority} onChange={e => setAllocationData({...allocationData, priority: e.target.value})}>
                <option value="" disabled hidden>Select priority</option>
                <option value="Critical">Emergency (Critical)</option>
                <option value="High">Urgent (High)</option>
                <option value="Medium">Normal (Medium)</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {allocationSuccess && <div style={{ marginBottom: 16, padding: "8px", background: T.success + "22", color: T.success, borderRadius: 6, fontSize: 13, textAlign: "center", fontWeight: 600 }}>{allocationSuccess}</div>}

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleAllocateSubmit} className="btn-primary" style={{ flex: 1, background: T.teal, color: "#fff", border: "none", borderRadius: 9, padding: "11px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" }}>Confirm Allocation</button>
              <button onClick={() => setAllocatingHospital(null)} style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 9, color: T.muted, padding: "11px 18px", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans'" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {historyHospital && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }} onClick={() => setHistoryHospital(null)}>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 32, width: 600, maxHeight: "80vh", overflowY: "auto", boxShadow: T.shadowLg, animation: "fadeIn .2s ease" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: T.text }}>Allocation History: {historyHospital.name}</h3>
              <button onClick={() => setHistoryHospital(null)} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted }}>{Ic.x(18)}</button>
            </div>
            {historyData.length === 0 ? (
              <div style={{ textAlign: "center", color: T.muted, padding: 20 }}>No allocations found for this hospital.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {historyData.map(a => (
                  <div key={a._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", border: `1px solid ${T.border}`, borderRadius: 8, background: T.bgSub }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{a.resourceType} ({a.quantity})</div>
                      <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>
                        {a.fromHospital === historyHospital.name ? `To: ${a.toHospital}` : `From: ${a.fromHospital}`} • {new Date(a.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge type={a.status}/>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </PageShell>
  );
}
