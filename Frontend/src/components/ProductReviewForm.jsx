import React, { useEffect, useState } from "react";
import { TbStar, TbStarFilled, TbPhoto } from "react-icons/tb";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const base_url = import.meta.env.VITE_BACKEND_API_URL;
const REVIEW_LIMIT = 250;

const ProductReviewForm = ({ product_id, review_id, setLoading }) => {
  const session = useAuth(true);
  const visitorId = session?.user?.id;
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const isEdit = review_id != null && product_id == null;

  useEffect(() => {
    if (!visitorId || !isEdit) return;
    const fetchReview = async () => {
      try {
        const res = await fetch(
          `${base_url}/visitor/${visitorId}/product-review?id=${review_id}`
        );
        if (!res.ok) return;
        const data = await res.json();
        setRating(data.rating);
        setReview(data.review);
        setPreview(data.image || null);
      } catch (err) {
        console.error("Failed to fetch review", err);
      }
    };
    fetchReview();
  }, [visitorId, review_id, isEdit]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const extractReviewId = async (res) => {
    try {
      const data = await res.json();
      return data?.id || data?.review_id || data?.data?.id || data?.data?.review_id;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !review) return;
    setLoading(true);

    try {
      let currentReviewId = review_id;

      if (isEdit) {
        const res = await fetch(
          `${base_url}/visitor/${visitorId}/product-review?id=${review_id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rating, review }),
          }
        );
        if (!res.ok) throw new Error("Failed to update review");
      } else {
        const res = await fetch(`${base_url}/product/${product_id}/review`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitor_id: visitorId, rating, review }),
        });
        if (!res.ok) throw new Error("Failed to create review");
        currentReviewId = await extractReviewId(res);
      }

      // ⭐ Upload image to Supabase storage if provided
      if (image && currentReviewId) {
        const imageBitmap = await createImageBitmap(image);
        const canvas = document.createElement("canvas");
        canvas.width = imageBitmap.width;
        canvas.height = imageBitmap.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(imageBitmap, 0, 0);
        const jpegBlob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/jpeg", 0.9)
        );

        const filePath = `product-reviews/${product_id}/${currentReviewId}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from("tamulokal")
          .upload(filePath, jpegBlob, { upsert: true, contentType: "image/jpeg" });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("tamulokal").getPublicUrl(filePath);
        const publicUrl = `${urlData.publicUrl}?t=${new Date().getTime()}`;

        await fetch(`${base_url}/visitor/${visitorId}/product-review?id=${currentReviewId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: publicUrl }),
        });
      }
    } catch (err) {
      console.error("Failed to submit review", err);
    } finally {
      setLoading(false);
      navigate(-1);
    }
  };

  const counterClass = review.length > REVIEW_LIMIT ? "text-red-500" : "text-gray-500";

  return (
    <form onSubmit={handleSubmit} className="py-6 md:py-8">
      {/* Card area */}
      <div className="bg-white md:rounded-xl md:border md:border-gray-200 md:shadow-sm px-4 md:px-6 py-4 md:py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image */}
          <div className="md:w-1/2">
            <label className="block cursor-pointer">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              <div className="w-full aspect-square overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="Review" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <TbPhoto className="text-3xl mb-2" />
                    <span className="text-sm md:text-base">No image</span>
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* Right inputs */}
          <div className="md:w-1/2 flex flex-col items-center md:justify-between gap-6">
            {/* Rating */}
            <div className="w-full flex justify-center md:justify-center gap-3 md:gap-4 md:mt-10">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-3xl md:text-4xl text-orange-500"
                >
                  {rating >= star ? <TbStarFilled /> : <TbStar />}
                </button>
              ))}
            </div>

            {/* Review Text */}
            <div className="w-full max-w-xl">
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={6}
                placeholder="Share your experience..."
                className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm md:text-base bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <div className={`mt-2 text-xs md:text-sm text-right ${counterClass}`}>
                {review.length} / {REVIEW_LIMIT}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex justify-end px-4 md:px-0">
        <button
          type="submit"

          className="w-full md:w-auto px-6 md:px-8 py-3 md:py-3.5 bg-[#FF8225] text-white rounded-md font-semibold text-sm md:text-base hover:bg-[#e6731f] transition disabled:opacity-60"
        >
          {isEdit ? "Save" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default ProductReviewForm;
