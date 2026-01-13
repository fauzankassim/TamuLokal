import React, { useEffect, useState } from 'react'
import { TbChevronLeft, TbRefresh, TbSettings } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const base_url = import.meta.env.VITE_BACKEND_API_URL

const MarketspaceApplicationPage = () => {
    const [filter, setFilter] = useState("all")
    const navigate = useNavigate()
    const session = useAuth(true)
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [withdrawing, setWithdrawing] = useState({})

    const vendorId = session?.user?.id

    useEffect(() => {
        if (!vendorId) return

        const fetchApplications = async () => {
            try {
                const res = await fetch(
                    `${base_url}/vendor/${vendorId}/marketspace/application`
                )
                const data = await res.json()
                setApplications(data || [])
            } catch (err) {
                console.error("Failed to fetch applications", err)
            } finally {
                setLoading(false)
            }
        }

        fetchApplications()
    }, [vendorId])

    const filteredApplications = applications.filter((app) => {
        if (filter === "all") return true
        if (filter === "pending") return app.application_status === 2
        if (filter === "approved") return app.application_status === 1
        if (filter === "rejected") return app.application_status !== 1 && app.application_status !== 2
        return true
    })

    // Withdraw with the correct DELETE endpoint
    const handleWithdraw = async (vendor_id, application_id) => {
        if (withdrawing[application_id]) return;
        setWithdrawing((prev) => ({ ...prev, [application_id]: true }));
        try {
            await fetch(
                `${base_url}/vendor/${vendor_id}/marketspace/application?id=${application_id}`,
                {
                    method: 'DELETE'
                }
            );
            // Remove the withdrawn application from local state
            setApplications((prev) => prev.filter(app =>
                app.application_id !== application_id
            ));
        } catch (error) {
            alert("Failed to withdraw application");
        } finally {
            setWithdrawing((prev) => ({ ...prev, [application_id]: false }));
        }
    };
 
    return (
        <div className="w-screen h-screen flex flex-col relative bg-gray-50">
            <div className="px-4 py-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/profile")}
                        className="text-gray-700 hover:text-orange-500 transition"
                    >
                        <TbChevronLeft className="text-2xl" />
                    </button>
                    <h1 className="text-xl font-semibold text-gray-800">
                        My application
                    </h1>
                </div>
            </div>

            {/* Applications list */}
            <div className="px-4 pb-6 flex-1 overflow-y-auto">
                {loading ? (
                    <p className="text-sm text-gray-500">Loading...</p>
                ) : applications.length > 0 ? (
                    <>
                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={() => setFilter("all")}
                                className={`px-3 py-1 text-xs rounded-full font-medium ${filter === "all"
                                    ? "bg-gray-800 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter("approved")}
                                className={`px-3 py-1 text-xs rounded-full font-medium ${filter === "approved"
                                    ? "bg-green-600 text-white"
                                    : "bg-green-100 text-green-700 hover:bg-green-200"}`}
                            >
                                Accepted
                            </button>
                            <button
                                onClick={() => setFilter("pending")}
                                className={`px-3 py-1 text-xs rounded-full font-medium ${filter === "pending"
                                    ? "bg-yellow-500 text-white"
                                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"}`}
                            >
                                Pending
                            </button>
                            <button
                                onClick={() => setFilter("rejected")}
                                className={`px-3 py-1 text-xs rounded-full font-medium ${filter === "rejected"
                                    ? "bg-red-600 text-white"
                                    : "bg-red-100 text-red-700 hover:bg-red-200"}`}
                            >
                                Rejected
                            </button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {filteredApplications.map(app => (
                                <div
                                    key={app.application_id}
                                    className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col md:items-stretch transition"
                                >
                                    {/* Market Image - always at top on md+ */}
                                    <div className="w-full h-36 md:h-40 flex-shrink-0 bg-gray-100">
                                        {app.market_image ? (
                                            <img
                                                src={app.market_image}
                                                alt={app.market_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-4 flex flex-col justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">
                                                {app.market_name}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Lot {app.lot}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Applied on{" "}
                                                {new Date(app.submitted_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            {/* Status (LEFT) */}
                                            <span
                                                className={`text-xs px-3 py-1 rounded-full font-medium ${app.application_status === 2
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : app.application_status === 1
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {app.application_status === 2
                                                    ? "Pending"
                                                    : app.application_status === 1
                                                        ? "Approved"
                                                        : "Rejected"}
                                            </span>
                                            {/* Action (RIGHT) */}
                                            {app.application_status === 2 && (
                                                <button
                                                    className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                                                    onClick={() => handleWithdraw(vendorId, app.application_id)}
                                                    type="button"
                                                    disabled={withdrawing[app.application_id]}
                                                >
                                                    <TbRefresh className="text-sm" />
                                                    {withdrawing[app.application_id] ? "Withdrawing..." : "Withdraw"}
                                                </button>
                                            )}
                                            {app.application_status === 1 && (
                                                <button
                                                    className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium"
                                                    onClick={() => navigate(`/business/marketspace/${app.space_id}`)}
                                                >
                                                    <TbSettings className="text-sm" />
                                                    Manage Product
                                                </button>
                                            )}
                                            {app.application_status !== 2 && app.application_status !== 1 && (
                                                <button
                                                    className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-medium"
                                                >
                                                    <TbRefresh className="text-sm" />
                                                    Appeal
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <p className="text-sm text-gray-500">
                        You have not applied for any marketspace yet.
                    </p>
                )}
            </div>
        </div>
    )
}

export default MarketspaceApplicationPage