import React, { useEffect, useState } from "react";

const MarketVisitList = ({ visitorId }) => {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const base_url = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(() => {
    const fetchVisitedMarkets = async () => {
      try {
        const res = await fetch(`${base_url}/visitor/${visitorId}/market-history`);
        const data = await res.json();

        setMarkets(data || []);
      } catch (err) {
        console.error("Error fetching visited markets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitedMarkets();
  }, [visitorId]);


  if (loading) {
    return <p className="text-center text-gray-500">Loading markets...</p>;
  }

  if (markets.length === 0) {
    return <p className="text-center text-gray-500">No visited markets found.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {markets.map((market) => (
        <div key={market.market_id} className="w-full aspect-square overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer">
          <img
            src={market.market_image}
            alt={market.market_name}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default MarketVisitList;
