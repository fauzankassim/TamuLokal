import React, { useEffect, useState } from 'react'
import { TbChevronLeft } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import OrganizerMarketCard from '../components/OrganizerMarketCard'
import Header from '../components/Header'
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
            } catch (err) {
                console.error("Error fetching available marketspace:", err)
            }
        }

        fetchAvailableMarketspace()
    }, [])

    return (
        <div className="w-screen h-screen flex flex-col relative">
            <Header title={"Market Space"} />
        
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:mx-auto">
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
