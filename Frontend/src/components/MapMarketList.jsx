import { useRef, useEffect, useState } from "react";
import MapMarketCard from "./MapMarketCard";

const MapMarketList = ({
  markets = [],
  userLocation,
  selectedMarketId,
  onMarketFocus,
  onGetDirection, // 👈 Add this prop
}) => {
  const listRef = useRef(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  // Smooth scroll to selected card when marker clicked
  useEffect(() => {
    if (!selectedMarketId || !listRef.current) return;
    const card = listRef.current.querySelector(`[data-id='${selectedMarketId}']`);
    if (card) {
      card.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedMarketId]);

  // Detect scroll and trigger map recenter
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    let timeout;
    const handleScroll = () => {
      setIsUserScrolling(true);
      clearTimeout(timeout);

      // When user stops scrolling, detect centered card
      timeout = setTimeout(() => {
        setIsUserScrolling(false);

        const listRect = list.getBoundingClientRect();
        const centerX = listRect.left + listRect.width / 2;

        let closestCard = null;
        let minDistance = Infinity;

        list.querySelectorAll(".map-card").forEach((card) => {
          const rect = card.getBoundingClientRect();
          const cardCenterX = rect.left + rect.width / 2;
          const distance = Math.abs(centerX - cardCenterX);
          if (distance < minDistance) {
            minDistance = distance;
            closestCard = card;
          }
        });

        if (closestCard) {
          const marketId = closestCard.dataset.id;
          const market = markets.find((m) => m.id === marketId);
          if (market && onMarketFocus) {
            onMarketFocus(market);
          }
        }
      }, 150);
    };

    list.addEventListener("scroll", handleScroll);
    return () => list.removeEventListener("scroll", handleScroll);
  }, [markets, onMarketFocus]);

  return (
    <div className="fixed bottom-[calc(var(--navbar-height)+20px)] left-0 right-0 z-[30] flex justify-center pointer-events-none">
      <div
        ref={listRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth 
          no-scrollbar px-[calc(50%-150px)] pb-2 pointer-events-auto"
      >
        {markets.map((market) => (
          <div
            key={market.id}
            data-id={market.id}
            className="map-card snap-center flex-shrink-0"
          >
            <MapMarketCard
              market={market}
              userLocation={userLocation}
              onGetDirection={onGetDirection} // 👈 Pass the handler
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapMarketList;