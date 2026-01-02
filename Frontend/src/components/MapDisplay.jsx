import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef
} from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { TbCurrentLocation, TbX } from "react-icons/tb";
import tamulokal from "../../public/tamulokal.png";

const MapDisplay = forwardRef(
  (
    {
      markers = [],
      location,
      routeTo,
      routeZoom = 15,
      mapHeight = "calc(100dvh - var(--navbar-height))",
      onMarkerClick,
      onClose,
      showCloseButton = false,
      distance, // ✅ distance now comes from parent
      onRouteFound // ✅ callback for route instructions
    },
    ref
  ) => {
    const mapRef = useRef(null);
    const radiusCircleRef = useRef(null);
    const initialViewRef = useRef(null);
    const routingControlRef = useRef(null);
    const containerId = "main-map";

    useImperativeHandle(ref, () => ({
      recenterMap: () => {
        if (mapRef.current && initialViewRef.current) {
          mapRef.current.setView(
            initialViewRef.current.center,
            initialViewRef.current.zoom
          );
        }
      },
      setView: (center, zoom) => {
        if (mapRef.current) {
          mapRef.current.setView(center, zoom);
        }
      },
      flyTo: (center, zoom, duration = 3) => {
        if (mapRef.current) {
          mapRef.current.flyTo(center, 18, {
            duration: duration,
            easeLinearity: 0.25
          });

          if (radiusCircleRef.current) {
            radiusCircleRef.current.remove();
            radiusCircleRef.current = null;
          }
        }
      },
      getCenter: () => mapRef.current?.getCenter() || null,
      getZoom: () => mapRef.current?.getZoom() || null
    }));

    // ✅ Map init + update markers + radius circle
    useEffect(() => {
      if (!location || !document.getElementById(containerId)) return;

      // Destroy old map if exists
      if (mapRef.current) {
        mapRef.current.remove();
        routingControlRef.current = null;
      }

      const map = L.map(containerId, { zoomControl: false });
      mapRef.current = map;

      // Base map
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap"
      }).addTo(map);

      // User location marker
      const userMarker = L.marker([location[0], location[1]])
        .addTo(map)
        .bindPopup("You are here");

      // ✅ Radius circle uses parent distance
      const radiusCircle = L.circle([location[0], location[1]], {
        radius: distance,
        color: "#1E90FF",
        fillColor: "#1E90FF",
        fillOpacity: 0.15
      }).addTo(map);
      radiusCircleRef.current = radiusCircle;

      // Circular marker icon (Tamu Lokal logo)
      const createCircularIcon = (iconUrl, size = 40) =>
        L.divIcon({
          html: `
          <div class="flex items-center justify-center rounded-full border-2 border-blue-500 bg-white"
               style="width: ${size}px; height: ${size}px;">
            <img src="${iconUrl}" class="w-3/4 h-3/4 object-contain" />
          </div>
        `,
          className: "",
          iconSize: [size, size],
          iconAnchor: [size / 2, size],
          popupAnchor: [0, -size]
        });

      // Market markers
      markers.forEach((m) => {
        // Show marker only if route is NOT active, or if this marker is the target
        if (!routeTo || (routeTo[0] === m.lat && routeTo[1] === m.lng)) {
          const marker = L.marker([m.lat, m.lng], {
            icon: createCircularIcon(tamulokal, 40)
          }).addTo(map);

          marker.on("click", () => {
            const maxZoom = map.getMaxZoom() || 18; // fly to max zoom
            map.flyTo([m.lat, m.lng], maxZoom, {
              duration: 1,
              easeLinearity: 0.25
            });
            if (onMarkerClick) onMarkerClick(m.id);
          });
        }
      });

      // Initial view + bounds
      map.setView([location[0], location[1]], 12);
      const circleBounds = radiusCircle.getBounds();
      map.fitBounds(circleBounds, {
        padding: [50, 50],
        maxZoom: 15
      });

      initialViewRef.current = {
        center: [location[0], location[1]],
        zoom: map.getZoom()
      };
    }, [location, markers, distance, onMarkerClick]);

    // ✅ Route handling
    useEffect(() => {
      if (!mapRef.current || !routeTo) {
        if (routingControlRef.current && mapRef.current) {
          mapRef.current.removeControl(routingControlRef.current);
          routingControlRef.current = null;
        }
        return;
      }

      const map = mapRef.current;

      // Remove existing route
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }

      try {
        const routingControl = L.Routing.control({
          waypoints: [
            L.latLng(location[0], location[1]),
            L.latLng(routeTo[0], routeTo[1])
          ],
          lineOptions: { styles: [{ color: "blue", weight: 6, opacity: 0.7 }] },
          routeWhileDragging: false,
          addWaypoints: false,
          draggableWaypoints: false,
          fitSelectedRoutes: false,
          showAlternatives: false,
          show: false,
          createMarker: () => null
        }).addTo(map);

        routingControlRef.current = routingControl;

        routingControl.on("routesfound", (e) => {
          const maxZoom = map.getMaxZoom() || 18;
          map.setView([location[0], location[1]], maxZoom);

          // Hide radius circle
          if (radiusCircleRef.current) {
            radiusCircleRef.current.remove();
            radiusCircleRef.current = null;
          }

          // Pass only the first instruction to parent
          if (onRouteFound && e.routes && e.routes[0] && e.routes[0].instructions) {
            const firstStep = e.routes[0].instructions[0];
            if (firstStep) {
              onRouteFound({
                instruction: firstStep.text,
                distance: firstStep.distance,
                time: firstStep.time,
                coordinate: firstStep.latLng
              });
            }
          }
        });
      } catch (err) {
        console.error("Error creating routing control:", err);
      }

      return () => {
        if (routingControlRef.current && mapRef.current) {
          mapRef.current.removeControl(routingControlRef.current);
          routingControlRef.current = null;
        }
      };
    }, [routeTo, location, onRouteFound]);

    // ✅ recenter handler
    const handleRecenter = () => {
      if (mapRef.current && radiusCircleRef.current) {
        const circleBounds = radiusCircleRef.current.getBounds();
        mapRef.current.fitBounds(circleBounds, {
          padding: [50, 50],
          maxZoom: 15
        });
      }
      if (onClose) onClose();
    };

    return (
      <div className="relative w-full" style={{ height: mapHeight }}>
        <div id={containerId} className="w-full h-full" />

        {/* Recenter button */}
        <button
          onClick={handleRecenter}
          className="absolute top-4 right-4 z-[1000] p-3 rounded-xl bg-white shadow-md hover:bg-gray-100 transition-colors flex items-center justify-center"
          title="Recenter map"
        >
          {routeTo ? <TbX size={26} /> : <TbCurrentLocation size={26} />}
        </button>
      </div>
    );
  }
);

MapDisplay.displayName = "MapDisplay";
export default MapDisplay;
