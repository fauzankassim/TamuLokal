// src/components/MarketReviewCard.jsx
import React from "react";
import { TbStarFilled, TbStar, TbEye, TbEyeOff } from "react-icons/tb";

const MarketReviewCard = ({ review, onToggleHide, isOwnProfile = false }) => {
  const createdDate = new Date(review.created_at);

  // Smart date formatting
  const formatDate = () => {
    const now = new Date();
    const diffMs = now - createdDate;
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
      const hoursAgo = Math.floor(diffHours);
      return hoursAgo === 0 ? "Just now" : `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`;
    }

    if (diffHours < 48) return "Yesterday";

    if (now.getFullYear() === createdDate.getFullYear()) {
      return createdDate.toLocaleDateString(undefined, { day: "numeric", month: "short" });
    }

    return createdDate.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  };

  const isHidden = review.hide;
  const containerClasses = `
    relative border rounded-lg p-4 shadow-sm transition
    ${isHidden && !isOwnProfile ? "hidden" : ""}
    ${isHidden && isOwnProfile ? "bg-gray-50 border-dashed opacity-80" : "bg-white border-gray-200"}
  `;

  return (
    <div className={containerClasses}>
      {/* Hide/Unhide button (owner only) */}
      {isOwnProfile && (
        <button
          onClick={() => onToggleHide(review.id, !review.hide)}
          className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow hover:bg-gray-100 transition"
          title={isHidden ? "Unhide review" : "Hide review"}
        >
          {isHidden ? (
            <TbEyeOff className="text-red-500" size={18} />
          ) : (
            <TbEye className="text-green-600" size={18} />
          )}
        </button>
      )}

      {/* Hidden badge */}
      {isHidden && isOwnProfile && (
        <span className="absolute top-3 left-3 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
          Hidden from public
        </span>
      )}

      {/* Header: Avatar + Name */}
      <div className="flex items-center mb-2">
        <img
          src={review.visitor.image || "/default-avatar.png"}
          alt={review.visitor.username || "Visitor"}
          className="w-10 h-10 rounded-full mr-3 object-cover"
        />
        <div className="flex-1">
          <p className="font-semibold text-gray-800">{review.visitor.fullname || "Anonymous"}</p>
          {review.visitor.username && (
            <p className="text-xs text-gray-500">@{review.visitor.username}</p>
          )}

          {/* Stars + Date */}
          <div className="flex justify-between items-center mt-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) =>
                i <= review.rating ? (
                  <TbStarFilled key={i} className="text-yellow-400 text-sm" />
                ) : (
                  <TbStar key={i} className="text-gray-300 text-sm" />
                )
              )}
            </div>
            <p className="text-xs text-gray-500">{formatDate()}</p>
          </div>
        </div>
      </div>

      {/* Review text */}
      <p className="text-gray-700 text-sm mt-2">{review.review}</p>

      {/* Optional review image */}
      {review.image && (
        <img
          src={review.image}
          alt="Review"
          className="w-full max-w-xs h-auto mt-2 rounded-lg object-cover"
        />
      )}
    </div>
  );
};

export default MarketReviewCard;
