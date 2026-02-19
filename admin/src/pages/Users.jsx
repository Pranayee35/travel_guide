import { useState, useEffect } from "react";
import api from "../api/axios";
import { LANGUAGES } from "../config/languages";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users").then((r) => {
      setUsers(r.data.users || []);
      setLoading(false);
    });
  }, []);

  const updateUser = async (id, updates) => {
    try {
      await api.patch("/users/" + id, updates);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, ...updates } : u))
      );
    } catch (_) {}
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Users</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Language</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-slate-100">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <select
                    value={u.role}
                    onChange={(e) => updateUser(u._id, { role: e.target.value })}
                    className="rounded border border-slate-300 text-sm"
                    disabled={u.role === "admin"}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="p-3">
                  <select
                    value={u.preferredLanguage || "en"}
                    onChange={(e) => updateUser(u._id, { preferredLanguage: e.target.value })}
                    className="rounded border border-slate-300 text-sm"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>{l.label}</option>
                    ))}
                  </select>
                </td>
                <td className="p-3">-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
