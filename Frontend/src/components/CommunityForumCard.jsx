import React, { useState, useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { TbHeart, TbHeartFilled, TbMessageCircle, TbShare2 } from "react-icons/tb";
import { useAuth } from "../hooks/useAuth";
import CommunityContentCommentPopup from "./CommunityContentCommentPopup";

const formatDate = (dateString) => {
  if (!dateString) return "";
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

const CommunityForumCard = ({ content }) => {
  const session = useAuth();
  const userId = session?.user?.id;

  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [engagement, setEngagement] = useState({ total_likes: 0, total_comments: 0 });

  const contentId = content?.content_id || content?.id;

  useEffect(() => {
    if (!contentId) return;
    const fetchEngagement = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}/content/${contentId}/engagement`
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
  }, [contentId]);

  useEffect(() => {
    if (!userId || !contentId) return;
    const checkLikeStatus = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}/content/like?visitor_id=${userId}&content_id=${contentId}`
        );
        const data = await response.json();
        setIsLiked(Array.isArray(data) ? data.length > 0 : false);
      } catch (err) {
        console.error("Error checking like status:", err);
      }
    };
    checkLikeStatus();
  }, [userId, contentId]);

  const handleLikeToggle = async () => {
    if (!userId || !contentId) return;

    try {
      if (isLiked) {
        await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}/content/like?visitor_id=${userId}&content_id=${contentId}`,
          { method: "DELETE" }
        );
        setIsLiked(false);
        setEngagement((prev) => ({ ...prev, total_likes: Math.max(0, prev.total_likes - 1) }));
      } else {
        await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/content/like`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitor_id: userId,
            content_id: contentId,
          }),
        });
        setIsLiked(true);
        setEngagement((prev) => ({ ...prev, total_likes: prev.total_likes + 1 }));
      }
    } catch (err) {
      console.error("Error liking/unliking content:", err);
    }
  };

  const handleShare = useCallback(async () => {
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/community/${contentId}`
        : "";
    const title = content?.title || "Check this forum";
    const text = content?.caption || "Have a look at this forum";

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
  }, [content?.caption, content?.title, contentId]);

  const marketName = content?.market_name;
  const forumTitle = content?.title || "Forum";
  const caption = content?.caption || "";
  const createdAt = formatDate(content?.created_at);
  const author = content?.visitor_username || content?.visitor_name || "";

  return (
    <div className="bg-[var(--white)] shadow-sm hover:shadow-md transition rounded-lg border border-gray-100">
      {/* Header */}
      <div className="px-4 py-3 flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          {marketName && (
            <NavLink
              to={`/market/${content?.market_id ?? ""}`}
              className="text-xs font-semibold text-[var(--orange)] uppercase tracking-wide hover:underline"
            >
              {marketName}
            </NavLink>
          )}
          <h3 className="text-base font-semibold text-[var(--black)]">{forumTitle}</h3>
        </div>
        {author && (
          <div className="text-xs text-[var(--gray)] whitespace-nowrap">
            Posted by @{author}
          </div>
        )}
      </div>

      {/* Body */}
      {caption && (
        <div className="px-4 pb-3 text-sm text-[var(--black)]">
          <p>{caption}</p>
        </div>
      )}

      {/* Engagement counts + author aligned */}
      <div className="px-4 pb-2 text-xs text-[var(--gray)] flex items-center justify-between">
        <div className="flex gap-4">
          <span>{engagement.total_likes} Likes</span>
          <span>{engagement.total_comments} Comments</span>
        </div>
        {createdAt && (
          <div className="whitespace-nowrap">
            {createdAt}
          </div>
        )}

      </div>

      {/* Footer actions */}
      <div className="px-4 py-2 border-t border-gray-200 flex justify-around text-sm text-[var(--gray)]">
        <button
          onClick={handleLikeToggle}
          className="flex items-center gap-1 hover:text-[var(--orange)] transition"
        >
          {isLiked ? (
            <TbHeartFilled className="text-lg text-red-500" />
          ) : (
            <TbHeart className="text-lg" />
          )}
          Like
        </button>
        <button
          onClick={() => setShowComments(true)}
          className="flex items-center gap-1 hover:text-[var(--orange)] transition"
        >
          <TbMessageCircle className="text-lg" />
          Comment
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-1 hover:text-[var(--orange)] transition"
        >
          <TbShare2 className="text-lg" />
          Share
        </button>
      </div>

      {/* Comments popup */}
      {showComments && (
        <CommunityContentCommentPopup
          contentId={contentId}
          onClose={() => setShowComments(false)}
        />
      )}
    </div>
  );
};

export default CommunityForumCard;