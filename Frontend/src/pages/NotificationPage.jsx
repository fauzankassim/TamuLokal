import { useEffect, useState, useMemo } from "react";
import { TbChevronLeft } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

import NotificationCard from "../components/NotificationCard";
import { useAuth } from "../hooks/useAuth";

const NotificationPage = () => {
  const session = useAuth();
  const user = session?.user;

  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const getNotificationLink = (notif) => {
  switch (notif.event_id) {
    case 1:
      return "/market/history/";
    case 2:
      return `/visitor/${notif.sender_id}/`;
    case 3:
      return `/market/${notif.market_id}/`;
    case 4:
      return `/business/market/${notif.market_id}/space`;
    case 5:
      return `/business/marketspace/`;
    case 6:
      return `/business/marketspace/application`;
    case 7:
      return `/business/market/${notif.market_id}/space`;
    default:
      return "#"; // fallback
  }
};

  useEffect(() => {
    if (!user?.id) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}/notification?user_id=${user.id}`
        );
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  // ─── Group notifications by Today / Yesterday / Older ─────────────
  const groupedNotifications = useMemo(() => {
    const today = [];
    const yesterday = [];
    const older = [];

    const now = new Date();
    const todayDate = now.toDateString();
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(now.getDate() - 1);
    const yDateString = yesterdayDate.toDateString();

    notifications.forEach((notif) => {
      const notifDate = new Date(notif.created_at + "Z").toDateString();

      if (notifDate === todayDate) {
        today.push(notif);
      } else if (notifDate === yDateString) {
        yesterday.push(notif);
      } else {
        older.push(notif);
      }
    });

    return { today, yesterday, older };
  }, [notifications]);

  return (
    <div className="relative h-screen overflow-hidden bg-[#FFFDFA] flex flex-col items-center font-inter p-4">

      {/* ─── Header ───────────────────────────────────────────────────── */}
      <div className="max-w-xl w-full">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/profile")}
            className="text-gray-700 hover:text-orange-500 transition"
          >
            <TbChevronLeft className="text-2xl" />
          </button>

          <h1 className="text-xl font-semibold text-gray-800">
            Notifications
          </h1>
        </div>
      </div>

      {/* ─── Notification List ───────────────────────────────────────── */}
      <div className="max-w-xl w-full space-y-6 overflow-y-auto pb-10">

        {loading ? (
          <p className="text-gray-500">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-500">No notifications yet.</p>
        ) : (
          <>
            {/* ─── Today ─────────── */}
            {groupedNotifications.today.length > 0 && (
              <div>
                <h2 className="text-[var(--black)] font-semibold mb-2">Today</h2>
                  {groupedNotifications.today.map((notif) => (
                    <NotificationCard
                      key={notif.id}
                      notif={notif}
                      onClick={() => navigate(getNotificationLink(notif))}
                    />
                  ))}
              </div>
            )}

            {/* ─── Yesterday ─────────── */}
            {groupedNotifications.yesterday.length > 0 && (
              <div>
                <h2 className="text-[var(--black)] font-semibold mb-2">Yesterday</h2>
                  {groupedNotifications.yesterday.map((notif) => (
                    <NotificationCard
                      key={notif.id}
                      notif={notif}
                      onClick={() => navigate(getNotificationLink(notif))}
                    />
                  ))}
              </div>
            )}

            {/* ─── Older ─────────── */}
            {groupedNotifications.older.map((notif) => (
              <NotificationCard
                key={notif.id}
                notif={notif}
                onClick={() => navigate(getNotificationLink(notif))}
              />
            ))}
          </>
        )}

      </div>

    </div>
  );
};

export default NotificationPage;
