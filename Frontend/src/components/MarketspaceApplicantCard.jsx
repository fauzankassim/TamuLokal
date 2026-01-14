import React, { useEffect, useState } from "react";
import { TbCheck, TbX } from "react-icons/tb";

const MarketspaceApplicantCard = ({ application }) => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  const base_url = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(() => {
    if (!application?.vendor_id) return;

    const fetchVendor = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${base_url}/vendor/${application.vendor_id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch vendor");

        const data = await res.json();
        setVendor(data);
      } catch (err) {
        console.error(err);
        setVendor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [application?.vendor_id]);



  return (
    <div className="border rounded p-3 flex justify-between items-center">
      {/* Left: Vendor info */}
      <div className="flex items-center gap-3">
        {/* Vendor Image */}
        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
          {vendor?.image ? (
            <img
              src={vendor.image}
              alt={vendor?.fullname}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-400">N/A</span>
          )}
        </div>

        {/* Vendor Name + Date */}
        <div>
          {loading ? (
            <p className="text-sm text-gray-400">Loading vendor...</p>
          ) : (
            <>
              <p className="text-sm font-medium">
                {vendor?.fullname || "Unknown Vendor"}
              </p>
              <p className="text-xs text-gray-500">
                Applied on{" "}
                {application?.submitted_at
                  ? new Date(application.submitted_at).toLocaleDateString()
                  : "-"}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded bg-red-100 text-red-700 hover:bg-red-200 transition"
          title="Reject"
        >
          <TbX className="text-lg" />
        </button>
        <button
          className="p-2 rounded bg-green-100 text-green-700 hover:bg-green-200 transition"
          title="Accept"
        >
          <TbCheck className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default MarketspaceApplicantCard;
