import { useState, useEffect } from "react";
import api from "../api/axios";
import MultilingualInput from "../components/MultilingualInput";

export default function Regions() {
  const [regions, setRegions] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: {}, icon: "" });
  const [loading, setLoading] = useState(true);

  const load = () => api.get("/regions").then((r) => { setRegions(r.data.regions || []); setLoading(false); });

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing("new");
    setForm({ name: {}, icon: "" });
  };
  const openEdit = (r) => {
    setEditing(r._id);
    setForm({ name: r.name || {}, icon: r.icon || "" });
  };
  const cancel = () => setEditing(null);

  const save = async () => {
    if (editing === "new") {
      await api.post("/regions", form);
    } else {
      await api.put("/regions/" + editing, form);
    }
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete?")) return;
    await api.delete("/regions/" + id);
    load();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy">Regions</h1>
        <button onClick={openCreate} className="px-4 py-2 rounded bg-saffron text-white font-medium">
          Add Region
        </button>
      </div>

      {editing && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editing === "new" ? "New Region" : "Edit Region"}</h2>
          <MultilingualInput label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-600">Icon (emoji or class)</label>
            <input
              value={form.icon}
              onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
              className="w-full rounded border border-slate-300 px-3 py-2"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="px-4 py-2 rounded bg-green text-white">Save</button>
            <button onClick={cancel} className="px-4 py-2 rounded border border-slate-300">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-3">Name (EN)</th>
              <th className="text-left p-3">Icon</th>
              <th className="p-3 w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {regions.map((r) => (
              <tr key={r._id} className="border-t border-slate-100">
                <td className="p-3">{typeof r.name === "object" ? r.name?.en || "-" : r.name}</td>
                <td className="p-3">{r.icon || "-"}</td>
                <td className="p-3">
                  <button onClick={() => openEdit(r)} className="text-saffron mr-2">Edit</button>
                  <button onClick={() => remove(r._id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
