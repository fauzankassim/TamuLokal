import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import VendorMarketSpaceList from "../components/VendorMarketSpaceList"; // renamed
import OrganizerMarketSpaceList from "../components/OrganizerMarketSpaceList"; // new
import { TbChevronLeft } from "react-icons/tb";
import OrganizerMarketList from "../components/OrganizerMarketList";

const BusinessMarketSpacePage = () => {
  const session = useAuth(true); // redirect if not logged in
  const navigate = useNavigate();
  const [role, setRole] = useState(null); // 'vendor' or 'organizer'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userId = session.user.id;
        const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/user/${userId}/roles`);
        const data = await res.json();

        if (res.ok && data.roles) {
          if (data.roles.includes("Vendor")) setRole("Vendor");
          else if (data.roles.includes("Organizer")) setRole("Organizer");
          else setRole("None");
        } else {
          setRole("None");
        }
      } catch (err) {
        console.error(err);
        setRole("None");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) fetchUserRole();
  }, [session]);

  if (!session || !session.user) return null;
  if (loading) return <div className="text-gray-600 text-center mt-10">Loading...</div>;

  return (
    <div className="relative h-screen overflow-hidden bg-[#FFFDFA] flex flex-col items-center font-inter p-4">
      <div className="max-w-5xl w-full mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/profile")}
            className="text-gray-700 hover:text-orange-500 transition"
          >
            <TbChevronLeft className="text-2xl" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            {role === "Vendor"
              ? "Market Space"
              : role === "Organizer"
              ? "Market Property"
              : "Business Page"}
          </h1>
        </div>
      </div>

      {role === "Vendor" && <VendorMarketSpaceList vendorId={session.user.id} />}
      {role === "Organizer" && <OrganizerMarketList organizerId={session.user.id} />}
    </div>
  );
};

export default BusinessMarketSpacePage;
