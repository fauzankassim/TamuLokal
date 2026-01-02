import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const OrganizerMarketSpaceCard = ({ market }) => {
  const navigate = useNavigate();
  const [showManage, setShowManage] = useState(false);
  const cardRef = useRef(null);

  const hasPending = market.pending_applications > 0;

  // Hide manage button when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setShowManage(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg group cursor-pointer transition-transform hover:scale-105 hover:shadow-2xl"
    >
      {/* Background Image */}
      <img
        src={market.market_image}
        alt={market.market_name}
        className="w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Pending Badge */}
      {hasPending && (
        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow">
          {market.pending_applications} Pending
        </div>
      )}

      {/* CENTER CONTENT */}
      <div className={`absolute inset-0 flex items-center justify-center`}>
        <h3 className={`text-white text-xl font-semibold text-center`}>
          {market.market_name}
        </h3>
      </div>
    </div>
  );
};

export default OrganizerMarketSpaceCard;
