import React, { useEffect, useState, useMemo } from "react";
import { TbStarFilled } from "react-icons/tb";
import { useParams } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const base_url = import.meta.env.VITE_BACKEND_API_URL;

const formatDate = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${String(
    d.getHours()
  ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const getToday = () => {
  const d = new Date();
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${String(
    d.getHours()
  ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const formatNumber = (n) => n || 0;

function groupBy(arr, getKey) {
  const result = {};
  arr.forEach((item) => {
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
    if (type === "date") return d.toISOString().slice(0, 10);
    if (type === "month") return d.getMonth() + 1;
    if (type === "year") return d.getFullYear();
    return "Unknown";
  });
}

const CHART_LABELS = {
  hour: Array.from({ length: 24 }, (_, i) => `${i}:00`),
  day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  month: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
};

const Card = ({ children, className }) => (
  <div
    className={`rounded-xl border border-gray-300 bg-white p-6 mb-8 shadow-none ${className}`}
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
      height: "220px",
      boxShadow: "none",
    }}
  >
    <h4 className="font-semibold text-md mb-3 text-gray-700">{title}</h4>
    <Bar
      data={{
        labels,
        datasets: [
          { label: title, data, backgroundColor: color, borderRadius: 8 },
        ],
      }}
      options={{
        plugins: { legend: { display: false } },
        responsive: false,
        maintainAspectRatio: false,
        layout: { padding: { top: 10, bottom: 10, left: 0, right: 0 } },
        scales: {
          x: {
            ticks: { color: "#444", font: { size: 12 } },
            grid: { color: "#e5e5e5" },
          },
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1, color: "#444", font: { size: 12 } },
          },
        },
      }}
      width={650}
      height={145}
    />
  </Card>
);

const BusinessMarketStatisticReport = () => {
  const { market_id } = useParams();
  const [statistic, setStatistic] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [marketDetail, setMarketDetail] = useState(null);

  useEffect(() => {
    if (!market_id) return;
    const fetchStatistic = async () => {
      try {
        const res = await fetch(`${base_url}/market/${market_id}/statistic`);
        if (!res.ok) throw new Error("Failed to fetch statistic");
        const data = await res.json();
        setStatistic(data);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchVendors = async () => {
      try {
        const res = await fetch(`${base_url}/market/${market_id}/vendor`);
        if (!res.ok) throw new Error("Failed to fetch vendors");
        const data = await res.json();
        setVendors(data);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchMarketDetail = async () => {
      try {
        const res = await fetch(`${base_url}/market/${market_id}`);
        if (!res.ok) throw new Error("Failed to fetch market detail");
        const data = await res.json();
        setMarketDetail(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMarketDetail();
    fetchStatistic();
    fetchVendors();
  }, [market_id]);

  // Chart Data Preparation
  const marketHistory = statistic?.market_history || [];
  const marketReview = statistic?.market_review || [];
  const marketClick = statistic?.market_click || [];

  // Grouping for peak graphs
  const hourData = useMemo(
    () => groupVisitsBy(marketHistory, "hour"),
    [marketHistory]
  );
  const dayData = useMemo(
    () => groupVisitsBy(marketHistory, "day"),
    [marketHistory]
  );
  const monthData = useMemo(
    () => groupVisitsBy(marketHistory, "month"),
    [marketHistory]
  );
  const yearData = useMemo(
    () => groupVisitsBy(marketHistory, "year"),
    [marketHistory]
  );

  // Profile Clicks graph data
  const clickHourData = useMemo(
    () => groupVisitsBy(marketClick, "hour"),
    [marketClick]
  );
  const clickDayData = useMemo(
    () => groupVisitsBy(marketClick, "day"),
    [marketClick]
  );
  const clickMonthData = useMemo(
    () => groupVisitsBy(marketClick, "month"),
    [marketClick]
  );
  const clickYearData = useMemo(
    () => groupVisitsBy(marketClick, "year"),
    [marketClick]
  );

  // Market rating section
  const totalRating = marketReview.length;
  const avgRating =
    totalRating > 0
      ? (
          marketReview.reduce(
            (sum, review) =>
              sum + (Number(review.rating ?? 0)),
            0
          ) / totalRating
        ).toFixed(2)
      : "-";
  const ratingCountDist = useMemo(() => {
    // Key: rating value, Value: count
    return groupBy(marketReview, (review) => review.rating ?? "-");
  }, [marketReview]);

  // Top Vendors
  const topVendors = [...vendors]
    .sort((a, b) => b.avg_rating - a.avg_rating)
    .slice(0, 3);

  // Totals
  const visitCount = statistic?.market_history?.length || 0;
  const reviewCount = statistic?.market_review?.length || 0;
  const mentionCount = statistic?.market_content?.length || 0;
  const clickCount = statistic?.market_click?.length || 0;

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
      {/* Header and meta */}
      <div className="mb-8 pb-2 border-b border-gray-200">
        <div className="flex flex-row items-end gap-2">
            <img src="/tamulokal.png" className="w-8"/>
            <h1 className="text-xl font-bold font-inter">TamuKinabalu</h1>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 pb-2">
            Market Statistical Report
        </h1>

            <div className="text-2xl font-bold text-gray-900 mb-1 leading-tight">
              {marketDetail?.name || (
                <span className="text-gray-400">Market Name</span>
              )}
            </div>
                    <div className="flex flex-row justify-between items-center">
            <div className="text-sm text-gray-500">
              Created at:{" "}
              {marketDetail?.created_at
                ? formatDate(marketDetail.created_at)
                : "-"}
            </div>

            <div className="text-sm text-gray-500 text-right">
              Generated on: {getToday()}
            </div>

        </div>
      </div>

      {/* Stats Boxes Section */}
      <div
        className="flex flex-row gap-6 mb-8"
        style={{
          pageBreakInside: "avoid",
          alignItems: "stretch",
          justifyContent: "center",
        }}
      >
        <StatBox
          label="Total Visit"
          value={formatNumber(visitCount)}
          description="Unique individuals who visited this market."
        />
        <StatBox
          label="Total Reviews"
          value={formatNumber(reviewCount)}
          description="Total reviews submitted for this market."
        />
        <StatBox
          label="Mentions"
          value={formatNumber(mentionCount)}
          description="Times the market was mentioned in platform posts."
        />
        <StatBox
          label="Market Clicks"
          value={formatNumber(clickCount)}
          description="Users who clicked on the market profile."
        />
      </div>

      {/* Market Rating Section */}
      <Card className="mb-10" style={{maxWidth:"520px", margin:"0 auto"}}>
        <SectionTitle>Market Rating Summary</SectionTitle>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
          <div>
            <div className="text-xl font-bold text-gray-800">{avgRating} <TbStarFilled className="inline mb-1 text-yellow-500" /></div>
            <div className="text-xs text-gray-600 font-medium">Average Rating ({totalRating} review{totalRating === 1 ? "" : "s"})</div>
          </div>
          <div>
            <div className="flex gap-2">
              {[5,4,3,2,1].map(rating => (
                <div key={rating} className="flex flex-col items-center">
                  <span className="font-semibold text-gray-800">{rating}</span>
                  <TbStarFilled className="text-yellow-500 mb-1"/>
                  <span className="text-sm text-gray-500">{ratingCountDist[rating] || 0}</span>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-400 text-right mt-2">Count per rating</div>
          </div>
        </div>
      </Card>

      {/* Market Visit Peak Time Graphs */}
        <>
          <SectionTitle>Market Visit Peak Times</SectionTitle>
          <BarGraph
            labels={CHART_LABELS.hour}
            data={CHART_LABELS.hour.map((_, i) => hourData[i] || 0)}
            title="Visits by Hour"
            color="#fb923c"
          />
          <BarGraph
            labels={CHART_LABELS.day}
            data={CHART_LABELS.day.map((_, i) => dayData[i] || 0)}
            title="Visits by Day of Week"
            color="#60a5fa"
          />
          <BarGraph
            labels={CHART_LABELS.month}
            data={CHART_LABELS.month.map((_, i) => monthData[i + 1] || 0)}
            title="Visits by Month"
            color="#34d399"
          />

        </>


      {/* Profile Click Peak Time Graphs */}

        <>
          <SectionTitle>Market Profile Click Peak Times</SectionTitle>
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
        </>


    </div>
  );
};

export default BusinessMarketStatisticReport;