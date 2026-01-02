import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CommunityContentList from "../components/CommunityContentList";
import { TbPlus, TbFilter } from "react-icons/tb";

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState("Explore");
  const [filter, setFilter] = useState("Latest");
  const tabs = ["Explore", "Following", "Forum"];
  const filters = ["Latest", "Popular", "Nearby"];
  const navigate = useNavigate();

  const handleNewContent = () => {
    if (activeTab === "Forum") {
      navigate("/community/add?type=forum");
    } else {
      navigate("/community/add?type=post");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tabs Navbar */}
      <nav className="bg-white shadow-sm px-6 py-3 flex justify-center space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="relative text-gray-600 font-medium text-sm transition-colors hover:text-orange-500"
          >
            {tab}
            <span
              className={`absolute left-0 -bottom-1 h-0.5 w-full bg-orange-500 transition-all ${
                activeTab === tab ? "scale-x-100" : "scale-x-0"
              }`}
              style={{ transformOrigin: "left" }}
            />
          </button>
        ))}
      </nav>

      {/* Secondary Toolbar */}
      <div className="bg-white shadow-sm px-6 py-3 flex justify-between items-center">
        {/* Filter Section */}
        <div className="flex items-center gap-2 text-gray-600 relative">
          <div className="flex items-center border border-gray-300 rounded-md px-2 py-1.5 bg-white">
            <TbFilter className="text-lg mr-1" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-transparent outline-none text-sm text-gray-700 cursor-pointer"
            >
              {filters.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* + Create Button */}
        <button
          onClick={handleNewContent}
          className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-3 py-1.5 rounded-full shadow-sm transition"
        >
          <TbPlus className="text-lg" />
          {activeTab === "Forum" ? "New Forum" : "New Post"}
        </button>
      </div>

      {/* Content List */}
      <div>
        <CommunityContentList type={activeTab} filter={filter} />
      </div>
    </div>
  );
};

export default CommunityPage;
