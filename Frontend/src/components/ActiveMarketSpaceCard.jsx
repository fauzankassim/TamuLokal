import React, { useState, useEffect, useRef } from "react";

const ActiveMarketSpaceCard = ({ marketspace }) => {
  const [showManage, setShowManage] = useState(false);
  const cardRef = useRef(null);

  // Click outside → hide manage
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
        src={marketspace.market_image}
        alt={marketspace.market_name}
        className="w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* CENTER CONTENT */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          showManage ? "backdrop-blur-md" : "backdrop-blur-0"
        }`}
      >
        {/* MARKET NAME (tap to reveal Manage) */}
        <h3
          onClick={(e) => {
            e.stopPropagation();
            setShowManage(true);
          }}
          className={`text-white text-xl font-semibold text-center px-3 py-1 rounded-lg cursor-pointer transition-all duration-300
            ${showManage ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"}
          `}
        >
          {marketspace.market_name}<br/>(Lot {marketspace.lot})
        </h3>

        {/* MANAGE BUTTON */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            // navigate("/vendor/manage/" + marketspace.id)
          }}
          className={`
            px-6 py-2 rounded-xl
            backdrop-blur-xl bg-white/20
            text-white font-medium
            shadow-lg shadow-black/20
            border border-white/30
            transition-all duration-300
            hover:bg-white/30
            absolute
            ${showManage ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}
          `}
        >
          Manage
        </button>
      </div>
    </div>
  );
};

export default ActiveMarketSpaceCard;
