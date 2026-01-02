import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MarketFloorPlanBuilder from "../components/MarketFloorPlanBuilder";
import { TbChevronLeft } from "react-icons/tb";

/**
 * MarketFloorPlanPage
 * -------------------
 * Page-level component for TamuLokal market floor plan editor
 * This wraps the MarketFloorPlanBuilder and can later handle:
 * - Fetching/saving layout data
 * - Market metadata (name, date, location)
 * - Role-based access (organizer vs visitor)
 */

export default function MarketFloorPlanPage() {
    const navigate = useNavigate();
  return (
    <div className="w-screen h-screen flex flex-col">
        <div className="px-4 py-4">
            <div className="flex items-center gap-3">
            <button
                onClick={() => navigate("/")}
                className="text-gray-700 hover:text-orange-500 transition"
            >
                <TbChevronLeft className="text-2xl" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
                Market Floor Plan
            </h1>
            </div>
        </div>

      {/* Floor Plan Canvas */}
      <main className="flex-1 overflow-hidden">
        <MarketFloorPlanBuilder />
      </main>
    </div>
  );
}
