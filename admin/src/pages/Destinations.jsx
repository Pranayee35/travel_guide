import { useState, useEffect } from "react";
import api from "../api/axios";
import MultilingualInput from "../components/MultilingualInput";
import MultilingualTextarea from "../components/MultilingualTextarea";

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [states, setStates] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: {},
    description: {},
    stateId: "",
    categories: "",
    rating: 0,
  });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [r1, r2] = await Promise.all([api.get("/destinations"), api.get("/states")]);
    setDestinations(r1.data.destinations || []);
    setStates(r2.data.states || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing("new");
    setForm({
      name: {},
      description: {},
      stateId: states[0]?._id || "",
      categories: "",
      rating: 0,
    });
  };
  const openEdit = (d) => {
    setEditing(d._id);
    setForm({
      name: d.name || {},
      description: d.description || {},
      stateId: d.stateId?._id || d.stateId || "",
      categories: (d.categories || []).join(", "),
      rating: d.rating || 0,
    });
  };
  const cancel = () => setEditing(null);

  const save = async () => {
    const payload = {
      name: form.name,
      description: form.description,
      stateId: form.stateId || undefined,
      categories: form.categories ? form.categories.split(",").map((s) => s.trim()).filter(Boolean) : [],
      rating: Number(form.rating) || 0,
    };
    if (editing === "new") await api.post("/destinations", payload);
    else await api.put("/destinations/" + editing, payload);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete?")) return;
    await api.delete("/destinations/" + id);
    load();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy">Destinations</h1>
        <button onClick={openCreate} className="px-4 py-2 rounded bg-saffron text-white font-medium">
          Add Destination
        </button>
      </div>

      {editing && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editing === "new" ? "New Destination" : "Edit Destination"}</h2>
          <MultilingualInput label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
          <MultilingualTextarea label="Description" value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} />
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-600">State</label>
            <select
              value={form.stateId}
              onChange={(e) => setForm((f) => ({ ...f, stateId: e.target.value }))}
              className="w-full rounded border border-slate-300 px-3 py-2"
            >
              <option value="">Select</option>
              {states.map((s) => (
                <option key={s._id} value={s._id}>{typeof s.name === "object" ? s.name?.en : s.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-600">Categories (comma-separated)</label>
            <input
              value={form.categories}
              onChange={(e) => setForm((f) => ({ ...f, categories: e.target.value }))}
              className="w-full rounded border border-slate-300 px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-600">Rating</label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
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
              <th className="text-left p-3">State</th>
              <th className="text-left p-3">Rating</th>
              <th className="p-3 w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {destinations.map((d) => (
              <tr key={d._id} className="border-t border-slate-100">
                <td className="p-3">{typeof d.name === "object" ? d.name?.en || "-" : d.name}</td>
                <td className="p-3">{typeof d.stateId?.name === "object" ? d.stateId?.name?.en : d.stateId?.name || "-"}</td>
                <td className="p-3">{d.rating ?? "-"}</td>
                <td className="p-3">
                  <button onClick={() => openEdit(d)} className="text-saffron mr-2">Edit</button>
                  <button onClick={() => remove(d._id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
