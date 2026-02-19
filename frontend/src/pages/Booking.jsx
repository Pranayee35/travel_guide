import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import BookingStepper from "../components/BookingStepper";

export default function Booking() {
  const { destinationId } = useParams();
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get("packageId");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState(null);
  const [pkg, setPkg] = useState(null);
  const [travelers, setTravelers] = useState([{ name: "", email: "", phone: "" }]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookingId, setBookingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/booking/" + destinationId + "?packageId=" + packageId);
      return;
    }
    if (destinationId) api.get(`/destinations/${destinationId}`).then((r) => setDestination(r.data.destination));
    if (packageId) api.get(`/packages/${packageId}`).then((r) => setPkg(r.data.package));
  }, [destinationId, packageId, user, navigate]);

  const addTraveler = () => setTravelers([...travelers, { name: "", email: "", phone: "" }]);

  const updateTraveler = (i, field, value) => {
    const next = [...travelers];
    next[i] = { ...next[i], [field]: value };
    setTravelers(next);
  };

  const handleConfirm = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/bookings", {
        packageId: pkg._id,
        travelers,
        startDate: startDate || new Date().toISOString().slice(0, 10),
        endDate: endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      });
      setBookingId(data.booking._id);
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;
  if (!pkg && packageId) return <div className="max-w-2xl mx-auto px-4 py-12">{t("common.loading")}</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-navy mb-6">{t("booking.title")}</h1>
      <BookingStepper currentStep={step} />

      {step === 1 && (
        <div className="bg-white rounded-xl shadow p-6">
          {pkg && (
            <>
              <h2 className="font-semibold text-lg text-navy">{pkg.title}</h2>
              <p className="text-slate-600 text-sm">{pkg.description}</p>
              <p className="mt-2">
                {t("destination.duration")}: {pkg.duration} • {t("destination.price")}: ₹{pkg.price?.toLocaleString()}
              </p>
              <button
                onClick={() => setStep(2)}
                className="mt-6 w-full py-3 rounded-lg bg-saffron text-white font-medium"
              >
                {t("common.next")}
              </button>
            </>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-lg text-navy mb-4">{t("booking.travelers")}</h2>
          {travelers.map((trav, i) => (
            <div key={i} className="border border-slate-200 rounded-lg p-4 mb-4">
              <input
                type="text"
                placeholder={t("booking.name")}
                value={trav.name}
                onChange={(e) => updateTraveler(i, "name", e.target.value)}
                className="w-full rounded border border-slate-300 px-3 py-2 mb-2"
              />
              <input
                type="email"
                placeholder={t("booking.email")}
                value={trav.email}
                onChange={(e) => updateTraveler(i, "email", e.target.value)}
                className="w-full rounded border border-slate-300 px-3 py-2 mb-2"
              />
              <input
                type="tel"
                placeholder={t("booking.phone")}
                value={trav.phone}
                onChange={(e) => updateTraveler(i, "phone", e.target.value)}
                className="w-full rounded border border-slate-300 px-3 py-2"
              />
            </div>
          ))}
          <button onClick={addTraveler} className="text-saffron font-medium mb-4">
            + {t("booking.addTraveler")}
          </button>
          <div className="mb-4">
            <label className="block text-sm text-slate-600">{t("booking.travelDate")}</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded border border-slate-300 px-3 py-2 mt-1"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded border border-slate-300 px-3 py-2 mt-1 ml-2"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-lg border border-slate-300">
              {t("common.back")}
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-3 rounded-lg bg-saffron text-white font-medium"
            >
              {t("common.next")}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-lg text-navy mb-4">{t("booking.mockPayment")}</h2>
          <p className="text-slate-600 mb-4">
            {t("destination.price")}: ₹{pkg?.price?.toLocaleString()}
          </p>
          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
          <div className="flex gap-2">
            <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-lg border border-slate-300">
              {t("common.back")}
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 py-3 rounded-lg bg-green text-white font-medium disabled:opacity-50"
            >
              {loading ? t("common.loading") : t("booking.payNow")}
            </button>
          </div>
        </div>
      )}

      {step === 4 && bookingId && (
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-green text-xl font-semibold mb-2">{t("booking.success")}</p>
          <p className="text-slate-600">
            {t("booking.bookingId")}: {bookingId}
          </p>
          <button
            onClick={() => navigate("/dashboard/bookings")}
            className="mt-6 px-6 py-3 rounded-lg bg-saffron text-white font-medium"
          >
            {t("dashboard.myBookings")}
          </button>
        </div>
      )}
    </div>
  );
}
