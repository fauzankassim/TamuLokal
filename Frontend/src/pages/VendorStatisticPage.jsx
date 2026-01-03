import React, { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { TbChevronLeft, TbStarFilled } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'

const base_url = import.meta.env.VITE_BACKEND_API_URL

const VendorStatisticPage = () => {
  const session = useAuth(true)
  const vendor_id = session?.user?.id
  const navigate = useNavigate();
  const [vendorStatistic, setVendorStatistic] = React.useState(null);

  useEffect(() => {
    if (!vendor_id) return

    const fetchVendorStatistic = async () => {
      try {
        const res = await fetch(`${base_url}/vendor/${vendor_id}/statistic`)
        if (!res.ok) throw new Error('Failed to fetch vendor statistic')

        const data = await res.json()
        setVendorStatistic(data)
        console.log('Vendor statistic:', data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchVendorStatistic()
  }, [vendor_id])

  const profileClickCount = vendorStatistic?.profile_click?.length || 0
const followerCount = vendorStatistic?.account_follow?.length || 0

// 🔹 Reviews calculation (as requested)
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

const topProducts = vendorStatistic?.products
  ?.map(p => {
    if (!p.reviews || p.reviews.length === 0) return null

    const avgRating =
      p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length

    return {
      ...p.product,
      avg_rating: avgRating
    }
  })
  .filter(Boolean)
  .sort((a, b) => b.avg_rating - a.avg_rating)
  .slice(0, 3) || []


  return (
    <div className="w-screen h-screen flex flex-col relative">
        <div className="px-4 py-4">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate("/profile")}
                    className="text-gray-700 hover:text-orange-500 transition"
                >
                    <TbChevronLeft className="text-2xl" />
                </button>

                <h1 className="text-xl font-semibold text-gray-800">
                    Statistic
                </h1>
            </div>
        </div>

        {vendorStatistic && (
            <div className="px-4 py-4 grid grid-cols-2 gap-4">
                
                {/* Profile Click */}
                <div className="bg-white rounded-xl shadow p-4">
                <p className="text-sm font-medium text-gray-500">Profile Click</p>
                <p className="text-4xl font-semibold text-gray-800">
                    {profileClickCount}
                </p>
                </div>

                {/* Follower */}
                <div className="bg-white rounded-xl shadow p-4">
                <p className="text-sm font-medium text-gray-500">Follower</p>
                <p className="text-4xl font-semibold text-gray-800">
                    {followerCount}
                </p>
                </div>

                {/* Reviews */}
                <div className="bg-white rounded-xl shadow p-4 col-span-2">
                <p className="text-sm font-medium text-gray-500">Reviews</p>
                <p className="text-4xl font-semibold text-gray-800">
                    {finalAverageReview.toFixed(1)}
                </p>
                </div>

{/* Top 3 Products */}
{topProducts.length > 0 && (
  <div className="px-4 py-4 col-span-2">
    <h2 className="text-lg font-semibold text-gray-800 mb-2">
      Top Products
    </h2>

    <div className="grid grid-cols-1 gap-2">
      {topProducts.map((product, idx) => (
        <div
          key={product.id}
          className={`px-4 py-2 rounded-xl shadow flex items-center border-2 gap-4 ${
            idx === 0 ? "border-yellow-300" :
            idx === 1 ? "border-gray-300" :
            "border-orange-200"
          }`}
        >
          <p className="font-bold text-xl w-6 text-center">{idx + 1}</p>

          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover"
            />
          )}

          <div className="flex justify-between w-full items-center gap-2">
            <p className="font-semibold text-gray-800">
              {product.name}
            </p>

            <div className="flex items-center text-yellow-400">
              <TbStarFilled />
              <span className="ml-1">
                {product.avg_rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

  </div>

  
)}

    </div>
  )
}

export default VendorStatisticPage
