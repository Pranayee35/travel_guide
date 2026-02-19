import { useState, useEffect } from "react";
import api from "../api/axios";
import MultilingualInput from "../components/MultilingualInput";

export default function States() {
  const [states, setStates] = useState([]);
  const [regions, setRegions] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: {}, regionId: "" });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [r1, r2] = await Promise.all([api.get("/states"), api.get("/regions")]);
    setStates(r1.data.states || []);
    setRegions(r2.data.regions || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing("new");
    setForm({ name: {}, regionId: regions[0]?._id || "" });
  };
  const openEdit = (s) => {
    setEditing(s._id);
    setForm({ name: s.name || {}, regionId: s.regionId?._id || s.regionId || "" });
  };
  const cancel = () => setEditing(null);

  const save = async () => {
    const payload = { ...form, regionId: form.regionId || undefined };
    if (editing === "new") await api.post("/states", payload);
    else await api.put("/states/" + editing, payload);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete?")) return;
    await api.delete("/states/" + id);
    load();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy">States</h1>
        <button onClick={openCreate} className="px-4 py-2 rounded bg-saffron text-white font-medium">
          Add State
        </button>
      </div>

      {editing && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editing === "new" ? "New State" : "Edit State"}</h2>
          <MultilingualInput label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-600">Region</label>
            <select
              value={form.regionId}
              onChange={(e) => setForm((f) => ({ ...f, regionId: e.target.value }))}
              className="w-full rounded border border-slate-300 px-3 py-2"
            >
              <option value="">Select</option>
              {regions.map((r) => (
                <option key={r._id} value={r._id}>{typeof r.name === "object" ? r.name?.en : r.name}</option>
              ))}
            </select>
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
              <th className="text-left p-3">Region</th>
              <th className="p-3 w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {states.map((s) => (
              <tr key={s._id} className="border-t border-slate-100">
                <td className="p-3">{typeof s.name === "object" ? s.name?.en || "-" : s.name}</td>
                <td className="p-3">{typeof s.regionId?.name === "object" ? s.regionId?.name?.en : s.regionId?.name || "-"}</td>
                <td className="p-3">
                  <button onClick={() => openEdit(s)} className="text-saffron mr-2">Edit</button>
                  <button onClick={() => remove(s._id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
