import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/axios";

export default function Bookings() {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/bookings/my").then((res) => {
      setBookings(res.data.bookings || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-slate-500">{t("common.loading")}</p>;
  if (bookings.length === 0) return <p className="text-slate-500">{t("dashboard.noBookings")}</p>;

  return (
    <div className="space-y-4">
      {bookings.map((b) => (
        <div
          key={b._id}
          className="p-6 bg-white rounded-xl shadow border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <p className="font-semibold text-navy">
              {b.packageId?.title || "Package"}
            </p>
            <p className="text-sm text-slate-500">
              {t("dashboard.dates")}: {new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-slate-500">
              {t("dashboard.status")}: {b.status} • {t("dashboard.paymentStatus")}: {b.paymentStatus}
            </p>
          </div>
          <span className="text-slate-400 text-sm">#{b._id.slice(-8)}</span>
        </div>
      ))}
    </div>
  );
}
