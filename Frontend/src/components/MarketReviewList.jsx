// src/components/MarketReviewList.jsx
import React, { useEffect, useState } from "react";
import MarketReviewCard from "./MarketReviewCard";

const MarketReviewList = ({ marketId }) => {
  const [reviews, setReviews] = useState([]);
  const base_url = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${base_url}/market/${marketId}/review`);
        const data = await res.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [marketId]);

  return (
    <div className="space-y-4">
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <MarketReviewCard key={review.id} review={review} />
        ))
      ) : (
        <p className="text-center text-gray-500 py-8">No reviews yet.</p>
      )}
    </div>
  );
};

export default MarketReviewList;
