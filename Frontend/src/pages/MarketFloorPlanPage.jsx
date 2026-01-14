import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TbChevronLeft } from 'react-icons/tb'

import MarketFloorPlanBuilder from '../components/MarketFloorPlanBuilder'
import Spinner from '../components/Spinner'
import { useAuth } from "../hooks/useAuth"

const MarketFloorPlanPage = ({ edit = false }) => {
  const { id: market_id } = useParams()
  const navigate = useNavigate()
  const session = useAuth(true)
  
  const [stalls, setStalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const base_url = import.meta.env.VITE_BACKEND_API_URL

  /* ============================
   * Fetch existing stalls if in edit mode
   * ============================ */
  useEffect(() => {
    const fetchExistingStalls = async () => {
      if (!edit || !market_id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${base_url}/market/${market_id}/space`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch stalls: ${response.status}`)
        }

        const data = await response.json()
        
        const transformedStalls = data.map(stall => ({
          x: stall.x_floor_plan || 0,
          y: stall.y_floor_plan || 0,
          id: stall.id,
          lot: stall.lot,
          fee: stall.fee,
        }))

        setStalls(transformedStalls)
      } catch (err) {
        setError(err.message || "Failed to load stall data")
        setStalls([])
      } finally {
        setLoading(false)
      }
    }

    fetchExistingStalls()
  }, [market_id, edit, base_url])

  const handleSave = async (savedStalls, fee) => {
  try {
    // 1. Separate stalls into three categories
    const toDelete = [];
    const toCreate = [];
    
    savedStalls.forEach((stall, index) => {
      const baseStall = {
        lot: stall.lot || String(index + 1).padStart(String(savedStalls.length).length, '0'),
        fee: stall.fee || fee || 0,
        x_floor_plan: stall.x,
        y_floor_plan: stall.y,
        market_id: market_id,
      };

      if (!stall.id) toCreate.push(baseStall);

    });

    // Find deleted stalls (exist in original but not in saved)
    if (edit) {
      const savedIds = savedStalls.filter(s => s.id).map(s => s.id);
      stalls.forEach(stall => {
        if (!savedIds.includes(stall.id)) {
          toDelete.push(stall.id);
        }
      });
    }

    // ============================
    // Make API requests
    // ============================

    // POST new stalls
    if (toCreate.length > 0) {
      const resCreate = await fetch(`${base_url}/market/${market_id}/space`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toCreate),
      });

      if (!resCreate.ok) {
        const errText = await resCreate.text();
        throw new Error(`Failed to create stalls: ${errText}`);
      }
    }

    // DELETE removed stalls
    if (toDelete.length > 0) {
      const resDelete = await fetch(`${base_url}/market/${market_id}/space`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: toDelete }),
      });

      if (!resDelete.ok) {
        const errText = await resDelete.text();
        throw new Error(`Failed to delete stalls: ${errText}`);
      }
    }

    navigate(`/business/market/${market_id}/space`);
  } catch (err) {
    console.error('Error saving:', err);
    alert(`Failed to save: ${err.message}`);
  }
};


  if (loading) return <Spinner loading={loading} />
  if (error) return <div>Error: {error}</div>

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-700 hover:text-orange-500 transition"
          >
            <TbChevronLeft className="text-2xl" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            {edit ? 'Edit Market Floor Plan' : 'Create Market Floor Plan'}
          </h1>
        </div>
      </div>

      <main className="flex-1 overflow-hidden">
        <MarketFloorPlanBuilder
          edit={edit}
          existingStalls={stalls}
          marketId={market_id}
          onSave={handleSave}
        />
      </main>
    </div>
  )
}

export default MarketFloorPlanPage