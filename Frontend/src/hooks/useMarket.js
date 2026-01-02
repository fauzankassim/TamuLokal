import { useState, useEffect } from "react";
import { useLocationData } from "../context/LocationContext";

const useMarket = (limit = null, locationOverride = null) => {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const base_url = import.meta.env.VITE_BACKEND_API_URL;
  const { location: globalLocation } = useLocationData();

  // 🔥 Remove fastLocation
  const locationToUse = locationOverride || globalLocation;

  useEffect(() => {
    if (!locationToUse) return;

    console.log("[useMarket] fetching markets using location:", locationToUse);

    const fetchMarkets = async () => {
      try {
        setLoading(true);
        setError(null);

        const { lat, lng } = locationToUse;

        let url = `${base_url}/market?user_latitude=${lat}&user_longitude=${lng}`;
        if (limit) url += `&limit=${limit}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

        const data = await res.json();
        setMarkets(data);
      } catch (error) {
        console.log("Error fetching data", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, [base_url, limit, locationToUse]);

  return { markets, loading, error };
};

export default useMarket;
