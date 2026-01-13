import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TbPlus, TbFilter } from "react-icons/tb";
import { useAuth } from "../hooks/useAuth";
import CommunityContentCard from "../components/CommunityContentCard";
import CommunityForumCard from "../components/CommunityForumCard"; // NEW

// Skeleton card for loading state
const SkeletonCommunityCard = () => (
  <div className="bg-[var(--white)] shadow-sm hover:shadow-md transition animate-pulse mb-2">
    <div className="flex items-center justify-between px-4 py-3 gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="flex flex-col gap-1">
          <div className="w-24 h-4 bg-gray-200 rounded" />
          <div className="w-16 h-3 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="w-20 h-6 bg-gray-200 rounded-full" />
    </div>
    <div className="w-full h-48 bg-gray-200" />
    <div className="px-4 py-3 space-y-2">
      <div className="w-32 h-3 bg-gray-200 rounded" />
      <div className="w-full h-3 bg-gray-200 rounded" />
      <div className="w-3/4 h-3 bg-gray-200 rounded" />
      <div className="mt-2 flex gap-4">
        <div className="w-12 h-3 bg-gray-200 rounded" />
        <div className="w-16 h-3 bg-gray-200 rounded" />
      </div>
    </div>
    <div className="px-4 py-2 border-t border-gray-200 flex justify-around text-gray-600 text-sm">
      <div className="w-16 h-4 bg-gray-200 rounded" />
      <div className="w-16 h-4 bg-gray-200 rounded" />
      <div className="w-16 h-4 bg-gray-200 rounded" />
    </div>
  </div>
);

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState("Explore");
  const [filter, setFilter] = useState("Latest");
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = ["Explore", "Following", "Forum"];
  const filters = ["Latest", "Popular", "Nearby"];
  const navigate = useNavigate();
  const session = useAuth();
  const userId = session?.user?.id;

  const baseUrl = import.meta.env.VITE_BACKEND_API_URL;

  const handleNewContent = () => {
    if (activeTab === "Forum") {
      navigate("/community/add?type=forum");
    } else {
      navigate("/community/add?type=post");
    }
  };

  // ⭐ Fetch content whenever activeTab or userId changes
  useEffect(() => {
    if (!activeTab) return;

    const fetchContent = async () => {
      setLoading(true);
      try {
        let url = "";

        if (activeTab === "Explore") {
          url = `${baseUrl}/content/post/`;
        } else if (activeTab === "Following") {
          if (!userId) {
            setContent([]);
            setLoading(false);
            return;
          }
          url = `${baseUrl}/content/post?visitor_id=${userId}`;
        } else if (activeTab === "Forum") {
          url = `${baseUrl}/content/forum/`;
        } else {
          setContent([]);
          setLoading(false);
          return;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch content");
        const data = await res.json();
        setContent(data);
      } catch (err) {
        console.error(err);
        setContent([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [activeTab, userId, baseUrl]);

  console.log(content);
  return (
    <div className="min-h-screen">
      {/* Tabs Navbar */}
      <nav className="bg-[var(--white)] px-6 py-3 flex justify-center space-x-8 sticky top-0 z-50">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="relative text-[var(--black)] font-medium text-sm transition-colors hover:text-[var(--orange)]"
          >
            {tab}
            <span
              className={`absolute left-0 -bottom-1 h-0.5 w-full bg-[var(--orange)] transition-all ${
                activeTab === tab ? "scale-x-100" : "scale-x-0"
              }`}
              style={{ transformOrigin: "left" }}
            />
          </button>
        ))}
      </nav>

      {/* Secondary Toolbar */}
      <div className="bg-[var(--white)] shadow-sm px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2 text-[var(--black)] relative">
          <div className="flex items-center border border-[var(--black)] rounded-md px-2 py-1.5 bg-[var(--white)]">
            <TbFilter className="text-lg mr-1" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-transparent outline-none text-sm text-[var(--black)] cursor-pointer"
            >
              {filters.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleNewContent}
          className="flex items-center gap-1 bg-[var(--orange)] hover:bg-[var(--orange)] text-[var(--white)] text-sm font-medium px-3 py-1.5 rounded-full shadow-sm transition"
        >
          <TbPlus className="text-lg" />
          {activeTab === "Forum" ? "New Forum" : "New Post"}
        </button>
      </div>

      {/* Content List */}
      <div className="space-y-4 pb-20 mt-2 flex flex-col items-center">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-full max-w-xl">
                <SkeletonCommunityCard />
              </div>
            ))
          : content.length === 0
          ? (
            <div className="p-4 text-[var(--gray)] w-full text-center max-w-xl">
              No content available.
            </div>
            )
          : content.map((item) => (
              <div key={item.id} className="w-full max-w-xl">
                {activeTab === "Forum" ? (
                  <CommunityForumCard content={item} />
                ) : (
                  <CommunityContentCard
                    content={item}
                    type={activeTab === "Forum" ? "Forum" : "Post"}
                  />
                )}
              </div>
            ))
        }
      </div>
    </div>
  );
};

export default CommunityPage;