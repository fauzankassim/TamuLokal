import { useMap, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

const NavigationView = ({ userLocation, targetLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (!userLocation || !targetLocation) return;

    // Center map on user
    map.setView(userLocation, 16); // zoom level 16

    // Calculate bearing in degrees
    const lat1 = userLocation[0] * (Math.PI / 180);
    const lon1 = userLocation[1] * (Math.PI / 180);
    const lat2 = targetLocation[0] * (Math.PI / 180);
    const lon2 = targetLocation[1] * (Math.PI / 180);

    const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    const bearing = (Math.atan2(y, x) * 180) / Math.PI; // in degrees

    // Optionally: Rotate a marker or icon based on bearing
    // For example, a custom arrow icon:
    const arrowIcon = L.divIcon({
      className: "user-arrow",
      html: `<div style="transform: rotate(${bearing}deg); width:20px; height:20px;">➤</div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    const marker = L.marker(userLocation, { icon: arrowIcon }).addTo(map);

    return () => {
      map.removeLayer(marker);
    };
  }, [userLocation, targetLocation, map]);

  return null;
};

export default NavigationView;
