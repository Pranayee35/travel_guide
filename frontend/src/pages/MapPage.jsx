import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/axios";
import MapView from "../components/MapView";

export default function MapPage() {
  const { t } = useTranslation();
  const [destinations, setDestinations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/destinations").then((res) => {
      setDestinations(res.data.destinations || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-navy mb-6">{t("map.title")}</h1>
      {loading ? (
        <p className="text-slate-500">{t("common.loading")}</p>
      ) : (
        <MapView
          destinations={destinations}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      )}
    </div>
  );
}
