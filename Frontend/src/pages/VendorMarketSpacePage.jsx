import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ProductList from "../components/ProductList";
import { TbChevronLeft } from "react-icons/tb";

const VendorMarketSpacePage = () => {
  const navigate = useNavigate();
  const session = useAuth(true);
  const { id } = useParams();

  if (!session) return null;

  const vendorId = session.user.id;

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
            Manage Product
          </h1>
        </div>
      </div>

      <main className="p-4">
        <ProductList vendorId={vendorId} isOwnProfile={false} showAvailabilityToggle={true}/>
      </main>

    </div>
  );
};

export default VendorMarketSpacePage;
