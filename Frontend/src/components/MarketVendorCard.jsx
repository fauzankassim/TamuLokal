import React from "react";
import { TbStar, TbStarFilled } from "react-icons/tb";

const MarketVendorCard = ({ vendor }) => {
  const { name, image, avg_rating, total_reviews, lot } = vendor;

  const hasRating = avg_rating > 0 && total_reviews > 0;

  // Dummy tags (max 3)
  const tags = ["Fresh Produce", "Street Food", "Snacks & Drinks"];

  return (
    <div className="flex flex-col">
      {/* Vendor Image with shadow and border */}
      <img
        src={image || "/placeholder.jpg"}
        alt={name}
        className="w-full h-36 object-cover rounded-lg border border-gray-200 shadow-md"
      />

      {/* Vendor Name */}
      <h3 className="mt-2 text-base font-semibold text-gray-800 line-clamp-1">
        {name}
      </h3>


      {/* Tags */}
      <div className="mt-2 flex flex-wrap gap-1">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="text-[10px] bg-orange-100 text-orange-700 px-1 py-0.5 rounded-full whitespace-nowrap"
          >
            {tag}
          </span>
        ))}
      </div>

      
      {/* Lot and Rating Row */}
      <div className="mt-1 flex justify-between items-center text-sm text-gray-700">
        <span className="font-medium">Lot {lot} &middot;</span>

        <span className="flex items-center">
          {hasRating ? (
            <>
              <TbStarFilled className="text-orange-400 text-base mr-1" />
              {avg_rating.toFixed(1)} ({total_reviews})
            </>
          ) : (
            "No reviews yet"
          )}
        </span>
      </div>
    </div>
  );
};

export default MarketVendorCard;
