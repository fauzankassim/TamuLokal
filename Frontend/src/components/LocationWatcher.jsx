import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import MarketCheckinPopup from "./MarketCheckinPopup";

import { useLocationData } from "../context/LocationContext";
import useMarket from "../hooks/useMarket";
import { useAuth } from "../hooks/useAuth";

// ✅ Import reusable distance util
import { getDistanceMeters } from "../utils/calculateMarketDistance";

export default function LocationWatcher() {
  const { location: globalLocation, setLocation } = useLocationData();
  const routerLocation = useLocation();
  const { markets } = useMarket(null);
  const session = useAuth();
  const [activeMarket, setActiveMarket] = useState(null);

  // ⭐ Update user location every 60s
  useEffect(() => {
    if (routerLocation.pathname === "/map") return;

    navigator.geolocation.getCurrentPosition(pos => {
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setLocation(coords);
    });

    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(pos => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(coords);
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [routerLocation.pathname, setLocation]);

  // ⭐ Check distance + daily check-in (DB-enforced)
  useEffect(() => {
    if (!globalLocation || !markets?.length || !session?.user) return;

    const RADIUS = 5000; // meters
    const userId = session.user.id;

    const checkDistances = async () => {
      for (const market of markets) {
        const dist = getDistanceMeters(
          globalLocation.lat,
          globalLocation.lng,
          market.latitude,
          market.longitude
        );

        if (dist <= RADIUS) {
          try {
            const res = await fetch(
              `${import.meta.env.VITE_BACKEND_API_URL}/market/${market.id}/visit`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ visitor_id: userId }),
              }
            );

            const data = await res.json();

            if (data?.created_at) {
              // ⭐ Trigger popup only when a new visit is created
              setActiveMarket(market);
            }
          } catch (err) {
            console.error("[CheckIn] Error:", err);
          }
        }
      }
    };

    checkDistances();
  }, [globalLocation, markets, session]);

  return (
    <>
      {activeMarket && (
        <MarketCheckinPopup
          market={activeMarket}
          onClose={() => setActiveMarket(null)}
        />
      )}
    </>
  );
}
