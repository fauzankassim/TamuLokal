import React, { useEffect, useState } from 'react'
import { TbStar, TbStarFilled, TbPhoto } from 'react-icons/tb'
import { useAuth } from '../hooks/useAuth'

const base_url = import.meta.env.VITE_BACKEND_API_URL

const MarketReviewForm = ({ market_id, review_id }) => {
  const session = useAuth(true)
  const visitorId = session?.user?.id

  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const isEdit = review_id != null && market_id == null;

  /* ===============================
     Fetch existing review (EDIT)
  =============================== */
  useEffect(() => {
    if (!visitorId || !isEdit) return

    const fetchReview = async () => {
      try {
        const res = await fetch(
          `${base_url}/visitor/${visitorId}/market-review?id=${review_id}`
        )
        if (!res.ok) return

        const data = await res.json()
        setRating(data.rating)
        setReview(data.review)
        setPreview(data.image || null)
      } catch (err) {
        console.error('Failed to fetch review', err)
      }
    }

    fetchReview()
  }, [visitorId, review_id, isEdit])

  /* ===============================
     Image handler
  =============================== */
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  /* ===============================
     Submit
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating || !review) return

    setLoading(true)

    try {
      if (isEdit) {
        // ===============================
        // EDIT REVIEW (PUT)
        // ===============================
        await fetch(
          `${base_url}/visitor/${visitorId}/market-review?id=${review_id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              rating,
              review,
            }),
          }
        )
      } else {
        // ===============================
        // CREATE REVIEW (POST)
        // ===============================
        await fetch(
          `${base_url}/market/${market_id}/review`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              visitor_id: visitorId,
              rating,
              review,
            }),
          }
        )
      }
    } catch (err) {
      console.error('Failed to submit review', err)
    } finally {
      setLoading(false)
    }
  }


  return (
    <form onSubmit={handleSubmit} className="relative pb-24">
      {/* ===== Image Section ===== */}
      <div className="px-4 pt-4">
        <label className="block cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {preview ? (
            <img
              src={preview}
              alt="Review"
              className="w-full h-48 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-48 flex flex-col items-center justify-center
                            border border-dashed border-gray-300 rounded-lg text-gray-400">
              <TbPhoto className="text-3xl mb-2" />
              <span className="text-sm">No image</span>
            </div>
          )}
        </label>
      </div>

      {/* ===== Rating ===== */}
      <div className="mt-6 flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="text-3xl text-orange-500"
          >
            {rating >= star ? <TbStarFilled /> : <TbStar />}
          </button>
        ))}
      </div>

      {/* ===== Review Text ===== */}
      <div className="mt-6 px-4">
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={5}
          placeholder="Share your experience..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-1 focus:ring-orange-400"
        />
      </div>

      {/* ===== Fixed Save Button ===== */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-6 py-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#FF8225] text-white rounded-md font-medium
                     hover:bg-[#e6731f] transition disabled:opacity-60"
        >
          {loading ? 'Saving...' : isEdit ? 'Save' : 'Create'}
        </button>
      </div>
    </form>
  )
}

export default MarketReviewForm
