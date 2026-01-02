import React, { useState } from "react";
import { TbStar, TbStarFilled } from "react-icons/tb";

const MarketReviewForm = ({ market, type = "new", onClose }) => {
  const [rating, setRating] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [review, setReview] = useState("");

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ rating, photo, review });
    // handle post to Supabase later
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col overflow-y-auto">
      {/* Market Image */}
      <img
        src={market.image}
        alt={market.name}
        className="w-full h-56 object-cover"
      />

      {/* Scrollable content */}
      <div className="p-4 flex flex-col gap-6 pb-32">
        <h2 className="text-lg font-semibold text-gray-800 text-center">
          {market.name}
        </h2>

        {/* Rating */}
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setRating(num)}
              className="text-3xl text-orange-400"
            >
              {num <= rating ? <TbStarFilled /> : <TbStar />}
            </button>
          ))}
        </div>

        {/* Review Text */}
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review..."
          rows="4"
          className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
        ></textarea>
      </div>

      {/* Fixed Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex flex-col gap-3">
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition"
        >
          Submit
        </button>
        <button
          onClick={onClose}
          className="w-full py-3 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default MarketReviewForm;
