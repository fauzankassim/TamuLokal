import React, { useEffect, useState } from "react";
import { TbStarFilled } from "react-icons/tb";
import Header from "../components/Header";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";

const base_url = import.meta.env.VITE_BACKEND_API_URL;

const VisitorProductReviewPage = () => {
  const session = useAuth(true);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const visitor_id = session?.user?.id;

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchReviews = async () => {
      if (!visitor_id) return;
      setLoading(true);
      try {
        const res = await fetch(`${base_url}/visitor/${visitor_id}/product-review`);
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [visitor_id]);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading reviews...</div>;
  }

  return (
    <div className="relative w-full min-h-screen">
      <Header title="Your Product Reviews" />

      {/* Grid container */}
      <div className="max-w-6xl mx-auto p-4 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.length === 0 ? (
          <div className="text-gray-500 text-center py-10 col-span-full">
            You haven't reviewed any products yet.
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.review_id}
              className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col gap-4"
            >
              {/* Left: Image + Product Info */}
              <div className="flex items-center gap-3 p-4">
                <img
                  src={review.image || "/default-product.png"}
                  alt={review.name}
                  className="w-24 h-24 md:w-28 md:h-28 object-cover rounded"
                />
                <div className="flex flex-col">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800">{review.name}</h3>
                  <p className="text-sm md:text-base text-gray-600">
                    Price: RM {review.price} | Quantity: {review.quantity}
                  </p>
                </div>
              </div>

              {/* Review info */}
              <div className="p-4 flex flex-col justify-between space-y-3 border-t border-gray-100 relative">
                {/* Date top-right */}
                <p className="text-xs md:text-sm text-gray-400 absolute top-4 right-4">
                  {new Date(review.review_created_at).toLocaleDateString()}
                </p>

                <div>
                  <div className="flex items-center gap-2 mb-2 text-base md:text-base">
                    
                    <span className="font-medium text-gray-700">Rating: {review.rating}.0</span>
                    <TbStarFilled className="text-yellow-500" size={18} />
                  </div>

                  <div className="mb-2 text-base md:text-base">
                    <p className="text-gray-700">
                      <span className="font-medium">Review: </span>{review.review_text}
                    </p>
                  </div>

                  {review.review_image && (
                    <img
                      src={review.review_image}
                      alt="Review"
                      className="w-32 h-32 md:w-36 md:h-36 object-cover rounded mt-2"
                    />
                  )}
                </div>

                {/* Full-width Edit Review Button */}
                <div className="mt-4">
                  <button
                    className="w-full px-4 py-3 bg-[#FF8225] text-white rounded-md text-sm md:text-base font-medium hover:bg-[#e6731f] transition"
                    onClick={() => navigate(`${location.pathname}/${review.review_id}`)}
                  >
                    Edit Review
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VisitorProductReviewPage;
