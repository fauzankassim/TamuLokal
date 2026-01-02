import React, { useEffect, useState } from "react";
import { TbStar, TbStarFilled, TbStarHalfFilled } from "react-icons/tb";

const MarketRating = ({ marketId }) => {
  const [ratingData, setRatingData] = useState(null);
  const base_url = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await fetch(`${base_url}/market/${marketId}/rating`);
        const data = await res.json();
        setRatingData(data);
      } catch (err) {
        console.error("Error fetching market rating:", err);
      }
    };

    fetchRating();
  }, [marketId]);

  if (!ratingData) {
    return <p className="text-gray-500 text-center">Loading rating...</p>;
  }

  // Support two response shapes:
  // 1) { rating_counts: {1: x, 2: y, ...}, total_reviews, average_rating }
  // 2) { rating_1, rating_2, rating_3, rating_4, rating_5, total_reviews, average_rating }
  const {
    average_rating = 0,
    total_reviews = 0,
    rating_counts,
    rating_1,
    rating_2,
    rating_3,
    rating_4,
    rating_5,
  } = ratingData;

  // Build counts [5,4,3,2,1]
  let counts;
  if (rating_counts && typeof rating_counts === "object") {
    counts = [
      rating_counts[5] || 0,
      rating_counts[4] || 0,
      rating_counts[3] || 0,
      rating_counts[2] || 0,
      rating_counts[1] || 0,
    ];
  } else {
    // from separate fields
    counts = [
      Number(rating_5 || 0),
      Number(rating_4 || 0),
      Number(rating_3 || 0),
      Number(rating_2 || 0),
      Number(rating_1 || 0),
    ];
  }

  // total from counts, fall back to total_reviews (and then 1 to avoid div-by-zero)
  const sumCounts = counts.reduce((a, b) => a + b, 0);
  const total = sumCounts || total_reviews || 1;

  const roundedRating = Math.round((Number(average_rating) || 0) * 2) / 2;

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(roundedRating)) {
        stars.push(
          <TbStarFilled key={i} className="text-[var(--orange)] text-lg" />
        );
      } else if (i - 0.5 === roundedRating) {
        stars.push(
          <TbStarHalfFilled key={i} className="text-[var(--orange)] text-lg" />
        );
      } else {
        stars.push(<TbStar key={i} className="text-[var(--orange)] text-lg" />);
      }
    }
    return stars;
  };

  return (
    <div className="flex items-center justify-between p-2 gap-4">
      {/* Left side — rating summary */}
      <div className="flex flex-col items-center justify-center min-w-[100px]">
        <h2 className="text-4xl font-bold text-[var(--black)]">
          {Number(average_rating).toFixed(1)}
        </h2>
        <div className="flex gap-1 mt-1">{renderStars()}</div>
        <p className="text-sm text-[var(--gray)] mt-1">{total_reviews} reviews</p>
      </div>

      {/* Divider */}
      <div className="h-20 w-px bg-[var(--gray)]"></div>

      {/* Right side — rating distribution (5 -> 1) */}
      <div className="flex flex-col justify-between w-full space-y-1">
        {[5, 4, 3, 2, 1].map((num, idx) => {
          const count = counts[idx] || 0; // idx 0 => 5 stars, idx 4 => 1 star
          const percent = total ? (count / total) * 100 : 0;

          return (
            <div key={num} className="flex items-center gap-1">
              <span className="w-4 text-sm text-[var(--gray)]">{num}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[var(--orange)] h-full rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketRating;
