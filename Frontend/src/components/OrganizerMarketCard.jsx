import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  TbLayoutGrid,
  TbClock,
  TbEdit,
  TbStar,
  TbChartPie,
  TbSpeakerphone
} from "react-icons/tb";

const OrganizerMarketCard = ({ market, isVendor = false, onView }) => {
  const [showSchedule, setShowSchedule] = useState(false);

  return (
    <div className="relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer h-[208px]">
      {/* Image */}
      <img
        src={market.image || market.market_image || "/default-market.png"}
        alt={market.name || market.market_name }
        className="w-full h-full object-cover"
      />

      {/* Static dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {!isVendor && (
        <div className="absolute bottom-2 left-2 right-2 flex justify-between z-10">
          {/* Bottom-left icons */}
          <div className="flex gap-2">
            <NavLink
              to={`/business/market/${market.id}/space`}
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg bg-black/60 text-white backdrop-blur cursor-pointer"
              title="Manage Space"
            >
              <TbLayoutGrid size={20} />
            </NavLink>
            <NavLink
              to={`/business/market/${market.id}/reviews`}
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg bg-black/60 text-white backdrop-blur cursor-pointer"
              title="Reviews"
            >
              <TbStar size={20} />
            </NavLink>
            <NavLink
              to="#"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg bg-black/60 text-white backdrop-blur cursor-pointer"
              title="Announcement"
            >
              <TbSpeakerphone size={20} />
            </NavLink>
            <NavLink
              to={`/business/market/${market.id}/statistics`}
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg bg-black/60 text-white backdrop-blur cursor-pointer"
              title="Statistics"
            >
              <TbChartPie size={20} />
            </NavLink>
          </div>

          {/* Bottom-right edit icon */}
          <NavLink
            to={`/business/market/${market.id}/edit`}
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg bg-black/60 text-white backdrop-blur cursor-pointer"
            title="Edit Market"
          >
            <TbEdit size={20} />
          </NavLink>
        </div>
      )}

      {/* Vendor view */}
      {isVendor && (
        <>
          {/* Bottom-left: available spaces + schedule */}
          <div className="absolute bottom-2 left-2 flex items-center gap-2 z-10">
            {/* Available spaces */}
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-full text-white cursor-default">
              <TbLayoutGrid size={20} />
              <span className="text-xs font-medium">{market.available_space}</span>
            </div>

            {/* Schedule */}
            {market.schedules?.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSchedule(!showSchedule);
                }}
                className="flex items-center gap-1 bg-black/60 p-1 rounded-full text-white hover:bg-black/80 transition text-xs font-medium"
                title="View Schedule"
              >
                <TbClock size={20} />
                <span>{market.schedules.length}</span>
              </button>
            )}
          </div>

          {/* Schedule popup */}
          {showSchedule && (
            <div className="absolute bottom-12 left-2 bg-black/80 text-white text-xs rounded p-2 z-20 max-h-40 overflow-y-auto">
              {market.schedules.length > 0 && (
                <div className="mb-1">
                  <span className="font-semibold">
                    {market.schedules[0].recurrence_type}
                  </span>
                </div>
              )}
              {market.schedules.map((sch) => {
                // Helper to convert 1-7 to weekday names
                const weekdayMap = {
                  1: "Monday",
                  2: "Tuesday",
                  3: "Wednesday",
                  4: "Thursday",
                  5: "Friday",
                  6: "Saturday",
                  7: "Sunday"
                };

                // Convert open/close time to 12-hour format
                const formatTime12 = (timeStr) => {
                  const [h, m, s] = timeStr.split(":").map(Number);
                  const ampm = h >= 12 ? "PM" : "AM";
                  const hour12 = h % 12 === 0 ? 12 : h % 12;
                  return `${hour12}:${m.toString().padStart(2, "0")} ${ampm}`;
                };

                // Determine display string for recurrence
                let recurrenceDisplay = "";
                if (sch.daily_day) {
                  recurrenceDisplay = `Every Day ${weekdayMap[sch.daily_day] || ""}`;
                } else if (sch.weekly_day) {
                  recurrenceDisplay = `${weekdayMap[sch.weekly_day] || ""}`;
                } else if (sch.monthly_day) {
                  recurrenceDisplay = `Day ${sch.monthly_day} of every month`;
                } else if (sch.annually_day && sch.annually_month) {
                  recurrenceDisplay = `On ${sch.annually_day}/${sch.annually_month}`;
                } else if (sch.once_date) {
                  recurrenceDisplay = sch.once_date;
                }

                return (
                  <div key={sch.schedule_id} className="mb-1">
                    <div>{recurrenceDisplay}</div>
                    <div>
                      {formatTime12(sch.open_time)} - {formatTime12(sch.close_time)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}


          {/* Bottom-right View button */}
          <NavLink
            to={`/business/market/${market.market_id || market.id}/space`}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-lg font-medium hover:bg-orange-600 transition z-10"
            title="View Market"
          >
            View
          </NavLink>
        </>
      )}

      {/* Market Name centered */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h3 className="text-white font-semibold text-lg drop-shadow text-center px-4 line-clamp-2">
          {market.name || market.market_name }
        </h3>
      </div>
    </div>
  );
};

export default OrganizerMarketCard;
