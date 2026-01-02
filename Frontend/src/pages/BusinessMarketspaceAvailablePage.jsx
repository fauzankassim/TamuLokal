import React, { useEffect, useState } from 'react'
import { TbChevronLeft } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import OrganizerMarketCard from '../components/OrganizerMarketCard'

const base_url = import.meta.env.VITE_BACKEND_API_URL

const BusinessMarketspaceAvailablePage = ({ isVendor = true }) => {
    const navigate = useNavigate()
    const [marketspaces, setMarketspaces] = useState([])

    useEffect(() => {
        const fetchAvailableMarketspace = async () => {
            try {
                const res = await fetch(`${base_url}/marketspace/available`)
                if (!res.ok) throw new Error("Failed to fetch available marketspace")

                const data = await res.json()
                setMarketspaces(data)
                console.log("Available marketspace:", data)
            } catch (err) {
                console.error("Error fetching available marketspace:", err)
            }
        }

        fetchAvailableMarketspace()
    }, [])

    return (
        <div className="w-screen h-screen flex flex-col relative">
            <div className="px-4 py-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/profile")}
                        className="text-gray-700 hover:text-orange-500 transition"
                    >
                        <TbChevronLeft className="text-2xl" />
                    </button>

                    <h1 className="text-xl font-semibold text-gray-800">
                        Market Space
                    </h1>
                </div>
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {marketspaces.map((market) => (
                    <OrganizerMarketCard
                        key={market.market_id}
                        market={market}
                        isVendor={isVendor} // pass this prop to hide buttons for vendor
                    />
                ))}
            </div>
        </div>
    )
}

export default BusinessMarketspaceAvailablePage
