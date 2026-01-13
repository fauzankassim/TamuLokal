import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Header from '../components/Header'

const base_url = import.meta.env.VITE_BACKEND_API_URL  // adjust if needed

const MarketBookmarkPage = () => {
  const session = useAuth(true)
  const navigate = useNavigate()
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)

  const visitorId = session?.user?.id

  useEffect(() => {
    if (!visitorId) return

    const fetchBookmarks = async () => {
      try {
        const res = await fetch(`${base_url}/visitor/${visitorId}/market-bookmark`)
        const data = await res.json()
        setBookmarks(data)
      } catch (err) {
        console.error("Failed to fetch market bookmarks", err)
      } finally {
        setLoading(false)
      }
    }

    fetchBookmarks()
  }, [visitorId])

  const handleRemoveBookmark = (marketId) => {
    // TODO: implement remove API call
    console.log("Remove bookmark:", marketId)
  }

  const handleGetDirection = (market) => {
    // TODO: open maps or location
    console.log("Get direction for:", market.market_name)
  }

  const handleCheckMarket = (marketId) => {
    // TODO: navigate to market detail page
    navigate(`/market/${marketId}`)
  }

  return (
    <div className="w-screen h-full flex flex-col relative">
      {/* ===== Header (UNCHANGED) ===== */}
      <Header title={"Market Bookmark"} backPath={"/profile"} />

      {/* ===== Content ===== */}
      <div className="flex-1 px-4 py-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 overflow-y-auto">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading bookmarks...</p>
        ) : bookmarks.length === 0 ? (
          <p className="text-gray-500 text-sm">No bookmarks found</p>
        ) : (
          bookmarks.map((market) => (
            <NavLink
              key={market.market_id}
              to={`/market/${market.market_id}`}
              className="relative w-full h-40 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer"
            >
              {/* ===== Market Image ===== */}
              <img
                src={market.market_image || "https://via.placeholder.com/300x200"}
                alt={market.market_name}
                className="w-full h-full object-cover"
              />

              {/* ===== Overlay ===== */}
              <div className="absolute inset-0 bg-black/25 flex flex-col justify-between">
                {/* Center: Market Name */}
                <div className="flex-1 flex items-center justify-center">
                  <h2 className="text-white text-lg font-semibold text-center px-2">
                    {market.market_name}
                  </h2>
                </div>
              </div>
            </NavLink>
          ))
        )}
      </div>
    </div>
  )
}

export default MarketBookmarkPage