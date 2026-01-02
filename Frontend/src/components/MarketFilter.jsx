import React from "react";

const MarketFilter = ({ filters, setFilters, TAG_OPTIONS, onClose }) => {
    const toggleTag = (tag) => {
        setFilters((prev) => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter((t) => t !== tag)
                : [...prev.tags, tag],
        }));
    };

    return (
        <div className="absolute inset-0 bg-black/50 flex items-end justify-center">
            <div className="bg-white w-full max-w-xl rounded-t-2xl p-6 shadow-lg">

                <h2 className="text-lg font-semibold mb-4">Filters</h2>

                {/* Distance */}
                <div className="mb-5">
                    <p className="font-medium mb-2">Distance</p>
                    <div className="flex flex-col gap-2 text-sm">
                        {[3, 5, 10, null].map((dist) => (
                            <label key={dist} className="flex items-center justify-between">
                                {dist ? `Within ${dist} km` : "Any distance"}
                                <input
                                    type="radio"
                                    name="distance"
                                    checked={filters.distance === dist}
                                    onChange={() => setFilters({ ...filters, distance: dist })}
                                />
                            </label>
                        ))}
                    </div>
                </div>

                {/* Rating */}
                <div className="mb-5">
                    <p className="font-medium mb-2">Rating</p>
                    <div className="flex flex-col gap-2 text-sm">
                        {[4.5, 4, 3.5, null].map((r) => (
                            <label key={r} className="flex items-center justify-between">
                                {r ? `${r}★+` : "Any rating"}
                                <input
                                    type="radio"
                                    name="rating"
                                    checked={filters.rating === r}
                                    onChange={() => setFilters({ ...filters, rating: r })}
                                />
                            </label>
                        ))}
                    </div>
                </div>

                {/* Open Now */}
                <div className="mb-5">
                    <p className="font-medium mb-2">Open Status</p>
                    <label className="flex items-center justify-between">
                        Open Now
                        <input
                            type="checkbox"
                            checked={filters.openNow}
                            onChange={() => setFilters({ ...filters, openNow: !filters.openNow })}
                        />
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
                                className={`
                                    px-3 py-1 rounded-full text-xs border
                                    ${filters.tags.includes(tag)
                                        ? "bg-orange-500 text-white border-orange-500"
                                        : "bg-white text-gray-700 border-gray-300"}
                                `}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-6">
                    <button
                        onClick={() => setFilters({ distance: null, rating: null, openNow: false, tags: [] })}
                        className="text-gray-500 text-sm underline"
                    >
                        Reset
                    </button>

                    <button
                        onClick={onClose}
                        className="bg-orange-500 text-white rounded-lg px-4 py-2 text-sm shadow"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MarketFilter;
