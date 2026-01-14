import React, { useEffect, useState } from "react";
import OrganizerMarketCard from "./OrganizerMarketCard";
import { TbPlus } from "react-icons/tb";
import { useNavigate, NavLink } from "react-router-dom";
import Spinner from "./Spinner";
const base_url = import.meta.env.VITE_BACKEND_API_URL;


const OrganizerMarketList = ({ organizerId, isOwnProfile = false, isVisitor = false }) => {
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

  if (loading) return <Spinner loading={true}/>
  
  return (
    <div className="flex flex-col gap-3 pb-12">
      {markets
        .filter((market) => isOwnProfile || market.application_status !== null)
        .map((market) => (
          <OrganizerMarketCard
            key={market.id}
            isVisitor={isVisitor}
            market={market}
            isOwnProfile={isOwnProfile}
          />
      ))}
    </div>

  );
};

export default OrganizerMarketList;