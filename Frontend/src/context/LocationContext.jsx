import { createContext, useState, useContext, useEffect } from "react";

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(null);

    useEffect(() => {
    if (location) {
      console.log("[Global LocationContext] location updated:", location);
    }
  }, [location]);
  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationData() {
  return useContext(LocationContext);
}
