import React, { useEffect, useState } from 'react'
import { TbChevronLeft } from 'react-icons/tb'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const base_url = import.meta.env.VITE_BACKEND_API_URL  // adjust if needed

const MarketHistoryPage = () => {
  const session = useAuth(true)
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  // 🔹 replace this with your actual visitor id source
  const visitorId = session?.user?.id

  useEffect(() => {
    if (!visitorId) return

    const fetchMarketHistory = async () => {
      try {
        const res = await fetch(`${base_url}/visitor/${visitorId}/market-history`)
        const data = await res.json()
        setHistory(data)
      } catch (err) {
        console.error("Failed to fetch market history", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMarketHistory()
  }, [visitorId])

  const formatVisit = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()

    const isToday = date.toDateString() === now.toDateString()

    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    const isYesterday = date.toDateString() === yesterday.toDateString()

    const time = date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })

    let displayDate
    if (isToday) displayDate = "Today"
    else if (isYesterday) displayDate = "Yesterday"
    else if (date.getFullYear() === now.getFullYear())
      displayDate = date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    else displayDate = date.toLocaleDateString("en-GB") // dd/mm/yy

    return { displayDate, time }
  }
  console.log(history);
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
            Market History
          </h1>
        </div>
      </div>

      {/* ===== Content ===== */}
      <div className="flex-1 px-4 overflow-y-auto">
  {loading ? (
    <p className="text-gray-500 text-sm">Loading history...</p>
  ) : history.length === 0 ? (
    <p className="text-gray-500 text-sm">No market history found</p>
  ) : (
    <div className="flex flex-col md:flex-row md:flex-wrap md:gap-4 gap-4 justify-center mb-4">
      {history.map((market) => (
        <div
          key={market.market_id}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col md:flex-row max-h-92 md:h-60 md:w-[48%]"
        >
          {/* ===== Market Image ===== */}
          <div className="relative w-full md:w-1/2 h-32 md:h-full bg-gray-100 flex-shrink-0">
            {market.market_image ? (
              <img
                src={market.market_image}
                alt={market.market_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                No Image
              </div>
            )}
          </div>

          {/* ===== Content: Market Name + Visit History ===== */}
          <div className="px-4 py-3 w-full md:w-1/2 flex flex-col">
            {/* Market Name */}
            <h2 className="text-base font-semibold text-gray-800 text-center mb-2">
              {market.market_name}
            </h2>

            {/* Visit History with scrollable section */}
            <div className="flex-1 flex flex-col">
              <p className="text-xs font-medium text-gray-500 mb-2">
                Visit History ({market.visits.length})
              </p>
              
              {/* Scrollable visits container */}
              <div className="max-h-28 overflow-y-auto space-y-2 pr-1 flex-1 no-scrollbar">
                {market.visits
                  .sort(
                    (a, b) =>
                      new Date(b.visited_at) - new Date(a.visited_at)
                  )
                  .map((visit) => (
                    <div
                      key={visit.history_id}
                      className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-3 py-2"
                    >
                      {/* Left: Date */}
                      <span className="text-gray-700">
                        {formatVisit(visit.visited_at).displayDate}
                      </span>

                      {/* Right: Time */}
                      <span className="text-gray-500 text-xs">
                        {formatVisit(visit.visited_at).time}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
            {/* ===== Leave Review Button ===== */}
            <div className="pt-3">
            <NavLink
                to={
                market.review_id != null
                    ? `/market-review/${market.review_id}`
                    : `/market/${market.market_id}/review`
                }
                className={`block w-full py-2 text-sm font-medium rounded-lg text-center transition
                ${
                    market.review_id != null
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "border border-orange-400 text-orange-500 hover:bg-orange-500 hover:text-white"
                }
                `}
            >
                {market.review_id != null ? "Edit review" : "Leave a review"}
            </NavLink>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
    </div>
  )
}

export default MarketHistoryPage
