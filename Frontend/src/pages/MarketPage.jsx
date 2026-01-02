import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MarketNavbar from "../components/MarketNavbar";
import { TbX } from "react-icons/tb";
import MarketTimeDropdown from "../components/MarketTimeDropdown";
import MarketDistanceDropdown from "../components/MarketDistanceDropdown";
import useCurrentLocation from "../hooks/useCurrentLocation";
import MarketReviewList from "../components/MarketReviewList";
import MarketReviewForm from "../components/MarketReviewForm";
import MarketRating from "../components/MarketRating";
import MarketVendorList from "../components/MarketVendorList";

const MarketPage = () => {
  const location = useCurrentLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [market, setMarket] = useState(null);
  const [activeTab, setActiveTab] = useState("detail");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const base_url = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const res = await fetch(`${base_url}/market/${id}`);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await res.json();
        setMarket(data);
      } catch (error) {
        console.log("Error fetching market", error);
      }
    };

    fetchMarket();
  }, [id]);

  if (!market || !location || !location[0] || !location[1]) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // Optional: pick a "current schedule" based on today
  const now = new Date();
  const currentDay = now.getDay() === 0 ? 7 : now.getDay(); // Sunday = 7
  const todaysSchedule = market.schedules?.find((s) => s.daily_day === currentDay);

  return (
    <div className="relative bg-[var(--white)]">
      {/* Top image */}
      <div className="relative">
        <img
          src={market.image}
          alt={market.name}
          className="w-full h-52 object-cover"
        />

        {/* Close button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
        >
          <TbX className="w-5 h-5" />
        </button>
      </div>

      {/* Market name + rating */}
      <div className="px-4 py-4 shadow-sm border-b border-gray-200">
        <h1 className="font-bold text-[var(--black)] mb-2">{market.name}</h1>
        <MarketRating marketId={id} />
      </div>

      {/* Sub-navbar */}
      <MarketNavbar onTabChange={setActiveTab} />

      {/* Content section */}
      <div className="p-4 flex flex-col mb-6">
        {activeTab === "detail" && (
          <>
            <p>{market.description}</p>

            {/* Market schedule dropdown */}
            <MarketTimeDropdown
              schedules={market.schedules}
              frequency={market.recurrence_type}
              todaysSchedule={todaysSchedule}
              isOpen={openDropdown === "time"}
              onToggle={() =>
                setOpenDropdown(openDropdown === "time" ? null : "time")
              }
            />

            {/* Distance dropdown */}
            <MarketDistanceDropdown
              address={market.address}
              userLat={location[0]}
              userLng={location[1]}
              marketLat={market.latitude}
              marketLng={market.longitude}
              isOpen={openDropdown === "distance"}
              onToggle={() =>
                setOpenDropdown(openDropdown === "distance" ? null : "distance")
              }
            />
          </>
        )}

        {activeTab === "vendors" && <MarketVendorList marketId={id} />}

        {activeTab === "reviews" && (
          <div className="relative pb-24">
            <MarketReviewList marketId={id} />
          </div>
        )}
      </div>

      {/* Full-screen Review Form */}
      {showReviewForm && (
        <MarketReviewForm
          market={market}
          type="new"
          onClose={() => setShowReviewForm(false)}
        />
      )}
    </div>
  );
};

export default MarketPage;
