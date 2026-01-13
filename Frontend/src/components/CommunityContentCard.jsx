import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { NavLink } from "react-router-dom";
import { TbHeart, TbHeartFilled, TbMessageCircle, TbShare2 } from "react-icons/tb";
import CommunityContentCommentPopup from "./CommunityContentCommentPopup";

// Helper function to format created_at
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return diffMinutes <= 1 ? "just now" : `${diffMinutes} minutes ago`;
    }
    return `${diffHours} hours ago`;
  } else if (diffDays === 1) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString();
  }
};

const CommunityContentCard = ({ content, type }) => {
  const [showComments, setShowComments] = useState(false);
  const session = useAuth();
  const userId = session?.user?.id;

  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // New state for engagement
  const [engagement, setEngagement] = useState({ total_likes: 0, total_comments: 0 });

  // Fetch engagement counts
  useEffect(() => {
    const fetchEngagement = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}/content/${content.content_id}/engagement`
        );
        if (res.ok) {
          const data = await res.json();
          setEngagement({
            total_likes: data.total_likes || 0,
            total_comments: data.total_comments || 0,
          });
        }
      } catch (err) {
        console.error("Error fetching engagement:", err);
      }
    };

    fetchEngagement();
  }, [content.content_id]);

  // Follow/unfollow
  const handleFollowToggle = async () => {
    if (!userId) return;

    try {
      if (isFollowing) {
        await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}/user/follow?follower_id=${userId}&following_id=${content.visitor_id}`,
          { method: "DELETE" }
        );
        setIsFollowing(false);
      } else {
        await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/user/follow`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            follower_id: userId,
            following_id: content.visitor_id,
          }),
        });
        setIsFollowing(true);
      }
    } catch (err) {
      console.error("Error following/unfollowing:", err);
    }
  };

  // Like/unlike
  const handleLikeToggle = async () => {
    if (!userId) return;

    try {
      if (isLiked) {
        await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}/content/like?visitor_id=${userId}&content_id=${content.content_id}`,
          { method: "DELETE" }
        );
        setIsLiked(false);
      } else {
        await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/content/like`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitor_id: userId,
            content_id: content.content_id,
          }),
        });
        setIsLiked(true);
      }
    } catch (err) {
      console.error("Error liking/unliking content:", err);
    }
  };

  // Share
  const handleShare = useCallback(async () => {
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/community/${content.content_id}`
        : "";

    const title = content.market_name || "Check this out";
    const text = content.caption || "Have a look at this post";

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard");
      }
    } catch (err) {
      console.error("Error sharing content:", err);
    }
  }, [content.caption, content.content_id, content.market_name]);

  // Check follow status
  useEffect(() => {
    if (!userId) return;

    const checkFollowStatus = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}/user/follow?follower_id=${userId}&following_id=${content.visitor_id}`
        );

        const data = await response.json();

        setIsFollowing(data.length > 0);
      } catch (err) {
        console.error("Error checking follow status:", err);
      }
    };

    checkFollowStatus();
  }, [userId, content.visitor_id]);

  useEffect(() => {
    if (!userId) return;

    const checkLikeStatus = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}/content/like?visitor_id=${userId}&content_id=${content.content_id}`
        );
        const data = await response.json();
        setIsLiked(data.length > 0);
      } catch (err) {
        console.error("Error checking like status:", err);
      }
    };

    checkLikeStatus();
  }, [userId, content.content_id]);

  return (
    <div className="bg-[var(--white)] shadow-sm hover:shadow-md transition">
      {/* Visitor info + Follow button */}
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        <div className="flex items-center gap-3">
          <NavLink
            to={`/visitor/${content.visitor_id}`}
            className="flex items-center gap-3"
          >
            <img
              src={content.visitor_image}
              alt={content.visitor_username}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div className="flex flex-col">
              <span className="font-semibold text-[var(--black)] hover:underline">
                {content.visitor_username}
              </span>

              <span className="text-xs text-[var(--gray)]">
                {formatDate(content.created_at)}
              </span>
            </div>
          </NavLink>
        </div>

        {/* Follow / Following Button */}
        <button
          onClick={handleFollowToggle}
          className={`w-30 text-center px-3 py-1 text-sm font-medium rounded-full border transition ${
            isFollowing
              ? "border-[var(--orange)] text-[var(--white)] bg-[var(--orange)] hover:bg-[var(--white)] hover:text-[var(--orange)]"
              : "border-[var(--orange)] text-[var(--orange)] hover:bg-[var(--orange)] hover:text-[var(--white)]"
          }`}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      </div>

      {/* Content image */}
      {type === "Post" && content.image && (
        <img
          src={content.image}
          alt={content.title}
          className="w-full aspect-square object-cover"
        />
      )}

      {/* Title & caption */}
      <div className="px-4 py-3">
        <div className="mb-2 text-sm">
          <NavLink
            to={`/market/${content.market_id}`}
            className="font-medium text-[var(--orange)] hover:underline"
          >
            {content.market_name}
          </NavLink>
        </div>
        <p className="text-[var(--black)] text-sm mt-1">{content.caption}</p>

        {/* Engagement counts */}
        <div className="mt-2 text-xs text-[var(--gray)] flex gap-4">
          <span>{engagement.total_likes} Likes</span>
          <span>{engagement.total_comments} Comments</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-4 py-2 border-t border-gray-200 flex justify-around text-[var(--black)] text-sm">
        <button
          onClick={handleLikeToggle}
          className="flex items-center gap-1  hover:text-[var(--orange)] transition"
        >
          {isLiked ? (
            <TbHeartFilled className="text-lg text-red-500" />
          ) : (
            <TbHeart className="text-lg text-gray-600 hover:text-orange-500" />
          )}
          Like
        </button>
        <button
          onClick={() => setShowComments(true)}
          className="flex items-center gap-1 hover:text-[var(--orange)] transition"
        >
          <TbMessageCircle className="text-lg" /> Comment
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1 hover:text-[var(--orange)] transition"
        >
          <TbShare2 className="text-lg" /> Share
        </button>
      </div>

      {/* Bottom comment popup */}
      {showComments && (
        <CommunityContentCommentPopup
          contentId={content.content_id}
          onClose={() => setShowComments(false)}
        />
      )}
    </div>
  );
};

export default CommunityContentCard;