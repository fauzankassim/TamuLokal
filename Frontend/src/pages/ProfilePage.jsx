import { TbGridDots, TbTicket, TbPackage, TbBuildingStore } from "react-icons/tb";
import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ProfileInformation from "../components/ProfileInformation";
import ProductList from "../components/ProductList";
import ProfileHamburger from "../components/ProfileHamburger";
import MarketVisitList from "../components/MarketVisitList";
import OrganizerMarketList from "../components/OrganizerMarketList";
import { TbChevronLeft } from "react-icons/tb";

const ProfilePage = () => {
  const session = useAuth(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [roles, setRoles] = useState([]);
  const [activeTab, setActiveTab] = useState("main"); // "main" is default

  const base_url = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(() => {
    const fetchRoles = async () => {
      if (!session || !session.user) return;
      try {
        const res = await fetch(`${base_url}/user/${session.user.id}/roles`);
        const data = await res.json();
        if (res.ok && data.roles) setRoles(data.roles);
      } catch (err) {
        console.error("Error fetching roles:", err);
        setRoles([]);
      }
    };

    fetchRoles();
  }, [session, base_url]);

  if (!session) return null;

  // Detect role from pathname
  const path = location.pathname;
  const roleMatch = path.match(/\/(vendor|visitor|organizer)\//);
  let role = roleMatch ? roleMatch[1] : null;

  // If on /profile, use role from fetched roles
  if (path === "/profile") {
    if (roles.includes("Vendor")) role = "vendor";
    else if (roles.includes("Organizer")) role = "organizer";
    else role = "visitor";
  }

  const isOwnProfile = path === "/profile" || (!id ? true : id === session.user.id);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  // Tab icons depending on role
  const roleTabIcon = {
    visitor: { icon: TbTicket, key: "visited" },
    vendor: { icon: TbPackage, key: "products" },
    organizer: { icon: TbBuildingStore, key: "markets" },
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-[#FFFDFA] font-inter">
      {/* Top Bar */}
      <div className="absolute top-4 w-full px-4 flex justify-between items-center">
        {!isOwnProfile ? (
          <button
            onClick={handleBack}
            className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
          >
            <TbChevronLeft className="text-gray-700 text-xl" />
          </button>
        ) : (
          <div /> // empty spacer for layout balance
        )}

        {isOwnProfile && <ProfileHamburger />}
      </div>

      {/* Profile Content */}
      <div className="w-full max-w-md mt-14 px-4 py-6">
        <ProfileInformation
          userId={id || session.user.id}
          role={role}
          isOwnProfile={isOwnProfile}
        />

        <hr className="mt-6 border-gray-200" />

        {/* ===== Tab Bar ===== */}
        <div className="flex justify-around mb-4 border-b border-gray-200 py-2">
          {/* Main Tab */}
          <button
            onClick={() => setActiveTab("main")}
            className={`flex-1 flex justify-center py-2 ${
              activeTab === "main" ? "text-orange-500" : "text-gray-400"
            }`}
          >
            <TbGridDots size={24} />
          </button>

          {/* Role-specific Tab */}
          {role && roleTabIcon[role] && (
            <button
              onClick={() => setActiveTab(roleTabIcon[role].key)}
              className={`flex-1 flex justify-center py-2 ${
                activeTab === roleTabIcon[role].key ? "text-orange-500" : "text-gray-400"
              }`}
            >
              {React.createElement(roleTabIcon[role].icon, { size: 24 })}
            </button>
          )}
        </div>

        {/* ===== Tab Content ===== */}
        {activeTab === "main" && (
          <p className="text-gray-500 text-center text-sm mb-4">
            Main profile content displayed above tabs
          </p>
        )}

        {role === "visitor" && activeTab === "visited" && (
          <MarketVisitList visitorId={id || session.user.id} />
        )}

        {role === "vendor" && activeTab === "products" && (
          <ProductList vendorId={id || session.user.id} isOwnProfile={isOwnProfile} />
        )}

        {role === "organizer" && activeTab === "markets" && (
          <OrganizerMarketList organizerId={id || session.user.id} />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
