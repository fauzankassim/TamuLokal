import React, { useEffect, useState } from "react";
import VendorMarketSpaceCard from "./VendorMarketSpaceCard"; // <- updated import
import { TbClipboardList } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const base_url = import.meta.env.VITE_BACKEND_API_URL;

const VendorMarketSpaceList = ({ vendorId }) => {
  const navigate = useNavigate();
  const [marketspaces, setMarketspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketspaces = async () => {
      if (!vendorId) return;
      setLoading(true);

      try {
        const res = await fetch(`${base_url}/marketspace?vendor_id=${vendorId}`);
        const data = await res.json();
        setMarketspaces(data);
      } catch (err) {
        console.error("Error fetching marketspaces:", err);
        setMarketspaces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketspaces();
  }, [vendorId]);

  if (loading)
    return (
      <div className="flex justify-center py-10 text-gray-500">
        Loading market spaces...
      </div>
    );

  return (
    <div className="flex flex-col gap-3 pb-12">
      {marketspaces.map((space) => (
        <VendorMarketSpaceCard key={space.id} space={space} />
      ))}
    </div>
  );
};

export default VendorMarketSpaceList;
