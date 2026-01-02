import React, { useEffect, useState } from "react";
import OrganizerMarketCard from "./OrganizerMarketCard";
import { TbPlus } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const base_url = import.meta.env.VITE_BACKEND_API_URL;

const OrganizerMarketList = ({ organizerId }) => {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!organizerId) return;

    const fetchMarkets = async () => {
      try {
        const res = await fetch(`${base_url}/organizer/${organizerId}/market`);
        if (!res.ok) throw new Error("Failed to fetch markets");
        const data = await res.json();
        setMarkets(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, [organizerId]);

  if (loading) return <div className="text-gray-500 text-center mt-4">Loading markets...</div>;

 return (
    <div className="flex flex-col gap-3 pb-12">
      {markets.map((market) => (
        <OrganizerMarketCard key={market.id} market={market} />
      ))}
    </div>
  );

};

export default OrganizerMarketList;
