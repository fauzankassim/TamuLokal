import React, { useState, useEffect } from "react";
import { 
  TbUsers, 
  TbBuildingStore, 
  TbChevronRight,
  TbPlus,
  TbMenu,
  TbX
} from "react-icons/tb";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import Spinner from "../components/Spinner";

const AdminPage = () => {


  const base_url = import.meta.env.VITE_BACKEND_API_URL;
  const session = useAuth(true);
  const { isAdmin } = useRole(session, base_url);


  const [tab, setTab] = useState("market");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [businessData, setBusinessData] = useState({ vendors: [], organizers: [] });
  const [marketData, setMarketData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [privateImageUrl, setPrivateImageUrl] = useState(null);



  // Fetch multiple private images for a vendor/organizer
  const fetchPrivateImages = async (roleType, accountId) => {
    if (!roleType || !accountId) return null;

    const fileNames = ["nricFront.jpg", "nricBack.jpg", "license.jpg"];
    const result = {};

    for (const fileName of fileNames) {
      const path = `${roleType}/${accountId}/${fileName}`;
      const { data, error } = await supabase.storage
        .from("tamulokal-private")
        .download(path);

      if (error) {

        result[fileName] = null;
      } else {
        result[fileName] = URL.createObjectURL(data);

      }
    }

    return result; // { nricFront.jpg: url, nricBack.jpg: url, license.jpg: url }
  };

  useEffect(() => {
    if (!selectedAccount) return;

    const loadPrivateImages = async () => {
      // roleType is either "vendors" or "organizers"
      const roleType = selectedAccount.type === "Vendor" ? "vendors" : "organizers";
      const images = await fetchPrivateImages(roleType, selectedAccount.id);
      setPrivateImageUrl(images);
    };

    loadPrivateImages();
  }, [selectedAccount]);

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
      }
    };

    fetchMarketData();
  }, [tab]);

  const filteredMarkets = marketData.filter(market =>
    market.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAccounts = [
    ...businessData.vendors.map(v => ({ ...v, type: "Vendor" })),
    ...businessData.organizers.map(o => ({ ...o, type: "Organizer" }))
  ].filter(account =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) return <div>You do not have access to this page</div>

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar for desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white shadow-md p-4">
        <h1 className="text-xl font-semibold mb-6">Admin Dashboard</h1>
        <p className="text-xs text-gray-500 mb-4">Manage users and markets</p>

        <button
          onClick={() => { setTab("market"); setSearchTerm(""); }}
          className={`flex items-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition ${
            tab === "market"
              ? "bg-orange-100 text-orange-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <TbBuildingStore />
          Markets
        </button>

        <button
          onClick={() => { setTab("business"); setSearchTerm(""); }}
          className={`flex items-center gap-2 py-3 px-4 mt-2 rounded-lg text-sm font-medium transition ${
            tab === "business"
              ? "bg-orange-100 text-orange-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <TbUsers />
          Accounts
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Hamburger */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white shadow-md">
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            <TbMenu size={24} />
          </button>
        </header>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex lg:hidden">
            <aside className="bg-white w-64 p-4">
              <button
                onClick={() => setSidebarOpen(false)}
                className="mb-4 px-2 py-1 text-sm text-gray-500"
              >
                Close
              </button>
              <button
                onClick={() => { setTab("market"); setSearchTerm(""); setSidebarOpen(false); }}
                className={`flex items-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition ${
                  tab === "market"
                    ? "bg-orange-100 text-orange-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <TbBuildingStore />
                Markets
              </button>
              <button
                onClick={() => { setTab("business"); setSearchTerm(""); setSidebarOpen(false); }}
                className={`flex items-center gap-2 py-3 px-4 mt-2 rounded-lg text-sm font-medium transition ${
                  tab === "business"
                    ? "bg-orange-100 text-orange-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <TbUsers />
                Accounts
              </button>
            </aside>
          </div>
        )}

        {/* Search */}
        <div className="p-4">
          <input
            type="text"
            placeholder={tab === "market" ? "Search market" : "Search account"}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 rounded-xl shadow bg-white text-sm outline-none"
          />
        </div>

        {/* Content */}
        <main className="px-4 mb-10 pb-6 flex-1 overflow-y-auto">
          {/* MARKET MANAGEMENT */}
          {tab === "market" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
              {filteredMarkets.map((market, index) => {
                let statusTag = { text: "Approved", bg: "bg-green-100", textColor: "text-green-700" };
                if (market.applications && market.applications.length > 0) {
                  const appStatus = market.applications[0].status;
                  if (appStatus === 1) statusTag = { text: "Approved", bg: "bg-green-100", textColor: "text-green-700" };
                  else if (appStatus === 2) statusTag = { text: "Pending", bg: "bg-yellow-100", textColor: "text-yellow-700" };
                  else if (appStatus === 3) statusTag = { text: "Rejected", bg: "bg-red-100", textColor: "text-red-700" };
                }

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedMarket(market)}
                    className="p-4 bg-white rounded-xl shadow flex justify-between items-center cursor-pointer hover:shadow-lg transition"
                  >
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
              <div className="fixed bottom-4 left-0 w-full flex justify-center lg:static z-20">
                <NavLink
                  to="/admin/market/add"
                  className="w-[90%] lg:w-full flex items-center justify-center gap-2 p-4 bg-orange-600 text-white rounded-xl font-medium shadow active:scale-[0.98] transition text-center"
                >
                  Add New Market
                </NavLink>
              </div>
            </div>
          )}

          {/* BUSINESS ACCOUNTS */}
          {tab === "business" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredAccounts.map((account, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedAccount(account)}
                  className="p-4 bg-white rounded-xl shadow flex justify-between items-center cursor-pointer hover:shadow-lg transition"
                >
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
{/* Market Details Overlay */}
{selectedMarket && (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl relative overflow-y-auto max-h-[90vh]">
      <button
        onClick={() => setSelectedMarket(null)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
      >
        <TbX size={24} />
      </button>

      <div className="flex flex-col lg:flex-row p-4 gap-4">
        {/* Left side: Market image */}
        {selectedMarket.image ? (
          <div className="lg:w-1/3 flex-shrink-0 mx-auto">
            <img
              src={selectedMarket.image}
              alt={selectedMarket.name}
              className="w-full h-full max-w-[200px] mx-auto object-cover rounded-lg"
            />
          </div>
        ) : (
          <div className="lg:w-1/3 flex-shrink-0 flex items-center justify-center bg-green-100 text-green-600 rounded-lg border-2 border-gray-200">
            <TbBuildingStore size={48} />
          </div>
        )}

        {/* Right side: Market details */}
        <div className="lg:w-2/3 flex flex-col gap-2">
          <p className="text-lg font-semibold">{selectedMarket.name}</p>
          <p className="text-sm text-gray-600">{selectedMarket.description}</p>
          <p className="text-sm text-gray-600">Address: {selectedMarket.address}</p>

          {/* Status */}
          {selectedMarket.applications && selectedMarket.applications.length > 0 && (
            <div className="mt-2">
              {(() => {
                const appStatus = selectedMarket.applications[0].status;
                let statusText = "Approved";
                let bg = "bg-green-100";
                let textColor = "text-green-700";

                if (appStatus === 2) { statusText = "Pending"; bg = "bg-yellow-100"; textColor = "text-yellow-700"; }
                if (appStatus === 3) { statusText = "Rejected"; bg = "bg-red-100"; textColor = "text-red-700"; }

                return (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${bg} ${textColor}`}>
                    {statusText}
                  </span>
                );
              })()}
            </div>
          )}

          <p className="text-xs text-gray-500 mt-2">
            Created on {new Date(selectedMarket.created_at).toLocaleDateString()}
          </p>
          {/* Market Actions */}
<div className="flex gap-2 mt-3">
  {(() => {
    const status = selectedMarket.applications?.[0]?.status;

    // Pending
    if (status === 2) {
      return (
        <>
          {/* Approve button */}
          <button
            onClick={async () => {
              try {
                const response = await fetch(`${base_url}/market/${selectedMarket.market_id}/verify?status=1`, {
                  method: "PUT",
                });
                if (!response.ok) throw new Error("Failed to approve market");

                setSelectedMarket(prev => ({
                  ...prev,
                  applications: [{ ...prev.applications[0], status: 1 }]
                }));

                setMarketData(prev =>
                  prev.map(m =>
                    m.market_id === selectedMarket.market_id
                      ? { ...m, applications: [{ ...m.applications[0], status: 1 }] }
                      : m
                  )
                );

              } catch (error) {
     
              }
            }}
            className="flex-1 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Approve
          </button>

          {/* Reject button */}
          <button
            onClick={async () => {
              try {
                const response = await fetch(`${base_url}/market/${selectedMarket.market_id}/verify?status=3`, {
                  method: "PUT",
                });
                if (!response.ok) throw new Error("Failed to reject market");

                setSelectedMarket(prev => ({
                  ...prev,
                  applications: [{ ...prev.applications[0], status: 3 }]
                }));

                setMarketData(prev =>
                  prev.map(m =>
                    m.market_id === selectedMarket.market_id
                      ? { ...m, applications: [{ ...m.applications[0], status: 3 }] }
                      : m
                  )
                );


              } catch (error) {

              }
            }}
            className="flex-1 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Reject
          </button>
        </>
      );
    }

    // Approved, Rejected, or Admin-created (applications null)
    return (
      <button
        onClick={async () => {
          try {
            const response = await fetch(`${base_url}/market/${selectedMarket.market_id}`, {
              method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to remove market");

            setMarketData(prev => prev.filter(m => m.market_id !== selectedMarket.market_id));
            setSelectedMarket(null);

          } catch (error) {

          }
        }}
        className="flex-1 p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
      >
        Remove
      </button>
    );
  })()}
</div>


        </div>
      </div>
    </div>
  </div>
)}

        {/* Overlay for selected account */}
        {selectedAccount && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => { setSelectedAccount(null); setPrivateImageUrl(null); }}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
              >
                <TbX size={24} />
              </button>

              <div className="flex flex-col lg:flex-row p-4">
                {/* Left side: Main account image */}
                {selectedAccount.image && (
                  <div className="lg:w-1/3 flex-shrink-0 mx-auto">
                    <img
                      src={selectedAccount.image}
                      alt={selectedAccount.name}
                      className="w-full h-full max-w-[200px] mx-auto object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Right side: Details, private images, buttons */}
                <div className="lg:w-2/3 flex flex-col gap-2">
                  <p className="text-lg font-semibold">{selectedAccount.name}</p>
                  <p className="text-sm text-gray-600">License: {selectedAccount.license}</p>

                  {privateImageUrl ? (
                    <div className="flex">
                      {privateImageUrl["nricFront.jpg"] && (
                        <img
                          src={privateImageUrl["nricFront.jpg"]}
                          alt="NRIC Front"
                          className="w-1/3 object-cover aspect-square cursor-pointer"
                          onClick={() => setSelectedImage(privateImageUrl["nricFront.jpg"])}
                        />
                      )}
                      {privateImageUrl["nricBack.jpg"] && (
                        <img
                          src={privateImageUrl["nricBack.jpg"]}
                          alt="NRIC Back"
                          className="w-1/3 object-cover aspect-square cursor-pointer"
                          onClick={() => setSelectedImage(privateImageUrl["nricBack.jpg"])}
                        />
                      )}
                      {privateImageUrl["license.jpg"] && (
                        <img
                          src={privateImageUrl["license.jpg"]}
                          alt="License"
                          className="w-1/3 object-cover aspect-square cursor-pointer"
                          onClick={() => setSelectedImage(privateImageUrl["license.jpg"])}
                        />
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">Loading private images...</p>
                  )}

                  <p className="text-xs text-gray-500 mt-2">
                    Joined on {new Date(selectedAccount.created_at).toLocaleDateString()}
                  </p>

                  {/* Approve Button */}
<div className="flex gap-2 mt-3">
  {!selectedAccount.verified && (
    <button
      onClick={async () => {
        try {
          const response = await fetch(`${base_url}/${selectedAccount.type.toLowerCase()}/${selectedAccount.id}/verify?verified=true`, {
            method: "PUT",
          });
          if (!response.ok) throw new Error("Failed to verify account");
          // Update local state to show verified immediately
          setSelectedAccount(prev => ({ ...prev, verified: true }));
          // Update businessData state as well
          setBusinessData(prev => {
            const updateArray = prev.vendors.map(v =>
              v.id === selectedAccount.id ? { ...v, verified: true } : v
            );
            return { ...prev, vendors: updateArray };
          });

        } catch (error) {

        }
      }}
      className="flex-1 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
    >
      Approve
    </button>
  )}

  {selectedAccount.verified && (
    <button
    onClick={async () => {
      try {
        const response = await fetch(`${base_url}/${selectedAccount.type.toLowerCase()}/${selectedAccount.id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to remove account");

        // Remove account from local state so it disappears from the list
        setBusinessData(prev => ({
          vendors: prev.vendors.filter(v => v.id !== selectedAccount.id),
          organizers: prev.organizers.filter(o => o.id !== selectedAccount.id),
        }));
        setSelectedAccount(null);
        setPrivateImageUrl(null);

      } catch (error) {

      }
    }}
    className="flex-1 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
  >
    Remove
  </button>
  )}
</div>

                </div>
              </div>
            </div>
          </div>
        )}

        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setSelectedImage(null)} // close when clicked outside
          >
            <img
              src={selectedImage}
              alt="Selected"
              className="max-h-[90vh] max-w-full object-contain rounded shadow-lg"
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPage;