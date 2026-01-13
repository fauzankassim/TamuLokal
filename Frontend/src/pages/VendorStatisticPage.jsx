import React, { useEffect, useState, useMemo } from 'react'
import { useAuth } from '../hooks/useAuth'
import { TbChevronLeft, TbStarFilled, TbFileTypePdf } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

const base_url = import.meta.env.VITE_BACKEND_API_URL

const StatCard = ({ label, value, color, description }) => (
  <div className={`rounded-xl border border-gray-200 bg-white p-6 flex flex-col items-center justify-center`}>
    <div className="uppercase text-xs text-gray-500 font-semibold tracking-wider mb-2">{label}</div>
    <div className={`text-3xl font-extrabold mb-1 ${color || 'text-gray-900'}`}>{value}</div>
    {description && <div className="text-xs text-gray-500 font-normal text-center">{description}</div>}
  </div>
);

const ProductRankCard = ({ idx, product }) => (
  <div
    className={`p-4 rounded-xl border-2 flex items-center gap-4 bg-white shadow mb-3 ${
      idx === 0
        ? "border-yellow-300"
        : idx === 1
        ? "border-gray-300"
        : "border-orange-200"
    }`}
    style={{ minHeight: 90 }}
  >
    <div className="font-bold text-2xl w-8 text-center flex-shrink-0">{idx + 1}</div>
    {product.image ? (
      <img
        src={product.image}
        alt={product.name}
        className="w-16 h-16 object-cover rounded-lg border border-gray-100"
        style={{ background: "#f3f3f3" }}
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
);

const VendorStatisticPage = () => {
  const session = useAuth(true)
  const vendor_id = session?.user?.id
  const navigate = useNavigate();
  const [vendorStatistic, setVendorStatistic] = useState(null);

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

  const profileClickCount = vendorStatistic?.profile_click?.length || 0
  const followerCount = vendorStatistic?.account_follow?.length || 0

  // Calculate final average review
  let finalAverageReview = 0
  if (vendorStatistic?.products?.length > 0) {
    const productAverages = vendorStatistic.products
      .map(p => {
        if (!p.reviews || p.reviews.length === 0) return null

        const sum = p.reviews.reduce((acc, r) => acc + r.rating, 0)
        return sum / p.reviews.length
      })
      .filter(Boolean)

    if (productAverages.length > 0) {
      finalAverageReview =
        productAverages.reduce((a, b) => a + b, 0) / productAverages.length
    }
  }

  const topProducts = useMemo(() =>
    vendorStatistic?.products
      ?.map(p => {
        if (!p.reviews || p.reviews.length === 0) return null

        const avgRating =
          p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length

        return {
          ...p.product,
          avg_rating: avgRating,
          image: p.product?.image,
        }
      })
      .filter(Boolean)
      .sort((a, b) => b.avg_rating - a.avg_rating)
      .slice(0, 3) || [], [vendorStatistic]);

  const handleDownloadReport = () => {
    if (!vendor_id) return;
    window.location.href = `${base_url}/vendor/${vendor_id}/statistic-download`;
  };

  return (
    <div className='relative w-full h-screen'>
      <Header title={"Vendor Statistic"} />

      <div className="w-full max-w-2xl mx-auto px-4 flex justify-end items-center mb-4">
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-orange-500 text-white hover:bg-orange-600 text-sm font-medium transition"
          onClick={handleDownloadReport}
        >
          <TbFileTypePdf className="text-lg" />
          Full Report
        </button>
      </div>

      {vendorStatistic && (
        <div className="w-full max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 px-4 mb-8">
          <StatCard
            label="Profile Clicks"
            value={profileClickCount}
            description="Total click counts on your profile"
          />
          <StatCard
            label="Followers"
            value={followerCount}
            description="Current number of followers"
          />
          <StatCard
            label="Review Score"
            value={finalAverageReview ? finalAverageReview.toFixed(1) : "-"}
            description="Overall average rating of your products"
          />
        </div>
      )}

      {/* Top Products */}
      {topProducts.length > 0 && (
        <div className="w-full max-w-2xl mx-auto px-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-8">
            Top 3 Products
          </h2>
          {topProducts.map((product, idx) => (
            <ProductRankCard key={product.id} idx={idx} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default VendorStatisticPage