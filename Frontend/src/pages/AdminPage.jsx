import React, { useState, useEffect } from "react";
import { 
  TbUsers, 
  TbBuildingStore, 
  TbChevronRight,
  TbPlus
} from "react-icons/tb";

import { NavLink } from "react-router-dom";

const AdminPage = () => {
  const [tab, setTab] = useState("market");
  const [businessData, setBusinessData] = useState({ vendors: [], organizers: [] });
  const [marketData, setMarketData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const base_url = import.meta.env.VITE_BACKEND_API_URL;

  // Fetch Business Data (vendors + organizers)
  useEffect(() => {
    if (tab !== "business") return;

    const fetchBusinessData = async () => {
      try {
        const [vendorsRes, organizersRes] = await Promise.all([
          fetch(`${base_url}/vendor/`),
          fetch(`${base_url}/organizer/`)
        ]);

        const vendors = await vendorsRes.json();
        const organizers = await organizersRes.json();

        setBusinessData({ vendors, organizers });
      } catch (error) {
        console.error("❌ Failed to fetch business data:", error);
      }
    };

    fetchBusinessData();
  }, [tab]);

  // Fetch Market Data
  useEffect(() => {
    if (tab !== "market") return;

    const fetchMarketData = async () => {
      try {
        const res = await fetch(`${base_url}/market/admin`);
        const data = await res.json();
        setMarketData(data);
      } catch (error) {
        console.error("❌ Failed to fetch market data:", error);
      }
    };

    fetchMarketData();
  }, [tab]);

  // Counts
  const totalMarkets = marketData.length;
  const totalAccounts = businessData.vendors.length + businessData.organizers.length;

  // Filtered Lists
  const filteredMarkets = marketData.filter(market =>
    market.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAccounts = [
    ...businessData.vendors.map(v => ({ ...v, type: "Vendor" })),
    ...businessData.organizers.map(o => ({ ...o, type: "Organizer" }))
  ].filter(account =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="p-4 bg-white shadow-md">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <p className="text-xs text-gray-500 mt-1">Manage users and markets</p>
      </header>

      {/* Tabs */}
      <div className="flex bg-white shadow-sm sticky top-0 z-10">
        <button
          onClick={() => { setTab("market"); setSearchTerm(""); }}
          className={`flex-1 py-3 text-sm font-medium transition ${
            tab === "market"
              ? "text-orange-600 border-b-2 border-orange-600"
              : "text-gray-500"
          }`}
        >
          Markets ({totalMarkets})
        </button>

        <button
          onClick={() => { setTab("business"); setSearchTerm(""); }}
          className={`flex-1 py-3 text-sm font-medium transition ${
            tab === "business"
              ? "text-orange-600 border-b-2 border-orange-600"
              : "text-gray-500"
          }`}
        >
          Accounts ({totalAccounts})
        </button>
      </div>

      {/* Search Input */}
      <div className="p-4">
        <input
          type="text"
          placeholder={tab === "market" ? "Search market" : "Search account"}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 rounded-xl shadow bg-white text-sm outline-none"
        />
      </div>

      {/* Content Area */}
      <main className="px-4 mb-10 pb-6 space-y-3">

        {/* MARKET MANAGEMENT */}
        {tab === "market" && (
          <div className="space-y-3">
            {filteredMarkets.map((market, index) => {
              let statusTag = { text: "Approved", bg: "bg-green-100", textColor: "text-green-700" };

              if (market.applications && market.applications.length > 0) {
                const appStatus = market.applications[0].status;
                if (appStatus === 1) statusTag = { text: "Approved", bg: "bg-green-100", textColor: "text-green-700" };
                else if (appStatus === 2) statusTag = { text: "Pending", bg: "bg-yellow-100", textColor: "text-yellow-700" };
                else if (appStatus === 3) statusTag = { text: "Rejected", bg: "bg-red-100", textColor: "text-red-700" };
              }

              return (
                <div key={index} className="p-4 bg-white rounded-xl shadow flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {market.image ? (
                      <img src={market.image} alt={market.name} className="w-12 h-12 object-cover rounded-full border-2 border-gray-200" />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center bg-green-100 text-green-600 rounded-full border-2 border-gray-200">
                        <TbBuildingStore size={20} />
                      </div>
                    )}

                    <div className="flex flex-col">
                      <p className="font-semibold text-sm">{market.name}</p>
                      <div className="flex gap-2 mt-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusTag.bg} ${statusTag.textColor}`}>
                          {statusTag.text}
                        </span>
                      </div>
                    </div>
                  </div>
                  <TbChevronRight size={22} className="text-gray-400" />
                </div>
              );
            })}
            {/* Add Market Button */}
            <div className="fixed bottom-4 left-0 w-full flex justify-center z-20">
              <NavLink
                to="/admin/market/add" // <-- put your desired route here
                className="w-[90%] flex items-center justify-center gap-2 py-3 bg-orange-600 text-white rounded-xl font-medium shadow active:scale-[0.98] transition text-center"
              >
                <TbPlus size={20} />
                Add New Market
              </NavLink>
            </div>
          </div>
        )}

        {/* BUSINESS ACCOUNTS */}
        {tab === "business" && (
          <div className="space-y-3">
            {filteredAccounts.map((account, index) => (
              <div key={index} className="p-4 bg-white rounded-xl shadow flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {account.image ? (
                    <img src={account.image} alt={account.name} className="w-12 h-12 object-cover rounded-full border-2 border-gray-200" />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full border-2 border-gray-200">
                      <TbUsers size={20} />
                    </div>
                  )}

                  <div className="flex flex-col">
                    <p className="font-semibold text-sm">{account.name}</p>
                    <div className="flex gap-2 mt-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${account.verified ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                        {account.verified ? "Verified" : "Unverified"}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${account.type === "Vendor" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>
                        {account.type}
                      </span>
                    </div>
                  </div>
                </div>
                <TbChevronRight size={22} className="text-gray-400" />
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminPage;
