import React from 'react'
import { TbChevronLeft } from 'react-icons/tb'
import { useNavigate, useParams } from 'react-router-dom'
import MarketReviewForm from '../components/MarketReviewForm'

const MarketReviewActionPage = () => {
  const navigate = useNavigate();
  const { review_id } = useParams(); // used for create / edit
  const { market_id } = useParams();

  return (
    <div className="w-screen h-full flex flex-col relative">
      {/* ===== Header (UNCHANGED) ===== */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-700 hover:text-orange-500 transition"
          >
            <TbChevronLeft className="text-2xl" />
          </button>

          <h1 className="text-xl font-semibold text-gray-800">
            Market Review
          </h1>
        </div>
      </div>

      {/* ===== Review Form ===== */}
      <div className="flex-1 px-4 pb-6 overflow-y-auto">
        <MarketReviewForm market_id={market_id} review_id={review_id} />
      </div>
    </div>
  )
}

export default MarketReviewActionPage
