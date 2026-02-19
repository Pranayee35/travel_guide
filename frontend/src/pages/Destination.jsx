import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/axios";
import MapView from "../components/MapView";

const API_BASE = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

export default function Destination() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [destination, setDestination] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/destinations/${id}`).then((res) => {
      setDestination(res.data.destination);
      setLoading(false);
    });
    api.get("/packages", { params: { destinationId: id } }).then((res) => {
      setPackages(res.data.packages || []);
    });
  }, [id]);

  if (loading || !destination) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-500">
        {t("common.loading")}
      </div>
    );
  }

  const image = destination.images?.[0];
  const imageUrl = image?.startsWith("http") ? image : API_BASE + image;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="aspect-[21/9] bg-slate-200">
          <img
            src={imageUrl || "https://images.unsplash.com/photo-1524499940831-2a253ecb92eb?w=1200"}
            alt={destination.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1524499940831-2a253ecb92eb?w=1200";
            }}
          />
        </div>
        <div className="p-8">
          <h1 className="text-3xl font-bold text-navy mb-2">{destination.name}</h1>
          {destination.stateId?.name && (
            <p className="text-slate-500 mb-4">{destination.stateId.name}</p>
          )}
          {destination.rating > 0 && (
            <span className="inline-block text-amber-500">★ {destination.rating}</span>
          )}
          {destination.description && (
            <div className="mt-6 prose max-w-none">
              <h2 className="text-xl font-semibold text-navy">{t("destination.description")}</h2>
              <p className="text-slate-600 mt-2">{destination.description}</p>
            </div>
          )}
        </div>
      </div>

      {destination.coordinates?.lat != null && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-navy mb-4">{t("destination.map")}</h2>
          <MapView destinations={[destination]} />
        </div>
      )}

      <h2 className="text-2xl font-bold text-navy mb-4">{t("destination.packages")}</h2>
      <div className="grid gap-4">
        {packages.map((pkg) => (
          <div
            key={pkg._id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-xl shadow border border-slate-100"
          >
            <div>
              <h3 className="font-semibold text-lg text-navy">{pkg.title}</h3>
              <p className="text-slate-600 text-sm line-clamp-2">{pkg.description}</p>
              <p className="text-slate-500 text-sm mt-1">
                {t("destination.duration")}: {pkg.duration} • {t("destination.from")} ₹{pkg.price?.toLocaleString()}
              </p>
            </div>
            <Link
              to={`/booking/${destination._id}?packageId=${pkg._id}`}
              className="shrink-0 px-6 py-3 rounded-lg bg-saffron text-white font-medium hover:bg-amber-600 text-center"
            >
              {t("destination.bookNow")}
            </Link>
          </div>
        ))}
      </div>
      {packages.length === 0 && (
        <p className="text-slate-500 py-8">{t("explore.noDestinations")}</p>
      )}
    </div>
  );
}
