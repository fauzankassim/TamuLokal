import { useLocation, useNavigate } from "react-router-dom";
import CommunityPostForm from "../components/CommunityPostForm";
import CommunityForumForm from "../components/CommunityForumForm";
import Header from "../components/Header";
import { useState } from "react";
import Spinner from "../components/Spinner";

const CommunityActionPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type") || "post"; // default to post

  const isPost = type !== "forum";

  if (isSubmitting) return <Spinner loading={true} />
  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      <Header title={type === "forum" ? "New Forum" : "New Post"} backPath="/community" />

      <main className="flex-1 flex justify-center px-4 py-6">
        <div className="w-full max-w-3xl">
          {/* No box on mobile; card styling starts at md */}
          <div className="p-0 sm:p-6 md:p-8 md:bg-white md:shadow-sm md:rounded-xl md:border md:border-gray-100">
            {type === "forum" ? <CommunityForumForm /> : <CommunityPostForm setSubmitting={setIsSubmitting}/>}
          </div>

          {/* Desktop-only share button outside the box */}
          {isPost && (
            <div className="hidden md:flex justify-end mt-4">
              <button
                type="submit"
                form="community-post-form"
                className="px-6 py-3 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition"
              >
                Share
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CommunityActionPage;