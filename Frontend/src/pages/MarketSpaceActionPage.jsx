import React, { useEffect, useState } from "react";
import { TbChevronLeft } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import MarketspaceForm from "../components/MarketspaceForm";

const base_url = import.meta.env.VITE_BACKEND_API_URL;

const MarketSpaceActionPage = () => {
  const navigate = useNavigate();
  const { id: space_id } = useParams();
  const session = useAuth(true);

  const vendor_id = session?.user?.id;

  const [vendor, setVendor] = useState(null);
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [vendorRes, spaceRes] = await Promise.all([
          fetch(`${base_url}/vendor/${vendor_id}/all`),
          fetch(`${base_url}/marketspace/${space_id}`),
        ]);

        if (!vendorRes.ok) throw new Error("Failed to fetch vendor");
        if (!spaceRes.ok) throw new Error("Failed to fetch market space");

        const vendorData = await vendorRes.json();
        const spaceData = await spaceRes.json();

        setVendor(vendorData);
        setSpace(spaceData);
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [vendor_id, space_id]);

  return (
    <div className="w-screen h-screen flex flex-col relative">
      {/* Header */}
      <div className="px-4 py-4 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-700 hover:text-orange-500 transition"
          >
            <TbChevronLeft className="text-2xl" />
          </button>

          <h1 className="text-xl font-semibold text-gray-800">
            Space Application
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        {loading && (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin h-8 w-8 border-b-2 border-orange-500" />
          </div>
        )}

        {error && (
          <div className="p-4 text-red-600 text-sm">
            Error: {error}
          </div>
        )}

        {!loading && !error && (
          <MarketspaceForm vendor={vendor} space={space} />
        )}
      </div>
    </div>
  );
};

export default MarketSpaceActionPage;
