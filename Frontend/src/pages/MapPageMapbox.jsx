import React, { useState, useMemo, useEffect, useRef } from "react";
import MapboxMap from "../components/MapboxMap";
import MapMarketList from "../components/MapMarketList";
import useCurrentLocation from "../hooks/useCurrentLocation";
import useMarket from "../hooks/useMarket";
import Spinner from "../components/Spinner";
import { getDistanceMeters } from "../utils/calculateMarketDistance";


const MapPageMapbox = () => {
  const location = useCurrentLocation();
  const { markets: fetchedMarkets, loading } = useMarket(null, location);

  const [markets, setMarkets] = useState([]);
  const [selectedMarketId, setSelectedMarketId] = useState(null);
  const [showList, setShowList] = useState(false);
  const [routeTo, setRouteTo] = useState(null);
  const [routeSteps, setRouteSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [routeCompleted, setRouteCompleted] = useState(false);
  const mapRef = useRef(null);

  const [distance, setDistance] = useState(20000);

  useEffect(() => {
    setMarkets(fetchedMarkets || []);
  }, [fetchedMarkets]);

  const filteredMarkets = useMemo(() => {
    if (!location) return [];
    return (markets || [])
      .map((m) => ({
        ...m,
        distance_meters: getDistanceMeters(location[0], location[1], m.latitude, m.longitude),
      }))
      .filter((m) => m.distance_meters <= distance);
  }, [markets, location, distance]);

  const markers = useMemo(
    () =>
      filteredMarkets.map((m) => ({
        id: m.id,
        name: m.name,
        lat: m.latitude,
        lng: m.longitude,
      })),
    [filteredMarkets]
  );

  const handleMarkerClick = (marketId) => {
    setSelectedMarketId(marketId);
    setShowList(true);
    setRouteTo(null);
    setRouteSteps([]);
    setCurrentStepIdx(0);
    setRouteCompleted(false);
  };

  const handleMarketFocus = (market) => {
    if (mapRef.current && market?.latitude && market?.longitude) {
      mapRef.current.flyTo([market.latitude, market.longitude], 15);
    }
  };

  const handleCloseMarketList = () => {
    setShowList(false);
    setSelectedMarketId(null);
    setCurrentStepIdx(0);
    setRouteCompleted(false);
  };

  const handleGetDirection = (market) => {
    setRouteTo([market.latitude, market.longitude]);
    setShowList(false);
    setSelectedMarketId(null);
    setRouteSteps([]);
    setCurrentStepIdx(0);
    setRouteCompleted(false);
  };

  // Receive full steps from Mapbox (via MapboxMap)
  const handleRouteInstruction = (steps = []) => {
    setRouteSteps(steps);
    setCurrentStepIdx(0);
    setRouteCompleted(false);
  };

  const handleCancelRoute = () => {
    setRouteTo(null);
    setRouteSteps([]);
    setCurrentStepIdx(0);
    setRouteCompleted(false);
  };

  // Auto-advance to next step when user gets near the current maneuver location
  useEffect(() => {
    if (!routeTo || !routeSteps.length || !location) return;
    if (routeCompleted) return;
    if (currentStepIdx >= routeSteps.length) return;

    const step = routeSteps[currentStepIdx];
    const maneuverLoc = step?.maneuver?.location; // [lng, lat]
    if (!maneuverLoc) return;

    const [lng, lat] = maneuverLoc;
    const dist = getDistanceMeters(location[0], location[1], lat, lng);
    const threshold = currentStepIdx === routeSteps.length - 1 ? 20 : 30; // tighter for final step

    if (dist <= threshold) {
      if (currentStepIdx === routeSteps.length - 1) {
        setRouteCompleted(true);
      } else {
        setCurrentStepIdx((i) => i + 1);
      }
    }
  }, [location, routeTo, routeSteps, currentStepIdx, routeCompleted]);

  const currentInstruction =
    routeCompleted && routeSteps.length
      ? "Arrived at destination"
      : routeSteps[currentStepIdx]?.maneuver?.instruction ||
        routeSteps[currentStepIdx]?.name ||
        null;

  if (loading) return <Spinner loading />;

  return (
    <>
      <div className="relative h-screen w-screen z-0">
        <MapboxMap
          ref={mapRef}
          location={location}
          markers={markers}
          distance={distance}
          routeTo={routeTo}
          onMarkerClick={handleMarkerClick}
          onClose={handleCloseMarketList}
          onRouteFound={handleRouteInstruction}
          onCancelRoute={handleCancelRoute}
        />
      </div>

      {showList && (
        <MapMarketList
          markets={filteredMarkets}
          userLocation={location}
          selectedMarketId={selectedMarketId}
          onMarketFocus={handleMarketFocus}
          onGetDirection={handleGetDirection}
        />
      )}

      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white px-4 py-2 rounded-xl shadow-md flex flex-col items-center justify-center"
        style={{ width: "240px", minHeight: "52px" }}
      >
        {routeTo && (currentInstruction || routeCompleted) ? (
          <span className="text-sm font-medium text-center break-words">
            {currentInstruction || "Loading directions..."}
          </span>
        ) : (
          <>
            <span className="text-sm font-medium text-center">Radius ( {distance / 1000} km )</span>
            <input
              type="range"
              min={5000}
              max={20000}
              step={5000}
              value={distance}
              className="w-48 mt-1 cursor-pointer accent-[#FF8225]"
              onChange={(e) => setDistance(Number(e.target.value))}
            />
          </>
        )}
      </div>
    </>
  );
};

export default MapPageMapbox;