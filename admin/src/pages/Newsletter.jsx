import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Newsletter() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/newsletter").then((r) => {
      setSubscriptions(r.data.subscriptions || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Newsletter Subscriptions</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Subscribed at</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((s) => (
              <tr key={s._id} className="border-t border-slate-100">
                <td className="p-3">{s.email}</td>
                <td className="p-3">{new Date(s.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
