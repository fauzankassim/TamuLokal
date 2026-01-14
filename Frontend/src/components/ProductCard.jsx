import React, { useEffect, useState } from "react";
import { TbPencil, TbEye, TbEyeOff, TbStar, TbChevronRight, TbStarFilled } from "react-icons/tb";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const base_url = import.meta.env.VITE_BACKEND_API_URL;

const ProductCard = ({
  product,
  isOwnProfile,
  showAvailabilityToggle = false,
}) => {

  const navigate = useNavigate();
  const { id: spaceId } = useParams(); // marketspace id
  const location = useLocation();
  const [available, setAvailable] = useState(true);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [updating, setUpdating] = useState(false);

  /* ----------------------------------
   * Check availability on mount
   * ---------------------------------- */
  useEffect(() => {
    if (!showAvailabilityToggle || !spaceId) return;

    const checkAvailability = async () => {
      setLoadingAvailability(true);
      try {
        const res = await fetch(
          `${base_url}/marketspace/${spaceId}/product?product_id=${product.id}`
        );
        if (!res.ok) throw new Error("Failed to check availability");

        const data = await res.json();
        if (data) setAvailable(true);
        else setAvailable(false);
      } catch (err) {
        console.error("Failed to check availability", err);
        setAvailable(false);
      } finally {
        setLoadingAvailability(false);
      }
    };

    checkAvailability();
  }, [showAvailabilityToggle, spaceId, product.id]);

  /* ----------------------------------
   * Toggle availability
   * ---------------------------------- */
  const toggleAvailability = async (e) => {
    e.stopPropagation();
    if (updating || loadingAvailability) return;

    const nextState = !available;
    setAvailable(nextState);
    setUpdating(true);

    try {
      let res;

      if (nextState) {
        // Make available → INSERT
        res = await fetch(
          `${base_url}/marketspace/${spaceId}/product`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ product_id: product.id }),
          }
        );
      } else {
        // Make unavailable → DELETE
        res = await fetch(
          `${base_url}/marketspace/${spaceId}/product?product_id=${product.id}`,
          { method: "DELETE" }
        );
      }

      if (!res.ok) throw new Error("Availability update failed");
    } catch (err) {
      console.error(err);
      setAvailable(!nextState); // revert
      alert("Failed to update product availability");
    } finally {
      setUpdating(false);
    }
  };

  /* ----------------------------------
   * UI
   * ---------------------------------- */
  return (
    <div
      className={`relative rounded-xl overflow-hidden transition
        ${
          available
            ? "bg-white shadow-sm hover:shadow-md"
            : "bg-gray-100 opacity-60"
        }
      `}
    >
      {/* Image */}
      <div className="w-full aspect-square bg-gray-100">
        <img
          src={product.image || "/default-product.png"}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Availability badge */}
      {!available && (
        <div className="absolute top-2 left-2 text-xs bg-black/70 text-white px-2 py-0.5 rounded">
          Unavailable
        </div>
      )}

      {/* Rating badge */}
      <div
        onClick={() => {
          if (isOwnProfile) {
            navigate(`/business/product/${product.id}`);
          }
        }}
        className={`absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full shadow
          flex items-center gap-1 text-xs
          ${isOwnProfile ? "cursor-pointer hover:bg-white" : ""}
        `}
      >
        {product.review_count > 0 ? (
          <>
            <TbStarFilled className="text-yellow-500" size={14} />
            <span className="font-medium text-gray-700">
              {product.avg_rating} ({product.review_count})
            </span>
          </>
        ) : (
          <span className="text-gray-500">No reviews</span>
        )}
      </div>


      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800 truncate">
          {product.name}
        </h3>
        <p className="text-[#FF8225] font-medium text-sm mt-1">
          RM {product.price || "0.00"}
        </p>
      </div>

      {/* Availability toggle */}
      {showAvailabilityToggle && !loadingAvailability && (
        <button
          onClick={toggleAvailability}
          disabled={updating}
          className="absolute top-2 right-2 bg-white/90 backdrop-blur p-1.5 rounded-full shadow hover:bg-white transition"
          title={available ? "Set Unavailable" : "Set Available"}
        >
          {available ? (
            <TbEye className="text-green-600" size={18} />
          ) : (
            <TbEyeOff className="text-red-500" size={18} />
          )}
        </button>
      )}

      {/* Edit button */}
      {isOwnProfile && (
        <button
          onClick={() => navigate(`/business/product/${product.id}/edit`)}
          className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 transition"
        >
          <TbPencil className="text-gray-600" size={20} />
        </button>
      )}
      {/* Review button (for non-own profile) */}
      {!isOwnProfile && (
        <button
          onClick={() => navigate(`${location.pathname}/product/${product.id}`)}
          className="absolute bottom-2 right-2 p-1 transition"
          title="Leave a review"
        >
          <TbChevronRight className="text-yellow-500" size={20} />
        </button>
      )}
    </div>
  );
};

export default ProductCard;
