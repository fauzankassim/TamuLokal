import React from "react";
import { NavLink } from "react-router-dom";

const MarketOwnershipCard = ({ market }) => {
  const base_url = import.meta.env.VITE_BACKEND_API_URL;

  const handleClaim = () => {
    console.log("Claim market:", market.id);
  };

  const getActionButton = () => {
    if (market.isavailable > 0)
      return (
        <button
          onClick={handleClaim}
          className="bg-[#FF8225] hover:bg-[#ff9243] text-white rounded-xl text-sm font-medium shadow-sm transition w-[150px] h-[35px]"
        >
          Claim
        </button>
      );

    if (market.isactive > 0)
      return (
        <NavLink
          to={`/market/manage/${market.id}`}
          className="bg-[#22C55E] hover:bg-[#16a34a] text-white rounded-xl text-sm font-medium shadow-sm transition w-[150px] h-[35px] flex items-center justify-center"
        >
          Manage
        </NavLink>
      );

    if (market.ispending > 0)
      return (
        <NavLink
          to={`/market/application/${market.id}`}
          className="bg-[#FACC15] hover:bg-[#eab308] text-[#1E1E1E] rounded-xl text-sm font-medium shadow-sm transition w-[150px] h-[35px] flex items-center justify-center"
        >
          View Application
        </NavLink>
      );

    if (market.isrejected > 0)
      return (
        <button
          onClick={() => console.log("Re-apply:", market.id)}
          className="bg-[#EF4444] hover:bg-[#dc2626] text-white rounded-xl text-sm font-medium shadow-sm transition w-[150px] h-[35px]"
        >
          Re-apply
        </button>
      );

    return null;
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-[0_0_4px_rgba(0,0,0,0.25)] overflow-hidden font-inter w-full max-w-[600px] mx-auto h-[250px] flex flex-col">
      {/* 🖼️ Image */}
      <div className="relative">
        <img
          src={market.image}
          alt={market.name}
          className="w-full h-[140px] object-cover"
        />
      </div>

      {/* 🏷️ Details */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="text-base font-semibold text-[#1E1E1E] truncate">
          {market.name}
        </h3>

        {/* Buttons row */}
        <div className="mt-auto flex justify-center gap-3">
          {getActionButton()}

          <NavLink
            to={`/market/${market.id}`}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl text-sm font-medium shadow-sm transition w-[150px] h-[35px] flex items-center justify-center"
          >
            Check
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default MarketOwnershipCard;
