import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

const Routing = ({ start, end }) => {
  const map = useMap();

  useEffect(() => {
    if (!start || !end) return;

    // Create the routing control
    const control = L.Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      lineOptions: { styles: [{ color: "#FF8225", weight: 4 }] },
      addWaypoints: false,
      draggableWaypoints: false,
      routeWhileDragging: false,
      fitSelectedRoutes: true,
      show: false,
    }).addTo(map);

    // Cleanup on unmount
    return () => map.removeControl(control);
  }, [map, start, end]);

  return null;
};

export default Routing;
