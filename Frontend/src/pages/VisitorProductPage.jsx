import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TbStarFilled, TbEye, TbEyeOff } from "react-icons/tb";
import Header from "../components/Header";

const base_url = import.meta.env.VITE_BACKEND_API_URL;

const categoriesMap = [
  { id: 1, name: "Fresh Produce", emoji: "🍅" },
  { id: 2, name: "Street Food", emoji: "🍢" },
  { id: 3, name: "Snacks & Drinks", emoji: "🧃" },
  { id: 4, name: "Clothing", emoji: "👕" },
  { id: 5, name: "Handicrafts", emoji: "🧵" },
  { id: 6, name: "Fruits", emoji: "🍇" },
  { id: 7, name: "Seafood", emoji: "🦐" },
  { id: 8, name: "Performance", emoji: "🎷" },
];

const VisitorProductPage = ({ isOwnProfile = false }) => {
    const location = useLocation();
    console.log(isOwnProfile);
    const navigate = useNavigate();
    const { product_id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    console.log(data);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${base_url}/product/${product_id}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [product_id]);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  if (!data || !data.product) {
    return <div className="p-6 text-center text-red-500">Product not found</div>;
  }

  const { product, categories } = data;

  const resolvedCategories = categories.map((c) =>
    categoriesMap.find((cat) => cat.id === c.category_id)
  );

  const toggleReviewVisibility = async (reviewId, nextHide) => {
  try {
    await fetch(`${base_url}/product/${product_id}/review?id=${reviewId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hide: nextHide }),
    });

    // Optimistic UI update
    setData((prev) => ({
      ...prev,
      product: {
        ...prev.product,
        reviews: prev.product.reviews.map((r) =>
          r.id === reviewId ? { ...r, hide: nextHide } : r
        ),
      },
    }));
  } catch (err) {
    console.error("Failed to update review visibility", err);
    alert("Failed to update review visibility");
  }
};

  return (
  <div className="relative w-full h-screen">
    <Header title={product.name} />
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Product card */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
    <div className="flex flex-col md:flex-row">
      {/* Image */}
      <div className="w-full md:w-1/4 aspect-square flex-shrink-0">
        <img
          src={product.image || "/default-product.png"}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="p-4 space-y-2 flex-1">
        <h1 className="text-xl font-semibold text-gray-800">
          {product.name}
        </h1>
        <p className="text-lg font-bold text-[#FF8225]">
          RM {product.price}
        </p>
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mt-2">
          {resolvedCategories.map(
            (cat) =>
              cat && (
                <span
                  key={cat.id}
                  className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                >
                  {cat.emoji} {cat.name}
                </span>
              )
          )}
        </div>
      </div>
    </div>
  </div>

      {/* Reviews */}
<div className="space-y-4">
  <div className="flex justify-between items-center">
    <h2 className="text-lg font-semibold text-gray-800">
      Customer Reviews
    </h2>

    {/* Rating summary on the right */}
    <div className="flex items-center gap-1 text-sm">
      <TbStarFilled className="text-yellow-500" size={16} />
      {product.reviews.length > 0 ? (
        <span className="text-gray-700 font-medium">
          {(
            product.reviews.reduce((sum, r) => sum + r.rating, 0) /
            product.reviews.length
          ).toFixed(1)}{" "}
          ({product.reviews.length} reviews)
        </span>
      ) : (
        <span className="text-gray-500">No reviews yet</span>
      )}
    </div>
  </div>

 {product.reviews.length === 0 ? (
  <div className="text-sm text-gray-500">
    No reviews yet for this product.
  </div>
) : (
    product.reviews
      .filter((review) => !review.hide || isOwnProfile)
      .map((review) => (
        <div
      key={review.id}
className={`relative rounded-lg p-4 pr-12 space-y-3 shadow-sm
  ${review.hide
    ? "bg-gray-50 border border-dashed border-gray-300 opacity-80"
    : "bg-white"
  }`}

    >
      {/* Hide / Unhide (owner only) */}
      {isOwnProfile && (
        <button
          onClick={() =>
            toggleReviewVisibility(review.id, !review.hide)
          }
          className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow hover:bg-gray-100 transition"
          title={review.hide ? "Unhide review" : "Hide review"}
        >
          {review.hide ? (
            <TbEyeOff className="text-red-500" size={18} />
          ) : (
            <TbEye className="text-green-600" size={18} />
          )}
        </button>
      )}
      {isOwnProfile && review.hide && (
        <span className="absolute top-3 right-12 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          Hidden
        </span>
      )}

      {/* Reviewer info */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <img
          src={review.visitor_image || "/default-avatar.png"}
          alt={review.visitor_fullname || review.visitor_username || "Visitor"}
          className="w-10 h-10 object-cover rounded-full"
        />
        {/* Name and username */}
        <div className="flex flex-col text-sm">
          <span className="font-medium text-gray-800">
            {review.visitor_fullname || "Anonymous"}
          </span>
          {review.visitor_username && (
            <span className="text-gray-500">@{review.visitor_username}</span>
          )}
        </div>
        {/* Rating on the right */}
        <div className="ml-auto flex items-center gap-1">
          <TbStarFilled className="text-yellow-500" size={14} />
          <span className="font-medium text-gray-700">{review.rating}.0</span>
        </div>
      </div>

      {/* Review text */}
      <p className="text-gray-700 text-sm">{review.review}</p>

      {/* Optional review image */}
      {review.image && (
        <img
          src={review.image}
          alt="Review"
          className="w-24 h-24 object-cover rounded"
        />
      )}

      {/* Date */}
      <p className="text-xs text-gray-400">
        {new Date(review.created_at).toLocaleDateString()}
      </p>
    </div>
  ))
)}

      {!isOwnProfile && (
        <div className="mt-4">
          <button
            onClick={() => navigate(`${location.pathname}/review`)}
            className="w-full bg-[#FF8225] text-white px-4 py-3 rounded-lg shadow hover:bg-orange-600 transition text-center font-medium"
          >
            Leave a review
          </button>
        </div>
      )}

</div>
    </div>
  </div>
);

};

export default VisitorProductPage;
