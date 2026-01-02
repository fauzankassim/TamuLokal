import React, { useEffect, useState } from "react";

const MarketVisitList = ({ visitorId }) => {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const base_url = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(() => {
    const fetchVisitedMarkets = async () => {
      try {
        const res = await fetch(`${base_url}/visitor/${visitorId}/market`);
        const data = await res.json();
        console.log(data);
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
    <div className="grid grid-cols-2 gap-4 p-4">
      {markets.map((market) => (
        <div key={market.id} className="w-full">
          <img
            src={market.image}
            alt={market.name}
            className="w-full h-32 object-cover rounded-xl shadow-sm"
          />
        </div>
      ))}
    </div>
  );
};

export default MarketVisitList;
