import React, { useEffect, useState, useMemo } from 'react'
import { TbStarFilled } from 'react-icons/tb'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js'
import { useAuth } from '../hooks/useAuth'
import { useParams } from 'react-router-dom'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const base_url = import.meta.env.VITE_BACKEND_API_URL

const formatDate = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso)
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
const getToday = () => {
  const d = new Date()
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
function groupBy(arr, getKey) {
  const result = {};
  arr.forEach(item => {
    const key = getKey(item);
    result[key] = (result[key] || 0) + 1;
  });
  return result;
}

function groupVisitsBy(arr, type = "hour") {
  return groupBy(arr, ({ created_at }) => {
    const d = new Date(created_at);
    if (type === "hour") return d.getHours();
    if (type === "day") return d.getDay();
    if (type === "month") return d.getMonth() + 1;
    return "Unknown";
  });
}

const CHART_LABELS = {
  hour: Array.from({ length: 24 }, (_, i) => `${i}:00`),
  day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  month: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ],
};

const Card = ({ children, className }) => (
  <div
    className={`rounded-xl border border-gray-300 bg-white p-6 mb-8 shadow-none ${className || ""}`}
    style={{ pageBreakInside: "avoid" }}
  >
    {children}
  </div>
);

const StatBox = ({ label, value, description }) => (
  <div
    className="flex flex-col items-center justify-center border border-gray-300 rounded-lg bg-white px-6 py-10"
    style={{ height: "130px", minWidth: "170px", maxWidth: "220px" }}
  >
    <div className="uppercase text-xs text-gray-500 font-medium mb-2 tracking-widest letter-spacing-wider">
      {label}
    </div>
    <div className="text-3xl font-extrabold text-gray-900 mb-1">{value}</div>
    <div className="text-xs text-gray-500 font-normal text-center">{description}</div>
  </div>
);

const SectionTitle = ({ children }) => (
  <h2
    className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight"
    style={{ marginTop: "24px" }}
  >
    {children}
  </h2>
);

