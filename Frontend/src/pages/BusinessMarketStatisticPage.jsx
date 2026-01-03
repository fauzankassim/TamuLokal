import React, { useEffect, useState } from 'react';
import { TbChevronLeft, TbFileTypePdf, TbStarFilled } from 'react-icons/tb';
import { useNavigate, useParams } from 'react-router-dom';
import MarketStatisticCard from '../components/MarketStatisticCard';

const base_url = import.meta.env.VITE_BACKEND_API_URL;

const BusinessMarketStatisticPage = () => {
    const navigate = useNavigate();
    const { market_id } = useParams();
    const [filter, setFilter] = useState("today");
    const [statistic, setStatistic] = useState(null);
    const [vendors, setVendors] = useState([]);

    useEffect(() => {
        if (!market_id) return;

        const fetchStatistic = async () => {
            try {
                const res = await fetch(`${base_url}/market/${market_id}/statistic`);
                if (!res.ok) throw new Error("Failed to fetch statistic");
                const data = await res.json();
                setStatistic(data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchVendors = async () => {
            try {
                const res = await fetch(`${base_url}/market/${market_id}/vendor`);
                if (!res.ok) throw new Error("Failed to fetch vendors");
                const data = await res.json();
                console.log("Vendors for market:", data);
                setVendors(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchStatistic();
        fetchVendors();
    }, [market_id]);

    // Filter function (unchanged)
    const filterByTime = (arr) => {
        if (!arr) return [];
        const now = new Date();
        return arr.filter(item => {
            const created = new Date(item.created_at);
            switch (filter) {
                case "Today":
                    return created.toDateString() === now.toDateString();
                case "This Week":
                    const weekStart = new Date(now);
                    weekStart.setDate(now.getDate() - now.getDay());
                    return created >= weekStart;
                case "This Month":
                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                case "This Year":
                    return created.getFullYear() === now.getFullYear();
                case "All Time":
                default:
                    return true;
            }
        });
    };

    // Sort vendors by avg_rating and take top 3
    const topVendors = [...vendors]
        .sort((a, b) => b.avg_rating - a.avg_rating)
        .slice(0, 3);

    // Card colors for winner, runner-up, third
    const rankColors = ["bg-yellow-300", "bg-gray-300", "bg-orange-200"];

    return (
        <div className="w-screen h-full flex flex-col relative">
            {/* Header */}
            <div className="px-4 py-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-700 hover:text-orange-500 transition"
                    >
                        <TbChevronLeft className="text-2xl" />
                    </button>
                    <h1 className="text-xl font-semibold text-gray-800">Market Statistic</h1>
                </div>
            </div>

            {/* Filter + Download */}
            <div className="flex items-center justify-between px-4 py-2">
                <select
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                    <option value="all">All Time</option>
                </select>

                <button className="flex items-center gap-1 px-3 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition">
                    <TbFileTypePdf className="text-lg" />
                    Full Report
                </button>
            </div>

            {/* Statistic Cards */}
            <div className="px-4 py-2 grid grid-cols-2 gap-4">
                {statistic && (
                    <>
                        <MarketStatisticCard
                            title="People Visit"
                            data={statistic.market_history}
                            trendText="xx people have visited your market"
                            filter={filter}
                            filterByTime={filterByTime}
                        />
                        <MarketStatisticCard
                            title="Rating"
                            data={statistic.market_review}
                            trendText="xx people have reviewed your market"
                            filter={filter}
                            filterByTime={filterByTime}
                        />
                        <MarketStatisticCard
                            title="Mentions"
                            data={statistic.market_content}
                            trendText="Your market has been mentioned xx times"
                            filter={filter}
                            filterByTime={filterByTime}
                        />
                        <MarketStatisticCard
                            title="Profile Click"
                            data={statistic.market_click}
                            trendText="xx people have clicked on your market"
                            filter={filter}
                            filterByTime={filterByTime}
                        />
                    </>
                )}
            </div>

            {/* Top 3 Vendors */}
            {topVendors.length > 0 && (
                <div className="px-4 py-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Top Vendors</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {topVendors.map((vendor, idx) => (
                            <div
                                key={vendor.vendor_id}
                                className={`px-4 py-2 rounded-xl shadow flex items-center border-2 gap-4 ${
                                    idx === 0 ? "border-yellow-300" :
                                    idx === 1 ? "border-gray-300" :
                                    "border-orange-200"
                                }`}
                            >
                                <p className="font-bold text-xl w-6 text-center">{idx + 1}</p>
                                <img
                                    src={vendor.image}
                                    alt={vendor.name}
                                    className="w-16 h-16 object-cover rounded-full"
                                />
                                <div className="flex justify-between w-full items-center gap-2">
                                    <p className="font-semibold text-gray-800">{vendor.name}</p>
                                    <div className="flex items-center text-yellow-400">
                                        <TbStarFilled className="inline-block" />
                                        <span className="ml-1">{vendor.avg_rating}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default BusinessMarketStatisticPage;