import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { Ic } from "../components/icons";
import Badge from "../components/ui/Badge";
import PageShell from "../components/PageShell";

export default function UsersPage({ user }) {
  const { T } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", role: "", status: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditStart = (u) => {
    setEditingId(u._id);
    setEditData({ name: u.name || "", role: u.role || "ngo", status: u.status || "active" });
  };

  const handleEditSave = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`http://localhost:5000/api/users/${id}`, { method: "DELETE" });
      fetchUsers();
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

  if (user?.role !== "admin") {
    return (
      <PageShell title="Access Denied" sub="You do not have permission to view this page.">
        <div style={{ padding: 40, textAlign: "center", color: T.danger }}>Admin privileges required.</div>
      </PageShell>
    );
  }

  return (
    <PageShell title="User Management" sub="Manage platform users, roles, and access">
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden", boxShadow: T.shadow, transition: "background .3s" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thd}>Name</th>
              <th style={thd}>Email</th>
              <th style={thd}>Role</th>
              <th style={thd}>Status</th>
              <th style={thd}>Joined</th>
              <th style={thd}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: 20, textAlign: "center", color: T.muted }}>Loading users...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: 20, textAlign: "center", color: T.muted }}>No users found.</td></tr>
            ) : users.map((u) => (
              <tr key={u._id} className="t-row" style={{ borderBottom: `1px solid ${T.border}` }}>
                {editingId === u._id ? (
                  <>
                    <td style={{ padding: "14px 16px" }}><input className="field" type="text" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} style={{ width: "100%", padding: "6px", fontSize: 13, background: T.bgSub, color: T.text, border: `1px solid ${T.border}`, borderRadius: 4 }}/></td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: T.muted }}>{u.email}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <select className="field" value={editData.role} onChange={e => setEditData({...editData, role: e.target.value})} style={{ padding: "6px", fontSize: 13, background: T.bgSub, color: T.text, border: `1px solid ${T.border}`, borderRadius: 4 }}>
                        <option value="ngo">NGO</option>
                        <option value="hospital">Hospital</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <select className="field" value={editData.status} onChange={e => setEditData({...editData, status: e.target.value})} style={{ padding: "6px", fontSize: 13, background: T.bgSub, color: T.text, border: `1px solid ${T.border}`, borderRadius: 4 }}>
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: T.muted }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: "14px 16px", display: "flex", gap: 6 }}>
                      <button onClick={() => handleEditSave(u._id)} className="btn-primary" style={{ background: T.teal, color: "#fff", border: "none", borderRadius: 4, padding: "5px 10px", fontSize: 11, cursor: "pointer" }}>Save</button>
                      <button onClick={() => setEditingId(null)} className="btn-ghost" style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 4, color: T.text, padding: "5px 10px", fontSize: 11, cursor: "pointer" }}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 500, color: T.text }}>{u.name}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: T.muted }}>{u.email}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, textTransform: "capitalize", color: T.text }}>{u.role}</td>
                    <td style={{ padding: "14px 16px" }}><Badge type={u.status || "active"}/></td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: T.muted }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: "14px 16px", display: "flex", gap: 10 }}>
                      <button onClick={() => handleEditStart(u)} className="btn-ghost" style={{ background: "none", border: "none", color: T.muted, cursor: "pointer" }}>{Ic.edit(14)}</button>
                      <button onClick={() => handleDelete(u._id)} className="btn-ghost" style={{ background: "none", border: "none", color: T.danger, cursor: "pointer" }}>{Ic.trash(14)}</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
