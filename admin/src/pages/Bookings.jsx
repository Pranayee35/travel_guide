import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/bookings").then((r) => {
      setBookings(r.data.bookings || []);
      setLoading(false);
    });
  }, []);

  const updateStatus = async (id, status, paymentStatus) => {
    try {
      await api.patch("/bookings/" + id, { status, paymentStatus });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status, paymentStatus } : b))
      );
    } catch (_) {}
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Bookings</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-3">User</th>
              <th className="text-left p-3">Package</th>
              <th className="text-left p-3">Dates</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Payment</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-t border-slate-100">
                <td className="p-3">{b.userId?.name} ({b.userId?.email})</td>
                <td className="p-3">{typeof b.packageId?.title === "object" ? b.packageId?.title?.en : b.packageId?.title}</td>
                <td className="p-3">
                  {new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <select
                    value={b.status}
                    onChange={(e) => updateStatus(b._id, e.target.value, b.paymentStatus)}
                    className="rounded border border-slate-300 text-sm"
                  >
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="cancelled">cancelled</option>
                    <option value="completed">completed</option>
                  </select>
                </td>
                <td className="p-3">
                  <select
                    value={b.paymentStatus}
                    onChange={(e) => updateStatus(b._id, b.status, e.target.value)}
                    className="rounded border border-slate-300 text-sm"
                  >
                    <option value="pending">pending</option>
                    <option value="paid">paid</option>
                    <option value="failed">failed</option>
                    <option value="refunded">refunded</option>
                  </select>
                </td>
                <td className="p-3">#{b._id.slice(-8)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
