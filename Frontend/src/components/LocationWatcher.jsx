import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import MarketCheckinPopup from "./MarketCheckinPopup";

import { useLocationData } from "../context/LocationContext";
import useMarket from "../hooks/useMarket";
import { useAuth } from "../hooks/useAuth";

// ✅ Import reusable distance util
import { getDistanceMeters } from "../utils/calculateMarketDistance";

// ⭐ Helper to check same day
function isSameDay(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

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
      //console.log("[LocationWatcher] initial global location:", coords);
      setLocation(coords);
    });

    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(pos => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        //console.log("[LocationWatcher] updating global location:", coords);
        setLocation(coords);
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [routerLocation.pathname, setLocation]);

  // ⭐ Check distance + operating hours + daily check-in
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

        //console.log(`[LocationWatcher] Distance to ${market.name}: ${dist}m`);

        if (dist <= RADIUS) {
          // ⭐ LocalStorage: skip if already checked in today
          const lastCheckin = localStorage.getItem(`checkin_${market.id}`);
          if (lastCheckin && isSameDay(lastCheckin, new Date())) {

            continue;
          }

          // ⭐ POST to /market/:id/visit
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
            //console.log("[CheckIn] Response:", data);

            const createdAt = data?.created_at;

            if (createdAt) {
              // ⭐ Save last check-in timestamp
              localStorage.setItem(`checkin_${market.id}`, createdAt);

              // ⭐ Trigger popup
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
