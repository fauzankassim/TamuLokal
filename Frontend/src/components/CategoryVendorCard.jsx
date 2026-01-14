import React, { useEffect, useState } from "react";
import { TbStarFilled, TbArrowRight } from "react-icons/tb";
import { NavLink } from "react-router-dom";

const CategoryVendorCard = ({ vendor }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = (vendor.product_images || []).slice(0, 3);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="relative w-full max-w-md aspect-square rounded-xl overflow-hidden shadow-lg border border-gray-200">
      {/* Product Image */}
      <img
        src={images[currentImageIndex]}
        alt={vendor.vendor_name}
        className="w-full h-full object-cover"
      />

      {/* Overlay for vendor info */}
      <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Vendor Image */}
          <img
            src={vendor.vendor_image || "/placeholder.jpg"}
            alt={vendor.vendor_name}
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          {/* Vendor Name & Rating */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-sm line-clamp-1">
              {vendor.vendor_name}
            </h3>
            <div className="flex items-center text-xs gap-1">
              <TbStarFilled className="text-yellow-400 text-xs" />
              {vendor.avg_rating?.toFixed(1) ?? "0.0"}
            </div>
          </div>
        </div>

        {/* Arrow */}
        <NavLink
          to={`/vendor/${vendor.vendor_id}`}
          className="text-gray-800 bg-white p-2 rounded-full hover:bg-orange-100 transition"
        >
          <TbArrowRight className="text-base" />
        </NavLink>
      </div>
    </div>
  );
};

export default CategoryVendorCard;
