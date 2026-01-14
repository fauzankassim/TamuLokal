import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import CommunityContentCommentCard from "./CommunityContentCommentCard";
import { useNavigate } from "react-router-dom";

const CommunityContentCommentPopup = ({ contentId, onClose }) => {
  const navigate = useNavigate();
  const [replyingTo, setReplyingTo] = useState("");

  const [replyingToCommentId, setReplyingToCommentId] = useState(""); // for POST URL
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const session = useAuth();
  const userId = session?.user?.id;

  const fetchComments = async () => {
        try {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_API_URL}/content/${contentId}/comment`
        );
        const data = await response.json();
        setComments(data);
        } catch (err) {
        console.error("Error fetching comments:", err);
        }
    };

    useEffect(() => {
        // Disable body scroll
        document.body.style.overflow = "hidden";
        fetchComments();

        return () => {
        // Re-enable body scroll when popup closes
        document.body.style.overflow = "";
        };
    }, [contentId]);

    const handleSubmitComment = async () => {
    if (!userId) {
      navigate("/auth");
      return
    }
    if (!newComment.trim()) return;


    try {
        if (replyingToCommentId) {
        // Post reply
        await fetch(
            `${import.meta.env.VITE_BACKEND_API_URL}/content/reply`,
            {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                comment_id: replyingToCommentId,
                visitor_id: userId,
                reply: newComment.trim(),
            }),
            }
        );
    } else {
    // Post normal comment
        await fetch(
            `${import.meta.env.VITE_BACKEND_API_URL}/content/${contentId}/comment`,
            {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content_id: contentId,
                visitor_id: userId,
                comment: newComment.trim(),
            }),
            }
        );
    }

    setNewComment("");
    setReplyingToCommentId(""); // reset reply
    setReplyingTo(""); // reset placeholder
    fetchComments(); // refresh comments
} catch (err) {
    console.error("Error submitting comment or reply:", err);
}
    };


  return (
    <div className="fixed inset-0 z-[9999] flex justify-center items-end bg-black/40">
      <div className="bg-white w-full max-w-lg h-[75vh] rounded-t-2xl flex flex-col overflow-hidden">
        {/* Header + Close */}
        <div className="p-4 relative border-b border-gray-200">
          <h3 className="font-medium text-lg">Comments</h3>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto px-4">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-sm">No comments yet.</p>
          ) : (
            comments.map((c) => (
                <CommunityContentCommentCard
                    key={c.id}
                    comment={c}
                    onReply={(commentId, username) => {
                        setReplyingTo(username);
                        setReplyingToCommentId(commentId);
                    }}
                />
            ))
          )}
        </div>

        {/* Input for new comment */}
        <div className="p-4 border-t border-gray-200 flex gap-2">
        <input
            type="text"
            placeholder={replyingTo ? `Replying to ${replyingTo}` : "Write a comment..."}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring focus:border-orange-500"
        />
          <button
            onClick={handleSubmitComment}
            className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm hover:bg-orange-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityContentCommentPopup;
