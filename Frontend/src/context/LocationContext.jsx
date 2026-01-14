import { createContext, useState, useContext, useEffect } from "react";

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ ADD THIS

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setLocation(loc);
        setLoading(false);

      },
      (err) => {
        console.error("[Global LocationContext] location error:", err);
        setLoading(false); // still stop loading
      }
    );
  }, []);

  return (
    <LocationContext.Provider value={{ location, loading, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationData() {
  return useContext(LocationContext);
}
