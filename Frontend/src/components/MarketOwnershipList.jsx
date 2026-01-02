import React, { useEffect, useState } from "react";
import MarketOwnershipCard from "./MarketOwnershipCard";

const base_url = import.meta.env.VITE_BACKEND_API_URL;

const MarketOwnershipList = ({ organizerId }) => {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    const fetchMarkets = async () => {
      if (!organizerId) return;
      setLoading(true);

      try {
        const res = await fetch(`${base_url}/marketownership?organizer_id=${organizerId}`);
        const data = await res.json();
        if (res.ok) setMarkets(data);
        else setMarkets([]);
      } catch (err) {
        console.error("Error fetching markets:", err);
        setMarkets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, [organizerId]);

  if (loading)
    return (
      <div className="flex justify-center py-10 text-gray-500">
        Loading markets...
      </div>
    );

  const sections = [
    { key: "active", label: "Active", field: "isactive" },
    { key: "available", label: "Available", field: "isavailable" },
    { key: "pending", label: "Pending", field: "ispending" },
    { key: "rejected", label: "Rejected", field: "isrejected" },
  ];

  // Find selected tab info
  const activeSection = sections.find((s) => s.key === activeTab);

  // Apply filtering according to selected tab
  const filteredMarkets = markets.filter((m) => m[activeSection.field] > 0);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Tab header */}
      <div className="flex justify-between items-center mt-4 sticky top-0 z-10 gap-2">
        {/* Tabs box */}
        <div className="flex border rounded-xl border-gray-200 bg-white h-12 w-full">
          {sections.map(({ key, label }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`relative flex-1 flex items-center justify-center text-sm font-medium transition-colors h-full ${
                  isActive ? "text-orange-600" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-1 w-1/2 h-[2px] bg-orange-500 rounded-full mx-auto"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="py-6">
        {filteredMarkets.length === 0 ? (
          <div className="text-gray-500 text-center py-10 italic">
            No markets found in this section.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filteredMarkets.map((market) => (
              <MarketOwnershipCard key={market.id} market={market} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketOwnershipList;
