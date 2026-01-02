import React from "react";
import { TbChevronDown, TbChevronUp, TbClock } from "react-icons/tb";

const MarketTimeDropdown = ({ schedules = [], isOpen, onToggle }) => {
  const now = new Date();
  const todayIndex = now.getDay() === 0 ? 7 : now.getDay(); // Sunday = 7

  const weekdayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const isCurrentlyOpen = (schedule) => {
    if (!schedule) return false;
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const openParts = schedule.open_time.split(":").map(Number);
    const closeParts = schedule.close_time.split(":").map(Number);
    let openMinutes = openParts[0] * 60 + openParts[1];
    let closeMinutes = closeParts[0] * 60 + closeParts[1];

    if (closeMinutes <= openMinutes) closeMinutes += 24 * 60; // handle past-midnight

    return nowMinutes >= openMinutes && nowMinutes < closeMinutes;
  };

  // Determine today's schedule if exists
  const todaysSchedule = schedules.find(
    (s) => s.daily_day === todayIndex
  );

  const statusLabel = todaysSchedule
    ? isCurrentlyOpen(todaysSchedule)
      ? `Open until ${formatTime(todaysSchedule.close_time)}`
      : `Closed`
    : "Closed today";

  const statusColor = todaysSchedule && isCurrentlyOpen(todaysSchedule)
    ? "var(--green)"
    : "var(--red)";

  return (
    <div className="w-full overflow-hidden font-inter mt-2 border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center px-4 py-3 text-sm font-medium transition-colors"
        style={{ color: statusColor }}
      >
        <span className="flex items-center gap-2">
          <TbClock className="w-4 h-4" style={{ color: statusColor }} />
          {statusLabel}
        </span>

        {isOpen ? (
          <TbChevronUp className="w-4 h-4 text-[var(--gray)]" />
        ) : (
          <TbChevronDown className="w-4 h-4 text-[var(--gray)]" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 py-2 text-sm text-[var(--black)] space-y-1">
          {weekdayNames.map((dayName, index) => {
            const dayIndex = index + 1; // Monday=1, Sunday=7
            const schedule = schedules.find((s) => s.daily_day === dayIndex);
            const isToday = dayIndex === todayIndex;

            const label = schedule
              ? `${formatTime(schedule.open_time)} - ${formatTime(schedule.close_time)}`
              : "Closed";

            const labelColor = schedule ? "var(--black)" : "var(--red)";

            return (
              <p
                key={dayName}
                className={`flex justify-between ${isToday ? "font-semibold" : ""}`}
              >
                <span className="capitalize">{dayName}</span>
                <span style={{ color: labelColor }}>{label}</span>
              </p>
            );
          })}

          {/* Render once-off events */}
          {schedules
            .filter((s) => s.once_date)
            .map((s) => (
              <p key={s.id} className="flex justify-between font-medium text-[var(--blue)]">
                <span>Special: {new Date(s.once_date).toLocaleDateString()}</span>
                <span>
                  {formatTime(s.open_time)} - {formatTime(s.close_time)}
                </span>
              </p>
            ))}
        </div>
      )}
    </div>
  );
};

export default MarketTimeDropdown;
