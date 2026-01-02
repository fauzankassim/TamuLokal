import React from "react";
import { NavLink } from "react-router-dom";
import { useDistance } from "../hooks/useDistance";
import { TbStarFilled, TbArrowRight, TbCircleFilled, TbWalk } from "react-icons/tb";

const MarketCard = ({ market, height = 250 }) => {
  const { distance, loading } = useDistance(market.latitude, market.longitude);
  const now = new Date();
  const currentDay = now.getDay() + 1; // JS: Sunday=0, Daily schedule: 1=Monday, so adjust if needed

  // Helper: convert hh:mm:ss to minutes
  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  // Find today's active schedules
  const todaySchedules = (market.schedules || []).filter((s) => {
    // Daily schedule
    if (s.daily_day && s.daily_day === currentDay) return true;
    // Weekly schedule
    if (s.weekly_day && s.weekly_day === currentDay) return true;
    // Once-date schedule
    if (s.once_date && new Date(s.once_date).toDateString() === now.toDateString()) return true;
    // TODO: handle monthly / annual if needed
    return false;
  });

  // Determine if market is currently open
  let isOpen = false;
  let statusText = "";

 if (todaySchedules.length > 0) {
  // Use first schedule for simplicity
  const schedule = todaySchedules[0];
  const openMinutes = timeToMinutes(schedule.open_time);
  const closeMinutes = timeToMinutes(schedule.close_time);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const openBeforeClose = openMinutes <= closeMinutes;
  if (openBeforeClose) {
    isOpen = currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  } else {
    isOpen = currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
  }

  const diff = isOpen
    ? closeMinutes >= currentMinutes
      ? closeMinutes - currentMinutes
      : (24 * 60 - currentMinutes) + closeMinutes
    : openMinutes >= currentMinutes
    ? openMinutes - currentMinutes
    : (24 * 60 - currentMinutes) + openMinutes;

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  statusText = isOpen
    ? hours > 0
      ? `Closes in ${hours}h ${minutes}m`
      : `Closes in ${minutes}m`
    : hours > 0
    ? `Opens in ${hours}h ${minutes}m`
    : `Opens in ${minutes}m`;
} else {
  // No schedule today → find next upcoming schedule
  const nowTime = now.getTime();
  const schedules = (market.schedules || []).map((s) => {
    if (s.daily_day) return { ...s, type: "daily", dayOfWeek: s.daily_day };
    if (s.weekly_day) return { ...s, type: "weekly", dayOfWeek: s.weekly_day };
    if (s.once_date) {
      const d = new Date(s.once_date);
      return { ...s, type: "once", onceDate: d.getTime(), originalDate: d };
    }
    return null;
  }).filter(Boolean);

  if (schedules.length > 0) {
    // Separate past once-date schedules
    const pastOnce = schedules.filter(s => s.type === "once" && s.onceDate < nowTime);
    const futureSchedules = schedules.filter(s => s.type !== "once" || s.onceDate >= nowTime);

    if (futureSchedules.length > 0) {
      // Sort by next upcoming day/date
      const sorted = futureSchedules.sort((a, b) => {
        const aDiff = a.type === "once" ? a.onceDate - nowTime
          : ((a.dayOfWeek + 7 - (now.getDay() + 1)) % 7) * 24*60*60*1000;
        const bDiff = b.type === "once" ? b.onceDate - nowTime
          : ((b.dayOfWeek + 7 - (now.getDay() + 1)) % 7) * 24*60*60*1000;
        return aDiff - bDiff;
      });

      const next = sorted[0];
      if (next.type === "once") {
        const options = { weekday: "long", month: "short", day: "numeric" };
        statusText = `Opens on ${next.originalDate.toLocaleDateString("en-US", options)}`;
      } else {
        const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        statusText = `Opens on ${dayNames[next.dayOfWeek % 7]}`;
      }
    } else if (pastOnce.length > 0) {
      // Show last ended once-event
      const last = pastOnce.sort((a,b) => b.onceDate - a.onceDate)[0];
      const options = { weekday: "long", month: "short", day: "numeric" };
      statusText = `Market has ended on ${last.originalDate.toLocaleDateString("en-US", options)}`;
    } else {
      statusText = "No upcoming schedule";
    }
  } else {
    statusText = "No upcoming schedule";
  }
}


  return (
    <NavLink
      to={`/market/${market.id}`}
      className="
        relative rounded-2xl overflow-hidden
        hover:scale-[1.01] active:scale-[0.99]
        transition-all duration-300 block
        snap-start flex-shrink-0 shadow-md
      "
      style={{ height: `${height}px` }}
    >
      {/* Image */}
      <img src={market.image} alt={market.name} className="w-full h-full object-cover" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      {/* Reviews */}
      <div className="absolute top-3 left-3 flex flex-col gap-1">
        <div className="bg-black/40 backdrop-blur px-2 py-1 rounded-lg flex items-center text-white text-xs gap-1 shadow">
          {market.total_reviews > 0 ? (
            <>
              <TbStarFilled className="text-yellow-300 w-3.5 h-3.5" />
              <span className="font-medium">{market.average_rating.toFixed(1)}</span>
            </>
          ) : (
            <span className="text-white/70">No reviews yet</span>
          )}
        </div>
      </div>

      {/* Distance */}
      <div className="absolute top-3 right-3 text-xs bg-black/40 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-white shadow">
        <TbWalk className="w-3.5 h-3.5 opacity-80" />
        {loading ? "..." : `${distance} km`}
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-3 left-3 right-3 text-white flex flex-col gap-2">
        <h2 className="font-semibold text-lg drop-shadow leading-tight line-clamp-1">
          {market.name}
        </h2>
        <div className="flex items-center gap-2 text-[11px] bg-white/20 backdrop-blur px-2 py-1 rounded-full w-fit">
          <TbCircleFilled className={`w-3 h-3 ${isOpen ? "text-green-400" : "text-red-400"}`} />
          <span className="font-medium">{isOpen ? "Open now" : "Closed"} · {statusText}</span>
        </div>
      </div>

      {/* Arrow CTA */}
      <TbArrowRight className="absolute bottom-3 right-3 w-6 h-6 text-white opacity-80 group-hover:translate-x-1 transition-all" />
    </NavLink>
  );
};

export default MarketCard;
