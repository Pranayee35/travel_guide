import { useState, useEffect } from "react";
import api from "../api/axios";
import MultilingualInput from "../components/MultilingualInput";
import MultilingualTextarea from "../components/MultilingualTextarea";

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: {},
    description: {},
    destinationId: "",
    duration: "",
    price: 0,
    itinerary: [],
  });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [r1, r2] = await Promise.all([api.get("/packages"), api.get("/destinations")]);
    setPackages(r1.data.packages || []);
    setDestinations(r2.data.destinations || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing("new");
    setForm({
      title: {},
      description: {},
      destinationId: destinations[0]?._id || "",
      duration: "",
      price: 0,
      itinerary: [],
    });
  };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({
      title: p.title || {},
      description: p.description || {},
      destinationId: p.destinationId?._id || p.destinationId || "",
      duration: p.duration || "",
      price: p.price || 0,
      itinerary: Array.isArray(p.itinerary) ? p.itinerary : [],
    });
  };
  const cancel = () => setEditing(null);

  const addItineraryItem = () => {
    setForm((f) => ({ ...f, itinerary: [...(f.itinerary || []), {}] }));
  };
  const updateItineraryItem = (index, lang, value) => {
    setForm((f) => {
      const arr = [...(f.itinerary || [])];
      arr[index] = { ...(arr[index] || {}), [lang]: value };
      return { ...f, itinerary: arr };
    });
  };

  const save = async () => {
    const payload = {
      title: form.title,
      description: form.description,
      destinationId: form.destinationId || undefined,
      duration: form.duration,
      price: Number(form.price) || 0,
      itinerary: form.itinerary,
    };
    if (editing === "new") await api.post("/packages", payload);
    else await api.put("/packages/" + editing, payload);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete?")) return;
    await api.delete("/packages/" + id);
    load();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy">Packages</h1>
        <button onClick={openCreate} className="px-4 py-2 rounded bg-saffron text-white font-medium">
          Add Package
        </button>
      </div>

      {editing && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editing === "new" ? "New Package" : "Edit Package"}</h2>
          <MultilingualInput label="Title" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} />
          <MultilingualTextarea label="Description" value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} />
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-600">Destination</label>
            <select
              value={form.destinationId}
              onChange={(e) => setForm((f) => ({ ...f, destinationId: e.target.value }))}
              className="w-full rounded border border-slate-300 px-3 py-2"
            >
              <option value="">Select</option>
              {destinations.map((d) => (
                <option key={d._id} value={d._id}>{typeof d.name === "object" ? d.name?.en : d.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-600">Duration</label>
              <input
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                className="w-full rounded border border-slate-300 px-3 py-2"
                placeholder="e.g. 5 Days"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600">Price (₹)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className="w-full rounded border border-slate-300 px-3 py-2"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-600">Itinerary (multilingual text per item)</label>
            <button type="button" onClick={addItineraryItem} className="text-saffron text-sm mb-2">+ Add day</button>
            {(form.itinerary || []).map((item, idx) => (
              <div key={idx} className="border border-slate-200 rounded p-3 mb-2">
                <span className="text-xs text-slate-500">Day {idx + 1}</span>
                {["en", "hi"].map((lang) => (
                  <input
                    key={lang}
                    value={typeof item === "object" ? item[lang] || "" : ""}
                    onChange={(e) => updateItineraryItem(idx, lang, e.target.value)}
                    placeholder={`Text (${lang})`}
                    className="w-full rounded border border-slate-300 px-2 py-1 text-sm mt-1"
                  />
                ))}
              </div>
            ))}
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
              <th className="text-left p-3">Title (EN)</th>
              <th className="text-left p-3">Destination</th>
              <th className="text-left p-3">Duration</th>
              <th className="text-left p-3">Price</th>
              <th className="p-3 w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((p) => (
              <tr key={p._id} className="border-t border-slate-100">
                <td className="p-3">{typeof p.title === "object" ? p.title?.en || "-" : p.title}</td>
                <td className="p-3">{typeof p.destinationId?.name === "object" ? p.destinationId?.name?.en : p.destinationId?.name || "-"}</td>
                <td className="p-3">{p.duration || "-"}</td>
                <td className="p-3">₹{p.price?.toLocaleString?.() ?? "-"}</td>
                <td className="p-3">
                  <button onClick={() => openEdit(p)} className="text-saffron mr-2">Edit</button>
                  <button onClick={() => remove(p._id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
