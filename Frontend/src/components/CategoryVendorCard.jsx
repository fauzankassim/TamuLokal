import React, { useEffect, useState } from "react";
import { TbStarFilled, TbArrowRight } from "react-icons/tb";
import { NavLink } from "react-router-dom";

const CategoryVendorCard = ({ vendor }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Only use product images (max 3)
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
    <div className="flex flex-col w-full rounded-xl overflow-hidden shadow-lg border border-gray-200">
      {/* Product Image */}
      <div className="w-full aspect-square overflow-hidden">
        <img
          src={images[currentImageIndex]}
          alt={vendor.vendor_name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Vendor info + rating + arrow */}
      <div className="flex items-center justify-between p-3 bg-white">
        <div className="flex items-center gap-2">
          {/* Vendor Image */}
          <img
            src={vendor.vendor_image || "/placeholder.jpg"}
            alt={vendor.vendor_name}
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          {/* Vendor Name & Rating */}
          <div className="flex flex-col">
            <h3 className="text-gray-800 font-semibold text-sm line-clamp-1">
              {vendor.vendor_name}
            </h3>
            <div className="flex items-center text-gray-600 text-xs gap-1">
              <TbStarFilled className="text-yellow-400 text-xs" />
              {vendor.avg_rating?.toFixed(1) ?? "0.0"} ({vendor.total_reviews})
            </div>
          </div>
        </div>

        {/* Arrow */}
        <NavLink
          to={`/vendor/${vendor.vendor_id}`}
          className="text-gray-800 bg-gray-100 p-2 rounded-full hover:bg-orange-100 transition"
        >
          <TbArrowRight className="text-base" />
        </NavLink>
      </div>
    </div>
  );
};

export default CategoryVendorCard;
