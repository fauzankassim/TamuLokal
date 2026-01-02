import React, { useState } from "react";
import { 
  TbUsers, 
  TbBuildingStore, 
  TbChevronRight,
  TbPlus,
  TbSearch 
} from "react-icons/tb";

const AdminPage = () => {
  const [tab, setTab] = useState("business");

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="p-4 bg-white shadow-md">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <p className="text-xs text-gray-500 mt-1">Manage users and markets</p>
      </header>

      {/* Tabs */}
      <div className="flex bg-white shadow-sm mt-1">
        <button
          onClick={() => setTab("business")}
          className={`flex-1 py-3 text-sm font-medium transition ${
            tab === "business"
              ? "text-orange-600 border-b-2 border-orange-600"
              : "text-gray-500"
          }`}
        >
          Business Accounts
        </button>

        <button
          onClick={() => setTab("market")}
          className={`flex-1 py-3 text-sm font-medium transition ${
            tab === "market"
              ? "text-orange-600 border-b-2 border-orange-600"
              : "text-gray-500"
          }`}
        >
          Markets
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="flex items-center bg-white px-3 py-2 rounded-xl shadow">
          <TbSearch className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder={tab === "business" ? "Search business..." : "Search market..."}
            className="ml-2 w-full outline-none text-sm"
          />
        </div>
      </div>

      {/* Content Area */}
      <main className="px-4 pb-6 space-y-3">
        {/* BUSINESS ACCOUNTS */}
        {tab === "business" && (
          <div className="space-y-3">
            {[1, 2, 3].map((item, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-xl shadow flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                    <TbUsers size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Business Account {item}</p>
                    <p className="text-xs text-gray-500">Tap to manage details</p>
                  </div>
                </div>

                <TbChevronRight size={22} className="text-gray-400" />
              </div>
            ))}
          </div>
        )}

        {/* MARKET MANAGEMENT */}
        {tab === "market" && (
          <div className="space-y-3">
            {[1, 2].map((item, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-xl shadow flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                    <TbBuildingStore size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Market #{item}</p>
                    <p className="text-xs text-gray-500">Tap to manage market</p>
                  </div>
                </div>

                <TbChevronRight size={22} className="text-gray-400" />
              </div>
            ))}

            {/* Add Market Button */}
            <button className="w-full flex items-center justify-center gap-2 py-3 bg-orange-600 text-white rounded-xl font-medium shadow active:scale-[0.98] transition">
              <TbPlus size={20} />
              Add New Market
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
