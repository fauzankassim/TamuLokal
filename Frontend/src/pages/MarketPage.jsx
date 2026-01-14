import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TbX, TbBookmark, TbBookmarkFilled } from "react-icons/tb";
import MarketTimeDropdown from "../components/MarketTimeDropdown";
import MarketDistanceDropdown from "../components/MarketDistanceDropdown";
import useCurrentLocation from "../hooks/useCurrentLocation";
import MarketReviewList from "../components/MarketReviewList";
import MarketReviewForm from "../components/MarketReviewForm";
import MarketRating from "../components/MarketRating";
import MarketVendorList from "../components/MarketVendorList";
import { useAuth } from "../hooks/useAuth";

const MarketPage = () => {
  const location = useCurrentLocation();
  const session = useAuth(false);
  const userId = session?.user?.id;
  const { id } = useParams();
  const navigate = useNavigate();
  const [market, setMarket] = useState(null);
  const [activeTab, setActiveTab] = useState("detail");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const base_url = import.meta.env.VITE_BACKEND_API_URL;
  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const res = await fetch(`${base_url}/market/${id}`);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await res.json();
        setMarket(data);
      } catch (error) {

      }
    };

    fetchMarket();
  }, [id, base_url]);

  useEffect(() => {
    if (!userId || !id) return;
    const fetchBookmark = async () => {
      try {
        const res = await fetch(`${base_url}/market/${id}/bookmark?visitor_id=${userId}`);
        if (!res.ok) return;
        const data = await res.json();
        setIsBookmarked(data.hasBookmarked);
      } catch (err) {
        console.error("Failed to fetch bookmark status", err);
      }
    };
    fetchBookmark();
  }, [id, userId, base_url]);

  useEffect(() => {
  if (!userId || !id) return;

  const sendMarketClick = async () => {
    try {
      await fetch(`${base_url}/market/${id}/click`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          viewer_id: userId,
        }),
      });
    } catch (error) {
      console.error("Failed to record market click", error);
    }
  };

  sendMarketClick();
}, [id, userId, base_url]);
  const handleToggleBookmark = async () => {
    if (!userId || !id || bookmarkLoading) return;
    setBookmarkLoading(true);
    try {
      if (isBookmarked) {
        const res = await fetch(`${base_url}/market/${id}/bookmark`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitor_id: userId }),
        });
        if (!res.ok) throw new Error("Failed to remove bookmark");
        setIsBookmarked(false);
      } else {
        const res = await fetch(`${base_url}/market/${id}/bookmark`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitor_id: userId }),
        });
        if (!res.ok) throw new Error("Failed to add bookmark");
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error("Bookmark toggle error:", err);
    } finally {
      setBookmarkLoading(false);
    }
  };

  if (!market || !location || !location[0] || !location[1]) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const now = new Date();
  const currentDay = now.getDay() === 0 ? 7 : now.getDay();
  const todaysSchedule = market.schedules?.find((s) => s.daily_day === currentDay);

  const tabs = [
    { id: "detail", label: "Detail" },
    { id: "vendors", label: "Vendors" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <div className="relative bg-[var(--white)] min-h-screen">
      <div className="max-w-6xl mx-auto w-full px-0 md:px-6 pb-8 md:pt-6">
        {/* Desktop close button (top-right) */}
        <div className="hidden md:flex justify-end px-4 md:px-0 mb-3">
          <button
            onClick={() => navigate(-1)}
            className=" rounded-full w-9 h-9 flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
          >
            <TbX className="w-5 h-10" />
          </button>
        </div>

        {/* Header row: image left, title right */}
        <div className="flex flex-col md:flex-row md:gap-6">
          {/* Image */}
          <div className="relative md:w-2/5 w-full">
            <div className="w-full aspect-[16/9] md:rounded-xl overflow-hidden bg-gray-100">
              <img
                src={market.image}
                alt={market.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Mobile close (inside image) */}
            <button
              onClick={() => navigate(-1)}
              className="md:hidden absolute top-4 right-4 bg-[var(--white)] rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
            >
              <TbX size={20} className="text-[var(--black)]"/>
            </button>

            {/* Bookmark */}
            <button
              onClick={handleToggleBookmark}
              disabled={bookmarkLoading || !userId}
              className="md:hidden absolute top-4 left-4 bg-[var(--white)] rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
              title={isBookmarked ? "Remove bookmark" : "Bookmark"}
            >
              {isBookmarked ? (
                <TbBookmarkFilled size={20} className="text-orange-500" />
              ) : (
                <TbBookmark size={20} className="text-gray-700" />
              )}
            </button>
          </div>

          <div
            className="flex-1 mt-4 md:mt-0  md:rounded-xl md:border md:border-gray-200 md:shadow-sm
                      md:flex md:flex-col md:justify-center"
            style={{ minHeight: '0' }} // ensures flex works correctly with dynamic height
          >
            <div className="px-4 md:px-6 py-4">
              <h1 className="font-bold text-[var(--black)] text-xl md:text-2xl mb-2">
                {market.name}
              </h1>
              <MarketRating marketId={id} />
            </div>
          </div>
        </div>

        {/* Sub-navbar (inline) */}
        <div className="mt-4  md:rounded-xl md:border md:border-gray-200 md:shadow-sm">
          <div className="px-4 md:px-6">
            <div className="flex justify-around py-2 z-10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-sm font-medium px-4 py-2 transition-colors ${
                    activeTab === tab.id
                      ? "text-[var(--orange)] border-b-2 border-[var(--orange)]"
                      : "text-[var(--gray)]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content section */}
          <div className="px-4 md:px-6 pb-6 flex flex-col">
            {activeTab === "detail" && (
              <>
                <p className="text-gray-700 mt-4">{market.description}</p>

                <MarketTimeDropdown
                  schedules={market.schedules}
                  frequency={market.recurrence_type}
                  todaysSchedule={todaysSchedule}
                  isOpen={openDropdown === "time"}
                  onToggle={() =>
                    setOpenDropdown(openDropdown === "time" ? null : "time")
                  }
                />

                <MarketDistanceDropdown
                  address={market.address}
                  userLat={location[0]}
                  userLng={location[1]}
                  marketLat={market.latitude}
                  marketLng={market.longitude}
                  marketId={id}
                  isOpen={openDropdown === "distance"}
                  onToggle={() =>
                    setOpenDropdown(openDropdown === "distance" ? null : "distance")
                  }
                />
              </>
            )}

            {activeTab === "vendors" && (
              <div className="mt-4">
                <MarketVendorList marketId={id} />
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="relative pb-10 mt-4">
                <MarketReviewList marketId={id} />
              </div>
            )}
          </div>
        </div>
      </div>

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