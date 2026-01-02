import React, { useState } from "react";

const MarketScheduleInput = ({ schedule, setSchedule }) => {
  const [frequency, setFrequency] = useState(schedule?.frequency || "daily");

  const handleChange = (key, value) => {
    setSchedule((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const dayOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="bg-white shadow-sm p-4 rounded-xl space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Market Schedule</h3>

      {/* Frequency selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Frequency
        </label>
        <select
          value={frequency}
          onChange={(e) => {
            setFrequency(e.target.value);
            handleChange("frequency", e.target.value);
          }}
          className="w-full border-gray-300 rounded-lg p-2 text-sm"
        >
          <option value="daily">Daily</option>
          <option value="once">Once</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Conditional fields based on frequency */}
      {frequency === "daily" && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Open Time
            </label>
            <input
              type="time"
              value={schedule.open_time || ""}
              onChange={(e) => handleChange("open_time", e.target.value)}
              className="w-full border-gray-300 rounded-lg p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Close Time
            </label>
            <input
              type="time"
              value={schedule.close_time || ""}
              onChange={(e) => handleChange("close_time", e.target.value)}
              className="w-full border-gray-300 rounded-lg p-2 text-sm"
            />
          </div>
        </div>
      )}

      {frequency === "once" && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={schedule.date || ""}
              onChange={(e) => handleChange("date", e.target.value)}
              className="w-full border-gray-300 rounded-lg p-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={schedule.open_time || ""}
                onChange={(e) => handleChange("open_time", e.target.value)}
                className="w-full border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={schedule.close_time || ""}
                onChange={(e) => handleChange("close_time", e.target.value)}
                className="w-full border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {(frequency === "weekly" || frequency === "monthly" || frequency === "yearly") && (
        <div className="space-y-3">
          {/* Select day for weekly / monthly / yearly */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Day
            </label>
            <select
              value={schedule.day || ""}
              onChange={(e) => handleChange("day", e.target.value)}
              className="w-full border-gray-300 rounded-lg p-2 text-sm"
            >
              <option value="">Select day</option>
              {dayOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Open Time
              </label>
              <input
                type="time"
                value={schedule.open_time || ""}
                onChange={(e) => handleChange("open_time", e.target.value)}
                className="w-full border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Close Time
              </label>
              <input
                type="time"
                value={schedule.close_time || ""}
                onChange={(e) => handleChange("close_time", e.target.value)}
                className="w-full border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketScheduleInput;
