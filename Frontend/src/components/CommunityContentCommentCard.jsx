import React from "react";

const formatRelativeTime = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now - date;

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return `${weeks}w ago`;
};

const CommunityContentCommentCard = ({ comment, onReply }) => {
  return (
    <div className="w-full py-3">

      {/* Commenter Info */}
      <div className="flex items-start gap-3">
        <img
          src={comment.visitor?.image}
          alt={comment.visitor?.username}
          className="w-8 h-8 rounded-full object-cover"
        />

        <div className="flex flex-col leading-tight min-w-0">
          <div className="flex items-end gap-1 text-sm text-gray-800 -mt-1">
            <span className="font-semibold">{comment.visitor?.username}</span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-400 text-xs">
              {formatRelativeTime(comment.created_at)}
            </span>
          </div>
          <p className="text-gray-800 text-sm break-words whitespace-normal">{comment.comment}</p>

          {/* Reply button */}
        <button
            className="text-left text-xs text-gray-500 mt-1 hover:underline"
            onClick={() => {
                if (onReply) onReply(comment.id, comment.visitor?.username);
            }}
            >
            Reply
        </button>

        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 ml-8 border-l border-gray-200 pl-3 flex flex-col gap-3">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="py-1">

              <div className="flex items-center gap-2 mb-1">
                <img
                  src={reply.visitor?.image}
                  alt={reply.visitor?.username}
                  className="w-6 h-6 rounded-full object-cover"
                />

                <div className="flex items-center gap-1 text-xs text-gray-800">
                  <span className="font-medium">{reply.visitor?.username}</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-400">
                    {formatRelativeTime(reply.created_at)}
                  </span>
                </div>
              </div>

              <p className="text-gray-800 text-sm">{reply.reply}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default CommunityContentCommentCard;
