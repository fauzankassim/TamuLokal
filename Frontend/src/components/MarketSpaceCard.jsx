import React from "react";
import { useNavigate } from "react-router-dom";

const MarketSpaceCard = ({ marketspace }) => {

  const navigate = useNavigate();

  const status =
    marketspace.my_active_spaces > 0
      ? "Active"
      : marketspace.my_pending_spaces > 0
      ? "Pending"
      : marketspace.my_rejected_spaces > 0
      ? "Rejected"
      : "Available";

  const statusColor = {
    Active: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Rejected: "bg-red-100 text-red-800",
    Available: "bg-blue-100 text-blue-800",
  }[status];

  const handleCheck = () => {
    if (marketspace.id) {
      navigate(`/business/market/${marketspace.id}/space`);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all bg-white p-5 flex flex-col justify-between">
      <div>
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900">
          {marketspace.name || "Unnamed Space"}
        </h3>
        <p className="text-sm text-gray-500">
          {marketspace.address || "No address available"}
        </p>

        {/* Info */}
        <div className="mt-3 flex flex-col gap-1 text-sm text-gray-600">
          <p>
            Frequency:{" "}
            <span className="font-medium">
              {marketspace.frequency ? `${marketspace.frequency} times/week` : "-"}
            </span>
          </p>
          <p>
            Open Time:{" "}
            <span className="font-medium">
              {marketspace.open_time
                ? new Date(marketspace.open_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "-"}
            </span>
          </p>
          <p>
            Close Time:{" "}
            <span className="font-medium">
              {marketspace.close_time
                ? new Date(marketspace.close_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "-"}
            </span>
          </p>
          <p>
            Available Spaces:{" "}
            <span className="font-medium">{marketspace.available_spaces ?? 0}</span>
          </p>
          <p>
            Price:{" "}
            <span className="font-medium text-gray-800">
              RM {marketspace.price_range ?? "N/A"}
            </span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex justify-between items-center">
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${statusColor}`}
        >
          {status}
        </span>

        <button
          onClick={handleCheck}
          className="px-4 py-2 text-sm font-semibold bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Check
        </button>
      </div>
    </div>
  );
};

export default MarketSpaceCard;
