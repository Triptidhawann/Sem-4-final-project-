import { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { Ic } from "../components/icons";
import { StatCard, DonutChart, Sparkline, ResourceBar } from "../components/ui/Charts";
import Badge from "../components/ui/Badge";
import PageShell from "../components/PageShell";
import { HOSPITALS, ALLOCATIONS, REQUESTS } from "../data/mockData";
import LoginPage from "./LoginPage";

// ─── Role router ──────────────────────────────────────────────────────────────
export default function DashboardPage({ user, setPage, setUser }) {
  if (!user) return <LoginPage setUser={setUser} setPage={setPage} />;
  if (user.role === "admin")    return <AdminDashboard    setPage={setPage} />;
  if (user.role === "hospital") return <HospitalDashboard setPage={setPage} user={user} />;
  return <NGODashboard setPage={setPage} />;
}

// ─── Shared table header cell style ───────────────────────────────────────────
const useThd = () => {
  const { T } = useTheme();
  return {
    padding: "10px 16px", textAlign: "left",
    fontSize: 11, fontWeight: 600, color: T.muted,
    textTransform: "uppercase", letterSpacing: ".07em",
    borderBottom: `1px solid ${T.border}`,
    background: T.bgSub,
  };
};

// ═════════════════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD
// ═════════════════════════════════════════════════════════════════════════════
function AdminDashboard({ setPage }) {
  const { T } = useTheme();
  const thd = useThd();

  const [stats, setStats] = useState({
     totalHospitals: 0, criticalRequests: 0, inTransit: 0, deliveredToday: 0,
     averages: { avgBeds: 0, avgVents: 0, avgOx: 0, avgBlood: 0 },
     hospitals: []
  });
  const [allocations, setAllocations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, trackRes] = await Promise.all([
           fetch("http://localhost:5000/api/dashboard"),
           fetch("http://localhost:5000/api/tracking")
        ]);
        const dashData = await dashRes.json();
        const trackData = await trackRes.json();
        setStats(dashData);
        setAllocations(trackData.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch admin dashboard data", err);
      }
    };
    fetchData();
    const timer = setInterval(fetchData, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <PageShell title="Command Centre" sub="System-wide resource visibility — 22 Feb 2026">
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginBottom: 24 }}>
        <StatCard label="Hospitals Connected" value={stats.totalHospitals} sub="Active network"   icon={Ic.hospital(20)}                      delay="s1"/>
        <StatCard label="Critical Requests"   value={stats.criticalRequests}  sub="Action required"  icon={Ic.bell(20)}     color={T.danger}      delay="s2"/>
        <StatCard label="In Transit"          value={stats.inTransit} sub="Units en route"    icon={Ic.truck(20)}    color={T.warning}     delay="s3"/>
        <StatCard label="Delivered Today"     value={stats.deliveredToday}  sub="Recent deliveries"  icon={Ic.check(20)}   color={T.success}     delay="s4"/>
      </div>

      {/* Table + charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Hospital table */}
        <div className="s3" style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden", boxShadow: T.shadow, transition: "background .3s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", borderBottom: `1px solid ${T.border}` }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: T.text }}>Connected Hospitals</h3>
            <button onClick={() => setPage("hospitals")} className="btn-ghost" style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 7, color: T.muted, fontSize: 12, padding: "5px 14px", cursor: "pointer", fontFamily: "'DM Sans'" }}>View all</button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["Hospital","City","Beds","Vents","O₂","Status"].map((h) => <th key={h} style={thd}>{h}</th>)}</tr></thead>
            <tbody>
              {stats.hospitals.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: "13px 16px", textAlign: "center", color: T.muted }}>No hospitals found.</td></tr>
              ) : stats.hospitals.slice(0, 5).map((h) => (
                <tr key={h._id || h.id} className="t-row" style={{ borderBottom: `1px solid ${T.border}` }}>
                  <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 500, color: T.text }}>{h.name}</td>
                  <td style={{ padding: "13px 16px", fontSize: 13, color: T.muted }}>{h.city}</td>
                  <td style={{ padding: "13px 16px", fontSize: 13, color: T.text }}>{h.beds}</td>
                  <td style={{ padding: "13px 16px", fontSize: 13, color: h.ventilators < 50 ? T.danger : T.text, fontWeight: h.ventilators < 50 ? 600 : 400 }}>{h.ventilators}</td>
                  <td style={{ padding: "13px 16px", fontSize: 13, color: h.oxygen < 70 ? T.danger : T.text, fontWeight: h.oxygen < 70 ? 600 : 400 }}>{h.oxygen}%</td>
                  <td style={{ padding: "13px 16px" }}><Badge type={h.oxygen < 60 ? "Critical" : h.oxygen < 80 ? "Moderate" : "Stable"}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Charts panel */}
        <div className="s4" style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 22, boxShadow: T.shadow, transition: "background .3s" }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 20 }}>Resource Utilisation</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 18, marginBottom: 20 }}>
            <DonutChart value={Math.round((stats.averages.avgBeds / 500) * 100) || 0} max={100} color={T.teal}    label="Beds"/>
            <DonutChart value={Math.round((stats.averages.avgVents / 150) * 100) || 0} max={100} color={T.warning} label="Ventilators"/>
            <DonutChart value={Math.round(stats.averages.avgOx) || 0} max={100} color={T.danger}  label="Oxygen"/>
            <DonutChart value={Math.round((stats.averages.avgBlood / 300) * 100) || 0} max={100} color="#3B82C4"   label="Blood Units"/>
          </div>
          <div style={{ paddingTop: 18, borderTop: `1px solid ${T.border}` }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: T.muted, marginBottom: 10 }}>7-Day Allocation Trend</p>
            <Sparkline data={[120,145,132,168,155,180,195]} w={240} h={44}/>
          </div>
        </div>
      </div>

      {/* Allocations table */}
      <div className="s5" style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden", boxShadow: T.shadow, transition: "background .3s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", borderBottom: `1px solid ${T.border}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: T.text }}>Active Allocations</h3>
          <button onClick={() => setPage("allocations")} className="btn-ghost" style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 7, color: T.muted, fontSize: 12, padding: "5px 14px", cursor: "pointer", fontFamily: "'DM Sans'" }}>View all</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["From","To","Resource","Qty","Priority","Status","ETA"].map((h) => <th key={h} style={thd}>{h}</th>)}</tr></thead>
          <tbody>
            {allocations.length === 0 ? (
              <tr><td colSpan="7" style={{ padding: "13px 16px", textAlign: "center", color: T.muted }}>No allocations active.</td></tr>
            ) : allocations.map((a) => (
              <tr key={a._id || a.id} className="t-row" style={{ borderBottom: `1px solid ${T.border}` }}>
                <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 500, color: T.text }}>{a.fromHospital}</td>
                <td style={{ padding: "13px 16px", fontSize: 13, color: T.muted }}>{a.toHospital}</td>
                <td style={{ padding: "13px 16px", fontSize: 13, color: T.text }}>{a.resourceType}</td>
                <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 600, color: T.text }}>{a.quantity}</td>
                <td style={{ padding: "13px 16px" }}><Badge type={a.priority || "High"}/></td>
                <td style={{ padding: "13px 16px" }}><Badge type={a.status}/></td>
                <td style={{ padding: "13px 16px", fontSize: 12, color: T.muted }}>{new Date(a.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// HOSPITAL DASHBOARD
// ═════════════════════════════════════════════════════════════════════════════
function HospitalDashboard({ setPage, user }) {
  const { T } = useTheme();
  const [h, setH] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [incomingReqs, setIncomingReqs] = useState([]);
  const [myReqs, setMyReqs] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    const timer = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(timer);
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [hospRes, incReqRes, myReqRes, allocRes] = await Promise.all([
        fetch(`http://localhost:5000/api/hospitals?search=${encodeURIComponent(user.name)}`),
        fetch(`http://localhost:5000/api/requests?hospital=${encodeURIComponent(user.name)}`),
        fetch(`http://localhost:5000/api/requests?userEmail=${encodeURIComponent(user.email)}`),
        fetch(`http://localhost:5000/api/allocations`)
      ]);
      
      const hospData = await hospRes.json();
      if (hospData.length > 0) {
        const myHospital = hospData.find(d => d.name === user.name) || hospData[0];
        setH(myHospital);
      }

      setIncomingReqs(await incReqRes.json());
      setMyReqs(await myReqRes.json());
      
      const allAllocs = await allocRes.json();
      setActivities(allAllocs.filter(a => a.fromHospital === user.name).slice(0, 5));

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReqStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const hasEnoughInventory = (r) => {
    if (!h) return false;
    const rt = r.resourceType?.toLowerCase() || "";
    const qty = Number(r.quantity) || 0;
    if (rt.includes("bed")) return (h.beds || 0) >= qty;
    if (rt.includes("vent")) return (h.ventilators || 0) >= qty;
    if (rt.includes("oxy")) return (h.oxygen || 0) >= qty;
    if (rt.includes("blood")) return (h.bloodUnits || 0) >= qty;
    return true;
  };

  if (loading && !h) return <div style={{ padding: 40, textAlign: "center", color: T.muted }}>Loading...</div>;
  if (!h) return <div style={{ padding: 40, textAlign: "center", color: T.muted }}>No hospital profile found for your account. Please wait for admin approval setup.</div>;

  return (
    <PageShell
      title={h.name}
      sub={`${h.city} — Last Updated: ${new Date(h.updatedAt).toLocaleTimeString()}`}
    >
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginBottom: 24 }}>
        <StatCard label="ICU Beds Available"  value={h.beds}         sub="Capacity: 500"          icon={Ic.hospital(20)}                                    delay="s1"/>
        <StatCard label="Ventilators"         value={h.ventilators}  sub="Operational units"      icon={Ic.activity(20)} color={T.warning}                  delay="s2"/>
        <StatCard label="Oxygen Supply"       value={`${h.oxygen}%`} sub="Current level"          icon={Ic.box(20)}      color={h.oxygen<70?T.danger:T.teal} delay="s3"/>
        <StatCard label="Blood Bank Units"    value={h.bloodUnits}   sub="Combined units"         icon={Ic.chart(20)}                                        delay="s4"/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
        {/* Inventory bars */}
        <div className="s3" style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24, boxShadow: T.shadow, transition: "background .3s" }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 20 }}>Inventory Status</h3>
          <ResourceBar label="ICU Beds"         used={h.beds}   total={500}/>
          <ResourceBar label="Ventilators"      used={h.ventilators}  total={150} color={T.warning}/>
          <ResourceBar label="Oxygen %"         used={h.oxygen} total={100}/>
          <ResourceBar label="Blood Units"      used={h.bloodUnits}  total={300} color={T.danger}/>
        </div>

        {/* Incoming requests */}
        <div className="s4" style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24, boxShadow: T.shadow, transition: "background .3s" }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 18 }}>Incoming Requests</h3>
          {incomingReqs.length === 0 ? (
            <p style={{ fontSize: 13, color: T.muted }}>No incoming requests right now.</p>
          ) : incomingReqs.map((r) => (
            <div key={r._id} style={{ padding: "14px", border: `1px solid ${T.border}`, borderRadius: 10, marginBottom: 12, transition: "border-color .2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{r.resourceType}</span>
                <Badge type={r.priority}/>
              </div>
              <p style={{ fontSize: 12, color: T.muted, marginBottom: 10 }}>From: {r.requestedBy || "NGO/Citizen"} · {r.quantity} units · {new Date(r.createdAt).toLocaleDateString()}</p>
              {r.status === "Pending" ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <button 
                    onClick={() => handleReqStatus(r._id, 'Approved')} 
                    disabled={!hasEnoughInventory(r)}
                    className="btn-primary" 
                    title={hasEnoughInventory(r) ? "" : "Insufficient Inventory"}
                    style={{ flex: 1, background: hasEnoughInventory(r) ? T.teal : T.border, color: hasEnoughInventory(r) ? "#fff" : T.muted, border: "none", borderRadius: 7, padding: "7px", fontSize: 12, fontWeight: 600, cursor: hasEnoughInventory(r) ? "pointer" : "not-allowed", fontFamily: "'DM Sans'" }}
                  >
                    Approve
                  </button>
                  <button onClick={() => handleReqStatus(r._id, 'Declined')} style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 7, color: T.muted, padding: "7px 12px", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans'" }}>Decline</button>
                </div>
              ) : <Badge type={r.status}/>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
        {/* My Requests */}
        <div className="s5" style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24, boxShadow: T.shadow, transition: "background .3s" }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 18 }}>My Requests (Outgoing)</h3>
          {myReqs.length === 0 ? (
            <p style={{ fontSize: 13, color: T.muted }}>You haven't made any requests yet.</p>
          ) : myReqs.map((r) => (
            <div key={r._id} style={{ padding: "14px", border: `1px solid ${T.border}`, borderRadius: 10, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{r.resourceType}</span>
                <Badge type={r.status}/>
              </div>
              <p style={{ fontSize: 12, color: T.muted, marginBottom: 0 }}>To: {r.hospital} · {r.quantity} units · {new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>

        {/* Activity Log */}
        <div className="s6" style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24, boxShadow: T.shadow, transition: "background .3s" }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 18 }}>Recent Activity Log</h3>
          {activities.length === 0 ? (
            <p style={{ fontSize: 13, color: T.muted }}>No recent activity to show.</p>
          ) : activities.map((a) => (
            <div key={a._id} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: T.bgSub, display: "flex", alignItems: "center", justifyContent: "center", color: T.teal, flexShrink: 0 }}>
                {Ic.check(16)}
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
    </PageShell>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// NGO DASHBOARD
// ═════════════════════════════════════════════════════════════════════════════
function NGODashboard({ setPage }) {
  const { T } = useTheme();
  const [stateF, setStateF]   = useState("all");
  const [statusF, setStatusF] = useState("all");
  const [locSearch, setLocSearch] = useState("");
  const [search, setSearch]   = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);

  // Request Form State
  const [reqResource, setReqResource] = useState("");
  const [reqQty, setReqQty] = useState("");
  const [reqLocation, setReqLocation] = useState("");
  const [reqPriority, setReqPriority] = useState("");
  const [reqSuccess, setReqSuccess] = useState("");
  const locationInputRef = useRef(null);

  useEffect(() => {
    const fetchHospitals = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (search) query.append("search", search);
        if (stateF && stateF !== "all") query.append("state", stateF);
        if (statusF && statusF !== "all") query.append("status", statusF);
        
        const res = await fetch(`http://localhost:5000/api/hospitals?${query.toString()}`);
        const data = await res.json();
        setHospitals(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const delayFn = setTimeout(() => {
      fetchHospitals();
    }, 300);
    return () => clearTimeout(delayFn);
  }, [search, stateF, statusF]);

  const handleSubmitRequest = async () => {
    if (!reqResource || !reqQty || !reqLocation || !reqPriority) return;
    try {
      await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceType: reqResource,
          quantity: reqQty,
          hospital: reqLocation,
          priority: reqPriority
        }),
      });
      setReqSuccess("Request sent successfully!");
      setReqResource("");
      setReqQty("");
      setReqLocation("");
      setReqPriority("");
      setTimeout(() => setReqSuccess(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequestClick = (hospitalName) => {
    setReqLocation(hospitalName);
    if (locationInputRef.current) {
      locationInputRef.current.focus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const btnStyle = (active) => ({
    textAlign: "left", background: active ? T.tealLt : "none",
    border: `1px solid ${active ? T.tealMd : T.border}`,
    borderRadius: 7, padding: "8px 12px",
    color: active ? T.teal : T.muted, fontSize: 13,
    cursor: "pointer", fontFamily: "'DM Sans'",
    fontWeight: active ? 500 : 400, transition: "all .15s", textTransform: "capitalize",
  });

  const STATES_OPTS = ["all", "Delhi", "Punjab", "Rajasthan", "Maharashtra"];

  return (
    <PageShell title="Resource Search" sub="Find and request medical resources from connected institutions">
      {/* Horizontal request form at top */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "16px 22px", marginBottom: 24, boxShadow: T.shadow, transition: "background .3s" }}>
        <h4 style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 12 }}>Submit Quick Request</h4>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
          <div style={{ flex: 1.2 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 5 }}>Resource Type</label>
            <input className="field" style={{ fontSize: 13, width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgSub, color: T.text, outline: "none" }} type="text" placeholder="Ventilators…" value={reqResource} onChange={e => setReqResource(e.target.value)} />
          </div>
          <div style={{ flex: 0.8 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 5 }}>Quantity</label>
            <input className="field" style={{ fontSize: 13, width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgSub, color: T.text, outline: "none" }} type="number" placeholder="Units…" value={reqQty} onChange={e => setReqQty(e.target.value)} />
          </div>
          <div style={{ flex: 1.2 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 5 }}>Location</label>
            <input className="field" ref={locationInputRef} style={{ fontSize: 13, width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgSub, color: T.text, outline: "none" }} type="text" placeholder="Hospital name…" value={reqLocation} onChange={e => setReqLocation(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: T.muted, display: "block", marginBottom: 5 }}>Urgency</label>
            <select className="field" style={{ fontSize: 13, width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgSub, color: reqPriority ? T.text : T.muted, outline: "none", cursor: "pointer" }} value={reqPriority} onChange={e => setReqPriority(e.target.value)}>
              <option value="" disabled hidden>Select urgency</option>
              <option value="Critical" style={{color: T.text}}>Emergency</option>
              <option value="High" style={{color: T.text}}>Urgent</option>
              <option value="Medium" style={{color: T.text}}>Normal</option>
              <option value="Low" style={{color: T.text}}>Low</option>
            </select>
          </div>
          <button onClick={handleSubmitRequest} className="btn-primary" style={{ height: 38, padding: "0 20px", background: T.teal, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans'" }}>
            Submit
          </button>
        </div>
        {reqPriority && !reqSuccess && (
          <div style={{ marginTop: 12, fontSize: 12, color: T.muted, fontStyle: "italic", paddingLeft: 4 }}>
            {reqPriority === "Critical" && <span style={{color: T.danger}}>Emergency → For life-threatening situations</span>}
            {reqPriority === "High" && <span style={{color: T.warning}}>Urgent → Needed within hours</span>}
            {reqPriority === "Medium" && <span style={{color: T.teal}}>Normal → Routine requirement</span>}
            {reqPriority === "Low" && <span>Low → Non-urgent stock refill</span>}
          </div>
        )}
        {reqSuccess && (
          <div style={{ marginTop: 12, padding: "8px", background: T.success + "22", color: T.success, borderRadius: 6, fontSize: 13, textAlign: "center", fontWeight: 600 }}>
            {reqSuccess}
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 24 }}>
        {/* Filter sidebar */}
        <div className="s2">
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 22, marginBottom: 16, boxShadow: T.shadow, transition: "background .3s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, color: T.muted }}>
              {Ic.filter(15)}<span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Filters</span>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: ".08em", display: "block", marginBottom: 8 }}>Location / State</label>
              
              <div style={{ position: "relative", marginBottom: 8 }}>
                <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: T.muted, display: "flex", pointerEvents: "none" }}>
                  {Ic.search(12)}
                </span>
                <input 
                  type="text" 
                  placeholder="Search location..."
                  value={locSearch}
                  onChange={(e) => setLocSearch(e.target.value)}
                  style={{ width: "100%", padding: "7px 10px 7px 30px", borderRadius: 6, border: `1px solid ${T.border}`, background: T.bgSub, color: T.text, fontSize: 12, fontFamily: "'DM Sans'", outline: "none" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: 180, overflowY: "auto", paddingRight: 4 }}>
                {STATES_OPTS.filter(s => s === "all" || s.toLowerCase().includes(locSearch.toLowerCase())).map((s) => (
                  <button key={s} onClick={() => setStateF(s)} style={btnStyle(stateF === s)}>
                    {s === "all" ? "All Locations" : s}
                  </button>
                ))}
                {STATES_OPTS.filter(s => s === "all" || s.toLowerCase().includes(locSearch.toLowerCase())).length === 0 && (
                  <div style={{ fontSize: 12, color: T.muted, padding: "4px 8px" }}>No locations found</div>
                )}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: ".08em", display: "block", marginBottom: 8 }}>Status</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {["all", "critical", "moderate", "stable"].map((s) => (
                  <button key={s} onClick={() => setStatusF(s)} style={btnStyle(statusF === s)}>
                    {s === "all" ? "All Statuses" : s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hospital cards */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <p className="s1" style={{ fontSize: 13, color: T.muted, margin: 0 }}>Showing {hospitals.length} institutions</p>
            <div style={{ position: "relative", width: 260 }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.muted, display: "flex", pointerEvents: "none" }}>
                {Ic.search(16)}
              </span>
              <input
                type="text"
                placeholder="Search by name or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%", padding: "9px 14px 9px 36px",
                  borderRadius: 9, border: `1px solid ${T.border}`,
                  background: T.card, color: T.text, fontSize: 13,
                  fontFamily: "'DM Sans'", outline: "none",
                  transition: "border-color .2s",
                }}
                onFocus={(e) => e.target.style.borderColor = T.teal}
                onBlur={(e) => e.target.style.borderColor = T.border}
              />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
            {loading ? (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: T.muted }}>Loading...</div>
            ) : hospitals.length === 0 ? (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: T.muted }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🏥</div>
                <h3 style={{ fontSize: 16, color: T.text, fontWeight: 600, marginBottom: 4 }}>No hospitals found</h3>
                <p style={{ fontSize: 13 }}>Try adjusting your filters or search term.</p>
              </div>
            ) : hospitals.map((h, i) => (
              <div key={h._id || h.id} className={`card-lift s${(i % 4) + 1}`} style={{ background: T.card, border: `1.5px solid ${h.status?.toLowerCase() === "critical" ? T.criticalBorder : T.border}`, borderRadius: 12, padding: 20, boxShadow: T.shadow }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 2 }}>{h.name}</h4>
                    <p style={{ fontSize: 12, color: T.muted }}>{h.city}{h.state ? `, ${h.state}` : ''}</p>
                  </div>
                  <Badge type={h.status}/>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, marginBottom: 14 }}>
                  {[["Beds",h.beds,T.teal],["Vents",h.vents,T.warning],[`O₂`,`${h.oxygen}%`,h.oxygen<70?T.danger:T.teal],["Blood",h.blood,T.teal]].map(([l,v,c]) => (
                    <div key={l} style={{ background: T.bgSub, borderRadius: 8, padding: "9px 12px", transition: "background .3s" }}>
                      <div style={{ fontSize: 11, color: T.muted, marginBottom: 3 }}>{l}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: c }}>{v}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => handleRequestClick(h.name)} className="btn-ghost" style={{ width: "100%", background: "none", border: `1px solid ${T.border}`, borderRadius: 8, color: T.teal, padding: "8px", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans'" }}>
                  Request Resource
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
