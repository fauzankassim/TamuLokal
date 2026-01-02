import React, { useEffect, useState } from "react";
import MarketVendorCard from "./MarketVendorCard";

const MarketVendorList = ({ marketId }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const base_url = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch(`${base_url}/market/${marketId}/vendor`);
        const data = await res.json();
        setVendors(data || []);
      } catch (err) {
        console.error("Error fetching vendors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [marketId]);

  if (loading) {
    return <p className="text-gray-500 text-center">Loading vendors...</p>;
  }

  if (vendors.length === 0) {
    return <p className="text-gray-500 text-center">No vendors found.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {vendors.map((vendor) => (
        <MarketVendorCard key={vendor.vendor_id} vendor={vendor} />
      ))}
    </div>
  );
};

export default MarketVendorList;
