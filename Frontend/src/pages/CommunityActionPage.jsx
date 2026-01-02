import { useLocation, useNavigate } from "react-router-dom";
import { TbChevronLeft } from "react-icons/tb";
import CommunityPostForm from "../components/CommunityPostForm";
import CommunityForumForm from "../components/CommunityForumForm";

const CommunityActionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type") || "post"; // default to post

  return (
    <div className="relative h-screen overflow-hidden bg-gray-50 flex flex-col items-center px-4 py-4">
      <div className="max-w-xl w-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/community")}
            className="text-gray-700 hover:text-orange-500 transition"
          >
            <TbChevronLeft className="text-2xl" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            {type === "forum" ? "New Forum" : "New Post"}
          </h1>
        </div>

        {/* Form */}
        {type === "forum" ? <CommunityForumForm /> : <CommunityPostForm />}
      </div>
    </div>
  );
};

export default CommunityActionPage;
