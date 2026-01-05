import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import MarketForm from "../components/MarketForm";
import { TbChevronLeft } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const MarketActionPage = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // undefined for add route
    const session = useAuth(true); // ensure we have user session
    const [marketData, setMarketData] = useState(null);
    const base_url = import.meta.env.VITE_BACKEND_API_URL;

  // Fetch market if editing
  useEffect(() => {
    if (!id) return; // only fetch if editing

    const fetchMarket = async () => {
      try {
        const res = await fetch(`${base_url}/market/${id}`);
        if (!res.ok) throw new Error("Failed to fetch market");
        const data = await res.json();

        setMarketData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMarket();
  }, [id]);

  if (!session) return null; // wait for session

  return (
    <div className="relative h-screen bg-[#FFFDFA] flex flex-col items-center font-inter p-4">
      <div className="max-w-xl w-full">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/profile")}
            className="text-gray-700 hover:text-orange-500 transition"
          >
            <TbChevronLeft className="text-2xl" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            {id ? "Edit Market" : "Register Market"}
          </h1>
        </div>
      </div>
      <MarketForm
        organizerId={session.user.id}
        market={id ? marketData : null} // pass market data if editing
        onClose={() => window.history.back()}
      />
    </div>
  );
};

export default MarketActionPage;