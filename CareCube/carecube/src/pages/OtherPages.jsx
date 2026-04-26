// ─── AllocationsPage ──────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { Ic } from "../components/icons";
import Badge from "../components/ui/Badge";
import PageShell from "../components/PageShell";
import { ALLOCATIONS, REQUESTS, TRACKING_STEPS } from "../data/mockData";

export function AllocationsPage() {
  const { T } = useTheme();
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/allocations");
      const data = await res.json();
      setAllocations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, currentStatus) => {
    const statuses = ["Processing", "In Transit", "Delivered"];
    const currentIndex = statuses.indexOf(currentStatus);
    if (currentIndex >= statuses.length - 1) return;
    
    const newStatus = statuses[currentIndex + 1];
    try {
      await fetch(`http://localhost:5000/api/allocations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchAllocations();
    } catch (err) {
      console.error(err);
    }
  };

  const thd = {
    padding: "12px 16px", textAlign: "left",
    fontSize: 11, fontWeight: 600, color: T.muted,
    textTransform: "uppercase", letterSpacing: ".07em",
    borderBottom: `1px solid ${T.border}`, background: T.bgSub,
  };

  return (
    <PageShell title="All Allocations" sub="Complete log of resource transfers across the network">
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden", boxShadow: T.shadow, transition: "background .3s" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["ID","From","To","Resource","Qty","Priority","Status","Date","Action"].map((h) => (
                <th key={h} style={thd}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="9" style={{ padding: 20, textAlign: "center", color: T.muted }}>Loading allocations...</td></tr>
            ) : allocations.length === 0 ? (
              <tr><td colSpan="9" style={{ padding: 20, textAlign: "center", color: T.muted }}>No allocations found.</td></tr>
            ) : allocations.map((a) => (
              <tr key={a._id} className="t-row" style={{ borderBottom: `1px solid ${T.border}` }}>
                <td style={{ padding: "14px 16px", fontSize: 12, color: T.faint }}>ALC-{String(a._id).slice(-4).toUpperCase()}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 500, color: T.text }}>{a.fromHospital}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: T.muted }}>{a.toHospital}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: T.text }}>{a.resourceType}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: T.text }}>{a.quantity}</td>
                <td style={{ padding: "14px 16px" }}><Badge type={a.priority || "Medium"}/></td>
                <td style={{ padding: "14px 16px" }}><Badge type={a.status}/></td>
                <td style={{ padding: "14px 16px", fontSize: 12, color: T.muted }}>{new Date(a.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: "14px 16px" }}>
                  {a.status !== "Delivered" && (
                    <button onClick={() => handleUpdateStatus(a._id, a.status)} className="btn-ghost" style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, fontSize: 11, padding: "5px 10px", cursor: "pointer", fontFamily: "'DM Sans'" }}>
                      Update Status
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}

// ─── RequestsPage ─────────────────────────────────────────────────────────────
export function RequestsPage({ user }) {
  const { T } = useTheme();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ resourceType: "", quantity: "", priority: "", status: "" });

  // Add state
  const [isAdding, setIsAdding] = useState(false);
  const [addData, setAddData] = useState({ resourceType: "", hospital: "", quantity: "", priority: "Medium" });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/requests${user?.role !== 'admin' ? `?userEmail=${user?.email}` : ''}`);
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await fetch(`http://localhost:5000/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      await fetch(`http://localhost:5000/api/requests/${id}`, { method: "DELETE" });
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditStart = (r) => {
    setEditingId(r._id);
    setEditData({ resourceType: r.resourceType, quantity: r.quantity, priority: r.priority, status: r.status });
  };

  const handleEditSave = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      setEditingId(null);
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSave = async () => {
    try {
      await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...addData, requestedBy: user?.role, userEmail: user?.email }),
      });
      setIsAdding(false);
      setAddData({ resourceType: "", hospital: "", quantity: "", priority: "Medium" });
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <PageShell title="Resource Requests" sub="Review and manage incoming resource requests">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 14, color: T.muted }}>
          <strong style={{ color: T.text }}>{requests.length}</strong> request{requests.length !== 1 ? "s" : ""} found
        </div>
        <button onClick={() => setIsAdding(true)} className="btn-primary" style={{ background: T.teal, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", display: "flex", alignItems: "center", gap: 6, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" }}>
          {Ic.plus(16)} Add Request
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {loading ? (
            <div style={{ padding: 20, textAlign: "center", color: T.muted }}>Loading requests...</div>
        ) : requests.length === 0 && !isAdding ? (
            <div style={{ padding: 20, textAlign: "center", color: T.muted }}>No requests found.</div>
        ) : (
          <>
            {isAdding && (
              <div
                className="card-lift s1"
                style={{
                  background: T.card, border: `1.5px solid ${T.teal}`,
                  borderRadius: 12, padding: "18px 22px",
                  display: "flex", alignItems: "center", gap: 20, boxShadow: T.shadow,
                }}
              >
                <div style={{ display: "flex", flex: 1, gap: 12, alignItems: "center" }}>
                  <input 
                    placeholder="Resource"
                    value={addData.resourceType} 
                    onChange={(e) => setAddData({...addData, resourceType: e.target.value})}
                    style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.text }}
                  />
                  <input 
                    placeholder="Hospital"
                    value={addData.hospital} 
                    onChange={(e) => setAddData({...addData, hospital: e.target.value})}
                    style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.text }}
                  />
                  <input 
                    type="number"
                    placeholder="Qty"
                    value={addData.quantity} 
                    onChange={(e) => setAddData({...addData, quantity: e.target.value === "" ? "" : Number(e.target.value)})}
                    style={{ width: 80, padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.text }}
                  />
                  <select 
                    value={addData.priority}
                    onChange={(e) => setAddData({...addData, priority: e.target.value})}
                    style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.text }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                  <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
                    <button onClick={handleAddSave} className="btn-primary" style={{ background: T.teal, color: "#fff", border: "none", borderRadius: 8, padding: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} title="Save">
                      {Ic.check(18)}
                    </button>
                    <button onClick={() => setIsAdding(false)} style={{ background: "none", border: `1px solid ${T.border}`, color: T.muted, borderRadius: 8, padding: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} title="Cancel">
                      {Ic.x(18)}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {requests.map((r, i) => (
          <div
            key={r._id || i}
            className={`card-lift s${(i % 4) + 1}`}
            style={{
              background: T.card, border: `1px solid ${T.border}`,
              borderRadius: 12, padding: "18px 22px",
              display: "flex", alignItems: "center", gap: 20, boxShadow: T.shadow,
            }}
          >
            {editingId === r._id ? (
              // EDIT MODE
              <div style={{ display: "flex", flex: 1, gap: 12, alignItems: "center" }}>
                <input 
                  value={editData.resourceType} 
                  onChange={(e) => setEditData({...editData, resourceType: e.target.value})}
                  style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.text }}
                />
                  <input 
                    type="number"
                    value={editData.quantity} 
                    onChange={(e) => setEditData({...editData, quantity: e.target.value === "" ? "" : Number(e.target.value)})}
                    style={{ width: 80, padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.text }}
                  />
                <select 
                  value={editData.priority}
                  onChange={(e) => setEditData({...editData, priority: e.target.value})}
                  style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.text }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
                <select 
                  value={editData.status}
                  onChange={(e) => setEditData({...editData, status: e.target.value})}
                  style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.text }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Declined">Declined</option>
                </select>
                <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
                  <button onClick={() => handleEditSave(r._id)} className="btn-primary" style={{ background: T.teal, color: "#fff", border: "none", borderRadius: 8, padding: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} title="Save">
                    {Ic.check(18)}
                  </button>
                  <button onClick={() => setEditingId(null)} style={{ background: "none", border: `1px solid ${T.border}`, color: T.muted, borderRadius: 8, padding: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} title="Cancel">
                    {Ic.x(18)}
                  </button>
                </div>
              </div>
            ) : (
              // VIEW MODE
              <>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 3 }}>{r.resourceType}</h4>
                  <p style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>{r.hospital}</p>
                  <p style={{ fontSize: 11, color: T.faint }}>
                    Submitted: {new Date(r.createdAt).toLocaleString()}
                    {r.status === "Approved" && (
                      <><br/>Approved: {new Date(r.updatedAt).toLocaleString()}</>
                    )}
                  </p>
                </div>
                <span style={{ fontSize: 20, fontWeight: 700, color: T.text }}>
                  {r.quantity} <span style={{ fontSize: 12, color: T.muted, fontWeight: 400 }}>units</span>
                </span>
                <Badge type={r.priority?.toLowerCase()}/>
                <Badge type={r.status?.toLowerCase()}/>
                
                <div style={{ display: "flex", gap: 8 }}>
                  {r.status === "Pending" && user?.role === "admin" && (
                    <>
                      <button onClick={() => handleUpdateStatus(r._id, "Approved")} className="btn-primary" style={{ background: T.teal, color: "#fff", border: "none", borderRadius: 8, padding: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} title="Approve">
                        {Ic.check(18)}
                      </button>
                      <button onClick={() => handleUpdateStatus(r._id, "Declined")} style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 8, color: T.muted, padding: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} title="Decline">
                        {Ic.x(18)}
                      </button>
                    </>
                  )}
                  <button onClick={() => handleEditStart(r)} style={{ background: "none", border: "none", color: T.teal, display: "flex", alignItems: "center", justifyContent: "center", padding: "8px", cursor: "pointer" }} title="Edit">
                    {Ic.edit(18)}
                  </button>
                  <button onClick={() => handleDelete(r._id)} style={{ background: "none", border: "none", color: T.danger, display: "flex", alignItems: "center", justifyContent: "center", padding: "8px", cursor: "pointer" }} title="Delete">
                    {Ic.trash(18)}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </>
    )}
      </div>
    </PageShell>
  );
}

