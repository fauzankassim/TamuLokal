import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import VendorMarketSpaceList from "../components/VendorMarketSpaceList"; // renamed
import OrganizerMarketSpaceList from "../components/OrganizerMarketSpaceList"; // new
import { TbChevronLeft } from "react-icons/tb";
import OrganizerMarketList from "../components/OrganizerMarketList";
import Header from "../components/Header";

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
    <div className="relative w-full h-screen ">
      <Header title={role === "Vendor"
              ? "Market Space"
              : role === "Organizer"
              ? "Market Property"
              : "Business Page"} />
      <main className="overflow-hidden flex flex-col items-center md:items-start font-inter p-4 max-w-7xl md:mx-auto">
        {role === "Vendor" && <VendorMarketSpaceList vendorId={session.user.id} />}
        {role === "Organizer" && <OrganizerMarketList organizerId={session.user.id} />}
      </main>
      
    </div>
  );
};

export default BusinessMarketSpacePage;
