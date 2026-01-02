import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth"; // assuming you have a hook for current user
import CommunityContentCard from "./CommunityContentCard";

const CommunityContentList = ({ type }) => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const session = useAuth(); // get logged-in user
  const userId = session?.user?.id;

  const baseUrl = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(() => {
    if (!type) return;

    const fetchContent = async () => {
      setLoading(true);
      try {
        let url = "";

        if (type === "Explore") {
          url = `${baseUrl}/content/post/`;
        } else if (type === "Following") {
          if (!userId) {
            setContent([]);
            setLoading(false);
            return;
          }
          // Pass user_id so backend can return posts from followed users
          url = `${baseUrl}/content/post?visitor_id=${userId}`;
        } else if (type === "Forum") {
          url = `${baseUrl}/content/forum/`;
        } else {
          setContent([]);
          setLoading(false);
          return;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch content");
        const data = await res.json();
        console.log(data);
        setContent(data);
      } catch (err) {
        console.error(err);
        setContent([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [type, userId]);

  if (loading) return <div className="p-4 text-gray-500">Loading...</div>;

  if (content == null)
    return <div className="p-4 text-gray-400">No content available.</div>;

  return (
    <div className="space-y-2 pb-20">
      {content.map((item) => (
        <CommunityContentCard           
            key={item.id}
            content={item}
            type={type === "Forum" ? "Forum" : "Post"}
        />
      ))}
    </div>
  );
};

export default CommunityContentList;
