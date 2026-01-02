import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ProfileInformation from "../components/ProfileInformation";
import ProductList from "../components/ProductList";
import ProfileHamburger from "../components/ProfileHamburger";
import MarketVisitList from "../components/MarketVisitList";
import { TbChevronLeft } from "react-icons/tb";
import OrganizerMarketList from "../components/OrganizerMarketList";

const ProfilePage = () => {
  const session = useAuth(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [roles, setRoles] = useState([]);

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

  // ✅ Detect role from pathname
  const path = location.pathname;
  const roleMatch = path.match(/\/(vendor|visitor|organizer)\//);
  let role = roleMatch ? roleMatch[1] : null;

  // ✅ If on /profile, use role from fetched roles
  if (path === "/profile") {
    if (roles.includes("Vendor")) role = "vendor";
    else if (roles.includes("Organizer")) role = "organizer";
    else role = "visitor";
  }

  const isOwnProfile =
    path === "/profile" || (!id ? true : id === session.user.id);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
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

        <hr className="my-6 border-gray-200" />

        {/* 👇 Visitor view */}
        {role === "visitor" && (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Visited Markets
            </h2>
            <MarketVisitList visitorId={id || session.user.id} />
          </>
        )}

        {/* 👇 Vendor view */}
        {role === "vendor" && (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Vendor Products
            </h2>
            <ProductList
              vendorId={id || session.user.id}
              isOwnProfile={isOwnProfile}
            />
          </>
        )}

        {/* 👇 Organizer view */}
        {role === "organizer" && (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Markets Owned
            </h2>
            <OrganizerMarketList organizerId={id || session.user.id} />

            {/* OrganizerMarketList will show here if needed */}
            {/* Import it only when you want organizer listing */}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
