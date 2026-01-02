import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useDistance } from "../hooks/useDistance";

const MapMarketCard = ({ market, userLocation, onGetDirection }) => { // 👈 Add onGetDirection prop
  const { distance, loading } = useDistance(
    market.latitude,
    market.longitude,
    userLocation
  );

  const isOpen = useMemo(() => {
    if (!market.open_time || !market.close_time) return false;
    const openDate = new Date(market.open_time);
    const closeDate = new Date(market.close_time);
    const now = new Date();
    const openMinutes = openDate.getHours() * 60 + openDate.getMinutes();
    const closeMinutes = closeDate.getHours() * 60 + closeDate.getMinutes();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    if (closeMinutes < openMinutes) {
      return nowMinutes >= openMinutes || nowMinutes <= closeMinutes;
    }
    return nowMinutes >= openMinutes && nowMinutes <= closeMinutes;
  }, [market.open_time, market.close_time]);

  return (
    <div className="bg-white rounded-2xl shadow-[0_0_4px_rgba(0,0,0,0.25)] font-inter w-[300px] h-[180px] p-3 flex flex-col items-center">
      <img
        src={market.image}
        alt={market.name}
        className="w-[280px] h-[70px] object-cover rounded-xl"
      />

      <div className="w-full flex justify-between items-start mt-3 px-1">
        <h3 className="w-1/2 text-sm font-semibold text-[#1E1E1E] leading-tight break-words">
          {market.name}
        </h3>
        <div className="w-1/2 flex justify-end items-center text-xs gap-1 whitespace-nowrap">
          <span className={isOpen ? "text-[var(--green)]" : "text-[var(--red)]"}>
            {isOpen ? "Open" : "Closed"}
          </span>
          <span>| {loading ? "Loading..." : `${distance} km`}</span>
        </div>
      </div>

      <div className="flex justify-between w-full mt-3 px-1 gap-2">
        <button
          onClick={() => onGetDirection && onGetDirection(market)} // 👈 Use the handler
          className="w-1/2 h-[30px] rounded-xl border border-[#FF8225] text-[#FF8225] text-sm font-medium hover:bg-[#FF8225] hover:text-white transition-colors"
        >
          Get Direction
        </button>

        <NavLink
          to={`/market/${market.id}`}
          className="w-1/2 h-[30px] rounded-xl bg-[#FF8225] text-white text-sm font-medium flex items-center justify-center hover:bg-[#e6731f] transition-colors"
        >
          Check
        </NavLink>
      </div>
    </div>
  );
};

export default MapMarketCard;