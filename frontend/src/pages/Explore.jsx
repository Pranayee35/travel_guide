import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/axios";
import DestinationCard from "../components/DestinationCard";
import Filters from "../components/Filters";

export default function Explore() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const regionIdParam = searchParams.get("regionId");
  const qParam = searchParams.get("q");

  const [regions, setRegions] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regionId, setRegionId] = useState(regionIdParam || null);

  useEffect(() => {
    setRegionId(regionIdParam || null);
  }, [regionIdParam]);

  useEffect(() => {
    setLoading(true);
    api.get("/regions").then((res) => setRegions(res.data.regions || []));
    const params = regionId ? { regionId } : {};
    api.get("/destinations", { params }).then((res) => {
      let list = res.data.destinations || [];
      if (qParam) {
        const q = qParam.toLowerCase();
        list = list.filter(
          (d) =>
            (d.name || "").toLowerCase().includes(q) ||
            (d.stateId?.name || "").toLowerCase().includes(q)
        );
      }
      setDestinations(list);
      setLoading(false);
    });
  }, [regionId, qParam]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-navy mb-6">{t("explore.title")}</h1>
      <Filters
        regions={regions}
        selectedRegionId={regionId}
        onRegionChange={setRegionId}
      />
      {loading ? (
        <p className="text-slate-500">{t("common.loading")}</p>
      ) : destinations.length === 0 ? (
        <p className="text-slate-500">{t("explore.noDestinations")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((d) => (
            <DestinationCard key={d._id} destination={d} />
          ))}
        </div>
      )}
    </div>
  );
}
