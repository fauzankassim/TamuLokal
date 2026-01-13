// src/pages/BusinessMarketReviewPage.jsx
import React, { useEffect, useState } from "react";
import { TbChevronLeft } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";
import MarketReviewCard from "../components/MarketReviewCard";
import Header from "../components/Header";

const base_url = import.meta.env.VITE_BACKEND_API_URL;

const BusinessMarketReviewPage = () => {
  const navigate = useNavigate();
  const { market_id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!market_id) return;

    const fetchReviews = async () => {
      try {
        const res = await fetch(`${base_url}/market/${market_id}/review`);
        if (!res.ok) throw new Error("Failed to fetch reviews");

        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [market_id]);

  const toggleReviewVisibility = async (reviewId, nextHide) => {
    try {
      await fetch(`${base_url}/market/${market_id}/review?id=${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hide: nextHide }),
      });

      // optimistic update
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId ? { ...r, hide: nextHide } : r
        )
      );
    } catch (err) {
      console.error("Failed to update review visibility", err);
      alert("Failed to update review visibility");
    }
  };

  return (
    <div className="w-screen h-full flex flex-col relative">
      {/* Header */}
      <Header title={"Market Reviews"} />

      {/* Content */}
      <div className="flex-1 px-4 py-4 overflow-y-auto space-y-4">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 text-sm">No reviews found</p>
        ) : (
          reviews.map((review) => (
            <MarketReviewCard
              key={review.id}
              review={review}
              onToggleHide={toggleReviewVisibility}
              isOwnProfile={true}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BusinessMarketReviewPage;
