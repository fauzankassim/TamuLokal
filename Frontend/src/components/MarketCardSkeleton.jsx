import React from "react";

const MarketCardSkeleton = ({ height = 250 }) => {
  return (
    <div
      className="
        relative rounded-2xl overflow-hidden
        block snap-start flex-shrink-0 shadow-md
        animate-pulse
      "
      style={{ height: `${height}px` }}
    >
      {/* Image placeholder */}
      <div className="w-full h-full bg-gray-300" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      {/* Reviews placeholder */}
      <div className="absolute top-3 left-3 flex flex-col gap-1">
        <div className="bg-black/40 px-2 py-1 rounded-lg w-16 h-4" />
      </div>

      {/* Distance placeholder */}
      <div className="absolute top-3 right-3 text-xs bg-black/40 px-2 py-1 rounded-lg w-12 h-4" />

      {/* Bottom info placeholder */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-2">
        <div className="h-5 w-3/4 bg-gray-400 rounded" /> {/* Market name */}
        <div className="h-4 w-1/2 bg-gray-400 rounded-full flex items-center" /> {/* Open/Closed */}
      </div>

      {/* Arrow CTA placeholder */}
      <div className="absolute bottom-3 right-3 w-6 h-6 bg-gray-400 rounded-full" />
    </div>
  );
};

export default MarketCardSkeleton;
