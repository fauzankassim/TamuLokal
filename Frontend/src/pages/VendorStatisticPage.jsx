import React, { useEffect, useState, useMemo } from 'react'
import { useAuth } from '../hooks/useAuth'
import { TbChevronLeft, TbStarFilled, TbFileTypePdf } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { TbCaretUpFilled, TbCaretDownFilled } from 'react-icons/tb'

const base_url = import.meta.env.VITE_BACKEND_API_URL

const MarketStatisticCard = ({ title, count, prevCount, totalCount, trendText, filter }) => {
  const trendUp = count >= prevCount
  let trendPercent
  if (count === 0 && prevCount === 0) trendPercent = 0
  else if (prevCount === 0) trendPercent = 100
  else trendPercent = Math.floor(((count - prevCount) / prevCount) * 100)

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <div className="flex items-end justify-start gap-2">
        <p className="text-4xl font-semibold text-gray-800">{count}</p>
        {filter !== 'all' && (
          <div className="flex items-end">
            {trendUp ? (
              <TbCaretUpFilled className="text-green-500 -mb-2.5 -mx-1.5" size={40} />
            ) : (
              <TbCaretDownFilled className="text-red-500 -mb-1.5 -mx-1.5" size={40} />
            )}
            <span className={`text-xl ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
              {trendPercent}%
            </span>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500">{trendText.replace('xx', totalCount)}</p>
    </div>
  )
}

const ProductRankCard = ({ idx, product }) => (
  <div
    className={`p-4 rounded-xl border-2 flex items-center gap-4 bg-white shadow mb-3 ${
      idx === 0 ? 'border-yellow-300' : idx === 1 ? 'border-gray-300' : 'border-orange-200'
    }`}
    style={{ minHeight: 90 }}
  >
    <div className="font-bold text-2xl w-8 text-center flex-shrink-0">{idx + 1}</div>
    {product.image ? (
      <img
        src={product.image}
        alt={product.name}
        className="w-16 h-16 object-cover rounded-lg border border-gray-100"
        style={{ background: '#f3f3f3' }}
      />
    ) : (
      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
        <TbStarFilled className="text-2xl" />
      </div>
    )}
    <div className="flex flex-col justify-center flex-1 min-w-0">
      <div className="truncate font-semibold text-gray-900">{product.name}</div>
      <div className="flex items-center mt-1 text-yellow-500 font-medium text-base">
        <TbStarFilled className="mr-1" />
        {product.avg_rating.toFixed(1)}
      </div>
    </div>
  </div>
)

const VendorStatisticPage = () => {
  const session = useAuth(true)
  const vendor_id = session?.user?.id
  const navigate = useNavigate()
  const [vendorStatistic, setVendorStatistic] = useState(null)
  const [filter, setFilter] = useState('today')

  useEffect(() => {
    if (!vendor_id) return

    const fetchVendorStatistic = async () => {
      try {
        const res = await fetch(`${base_url}/vendor/${vendor_id}/statistic`)
        if (!res.ok) throw new Error('Failed to fetch vendor statistic')
        const data = await res.json()
        setVendorStatistic(data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchVendorStatistic()
  }, [vendor_id])

  const filterByTime = (arr) => {
    if (!arr) return []
    const now = new Date()
    return arr.filter((item) => {
      const created = new Date(item.created_at)
      switch (filter) {
        case 'today':
          return created.toDateString() === now.toDateString()
        case 'week':
          const weekStart = new Date(now)
          weekStart.setDate(now.getDate() - now.getDay())
          return created >= weekStart
        case 'month':
          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
        case 'year':
          return created.getFullYear() === now.getFullYear()
        case 'all':
        default:
          return true
      }
    })
  }

  const getPreviousPeriodCount = (data) => {
    if (!data) return 0
    const now = new Date()
    return data.filter((item) => {
      const created = new Date(item.created_at)
      switch (filter) {
        case 'today': {
          const yesterday = new Date(now)
          yesterday.setDate(now.getDate() - 1)
          return created.toDateString() === yesterday.toDateString()
        }
        case 'week': {
          const lastWeekStart = new Date(now)
          lastWeekStart.setDate(now.getDate() - now.getDay() - 7)
          const lastWeekEnd = new Date(lastWeekStart)
          lastWeekEnd.setDate(lastWeekStart.getDate() + 6)
          return created >= lastWeekStart && created <= lastWeekEnd
        }
        case 'month': {
          const lastMonth = now.getMonth() - 1
          const year = lastMonth < 0 ? now.getFullYear() - 1 : now.getFullYear()
          const month = lastMonth < 0 ? 11 : lastMonth
          return created.getMonth() === month && created.getFullYear() === year
        }
        case 'year': {
          const lastYear = now.getFullYear() - 1
          return created.getFullYear() === lastYear
        }
        case 'all':
        default:
          return false
      }
    }).length
  }

  // Filtered counts
  const profileClickCount = filterByTime(vendorStatistic?.profile_click)?.length || 0
  const profileClickPrev = getPreviousPeriodCount(vendorStatistic?.profile_click_prev)

  const followerCount = filterByTime(vendorStatistic?.account_follow)?.length || 0
  const followerPrev = getPreviousPeriodCount(vendorStatistic?.account_follow_prev)

  let finalAverageReview = 0
  let prevAverageReview = 0
  if (vendorStatistic?.products?.length > 0) {
    const productAverages = vendorStatistic.products
      .map((p) => {
        if (!p.reviews || p.reviews.length === 0) return null
        return p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
      })
      .filter(Boolean)
    if (productAverages.length > 0) finalAverageReview = productAverages.reduce((a, b) => a + b, 0) / productAverages.length

    const productAveragesPrev = vendorStatistic.products
      .map((p) => {
        if (!p.reviews_prev || p.reviews_prev.length === 0) return null
        return p.reviews_prev.reduce((sum, r) => sum + r.rating, 0) / p.reviews_prev.length
      })
      .filter(Boolean)
    if (productAveragesPrev.length > 0) prevAverageReview = productAveragesPrev.reduce((a, b) => a + b, 0) / productAveragesPrev.length
  }

  const topProducts = useMemo(
    () =>
      vendorStatistic?.products
        ?.map((p) => {
          if (!p.reviews || p.reviews.length === 0) return null
          const avgRating = p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
          return { ...p.product, avg_rating: avgRating, image: p.product?.image }
        })
        .filter(Boolean)
        .sort((a, b) => b.avg_rating - a.avg_rating)
        .slice(0, 3) || [],
    [vendorStatistic]
  )

  const handleDownloadReport = () => {
    if (!vendor_id) return
    window.location.href = `${base_url}/vendor/${vendor_id}/statistic-download`
  }

  return (
    <div className="relative w-full h-screen">
      <Header title={'Vendor Statistic'} />

      {/* Filter + Download */}
      <div className="w-full max-w-2xl mx-auto px-4 flex justify-between items-center mb-4">
        <select
          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="all">All Time</option>
        </select>

        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-orange-500 text-white hover:bg-orange-600 text-sm font-medium transition"
          onClick={handleDownloadReport}
        >
          <TbFileTypePdf className="text-lg" />
          Full Report
        </button>
      </div>

      {/* Statistic Cards */}
      {/* Statistic Cards */}
{vendorStatistic && (
  <div className="w-full max-w-2xl mx-auto px-4 mb-8 
                  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <MarketStatisticCard
      title="Profile Clicks"
      count={profileClickCount}
      prevCount={profileClickPrev}
      totalCount={vendorStatistic?.profile_click?.length || 0}
      trendText="Total click counts on your profile"
      filter={filter}
    />
    <MarketStatisticCard
      title="Followers"
      count={followerCount}
      prevCount={followerPrev}
      totalCount={vendorStatistic?.account_follow?.length || 0}
      trendText="Current number of followers"
      filter={filter}
    />
    <MarketStatisticCard
      title="Review Score"
      count={parseFloat(finalAverageReview.toFixed(1))}
      prevCount={parseFloat(prevAverageReview.toFixed(1))}
      totalCount={vendorStatistic?.products?.length || 0}
      trendText="Overall average rating of your products"
      filter={filter}
    />
  </div>
)}


      {/* Top Products */}
      {topProducts.length > 0 && (
        <div className="w-full max-w-2xl mx-auto px-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-8">Top 3 Products</h2>
          {topProducts.map((product, idx) => (
            <ProductRankCard key={product.id} idx={idx} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default VendorStatisticPage
