import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useId,
  useState,
} from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { TbCurrentLocation, TbX } from "react-icons/tb";

const TAMULOKAL_ICON = "/tamulokal.png";
const MAP_STYLE = "mapbox://styles/mapbox/streets-v12";
const DEFAULT_ZOOM = 12;
const FALLBACK_CENTER = [0, 0];

mapboxgl.accessToken =
  import.meta.env.VITE_MAPBOX_TOKEN ||
  (typeof process !== "undefined" ? process.env.MAPBOX_TOKEN : "");

const makeCircle = (center, radiusMeters, points = 64) => {
  const [lng, lat] = center;
  const km = radiusMeters / 1000;
  const coords = [];
  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const dx = km * Math.cos(theta);
    const dy = km * Math.sin(theta);
    const dLat = dy / 111.32;
    const dLng = dx / (111.32 * Math.cos((lat * Math.PI) / 180));
    coords.push([lng + dLng, lat + dLat]);
  }
  coords.push(coords[0]);
  return {
    type: "Feature",
    properties: {},
    geometry: { type: "Polygon", coordinates: [coords] },
  };
};

const MapboxMap = forwardRef(
  (
    {
      location,
      markers = [],
      distance = 10000,
      routeTo = null,
      onMarkerClick,
      onRouteFound,
      onClose,
      onCancelRoute,
      mapHeight = "100dvh",
    },
    ref
  ) => {
    const mapRef = useRef(null);
    const radiusFeature = useRef(null);
    const markerInstancesRef = useRef([]);
    const containerId = useId().replace(/:/g, "_");
    const [isCentered, setIsCentered] = useState(false);
    const onRouteFoundRef = useRef(onRouteFound);

    const coordsClose = (a, b) => Math.abs(a - b) < 1e-6;
    useEffect(() => {
      onRouteFoundRef.current = onRouteFound;
    }, [onRouteFound]);

    const getFitOptions = () => {
      if (typeof window === "undefined") return { padding: 50, maxZoom: 15 };
      const isWide = window.innerWidth > window.innerHeight && window.innerWidth >= 1024;
      return isWide ? { padding: 100, maxZoom: 15 } : { padding: 50, maxZoom: 15 };
    };

    useImperativeHandle(ref, () => ({
      flyTo: (center, zoom = 15) => {
        if (!mapRef.current || !center) return;
        const [lat, lng] = center;
        mapRef.current.flyTo({ center: [lng, lat], zoom, speed: 0.8, curve: 1.3 });
      },
      setView: (center, zoom = DEFAULT_ZOOM) => {
        if (!mapRef.current || !center) return;
        const [lat, lng] = center;
        mapRef.current.setCenter([lng, lat]);
        mapRef.current.setZoom(zoom);
      },
      recenterMap: () => {
        if (!mapRef.current || !radiusFeature.current) return;
        const bounds = new mapboxgl.LngLatBounds();
        radiusFeature.current.geometry.coordinates[0].forEach((c) => bounds.extend(c));
        const { padding, maxZoom } = getFitOptions();
        mapRef.current.fitBounds(bounds, { padding, maxZoom });
      },
      getCenter: () => mapRef.current?.getCenter() ?? null,
      getZoom: () => mapRef.current?.getZoom() ?? null,
    }));

    useEffect(() => {
      if (!mapboxgl.accessToken) {
        console.error("Mapbox token missing");
        return;
      }
      if (!document.getElementById(containerId)) return;

      const map = new mapboxgl.Map({
        container: containerId,
        style: MAP_STYLE,
        center: location ? [location[1], location[0]] : FALLBACK_CENTER,
        zoom: location ? DEFAULT_ZOOM : 2,
        pitch: 0,
        bearing: 0,
      });

      map.on("load", () => {
        map.addSource("user", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: { type: "Point", coordinates: location ? [location[1], location[0]] : FALLBACK_CENTER },
          },
        });
        map.addLayer({
          id: "user-dot",
          type: "circle",
          source: "user",
          paint: {
            "circle-radius": 8,
            "circle-color": "#FF8225",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
          },
        });

        radiusFeature.current = makeCircle(location ? [location[1], location[0]] : FALLBACK_CENTER, distance);
        map.addSource("radius", {
          type: "geojson",
          data: { type: "FeatureCollection", features: [radiusFeature.current] },
        });
        map.addLayer({
          id: "radius-fill",
          type: "fill",
          source: "radius",
          paint: { "fill-color": "#1E90FF", "fill-opacity": 0.12 },
        });
        map.addLayer({
          id: "radius-outline",
          type: "line",
          source: "radius",
          paint: { "line-color": "#1E90FF", "line-width": 2, "line-opacity": 0.6 },
        });

        map.addSource("route", {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] },
        });
        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          layout: { "line-cap": "round", "line-join": "round" },
          paint: { "line-color": "#2563eb", "line-width": 6, "line-opacity": 0.8 },
        });

        const bounds = new mapboxgl.LngLatBounds();
        radiusFeature.current.geometry.coordinates[0].forEach((c) => bounds.extend(c));
        const { padding, maxZoom } = getFitOptions();
        map.fitBounds(bounds, { padding, maxZoom });
      });

      mapRef.current = map;

      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }, [containerId]);

    useEffect(() => {
      const map = mapRef.current;
      if (!map?.getSource("user")) return;
      const coords = location ? [location[1], location[0]] : FALLBACK_CENTER;
      map.getSource("user").setData({
        type: "Feature",
        properties: {},
        geometry: { type: "Point", coordinates: coords },
      });
      if (location) {
        map.flyTo({ center: coords, zoom: DEFAULT_ZOOM, speed: 0.8, curve: 1.3 });
      }
    }, [location]);

    useEffect(() => {
      const map = mapRef.current;
      if (!map) return;
      markerInstancesRef.current.forEach((mk) => mk.remove());
      markerInstancesRef.current = [];

      const effectiveMarkers =
        routeTo && Array.isArray(routeTo)
          ? markers.filter(
              (m) => coordsClose(m.lat, routeTo[0]) && coordsClose(m.lng, routeTo[1])
            )
          : markers;

      effectiveMarkers.forEach((m) => {
        const el = document.createElement("div");
        el.style.width = "44px";
        el.style.height = "44px";
        el.style.border = "2px solid #FF8225";
        el.style.borderRadius = "50%";
        el.style.background = "#ffffff";
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
        el.style.boxShadow = "0 4px 8px rgba(0,0,0,0.12)";
        el.style.cursor = "pointer";

        const img = document.createElement("img");
        img.src = TAMULOKAL_ICON;
        img.alt = m.name || "marker";
        img.style.width = "70%";
        img.style.height = "70%";
        img.style.objectFit = "contain";
        el.appendChild(img);

        el.addEventListener("click", () => {
          map.flyTo({ center: [m.lng, m.lat], zoom: 15, speed: 0.8, curve: 1.3 });
          if (onMarkerClick) onMarkerClick(m.id);
        });

        const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([m.lng, m.lat])
          .addTo(map);

        markerInstancesRef.current.push(marker);
      });
    }, [markers, onMarkerClick, routeTo]);

    useEffect(() => {
      const map = mapRef.current;
      if (!map?.getSource("radius")) return;
      const center = location ? [location[1], location[0]] : FALLBACK_CENTER;

      radiusFeature.current = makeCircle(center, distance);
      map.getSource("radius").setData({
        type: "FeatureCollection",
        features: [radiusFeature.current],
      });

      // Fit new radius to screen when distance changes
      const bounds = new mapboxgl.LngLatBounds();
      radiusFeature.current.geometry.coordinates[0].forEach((c) => bounds.extend(c));
      const { padding, maxZoom } = getFitOptions();
      map.fitBounds(bounds, { padding, maxZoom });

      setIsCentered(false);
    }, [distance, location]);

    // Routing: fetch with steps=true and send all steps to parent
    useEffect(() => {
      const map = mapRef.current;
      if (!map?.getSource("route")) return;

      const clearRoute = () => {
        map.getSource("route").setData({ type: "FeatureCollection", features: [] });
      };

      if (!routeTo || !location) {
        clearRoute();
        return;
      }

      const fetchRoute = async () => {
        try {
          const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${location[1]},${location[0]};${routeTo[1]},${routeTo[0]}?geometries=geojson&overview=full&steps=true&access_token=${mapboxgl.accessToken}`;
          const res = await fetch(url);
          const data = await res.json();
          const route = data?.routes?.[0]?.geometry;
          if (!route) {
            clearRoute();
            return;
          }

          map.getSource("route").setData({
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {},
                geometry: route,
              },
            ],
          });

          const steps = data?.routes?.[0]?.legs?.[0]?.steps || [];
          if (onRouteFoundRef.current) {
            onRouteFoundRef.current(steps);
          }

          map.flyTo({
            center: [location[1], location[0]],
            zoom: 18,
            speed: 0.8,
            curve: 1.3,
          });
          setIsCentered(true);
        } catch (err) {
          console.error("Error fetching route:", err);
          clearRoute();
        }
      };

      fetchRoute();
      return () => clearRoute();
    }, [routeTo, location]); // onRouteFound handled via ref

    const fitRadius = () => {
      if (mapRef.current && radiusFeature.current) {
        const bounds = new mapboxgl.LngLatBounds();
        radiusFeature.current.geometry.coordinates[0].forEach((c) => bounds.extend(c));
        const { padding, maxZoom } = getFitOptions();
        mapRef.current.fitBounds(bounds, { padding, maxZoom });
      }
    };

    const handleRecenterToggle = () => {
      onClose();
      const map = mapRef.current;
      if (!map) return;

      if (location && !isCentered) {
        map.flyTo({
          center: [location[1], location[0]],
          zoom: 18,
          speed: 0.8,
          curve: 1.3,
        });
        setIsCentered(true);
      } else {
        fitRadius();
        setIsCentered(false);
      }
    };

    const handleCancelRouteClick = () => {
      fitRadius();
      setIsCentered(false);
      if (onCancelRoute) onCancelRoute();
    };

    return (
      <div className="relative w-full" style={{ height: mapHeight }}>
        <div id={containerId} className="w-full h-full" />

        {routeTo && (
          <button
            onClick={handleCancelRouteClick}
            className="absolute top-4 left-2 z-[1000] p-4 rounded-xl bg-[var(--white)] shadow-md hover:bg-gray-100 transition-colors flex items-center justify-center"
            title="Cancel route"
          >
            <TbX className="text-xl text-[var(--black)]" />
          </button>
        )}

        <button
          onClick={handleRecenterToggle}
          className="absolute top-4 right-2 z-[1000] p-4 rounded-xl bg-[var(--white)] shadow-md hover:bg-gray-100 transition-colors flex items-center justify-center"
          title="Recenter map"
        >
          <TbCurrentLocation className="text-xl text-[var(--black)]" />
        </button>
      </div>
    );
  }
);

MapboxMap.displayName = "MapboxMap";
export default MapboxMap;