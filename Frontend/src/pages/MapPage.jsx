import React, { useState, useMemo, useEffect, useRef } from "react";
import MapDisplay from "../components/MapDisplay";
import MapMarketList from "../components/MapMarketList";
import useCurrentLocation from "../hooks/useCurrentLocation";
import useMarket from "../hooks/useMarket";

const MapPage = () => {
  const location = useCurrentLocation();
  const { markets: fetchedMarkets } = useMarket(null, location);

  const [markets, setMarkets] = useState([]);
  const [selectedMarketId, setSelectedMarketId] = useState(null);
  const [showList, setShowList] = useState(false);
  const [routeTo, setRouteTo] = useState(null);
  const mapRef = useRef(null);

  // ✅ distance filter (meters)
  const [distance, setDistance] = useState(10000);

  // ✅ store first routing instruction, update only if different
  const [firstStep, setFirstStep] = useState(null);

  useEffect(() => {
    setMarkets(fetchedMarkets || []);
  }, [fetchedMarkets]);

  console.log(markets);
  // ✅ Filter BEFORE passing to map
  const filteredMarkets = useMemo(() => {
    return markets.filter((m) => m.distance_meters <= distance);
  }, [markets, distance]);

  const markers = useMemo(() => {
    return filteredMarkets.map((m) => ({
      id: m.id,
      name: m.name,
      lat: m.latitude,
      lng: m.longitude,
    }));
  }, [filteredMarkets]);

  const center = useMemo(() => location, [location]);

  const handleMarkerClick = (marketId) => {
    setSelectedMarketId(marketId);
    setShowList(true);
    setRouteTo(null);
    setFirstStep(null);
  };

  const handleMarketFocus = (market) => {
    if (mapRef.current && market?.latitude && market?.longitude) {
      mapRef.current.flyTo([market.latitude, market.longitude], 15, 1);
    }
  };

  const handleCloseMarketList = () => {
    setShowList(false);
    setSelectedMarketId(null);
    setRouteTo(null);
    setFirstStep(null);
  };

  const handleGetDirection = (market) => {
    setRouteTo([market.latitude, market.longitude]);
    setShowList(false);
    setSelectedMarketId(null);
    setFirstStep(null);
  };

  // ✅ handler to update instruction only if changed
  const handleRouteInstruction = (step) => {
    if (!firstStep || firstStep.instruction !== step.instruction) {
      setFirstStep(step);
    }
  };

  return (
    <>
      <div className="relative h-screen w-screen z-0">
        <MapDisplay
          ref={mapRef}
          location={location}
          markers={markers}
          center={center}
          routeTo={routeTo}
          routeZoom={15}
          onMarkerClick={handleMarkerClick}
          onClose={handleCloseMarketList}
          showCloseButton={showList}
          distance={distance}
          onRouteFound={handleRouteInstruction} // ✅ only updates if instruction differs
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
{/* ✅ Instruction / Radius Slider UI */}
<div
  className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white px-4 py-2 rounded-xl shadow-md flex flex-col items-center justify-center"
  style={{ width: "220px", height: "52px" }} // fixed size
>
  {routeTo && firstStep ? (
    // Instruction text styled same as radius text
    <span className="text-sm font-medium text-center break-words">
      {firstStep.instruction}
    </span>
  ) : (
    <>
      <span className="text-sm font-medium text-center">Radius: {distance / 1000} km</span>
      <input
        type="range"
        min={5000}
        max={20000}
        step={5000}
        value={distance}
        className="w-48 mt-1 cursor-pointer"
        onChange={(e) => setDistance(Number(e.target.value))}
      />
    </>
  )}
</div>

    </>
  );
};

export default MapPage;
