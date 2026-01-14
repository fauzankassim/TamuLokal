import React, { useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { TbChevronUp, TbChevronDown, TbMapPin } from "react-icons/tb";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import tamulokal from "../../public/tamulokal.png";
import { getDistanceMeters } from "../utils/calculateMarketDistance"; // ✅ use your util

const MarketDistanceDropdown = ({
  address,
  userLat,
  userLng,
  marketLat,
  marketLng,
  isOpen,
  onToggle,
  markerSize = 40,
}) => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapId = `market-map-${marketLat}-${marketLng}`; // unique ID for multiple maps

  // ✅ Calculate distance using util
  const distance = useMemo(() => {
    if (!userLat || !userLng || !marketLat || !marketLng) return null;
    const meters = getDistanceMeters(userLat, userLng, marketLat, marketLng);
    return (meters / 1000).toFixed(2); // convert to km
  }, [userLat, userLng, marketLat, marketLng]);

  const createUserDot = () =>
    L.divIcon({
      html: `<div class="rounded-full bg-[#FF8225] border-2 border-white" style="width:16px; height:16px;"></div>`,
      className: "",
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      popupAnchor: [0, -8],
    });

  useEffect(() => {
    if (!isOpen || !userLat || !userLng || !marketLat || !marketLng) return;

    // Remove old map instance
    if (mapRef.current) mapRef.current.remove();

    // Create new map
    const map = L.map(mapId);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors',
    }).addTo(map);

    const createCircularIcon = (iconUrl) =>
      L.divIcon({
        html: `
          <div class="flex items-center justify-center rounded-full border-2 border-blue-500 bg-white"
               style="width: ${markerSize}px; height: ${markerSize}px;">
            <img src="${iconUrl}" class="w-3/4 h-3/4 object-contain" />
          </div>
        `,
        className: "",
        iconSize: [markerSize, markerSize],
        iconAnchor: [markerSize / 2, markerSize],
        popupAnchor: [0, -markerSize],
      });

    // Fit map to show both points
    const bounds = L.latLngBounds([userLat, userLng], [marketLat, marketLng]);
    map.fitBounds(bounds, { padding: [50, 50] });

    // Custom user location circle
    L.circle([userLat, userLng], {
      radius: 8,
      color: "#FF8225",
      fillColor: "#FF8225",
      fillOpacity: 1,
    }).addTo(map);

    // Add route with default start marker and custom end marker
    L.Routing.control({
      waypoints: [
        L.latLng(userLat, userLng),
        L.latLng(marketLat, marketLng),
      ],
      lineOptions: { styles: [{ color: "#FF8225", weight: 4 }] },
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      routeWhileDragging: false,
      fitSelectedRoutes: false,
      createMarker: (i, waypoint) => {
        if (i === 0) return L.marker([userLat, userLng], { icon: createUserDot() }).addTo(map);
        return L.marker(waypoint.latLng, { icon: createCircularIcon(tamulokal) });
      },
    }).addTo(map);

  }, [isOpen, userLat, userLng, marketLat, marketLng, markerSize, mapId]);

  return (
    <div className="w-full overflow-hidden font-inter mt-2 border-b border-gray-200">
      {/* Dropdown button */}
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center px-4 py-3 text-sm font-medium transition-colors"
      >
        {!isOpen ? (
          <span className="flex items-center gap-2">
            <TbMapPin className="text-[var(--black)]" />
            {distance === null ? "Calculating..." : `${distance} km from you`}
          </span>
        ) : (
          <span>Market Address</span>
        )}

        {isOpen ? <TbChevronUp className="text-[var(--black)]" /> : <TbChevronDown className="text-[var(--black)]" />}
      </button>

      {/* Dropdown content */}
      {isOpen && (
        <div className="px-4 py-2 text-sm text-[#585858] flex flex-col gap-3">
          <p className="mb-2">{address}</p>
          <div id={mapId} className="h-64 w-full rounded-lg shadow-sm" />
          <button
            className="bg-[#FF8225] text-white rounded-xl text-sm font-medium hover:bg-[#e6731f] transition-colors w-full h-[35px]"
            onClick={() => navigate("/map")}
          >
            Get Direction
          </button>
        </div>
      )}
    </div>
  );
};

export default MarketDistanceDropdown;
