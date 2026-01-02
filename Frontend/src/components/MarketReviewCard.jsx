// src/components/MarketReviewCard.jsx
import React from "react";
import { TbStarFilled, TbStar } from "react-icons/tb";

const MarketReviewCard = ({ review }) => {
  const createdDate = new Date(review.created_at);

  // ✅ Smart date formatting
  const formatDate = () => {
    const now = new Date();
    const diffMs = now - createdDate;
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
      const hoursAgo = Math.floor(diffHours);
      return hoursAgo === 0 ? "Just now" : `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`;
    }

    if (diffHours < 48) {
      return "Yesterday";
    }

    if (now.getFullYear() === createdDate.getFullYear()) {
      return createdDate.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
      });
    }

    return createdDate.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      {/* Header: Avatar + Info */}
      <div className="flex items-center mb-2">
        <img
          src={review.visitor.image || "/default-avatar.png"}
          alt={review.visitor.username}
          className="w-10 h-10 rounded-full mr-3 object-cover"
        />
        <div className="flex-1">
          <p className="font-semibold text-gray-800">{review.visitor.username}</p>

          {/* Stars + Date below username */}
          <div className="flex justify-between items-center">
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

      {/* ✅ Review text below avatar, username, stars, and date */}
      <p className="text-gray-700 text-sm mt-2">{review.review}</p>
    </div>
  );
};

export default MarketReviewCard;
