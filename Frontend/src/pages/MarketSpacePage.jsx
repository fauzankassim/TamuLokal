import React, { useState, useEffect } from 'react'
import { TbChevronLeft, TbLayoutGrid, TbList } from 'react-icons/tb'

import { useNavigate, useParams, NavLink } from 'react-router-dom'
import { useAuth } from "../hooks/useAuth";
import useRole from '../hooks/useRole';

import MarketCanvas from '../components/MarketCanvas';
import MarketspaceApplicantCard from '../components/MarketspaceApplicantCard';
import Spinner from '../components/Spinner';
import Header from '../components/Header';

const MarketSpacePage = () => {
  const session = useAuth(true);

  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [selectedStall, setSelectedStall] = useState(null);
  const [listMode, setListMode] = useState("grid"); // "grid" | "list"
  const [sortBy, setSortBy] = useState("lot"); // lot | status
  const [searchTerm, setSearchTerm] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  const [showPlan, setShowPlan] = useState(false);
  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const base_url = import.meta.env.VITE_BACKEND_API_URL;

  const {
    roles,
    loading: rolesLoading,
    isVendor,
  } = useRole(session, base_url);


  /* ============================
   * Fetch stalls data from API
   * ============================ */
  const fetchStalls = async () => {
    if (!id) {
      setError("Market ID is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${base_url}/market/${id}/space`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`Failed to fetch stalls: ${response.status} ${response.statusText}`);

      const data = await response.json();

      const transformedStalls = data.map((stall, index) => ({
        x: stall.x_floor_plan || 0,
        y: stall.y_floor_plan || 0,
        lot: stall.lot,
        id: stall.id || stall.stall_id || index + 1,
        name: stall.name || stall.stall_name || `Stall ${index + 1}`,
        status: stall.vendor_id == null ? "Available" : "Occupied",
        ...stall,
      }));

      setStalls(transformedStalls);
    } catch (err) {
      setError(err.message || "Failed to load stall data");
      setStalls([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStalls();
  }, [id]);
  
  if (loading) return <Spinner loading={loading} />;
  if (error) return <div>Error: {error}</div>;

  console.log(stalls);

  const displayedStalls = stalls
    // Filter by search term
    .filter((stall) => {
      const term = searchTerm.toLowerCase();

      return (
        stall.vendor_name?.toLowerCase().includes(term) ||
        String(stall.lot).includes(term)
      );
    })
    // Sort based on sortBy
    .sort((a, b) => {
      if (sortBy === "lot") return a.lot - b.lot;
      if (sortBy === "status") {
        // Occupied first
        if (a.status === b.status) return 0;
        if (a.status === "Occupied") return -1;
        return 1;
      }
      return 0;
    });

    

  console.log(selectedStall);
  return (
    <div className="w-screen h-screen flex flex-col relative">
      <Header title={"Market Space"} />

      <main className={`flex-1 flex ${showPlan ? 'overflow-hidden' : 'overflow-auto'}`}>
        {showPlan ? (
          <MarketCanvas
            marketId={id}
            stalls={stalls}
            isVendor={isVendor}
            session={session}
            onSelectStall={(stall) => {
              setSelectedStall(stall);
              setShowApplicationsModal(true);
            }}
           />
        ) : (
          // List View
          <div className="w-full h-full p-4 overflow-auto">
            {/* 🔹 Controls Bar */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4 w-full">
              {/* Left group: Grid / List + Sort */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                {/* Grid / List */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setListMode("grid")}
                    className={`p-2 rounded ${listMode === "grid"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <TbLayoutGrid className="text-lg" />
                  </button>

                  <button
                    onClick={() => setListMode("list")}
                    className={`p-2 rounded ${listMode === "list"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <TbList className="text-lg" />
                  </button>
                </div>

                {/* Sort By */}
                <div className="flex items-center gap-2 ml-auto md:ml-0">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="lot">Lot Number</option>
                    <option value="status">Occupied First</option>
                  </select>
                </div>
              </div>

              {/* Search */}
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search vendor or lot..."
                className="w-full md:w-64 md:ml-auto border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div className={listMode === "grid"
              ? "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch"
              : "flex flex-col gap-4"
            }>
              {displayedStalls.map(stall => {
                const hasApplied = stall.pending_applications?.some(
                  (app) => app.vendor_id === session?.user?.id
                );

                return (
                <div key={stall.id} className="bg-white p-4 rounded-lg shadow border h-full min-h-[100px] flex flex-col">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Lot {stall.lot}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${stall.status === "Available"
                      ? "bg-green-100 text-green-700"
                      : stall.status === "Occupied"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {stall.status}
                    </span>
                  </div>

                  {/* Replace stall.name with application/vendor section */}
                  <div className="mt-2 flex-1 flex flex-col justify-between">
                    {stall.status === "Occupied" ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <NavLink
                            to={`/vendor/${stall.vendor_id}`} // placeholder route
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center space-x-3 hover:opacity-80 transition"
                          >
                          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                            {stall.vendor_image ? (
                              <img
                                src={stall.vendor_image}
                                alt={stall.vendor_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-sm text-gray-400">N/A</span>
                            )}
                          </div>
                          <p className="text-sm font-medium text-gray-800">
                            {stall.vendor_name || "Unknown Vendor"}
                          </p>
                          </NavLink>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        {isVendor ? (
                          // 👇 Vendors see price only
                          <>
                            <div>
                              <p className="text-sm text-gray-500">Rent</p>
                              <p className="text-sm font-medium text-gray-800">
                                RM {stall.fee}
                              </p>
                            </div>
                            {hasApplied ? (
                              <span className="text-gray-400 font-medium text-sm cursor-not-allowed">
                                Applied
                              </span>
                            ) : (
                              <NavLink
                                to={`/business/marketspace/${stall.id}/apply`} // placeholder
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Apply
                              </NavLink>
                            )}
                          </>
                        ) : (
                          <>
                            <div>
                              <p className="text-sm text-gray-500">Application</p>
                              <p className="text-sm font-medium text-gray-800">
                                {stall.pending_applications.length > 0
                                  ? `${stall.pending_applications.length}`
                                  : "None"}
                              </p>
                            </div>
                            <NavLink
                              to={`/market/${id}/space/${stall.id}/applications`} // placeholder
                              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedStall(stall);
                                setShowApplicationsModal(true);
                              }}
                            >
                              View
                            </NavLink>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        )}
      </main>

      {/* 🔹 Floating Bottom-Left Toggle (aligned with Reset + Zoom) */}
      <div className="fixed bottom-4 right-4 flex items-center space-x-3 bg-orange-500 bg-opacity-80 px-3 py-2 rounded-full z-20">
        <button
          onClick={() => setShowPlan((prev) => !prev)}
          className="flex items-center gap-2 bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition"
        >
          {showPlan ? <TbList className="text-lg" /> : <TbLayoutGrid className="text-lg" />}
          <span>{showPlan ? "List" : "Plan View"}</span>
        </button>
      </div>
      {showApplicationsModal && (
  <div
    className="fixed inset-0 z-50 px-4 flex items-center justify-center bg-black/40"
    onClick={() => setShowApplicationsModal(false)}
  >
  <div
    className="bg-white rounded-lg w-full max-w-lg h-[70vh] p-5 shadow-lg flex flex-col"
    onClick={(e) => e.stopPropagation()}
  >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Applications — Lot {selectedStall?.lot}
        </h2>
        <button
          onClick={() => setShowApplicationsModal(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* 🔹 Applications Content */}

      {selectedStall?.pending_applications?.length > 0 ? (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {selectedStall.pending_applications.map((app) => (
           <MarketspaceApplicantCard
              key={app.id}
              application={app}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No applications found.</p>
      )}
    </div>
  </div>
)}

    </div>
  )
}

export default MarketSpacePage