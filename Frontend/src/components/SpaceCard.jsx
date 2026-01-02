import React from "react";

const SpaceCard = ({ space }) => {
  return (
    <div className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all bg-white p-5 flex flex-col justify-between">
      <div>
        {/* Lot Number */}
        <h3 className="text-lg font-semibold text-gray-900">
          Lot {space.lot || "N/A"}
        </h3>

        {/* Fee */}
        <div className="mt-3 flex flex-col gap-1 text-sm text-gray-600">
          <p>
            Fee:{" "}
            <span className="font-medium text-gray-800">
              RM {space.fee ?? "N/A"}
            </span>
          </p>
        </div>
      </div>

      {/* Apply Button */}
      <div className="mt-4">
        <button
          className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-sm transition"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default SpaceCard;
