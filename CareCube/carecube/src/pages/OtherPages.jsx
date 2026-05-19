import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { Ic } from "../components/icons";
import Badge from "../components/ui/Badge";
import PageShell from "../components/PageShell";
import { exportToPDF, exportToCSV } from "../utils/exportUtils";

// ─── Shared ───────────────────────────────────────────────────────────────────
const thd = {
  padding: "12px 16px", textAlign: "left",
  fontSize: 11, fontWeight: 600, color: "var(--muted)",
  textTransform: "uppercase", letterSpacing: ".07em",
  borderBottom: `1px solid var(--border)`, background: "var(--bgSub)",
};

// ─── AllocationsPage ──────────────────────────────────────────────────────────
export function AllocationsPage({ user }) {
  const { T } = useTheme();
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllocations();
  }, [user]);

  const fetchAllocations = async () => {
    try {
      let url = "https://carecube-backend.onrender.com/api/allocations";
      
      if (user?.role !== "admin") {
         const resHosp = await fetch(`https://carecube-backend.onrender.com/api/hospitals?search=${encodeURIComponent(user.name)}`);
         const hospData = await resHosp.json();
         const myHospital = hospData.find(d => d.name === user.name) || hospData[0];
         
         if (!myHospital) {
            setLoading(false);
            return;
         }
         url += `?hospitalId=${myHospital._id}`;
      }
      
      const res = await fetch(url);
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
      await fetch(`https://carecube-backend.onrender.com/api/allocations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ allocationStatus: newStatus }),
      });
      fetchAllocations();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <PageShell title="My Allocations" sub="Complete log of your resource transfers">
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginBottom: 16 }}>
        <button onClick={() => {
            const columns = ["Allocation ID", "From", "To", "Resource", "Quantity", "Priority", "Status", "Date"];
            const data = allocations.map(a => [
               `ALC-${String(a._id).slice(-4).toUpperCase()}`,
               a.fromHospitalName,
               a.toHospitalName,
               a.resource,
               String(a.quantity),
               a.priority,
               a.allocationStatus,
               new Date(a.createdAt).toLocaleDateString()
            ]);
            exportToCSV("allocations-report", columns, data);
        }} className="btn-ghost" style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 16px", display: "flex", alignItems: "center", gap: 6, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'", color: T.text }}>
          {Ic.download(16)} Export to CSV
        </button>
        <button onClick={() => {
            const columns = ["Allocation ID", "From", "To", "Resource", "Quantity", "Priority", "Status", "Date"];
            const data = allocations.map(a => [
               `ALC-${String(a._id).slice(-4).toUpperCase()}`,
               a.fromHospitalName,
               a.toHospitalName,
               a.resource,
               String(a.quantity),
               a.priority,
               a.allocationStatus,
               new Date(a.createdAt).toLocaleDateString()
            ]);
            exportToPDF("Allocations Report", "allocations-report", columns, data);
        }} className="btn-ghost" style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 16px", display: "flex", alignItems: "center", gap: 6, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'", color: T.text }}>
          {Ic.download(16)} Export to PDF
        </button>
      </div>
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden", boxShadow: T.shadow }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Allocation ID","From","To","Resource","Quantity","Priority","Status","Created Date","Action"].map((h) => (
                <th key={h} style={{...thd, color: T.muted, background: T.bgSub, borderColor: T.border}}>{h}</th>
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
                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 500, color: T.text }}>{a.fromHospitalName}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: T.text }}>{a.toHospitalName}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: T.text }}>{a.resource}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: T.text }}>{a.quantity}</td>
                <td style={{ padding: "14px 16px" }}><Badge type={a.priority}/></td>
                <td style={{ padding: "14px 16px" }}><Badge type={a.allocationStatus}/></td>
                <td style={{ padding: "14px 16px", fontSize: 12, color: T.muted }}>{new Date(a.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: "14px 16px" }}>
                  {a.allocationStatus !== "Delivered" && (user?.id === a.fromHospitalId || user?._id === a.fromHospitalId) && (
                    <button onClick={() => handleUpdateStatus(a._id, a.allocationStatus)} className="btn-ghost" style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, fontSize: 11, padding: "5px 10px", cursor: "pointer", fontFamily: "'DM Sans'" }}>
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
  const [incomingReqs, setIncomingReqs] = useState([]);
  const [outgoingReqs, setOutgoingReqs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isAdding, setIsAdding] = useState(false);
  const [addData, setAddData] = useState({ resource: "", toHospitalId: "", toHospitalName: "", quantity: "", priority: "Medium" });
  
  const [hospitalsList, setHospitalsList] = useState([]);
  const [myHosp, setMyHosp] = useState(null);

  useEffect(() => {
    fetchHospitals();
  }, [user]);

  useEffect(() => {
    if (myHosp || user?.role === "admin" || user?.role === "ngo") {
      fetchRequests();
    }
  }, [myHosp, user]);

  const fetchHospitals = async () => {
    try {
      const res = await fetch("https://carecube-backend.onrender.com/api/hospitals");
      const data = await res.json();
      setHospitalsList(data);
      
      if (user?.name) {
         const found = data.find(h => h.name === user.name);
         if (found) setMyHosp(found);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequests = async () => {
    try {
      if (user?.role === "admin") {
         const res = await fetch(`https://carecube-backend.onrender.com/api/requests`);
         const allReqs = await res.json();
         setIncomingReqs(allReqs.filter(r => r.requestStatus === "Pending"));
         setOutgoingReqs(allReqs.filter(r => r.requestStatus !== "Pending"));
         return;
      }

      let hospitalId;
      
      if (user?.role === "ngo") {
         hospitalId = user?.id || user?._id;
         if (!hospitalId) return;
         const resOut = await fetch(`https://carecube-backend.onrender.com/api/requests?fromHospitalId=${hospitalId}`);
         setIncomingReqs([]);
         setOutgoingReqs(await resOut.json());
      } else {
         if (!myHosp || !myHosp._id) return;
         hospitalId = myHosp._id;

         const [resIn, resOut] = await Promise.all([
             fetch(`https://carecube-backend.onrender.com/api/requests?toHospitalId=${hospitalId}&requestStatus=Pending`),
             fetch(`https://carecube-backend.onrender.com/api/requests?fromHospitalId=${hospitalId}`)
         ]);

         setIncomingReqs(await resIn.json());
         setOutgoingReqs(await resOut.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await fetch(`https://carecube-backend.onrender.com/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestStatus: newStatus }),
      });
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      await fetch(`https://carecube-backend.onrender.com/api/requests/${id}`, { method: "DELETE" });
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSave = async () => {
    if (!addData.resource || !addData.toHospitalId || !addData.quantity) {
      alert("Please fill in all required fields (Resource, Hospital, and Quantity).");
      return;
    }
    
    if (Number(addData.quantity) <= 0) {
      alert("Quantity must be greater than 0.");
      return;
    }
    
    try {
      let hospitalId, hospitalName;
      if (user?.role === "ngo") {
         hospitalId = user?.id || user?._id;
         hospitalName = user?.name;
      } else {
         if (!myHosp || !myHosp._id) {
            alert("Could not identify your hospital account.");
            return;
         }
         hospitalId = myHosp._id;
         hospitalName = myHosp.name;
      }

      const payload = { 
          ...addData, 
          fromHospitalId: hospitalId,
          fromHospitalName: hospitalName,
          requestStatus: "Pending",
          submittedAt: new Date()
      };

      const res = await fetch("https://carecube-backend.onrender.com/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Failed to create request");
        return;
      }
      
      setIsAdding(false);
      setAddData({ resource: "", toHospitalName: "", toHospitalId: "", quantity: "", priority: "Medium" });
      alert("Request submitted successfully!");
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert("An error occurred while creating the request.");
    }
  };

  return (
    <PageShell title="Resource Requests" sub="Manage incoming operations and outgoing requests">
      {user?.role !== "admin" && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
          <button onClick={() => setIsAdding(true)} className="btn-primary" style={{ background: T.teal, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", display: "flex", alignItems: "center", gap: 6, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" }}>
            {Ic.plus(16)} New Request
          </button>
        </div>
      )}

      {isAdding && (
        <div style={{ background: T.card, border: `1.5px solid ${T.teal}`, borderRadius: 12, padding: "18px 22px", display: "flex", gap: 12, alignItems: "center", marginBottom: 24, boxShadow: T.shadow }}>
            <input 
              placeholder="Resource (e.g. ICU Beds)"
              value={addData.resource} 
              onChange={(e) => setAddData({...addData, resource: e.target.value})}
              style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.text }}
            />
            <select
              value={addData.toHospitalId}
              onChange={(e) => {
                const selectedHosp = hospitalsList.find(h => h._id === e.target.value || h.id === e.target.value);
                if (selectedHosp) {
                   setAddData({...addData, toHospitalName: selectedHosp.name, toHospitalId: selectedHosp._id || selectedHosp.id});
                }
              }}
              style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: addData.toHospitalId ? T.text : T.muted }}
            >
              <option value="" disabled hidden>Send Request To...</option>
              {hospitalsList.filter(h => user?.role === "ngo" ? true : (myHosp && h._id !== myHosp._id)).map(h => (
                 <option key={h._id || h.id} value={h._id || h.id} style={{ color: T.text }}>
                    {h.name}
                 </option>
              ))}
            </select>
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
              <button onClick={handleAddSave} className="btn-primary" style={{ background: T.teal, color: "#fff", border: "none", borderRadius: 8, padding: "8px", cursor: "pointer" }} title="Save">
                {Ic.check(18)}
              </button>
              <button onClick={() => setIsAdding(false)} style={{ background: "none", border: `1px solid ${T.border}`, color: T.muted, borderRadius: 8, padding: "8px", cursor: "pointer" }} title="Cancel">
                {Ic.x(18)}
              </button>
            </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: user?.role === "ngo" ? "1fr" : "1fr 1fr", gap: 24 }}>
        {/* Incoming Requests (WAITING FOR ACTION) */}
        {user?.role !== "ngo" && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: T.text, marginBottom: 16 }}>
              {user?.role === "admin" ? "Global Pending Requests" : "Action Required: Incoming"}
            </h3>
            {loading ? (
               <div style={{ padding: 20, textAlign: "center", color: T.muted }}>Loading...</div>
            ) : incomingReqs.length === 0 ? (
               <div style={{ padding: 40, textAlign: "center", background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, color: T.muted }}>No pending requests found.</div>
            ) : incomingReqs.map((r) => (
               <div key={r._id} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "16px 20px", marginBottom: 12, boxShadow: T.shadow }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                     <span style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{r.resource}</span>
                     <Badge type={r.priority}/>
                  </div>
                  <p style={{ fontSize: 13, color: T.muted, marginBottom: 4 }}>From: <strong style={{color: T.text}}>{r.fromHospitalName}</strong></p>
                  <p style={{ fontSize: 13, color: T.muted, marginBottom: 4 }}>To: <strong style={{color: T.text}}>{r.toHospitalName}</strong></p>
  
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                     <span style={{ fontSize: 20, fontWeight: 700, color: T.text }}>{r.quantity} <span style={{fontSize: 12, fontWeight: 400, color: T.muted}}>units</span></span>
                     <div style={{ display: "flex", gap: 8 }}>
                       <button onClick={() => handleUpdateStatus(r._id, "Approved")} className="btn-primary" style={{ background: T.teal, color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Approve</button>
                       <button onClick={() => handleUpdateStatus(r._id, "Declined")} style={{ background: "none", border: `1px solid ${T.border}`, color: T.muted, borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12 }}>Reject</button>
                     </div>
                  </div>
               </div>
            ))}
          </div>
        )}

        {/* Outgoing Requests (MY REQUESTS) */}
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: T.text, marginBottom: 16 }}>
            {user?.role === "admin" ? "Global Processed Requests" : "My Requests (Outgoing)"}
          </h3>
          {loading ? (
             <div style={{ padding: 20, textAlign: "center", color: T.muted }}>Loading...</div>
          ) : outgoingReqs.length === 0 ? (
             <div style={{ padding: 40, textAlign: "center", background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, color: T.muted }}>No outgoing requests found.</div>
          ) : outgoingReqs.map((r) => (
             <div key={r._id} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "16px 20px", marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                   <span style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{r.resource}</span>
                   <Badge type={r.requestStatus}/>
                </div>
                <p style={{ fontSize: 13, color: T.muted, marginBottom: 4 }}>From: <strong style={{color: T.text}}>{r.fromHospitalName}</strong></p>
                <p style={{ fontSize: 13, color: T.muted, marginBottom: 4 }}>To: <strong style={{color: T.text}}>{r.toHospitalName}</strong></p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                   <span style={{ fontSize: 20, fontWeight: 700, color: T.text }}>{r.quantity} <span style={{fontSize: 12, fontWeight: 400, color: T.muted}}>units</span></span>
                   <div style={{ display: "flex", gap: 8 }}>
                     {r.requestStatus === "Pending" && (
                         <button onClick={() => handleDelete(r._id)} style={{ background: "none", border: "none", color: T.danger, cursor: "pointer", padding: 4 }}>{Ic.trash(16)}</button>
                     )}
                   </div>
                </div>
             </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

// ─── TrackingPage ─────────────────────────────────────────────────────────────
export function TrackingPage({ user }) {
  const { T } = useTheme();
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sel, setSel] = useState(null);

  useEffect(() => {
    fetchTracking();
  }, [user]);

  const fetchTracking = async () => {
    try {
      let url = "https://carecube-backend.onrender.com/api/tracking";
      
      if (user?.role !== "admin") {
         const resHosp = await fetch(`https://carecube-backend.onrender.com/api/hospitals?search=${encodeURIComponent(user.name)}`);
         const hospData = await resHosp.json();
         const myHospital = hospData.find(d => d.name === user.name) || hospData[0];
         
         if (!myHospital) {
            setLoading(false);
            return;
         }
         url += `?hospitalId=${myHospital._id}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      setTracking(data);
      if (data.length > 0) {
        setSel(prev => data.find(d => d._id === prev?._id) || data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeStep = sel ? (
    sel.status === "Delivered"  ? 4 :
    sel.status === "In Transit" ? 2 : 1
  ) : 0;
  const getS = (i) => i < activeStep ? "done" : i === activeStep ? "active" : "pending";

  const dynamicSteps = sel ? [
    { label:"Request Approved",    time: new Date(sel.createdAt).toLocaleString(), desc:"Received and logged by the system." },
    { label:"Allocation Confirmed", time: new Date(sel.createdAt).toLocaleString(), desc:`${sel.fromHospitalName} confirmed dispatch.`  },
    { label:"In Transit",           time: sel.status !== "Processing" ? new Date(sel.updatedAt).toLocaleString() : "—", desc:"Vehicle dispatched."     },
    { label:"Checkpoint",           time: sel.status !== "Processing" ? new Date(sel.updatedAt).toLocaleString() : "—", desc:"Consignment in route."        },
    { label:"Final Delivery",       time: sel.status === "Delivered" ? new Date(sel.updatedAt).toLocaleString() : "—", desc:`Expected at ${sel.toHospitalName}.`          },
  ] : [];

  return (
    <PageShell title="Resource Tracking" sub="Monitor the end-to-end journey of every allocation">
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 }}>
        
        {/* Left: list */}
        <div className="s2" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {loading ? (
              <div style={{ color: T.muted, padding: "20px" }}>Loading tracking data...</div>
            ) : tracking.length === 0 ? (
              <div style={{ color: T.muted, padding: "20px" }}>No tracking data found.</div>
            ) : tracking.map((a) => (
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
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{a.resource}</span>
                  <Badge type={a.priority}/>
                </div>
                <p style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>{a.fromHospitalName} → {a.toHospitalName}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Badge type={a.status}/>
                  <span style={{ fontSize: 11, color: T.faint }}>{new Date(a.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
        </div>

        {/* Right: detail */}
        <div className="s3">
          {sel ? (
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 28, boxShadow: T.shadow }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, paddingBottom: 20, borderBottom: `1px solid ${T.border}` }}>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 4 }}>{sel.resource}</h3>
                  <p style={{ fontSize: 13, color: T.muted }}>Tracking ID: TRK-{sel._id.substring(sel._id.length - 6).toUpperCase()} · {sel.quantity} units</p>
                </div>
                <Badge type={sel.status}/>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
                {[
                  ["From",      sel.fromHospitalName, T.teal   ],
                  ["To",        sel.toHospitalName,   T.text   ],
                  ["Dispatched",new Date(sel.createdAt).toLocaleDateString(), T.muted  ],
                  ["Updated",   new Date(sel.updatedAt).toLocaleDateString(),  sel.status==="Delivered"?T.success:T.warning],
                ].map(([l, v, c]) => (
                  <div key={l} style={{ background: T.bgSub, borderRadius: 10, padding: "12px 16px", border: `1px solid ${T.border}` }}>
                    <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 6 }}>{l}</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: c }}>{v}</div>
                  </div>
                ))}
              </div>

              <h4 style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 20 }}>Delivery Timeline</h4>
              <div style={{ position: "relative" }}>
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
