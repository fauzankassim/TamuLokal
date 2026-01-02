import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { TbEdit, TbPackage } from "react-icons/tb";

const base_url = import.meta.env.VITE_BACKEND_API_URL;

const VendorMarketSpaceCard = ({ space }) => {
  const [isOpen, setIsOpen] = useState(space.state == 2 ? false : true); // assume space has is_open boolean

  const toggleOpen = async (e) => {
    e.stopPropagation();
    const newState = !isOpen; // assuming 1 = Open, 2 = Closed
    setIsOpen(newState);

    try {
        const response = await fetch(`${base_url}/marketspace/${space.id}/state`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                state: newState ? 1 : 2 // 1 = Open, 2 = Closed
            }),
        });

      if (!response.ok) {
        throw new Error(`Failed to update space: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      // Optional: handle response if needed
      // const data = await response.json();
    } catch (error) {
      console.error("Error updating space state:", error);
      // revert state on error
      setIsOpen(isOpen);
      alert("Failed to update space state");
    }
  };

  return (
    <div className="relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer h-[208px]">
      {/* Image */}
      <img
        src={space.market_image || "/default-market.png"}
        alt={space.market_name}
        className="w-full h-full object-cover"
      />

      {/* Static dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Bottom-right edit icon */}
      <div className="absolute bottom-2 right-2 flex z-10">
        <NavLink
          to={`/business/marketspace/${space.id}`}
          onClick={(e) => e.stopPropagation()}
          className="p-1.5 rounded-lg bg-black/60 text-white backdrop-blur cursor-pointer"
          title="Edit Market"
        >
          <TbPackage size={20} />
        </NavLink>
      </div>

      {/* Bottom-left slider toggle with label */}
      <div className="absolute bottom-2 left-2 flex items-center gap-2 z-10">
        <button
          onClick={toggleOpen}
          className={`relative inline-flex items-center h-8 w-16 rounded-full transition-colors duration-300 focus:outline-none ${
            isOpen ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {/* Knob */}
          <span
            className={`absolute w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
              isOpen ? "translate-x-0 right-1" : "translate-x-0 left-1"
            }`}
          />
        </button>
        {/* Label */}
        <span className="text-white text-sm font-medium select-none">
          {isOpen ? "Open" : "Closed"}
        </span>
      </div>

      {/* Market Name centered */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h3 className="text-white font-semibold text-lg drop-shadow text-center px-4 line-clamp-2">
          {space.market_name}
          <br />
          ( Lot {space.lot} )
        </h3>
      </div>
    </div>
  );
};

export default VendorMarketSpaceCard;
