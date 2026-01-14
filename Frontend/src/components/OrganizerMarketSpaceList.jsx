import React, { useEffect, useState } from "react";
import ActiveMarketSpaceCard from "./ActiveMarketSpaceCard";
import { TbPlus } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import OrganizerMarketSpaceCard from "./OrganizerMarketSpaceCard";

const base_url = import.meta.env.VITE_BACKEND_API_URL;

const OrganizerMarketSpaceList = ({ organizerId }) => {
  const navigate = useNavigate();
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarkets = async () => {
      if (!organizerId) return;
      setLoading(true);

      try {
        const res = await fetch(`${base_url}/marketspace?organizer_id=${organizerId}`);
        const data = await res.json();
        setMarkets(data);

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

  return (
    <div className="w-full max-w-5xl mx-auto relative">

      <div className="pt-12 pb-6">
        {markets.length === 0 ? (
          <div className="text-gray-500 text-center py-10 italic">
            You have not registered any markets yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {markets.map((market) => (
              <OrganizerMarketSpaceCard
                key={market.id}
                market={market} // market object should include name, image, lot, etc.
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerMarketSpaceList;