// ─── TrackingPage ─────────────────────────────────────────────────────────────
export function TrackingPage({ user }) {
  const { T } = useTheme();
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sel, setSel]     = useState(null);
  const [fp,  setFp]      = useState("all");

  const fetchTracking = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tracking");
      const data = await res.json();
      setAllocations(data);
      if (data.length > 0) {
        setSel(prev => data.find(d => d._id === prev?._id) || data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking();
  }, []);

  const handleUpdateStatus = async (newStatus) => {
    if (!sel) return;
    try {
      await fetch(`http://localhost:5000/api/tracking/${sel._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      fetchTracking();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = allocations.filter((a) => fp === "all" || a.priority?.toLowerCase() === fp);
  const activeStep = sel ? (
    sel.status === "Delivered"  ? 4 :
    sel.status === "In Transit" ? 2 : 1
  ) : 0;
  const getS = (i) => i < activeStep ? "done" : i === activeStep ? "active" : "pending";

  const dynamicSteps = sel ? [
    { label:"Request Approved",    time: new Date(sel.createdAt).toLocaleString(), desc:"Received and logged by the system." },
    { label:"Allocation Confirmed", time: new Date(sel.createdAt).toLocaleString(), desc:`${sel.fromHospital} confirmed dispatch.`  },
    { label:"In Transit",           time: sel.status !== "Processing" ? new Date(sel.updatedAt).toLocaleString() : "—", desc:"Vehicle dispatched."     },
    { label:"Checkpoint",           time: sel.status !== "Processing" ? new Date(sel.updatedAt).toLocaleString() : "—", desc:"Consignment in route."        },
    { label:"Final Delivery",       time: sel.status === "Delivered" ? new Date(sel.updatedAt).toLocaleString() : "—", desc:`Expected at ${sel.toHospital}.`          },
  ] : [];

  return (
    <PageShell title="Resource Tracking" sub="Monitor the end-to-end journey of every allocation">
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 }}>

        {/* ── Left: allocation list ──────────────────────────────────────────── */}
        <div className="s2">
          {/* Priority filter pills */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            {["all","critical","high","medium","low"].map((p) => (
              <button
                key={p}
                onClick={() => setFp(p)}
                style={{
                  background: fp === p ? T.tealLt : "transparent",
                  border: `1px solid ${fp === p ? T.tealMd : T.border}`,
                  borderRadius: 99, padding: "4px 12px",
                  fontSize: 11, fontWeight: 500,
                  color: fp === p ? T.teal : T.muted,
                  cursor: "pointer", fontFamily: "'DM Sans'",
                  textTransform: "capitalize", transition: "all .15s",
                }}
              >
                {p}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {loading ? (
              <div style={{ color: T.muted, padding: "20px" }}>Loading tracking data...</div>
            ) : filtered.length === 0 ? (
              <div style={{ color: T.muted, padding: "20px" }}>No tracking data found.</div>
            ) : filtered.map((a) => (
              <div
                key={a._id}
                onClick={() => setSel(a)}
                style={{
                  background: T.card,
                  border: `1.5px solid ${sel?._id === a._id ? T.teal : T.border}`,
                  borderRadius: 11, padding: 16, cursor: "pointer",
                  transition: "all .18s",
                  boxShadow: sel?._id === a._id ? `0 0 0 3px ${T.tealLt}` : T.shadow,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{a.resourceType}</span>
                  <Badge type={a.priority}/>
                </div>
                <p style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>{a.fromHospital} → {a.toHospital}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Badge type={a.status}/>
                  <span style={{ fontSize: 11, color: T.faint }}>{new Date(a.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: timeline detail ────────────────────────────────────────── */}
        <div className="s3">
          {sel ? (
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 28, boxShadow: T.shadow, transition: "background .3s" }}>
              {/* Detail header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, paddingBottom: 20, borderBottom: `1px solid ${T.border}` }}>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 4 }}>{sel.resourceType}</h3>
                  <p style={{ fontSize: 13, color: T.muted }}>Tracking ID: TRK-{sel._id.substring(sel._id.length - 6).toUpperCase()} · {sel.quantity} units</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                  <Badge type={sel.status}/>
                  {user?.role === "admin" && (
                    <div style={{ display: "flex", gap: 6 }}>
                      {sel.status === "Processing" && (
                        <button onClick={() => handleUpdateStatus("In Transit")} style={{ background: T.teal, color: "#fff", border: "none", borderRadius: 6, padding: "6px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Mark In Transit</button>
                      )}
                      {sel.status === "In Transit" && (
                        <button onClick={() => handleUpdateStatus("Delivered")} style={{ background: T.success, color: "#fff", border: "none", borderRadius: 6, padding: "6px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Mark Delivered</button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Meta grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
                {[
                  ["From",      sel.fromHospital, T.teal   ],
                  ["To",        sel.toHospital,   T.text   ],
                  ["Dispatched",new Date(sel.createdAt).toLocaleDateString(), T.muted  ],
                  ["Updated",   new Date(sel.updatedAt).toLocaleDateString(),  sel.status==="Delivered"?T.success:T.warning],
                ].map(([l, v, c]) => (
                  <div key={l} style={{ background: T.bgSub, borderRadius: 10, padding: "12px 16px", border: `1px solid ${T.border}`, transition: "background .3s" }}>
                    <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>{l}</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: c }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Timeline */}
              <h4 style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 20 }}>Delivery Timeline</h4>
              <div style={{ position: "relative" }}>
                {/* Vertical line */}
                <div style={{ position: "absolute", left: 11, top: 12, bottom: 12, width: 1.5, background: T.border }}/>
                <div style={{
                  position: "absolute", left: 11, top: 12, width: 1.5,
                  background: T.teal,
                  height: `${(activeStep / (dynamicSteps.length - 1)) * 100}%`,
                  transition: "height 1.2s ease",
                }}/>

                {dynamicSteps.map((step, i) => {
                  const s = getS(i);
                  return (
                    <div key={i} className={`step-${s}`} style={{ display: "flex", gap: 20, marginBottom: 22, position: "relative" }}>
                      <div className="step-dot" style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, marginTop: 1, zIndex: 1, border: "2px solid", display: "flex", alignItems: "center", justifyContent: "center", background: s === "done" || s === "active" ? T.teal : T.card, borderColor: s === "done" || s === "active" ? T.teal : T.border }}>
                        {s === "done" && (
                          <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: s === "pending" ? T.faint : T.text }}>
                            {step.label}
                          </span>
                          {s === "active" && (
                            <span style={{ background: T.tealLt, color: T.teal, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, border: `1px solid ${T.tealMd}` }}>
                              LIVE
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: 12, color: T.muted, marginBottom: 2 }}>{step.time}</p>
                        <p style={{ fontSize: 13, color: s === "pending" ? T.faint : T.muted }}>{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
             <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 40, textAlign: "center", color: T.muted }}>
               Select an allocation to view tracking details.
             </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

// ─── AlertsPage ───────────────────────────────────────────────────────────────
export function AlertsPage() {
  const { T } = useTheme();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/alerts");
        const data = await res.json();
        
        const formatted = data.map(a => {
           let colors = {};
           if (a.type === 'critical') {
              colors = { c: T.danger, bg: T.dangerLt, bd: T.dangerBd, p: "critical" };
           } else if (a.type === 'high') {
              colors = { c: T.warning, bg: T.warnLt, bd: T.warnBd, p: "high" };
           } else if (a.type === 'medium') {
              colors = { c: T.teal, bg: T.tealLt, bd: T.tealMd, p: "medium" };
           } else {
              colors = { c: T.success, bg: T.successLt, bd: T.successBd, p: "low" };
           }
           
           return {
              msg: a.message,
              t: new Date(a.createdAt).toLocaleString(),
              ...colors
           };
        });
        
        setAlerts(formatted);
      } catch (err) {
        console.error("Failed to fetch alerts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, [T]);

  return (
    <PageShell title="System Alerts" sub="Notifications and critical updates across the platform">
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {loading ? (
          <div style={{ color: T.muted, padding: "20px" }}>Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div style={{ color: T.muted, padding: "20px" }}>No alerts found.</div>
        ) : alerts.map((a, i) => (
          <div
            key={i}
            className={`s${i + 1}`}
            style={{
              background: a.bg, border: `1px solid ${a.bd}`,
              borderLeft: `4px solid ${a.c}`, borderRadius: 10,
              padding: "16px 20px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: a.c, display: "inline-block", flexShrink: 0 }}/>
              <span style={{ fontSize: 14, color: T.text }}>{a.msg}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0, marginLeft: 20 }}>
              <Badge type={a.p}/>
              <span style={{ fontSize: 12, color: T.faint, whiteSpace: "nowrap" }}>{a.t}</span>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