const BarGraph = ({ labels, data, title, color }) => (
  <Card
    className="p-4 mb-6"
    style={{
      width: "100%",
      maxWidth: "650px",
      margin: "0 auto",
      boxShadow: "none"
    }}
  >
    <h4 className="font-semibold text-md mb-3 text-gray-700">{title}</h4>
    <Bar
      data={{
        labels,
        datasets: [{ label: title, data, backgroundColor: color, borderRadius: 8 }],
      }}
      options={{
        plugins: { legend: { display: false } },
        responsive: false,
        maintainAspectRatio: false,
        layout: { padding: { top: 10, bottom: 10, left: 0, right: 0 } },
        scales: {
          x: { ticks: { color: "#444", font: { size: 12 } }, grid: { color: "#e5e5e5" }},
          y: { beginAtZero: true, ticks: { stepSize: 1, color: "#444", font: { size: 12 } }},
        },
      }}
      width={650}
      height={145}
    />
  </Card>
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

const VendorStatisticReport = () => {
  const [vendorStatistic, setVendorStatistic] = useState(null);
  const [vendorDetail, setVendorDetail] = useState(null);
  const { vendor_id } = useParams();
  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const statRes = await fetch(`${base_url}/vendor/${vendor_id}/statistic`)
        if (statRes.ok) setVendorStatistic(await statRes.json());

        const detailRes = await fetch(`${base_url}/vendor/${vendor_id}`)
        if (detailRes.ok) setVendorDetail(await detailRes.json());
      } catch (err) {
        console.error(err)
      }
    }
    fetchVendorData();
  }, []);

  const profileClick = vendorStatistic?.profile_click || [];
  const accountFollow = vendorStatistic?.account_follow || [];
  const reviewEvents = vendorStatistic?.products?.flatMap(p => 
    (p.reviews || []).map(r => ({...r, product: p.product}))
  ) || [];

  // Stat calculations
  const profileClickCount = profileClick.length;
  const followerCount = accountFollow.length;

  // Calculate final average review
  let finalAverageReview = 0;
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

  // Review trend graphs (by time)
  const reviewHourData = useMemo(() => groupVisitsBy(reviewEvents, "hour"), [reviewEvents]);
  const reviewDayData = useMemo(() => groupVisitsBy(reviewEvents, "day"), [reviewEvents]);
  const reviewMonthData = useMemo(() => groupVisitsBy(reviewEvents, "month"), [reviewEvents]);

  // Profile click graphs
  const clickHourData = useMemo(() => groupVisitsBy(profileClick, "hour"), [profileClick]);
  const clickDayData = useMemo(() => groupVisitsBy(profileClick, "day"), [profileClick]);
  const clickMonthData = useMemo(() => groupVisitsBy(profileClick, "month"), [profileClick]);

  // Followers graphs
  const followerHourData = useMemo(() => groupVisitsBy(accountFollow, "hour"), [accountFollow]);
  const followerDayData = useMemo(() => groupVisitsBy(accountFollow, "day"), [accountFollow]);
  const followerMonthData = useMemo(() => groupVisitsBy(accountFollow, "month"), [accountFollow]);

  // Top products
  const topProducts = useMemo(() =>
    vendorStatistic?.products
      ?.map(p => {
        if (!p.reviews || p.reviews.length === 0) return null
        const avgRating =
          p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
        return {
          ...p.product,
          avg_rating: avgRating,
          image: p.product?.image
        }
      })
      .filter(Boolean)
      .sort((a, b) => b.avg_rating - a.avg_rating)
      .slice(0, 3) || [], [vendorStatistic]);

  return (
    <div
      className="bg-white text-black"
      style={{
        fontFamily: "Inter, Arial, sans-serif",
        width: "210mm",
        minHeight: "297mm",
        margin: "0 auto",
        boxSizing: "border-box",
        padding: "36px 30px",
        background: "#fff",
      }}
    >
      {/* Header */}
      <div className="mb-8 pb-2 border-b border-gray-200">
        <div className="flex flex-row items-end gap-2">
          <img src="/tamulokal.png" className="w-8" alt="TamuKinabalu Logo"/>
          <h1 className="text-xl font-bold font-inter">TamuKinabalu</h1>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 pb-2">
          Vendor Statistical Report
        </h1>
        <div className="text-2xl font-bold text-gray-900 mb-1 leading-tight">
          {vendorDetail?.fullname || <span className="text-gray-400">Vendor Name</span>}
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="text-sm text-gray-500">
            Joined: {vendorDetail?.created_at ? formatDate(vendorDetail.created_at) : '-'}
          </div>
          <div className="text-sm text-gray-500 text-right">
            Generated on: {getToday()}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div
        className="flex flex-row gap-6 mb-8"
        style={{
          pageBreakInside: "avoid",
          alignItems: "stretch",
          justifyContent: "center",
        }}
      >
        <StatBox
          label="Profile Clicks"
          value={profileClickCount}
          description="Total click counts on your profile"
        />
        <StatBox
          label="Followers"
          value={followerCount}
          description="Current number of followers"
        />
        <StatBox
          label="Review Score"
          value={finalAverageReview ? finalAverageReview.toFixed(1) : "-"}
          description="Overall average rating of your products"
        />
      </div>

      {/* Review Trends */}
      <SectionTitle>Review Trends</SectionTitle>
      <BarGraph
        labels={CHART_LABELS.hour}
        data={CHART_LABELS.hour.map((_, i) => reviewHourData[i] || 0)}
        title="Reviews by Hour"
        color="#fb923c"
      />
      <BarGraph
        labels={CHART_LABELS.day}
        data={CHART_LABELS.day.map((_, i) => reviewDayData[i] || 0)}
        title="Reviews by Day of Week"
        color="#60a5fa"
      />
      <BarGraph
        labels={CHART_LABELS.month}
        data={CHART_LABELS.month.map((_, i) => reviewMonthData[i + 1] || 0)}
        title="Reviews by Month"
        color="#34d399"
      />

      {/* Profile Click Trends */}
      <SectionTitle>Profile Click Trends</SectionTitle>
      <BarGraph
        labels={CHART_LABELS.hour}
        data={CHART_LABELS.hour.map((_, i) => clickHourData[i] || 0)}
        title="Profile Clicks by Hour"
        color="#fbbf24"
      />
      <BarGraph
        labels={CHART_LABELS.day}
        data={CHART_LABELS.day.map((_, i) => clickDayData[i] || 0)}
        title="Profile Clicks by Day of Week"
        color="#818cf8"
      />
      <BarGraph
        labels={CHART_LABELS.month}
        data={CHART_LABELS.month.map((_, i) => clickMonthData[i + 1] || 0)}
        title="Profile Clicks by Month"
        color="#67e8f9"
      />

      {/* Follower Trends */}
      <SectionTitle>Follower Trends</SectionTitle>
      <BarGraph
        labels={CHART_LABELS.hour}
        data={CHART_LABELS.hour.map((_, i) => followerHourData[i] || 0)}
        title="Followers by Hour"
        color="#a7f3d0"
      />
      <BarGraph
        labels={CHART_LABELS.day}
        data={CHART_LABELS.day.map((_, i) => followerDayData[i] || 0)}
        title="Followers by Day of Week"
        color="#f472b6"
      />
      <BarGraph
        labels={CHART_LABELS.month}
        data={CHART_LABELS.month.map((_, i) => followerMonthData[i + 1] || 0)}
        title="Followers by Month"
        color="#f9fafb"
      />

      {/* Top 3 Products */}
      {topProducts.length > 0 && (
        <div style={{ marginTop: 60 }}>
          <SectionTitle>Top 3 Products</SectionTitle>
          {topProducts.map((product, idx) => (
            <ProductRankCard key={product.id} idx={idx} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default VendorStatisticReport;