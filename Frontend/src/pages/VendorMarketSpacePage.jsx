import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ProductList from "../components/ProductList";
import { TbChevronLeft } from "react-icons/tb";
import Header from "../components/Header";

const VendorMarketSpacePage = () => {
  const navigate = useNavigate();
  const session = useAuth(true);
  const { id } = useParams();

  if (!session) return null;

  const vendorId = session.user.id;

  return (
    <div className="w-screen h-screen flex flex-col relative">
      <Header title={"Manage Product"} />
  

      <main className="p-4 md:mx-auto">
        <ProductList vendorId={vendorId} isOwnProfile={false} showAvailabilityToggle={true}/>
      </main>

    </div>
  );
};

export default VendorMarketSpacePage;
