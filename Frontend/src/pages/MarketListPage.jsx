import React, { useState } from 'react'
import { TbChevronLeft, TbFilter } from "react-icons/tb";
import { NavLink } from "react-router-dom";
import useMarket from "../hooks/useMarket";
import useCurrentLocation from "../hooks/useCurrentLocation";
import MarketCard from "../components/MarketCard";
import MarketFilter from '../components/MarketFilter';

const MarketListPage = () => {
    const { markets, loading, error } = useMarket();
    console.log(markets);
    const currentLocation = useCurrentLocation();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        distance: null,
        rating: null,
        openNow: false,
        tags: [],
    });

    const TAG_OPTIONS = ["Food", "Fresh Produce", "Handicraft", "Fashion", "Local Snack"];

    const isMarketOpen = (m) => {
        const now = new Date().getHours();
        const open = new Date(m.open_time).getHours();
        const close = new Date(m.close_time).getHours();
        if (open <= close) return now >= open && now <= close;
        return now >= open || now <= close;
    };

    const filteredMarkets = markets.filter((m) => {
        if (filters.openNow && !isMarketOpen(m)) return false;
        if (filters.rating && m.average_rating < filters.rating) return false;
        if (filters.distance && m.distance > filters.distance) return false;
        if (filters.tags.length > 0 && !filters.tags.some(t => m.tags?.includes(t))) return false;
        return true;
    });

    const toggleTag = (tag) => {
        setFilters((prev) => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter((t) => t !== tag)
                : [...prev.tags, tag],
        }));
    };

    return (
        <div className="relative h-screen overflow-auto bg-[#FFFDFA] flex flex-col items-center font-inter p-4">
            <div className="max-w-xl w-full">

                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <NavLink
                        to="/"
                        className="text-gray-700 hover:text-orange-500 transition"
                    >
                        <TbChevronLeft className="text-2xl" />
                    </NavLink>
                    <h1 className="text-xl font-semibold text-gray-800">
                        Explore Tamu
                    </h1>
                </div>

                {/* Filter + Location Status */}
                <div className="flex items-center gap-3 mb-4">
                    {/* Filter Button */}
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white shadow-sm hover:shadow-md transition"
                    >
                        <TbFilter size={20} className="text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Filter</span>
                    </button>

                    {/* Location Status */}
                    <div
                        className={`
                            px-4 py-2 rounded-full text-sm font-medium shadow-sm
                            ${currentLocation ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                            transition
                        `}
                    >
                        {currentLocation ? "Location enabled" : "Location disabled"}
                    </div>
                </div>

                {/* Loading & Error */}
                {loading && <p className="text-gray-600">Loading...</p>}
                {error && <p className="text-red-500">Failed to load markets.</p>}

                {/* Vertical List */}
                <div className="flex flex-col gap-4">
                    {filteredMarkets?.map((market) => (
                        <div key={market.id} className="w-full h-[350px]">
                            <MarketCard market={market} height={350} />
                        </div>
                    ))}

                    {!loading && filteredMarkets?.length === 0 && (
                        <p className="text-gray-600 text-center">No markets found with selected filters.</p>
                    )}
                </div>
            </div>

            {/* Filter Overlay */}
            {isFilterOpen && (
                <MarketFilter
                    filters={filters}
                    setFilters={setFilters}
                    TAG_OPTIONS={["Food", "Fresh Produce", "Handicraft", "Fashion", "Local Snack"]}
                    onClose={() => setIsFilterOpen(false)}
                />
            )}
        </div>
    );
};

export default MarketListPage;
