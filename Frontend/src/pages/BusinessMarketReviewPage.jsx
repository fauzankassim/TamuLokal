// src/pages/BusinessMarketReviewPage.jsx
import React, { useEffect, useState } from "react";
import { TbChevronLeft } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";
import MarketReviewCard from "../components/MarketReviewCard";

const base_url = import.meta.env.VITE_BACKEND_API_URL;

const BusinessMarketReviewPage = () => {
  const navigate = useNavigate();
  const { market_id } = useParams(); // get market_id from route
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

  return (
    <div className="w-screen h-full flex flex-col relative">
      {/* ===== Header ===== */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-700 hover:text-orange-500 transition"
          >
            <TbChevronLeft className="text-2xl" />
          </button>

          <h1 className="text-xl font-semibold text-gray-800">
            Market Reviews
          </h1>
        </div>
      </div>

      {/* ===== Content ===== */}
      <div className="flex-1 px-4 overflow-y-auto space-y-4 pb-4">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 text-sm">No reviews found</p>
        ) : (
          reviews.map((review) => (
            <MarketReviewCard key={review.id} review={review} />
          ))
        )}
      </div>
    </div>
  );
};

export default BusinessMarketReviewPage;
