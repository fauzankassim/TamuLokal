import React from 'react'
import { TbChevronLeft } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'

const MarketBookmarkPage = () => {
    const navigate = useNavigate();
  return (
    <div className="w-screen h-full flex flex-col relative">
        {/* ===== Header (UNCHANGED) ===== */}
        <div className="px-4 py-4">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate("/profile")}
                    className="text-gray-700 hover:text-orange-500 transition"
                >
                    <TbChevronLeft className="text-2xl" />
                </button>

                <h1 className="text-xl font-semibold text-gray-800">
                    Market Bookmark
                </h1>
            </div>
        </div>
    </div>
  )
}

export default MarketBookmarkPage