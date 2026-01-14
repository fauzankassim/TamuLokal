import { TbGridDots, TbTicket, TbPackage, TbBuildingStore, TbChevronLeft } from "react-icons/tb";
import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ProfileInformation from "../components/ProfileInformation";
import ProductList from "../components/ProductList";
import ProfileHamburger from "../components/ProfileHamburger";
import MarketVisitList from "../components/MarketVisitList";
import OrganizerMarketList from "../components/OrganizerMarketList";

const VisitProfilePage = () => {
  const session = useAuth(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const base_url = import.meta.env.VITE_BACKEND_API_URL;

  const [roles, setRoles] = useState([]);
  const [activeTab, setActiveTab] = useState("main");
  const [visitorPosts, setVisitorPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const visitor_id = id; // visiting profile

  // Fetch visitor posts
  useEffect(() => {
    if (!visitor_id) return;
    const fetchVisitorPosts = async () => {
      setLoadingPosts(true);
      try {
        const res = await fetch(`${base_url}/visitor/${visitor_id}/post`);
        if (!res.ok) throw new Error("Failed to fetch visitor posts");
        const data = await res.json();
        setVisitorPosts(data);
      } catch (err) {
        console.error("[Visitor Posts] Error:", err);
        setVisitorPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchVisitorPosts();
  }, [base_url, visitor_id]);

  // Fetch roles
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

  // Determine role based on path or roles
  const path = location.pathname;
  const roleMatch = path.match(/\/(vendor|visitor|organizer)\//);
  let role = roleMatch ? roleMatch[1] : null;

  if (!role) {
    if (roles.includes("Vendor")) role = "vendor";
    else if (roles.includes("Organizer")) role = "organizer";
    else role = "visitor";
  }

  const isOwnProfile = path === "/profile" || (!id ? true : id === session?.user?.id);

  // Register profile click
  useEffect(() => {
    if (!session?.user) return;
    if (!id) return;
    if (isOwnProfile) return;

    const registerProfileClick = async () => {
      try {
        await fetch(`${base_url}/user/${id}/click`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ viewer_id: session.user.id }),
        });
      } catch (err) {
        console.error("[Profile Click] Error:", err);
      }
    };

    registerProfileClick();
    console.log("here");
  }, [id, isOwnProfile, session, base_url]);

  const roleTabIcon = {
    visitor: { icon: TbTicket, key: "visited" },
    vendor: { icon: TbPackage, key: "products" },
    organizer: { icon: TbBuildingStore, key: "markets" },
  };

  const visitorPostItems = Array.isArray(visitorPosts)
    ? visitorPosts.filter((post) => post.type === 1)
    : [];

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-[#FFFDFA] font-inter">
      {/* Top Bar */}
      <div className="absolute top-4 w-full px-4 md:px-8 flex justify-between items-center">
        {!isOwnProfile ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="text-[var(--black)] hover:text-[var(--orange)] transition"
            >
              <TbChevronLeft className="text-2xl" />
            </button>
          </div>
        ) : (
          <div />
        )}
        {isOwnProfile && <ProfileHamburger />}
      </div>

      {/* Profile Content */}
      <div className="w-full max-w-5xl mt-16 px-4 md:px-8 pb-10">
        <ProfileInformation userId={visitor_id} isOwnProfile={isOwnProfile} />

        <hr className="mt-6 border-gray-200" />

        {/* Tabs */}
        {!isOwnProfile && (
          <div className="flex justify-center mb-6 border-b border-gray-200 py-3 gap-2">
            <button
              onClick={() => setActiveTab("main")}
              className={`flex-1 max-w-[200px] flex justify-center py-2 rounded-md ${
                activeTab === "main" ? "text-orange-500 bg-orange-50" : "text-gray-400"
              }`}
            >
              <TbGridDots size={22} />
            </button>
            {role && roleTabIcon[role] && (
              <button
                onClick={() => setActiveTab(roleTabIcon[role].key)}
                className={`flex-1 max-w-[200px] flex justify-center py-2 rounded-md ${
                  activeTab === roleTabIcon[role].key ? "text-orange-500 bg-orange-50" : "text-gray-400"
                }`}
              >
                {React.createElement(roleTabIcon[role].icon, { size: 22 })}
              </button>
            )}
          </div>
        )}

        {/* Visitor Posts Grid */}
        {activeTab === "main" && visitorPostItems.length > 0 && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {visitorPostItems.map((post) => (
              <div
                key={post.id}
                className="w-full aspect-square overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer rounded-lg bg-white"
                onClick={() => console.log("Clicked post:", post.id)}
              >
                <img
                  src={post.image}
                  alt={post.caption || "Visitor post"}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {role === "visitor" && activeTab === "visited" && (
          <div className="mt-6">
            <MarketVisitList visitorId={visitor_id} />
          </div>
        )}

        {role === "vendor" && activeTab === "products" && (
          <div className="mt-6">
            <ProductList vendorId={visitor_id} isOwnProfile={isOwnProfile} />
          </div>
        )}

        {role === "organizer" && activeTab === "markets" && (
          <div className="mt-6">
            <OrganizerMarketList organizerId={visitor_id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitProfilePage;
