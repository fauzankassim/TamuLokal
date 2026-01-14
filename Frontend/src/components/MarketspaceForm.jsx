import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";


const MarketspaceForm = ({ vendor, space }) => {
  const navigate = useNavigate();
  if (!vendor || !space) return null;

    const handleSubmit = async () => {
      try {
        const base_url = import.meta.env.VITE_BACKEND_API_URL;

        const res = await fetch(
          `${base_url}/marketspace/${space.id}/apply`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              vendor_id: vendor.id,
            }),
          }
        );
        navigate("/business/marketspace/application")
      } catch (err) {
        console.error(err);
      }
    };


  return (
    <div className="p-4 space-y-6">
      {/* Vendor Info */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Vendor Information
        </h2>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Name:</span>{" "}
          {vendor.name || vendor.username}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Business License:</span>{" "}
          {vendor.license || "-"}
        </p>
      </div>

      {/* Space Info */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Space Information
        </h2>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Lot:</span> {space.lot}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Rent:</span> RM{space.fee}
        </p>
      </div>

        <div className="absolute bottom-0 left-0 px-4 w-full py-4">
            <button
                type="submit"
                onClick={handleSubmit}
                className="w-full py-3 bg-[#FF8225] text-white rounded-md font-medium hover:bg-[#e6731f] transition"
            >
                Submit
            </button>
        </div>

    </div>
  );
};

export default MarketspaceForm;
