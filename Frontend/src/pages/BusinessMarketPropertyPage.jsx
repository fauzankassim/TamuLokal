import React from 'react'
import { TbChevronLeft } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';


const BusinessMarketPropertyPage = () => {
  const navigate = useNavigate();
return (
    <div className="relative h-screen overflow-hidden bg-[#FFFDFA] flex flex-col items-center font-inter p-4">

      <div className="max-w-xl w-full">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/profile")}
            className="text-gray-700 hover:text-orange-500 transition"
          >
            <TbChevronLeft className="text-2xl" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            Market Property
          </h1>
        </div>
      </div>

    </div>
  );
}

export default BusinessMarketPropertyPage