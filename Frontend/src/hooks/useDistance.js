import { useState, useEffect } from "react";
import useCurrentLocation from "./useCurrentLocation";

export function useDistance(marketLat, marketLng, userLocation) {
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useCurrentLocation();

  useEffect(() => {
    // only run when both user and market coordinates are available
    if (!location || !marketLat || !marketLng) return;

    const fetchDistance = async () => {
      const [userLat, userLng] = location;
      const apiKey = import.meta.env.VITE_ORS_API_KEY;
      const baseUrl = import.meta.env.VITE_ORS_BASE_URL;

      const url = `${baseUrl}?api_key=${apiKey}&start=${userLng},${userLat}&end=${marketLng},${marketLat}`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        // defensive check
        if (!data.features?.[0]?.properties?.summary?.distance) {
          throw new Error("Invalid response from routing API");
        }

        const distanceMeters = data.features[0].properties.summary.distance;
        setDistance((distanceMeters / 1000).toFixed(1)); // km
      } catch (err) {
        console.error("Error fetching distance:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDistance();
  }, [location, marketLat, marketLng]);

  return { distance, loading, error };
}
