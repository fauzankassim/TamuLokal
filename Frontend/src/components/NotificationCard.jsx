import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const NotificationCard = ({ notif }) => {
  const navigate = useNavigate();
  const createdAt = new Date(notif.created_at + "Z");

  const handleClick = async () => {
    // Mark as read if not already
    if (!notif.is_read) {
      try {
        await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}/notification/${notif.id}/`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ is_read: true }),
          }
        );
        notif.is_read = true; // locally update to reflect change
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    }

    // Navigate if market_id exists
    if (notif.market_id) {
      navigate(`/market/${notif.market_id}`);
    }
  };

  return (
    <div
      className={`w-full py-3 min-h-[60px] flex flex-col justify-center border-b border-gray-200 ${
        notif.market_id ? "cursor-pointer hover:bg-gray-50 transition" : ""
      } ${notif.is_read ? "opacity-60" : "bg-[var(--white)]"}`}
      onClick={handleClick}
    >
      <div className="flex justify-between items-center">
        {/* Message title */}
        <p className="font-medium text-gray-800">{notif.message}</p>

        {/* Red dot for unread */}
        {!notif.is_read && (
          <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
        )}
      </div>

      <p className="text-xs text-gray-500 mt-1">
        {formatDistanceToNow(createdAt, { addSuffix: true })}
      </p>
    </div>
  );
};

export default NotificationCard;
