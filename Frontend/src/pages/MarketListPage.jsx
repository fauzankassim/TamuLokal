import React, { useState } from 'react';
import { TbFilter, TbStarFilled } from "react-icons/tb";
import useMarket from "../hooks/useMarket";
import useCurrentLocation from "../hooks/useCurrentLocation";
import MarketCard from "../components/MarketCard";
import Header from '../components/Header';
import Spinner from '../components/Spinner';

const TAG_OPTIONS = ["Food", "Fresh Produce", "Handicraft", "Fashion", "Local Snack"];

const MarketListPage = () => {
    const { markets, loading } = useMarket();
    const currentLocation = useCurrentLocation();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        distance: null,
        rating: null,
        openNow: false,
        tags: [],
    });

    const isMarketOpen = (market) => {
        const now = new Date().getHours();
        const open = new Date(market.open_time).getHours();
        const close = new Date(market.close_time).getHours();
        return open <= close ? now >= open && now <= close : now >= open || now <= close;
    };

    const filteredMarkets = markets.filter((m) => {
        if (filters.openNow && !isMarketOpen(m)) return false;
        if (filters.rating && m.average_rating < filters.rating) return false;
        if (filters.distance && m.distance > filters.distance) return false;
        if (filters.tags.length > 0 && !filters.tags.some(t => m.tags?.includes(t))) return false;
        return true;
    });

    // Toggle a tag in filters
    const toggleTag = (tag) => {
        setFilters(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag],
        }));
    };

    if (loading) return <Spinner loading={loading} />;
    return (
        <div className="w-screen h-screen flex flex-col relative">
            {/* Header */}
            <Header title="Explore Tamu" backPath="/" />

            {/* Filter + Location */}
            <div className="flex items-center justify-between mb-4 px-4">
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white shadow-sm hover:shadow-md transition"
                >
                    <TbFilter size={20} className="text-gray-700" />
                    <span className="text-sm font-medium text-gray-700">Filter</span>
                </button>

                <div className={`
                    px-4 py-2 rounded-full text-sm font-medium shadow-sm
                    ${currentLocation ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                    transition
                `}>
                    {currentLocation ? "Location enabled" : "Location disabled"}
                </div>
            </div>

            {/* Vertical / Grid Market List */}
            <div className="px-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {filteredMarkets.map(market => (
                <div key={market.id} className="w-full h-[350px]">
                    <MarketCard market={market} height={350} />
                </div>
                ))}

                {!loading && filteredMarkets.length === 0 && (
                <p className="text-gray-600 text-center col-span-full">
                    No markets found with selected filters.
                </p>
                )}
            </div>
            </div>

            {/* --- Filter Overlay --- */}
            {isFilterOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
                    <div className="bg-white w-full max-w-xl rounded-t-2xl p-6 shadow-lg ">

                    {/* Top bar: Reset | Filter | Apply */}
                    <div className="flex justify-between items-center mb-4">
                        <button
                        onClick={() => setFilters({ distance: null, rating: null, openNow: false, tags: [] })}
                        className="text-sm text-gray-500 font-medium"
                        >
                        Reset
                        </button>
                        <h3 className="text-lg font-semibold">Filter</h3>
                        <button
                        onClick={() => setIsFilterOpen(false)}
                        className="text-sm text-[var(--orange)] font-medium"
                        >
                        Apply
                        </button>
                    </div>

                    {/* Distance Slider */}
                    <div className="mb-5">
                        <p className="font-medium mb-2">Distance {filters.distance ? `( ${filters.distance} km )` : "Any"}</p>
                        <input
                        type="range"
                        min={5}
                        max={20}
                        step={5}
                        value={filters.distance || 20}
                        onChange={(e) =>
                            setFilters({ ...filters, distance: Number(e.target.value) })
                        }
                        className="w-full accent-orange-500"
                        />
                    </div>

                    {/* Rating Slider */}
                    <div className="mb-5">
                        <p className="font-medium mb-2 flex items-center gap-1">
                        Rating  
                        {filters.rating ? (
                            <span className="flex items-center gap-0.5">
                            ( {filters.rating} <TbStarFilled className="text-yellow-400" /> )
                            </span>
                        ) : " Any"}
                        </p>
                        <input
                        type="range"
                        min={1}
                        max={5}
                        step={1}
                        value={filters.rating || 1}
                        onChange={(e) =>
                            setFilters({ ...filters, rating: Number(e.target.value) })
                        }
                        className="w-full accent-orange-500"
                        />
                    </div>

                    {/* Open Only Toggle */}
                    <div className="mb-5 flex items-center justify-between">
                        <p className="font-medium mb-0">Open Only</p>
                        <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filters.openNow}
                            onChange={() => setFilters({ ...filters, openNow: !filters.openNow })}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:bg-orange-500 transition-colors"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md peer-checked:translate-x-5 transition-transform"></div>
                        </label>
                    </div>

                    {/* Tags */}
                    <div className="mb-5">
                        <p className="font-medium mb-2">Tags</p>
                        <div className="flex flex-wrap gap-2">
                        {TAG_OPTIONS.map((tag) => (
                            <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`px-3 py-1 rounded-full text-xs border ${
                                filters.tags.includes(tag)
                                ? "bg-orange-500 text-white border-orange-500"
                                : "bg-white text-gray-700 border-gray-300"
                            }`}
                            >
                            {tag}
                            </button>
                        ))}
                        </div>
                    </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default MarketListPage;
