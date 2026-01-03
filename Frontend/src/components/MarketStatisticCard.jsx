import React from 'react';
import { TbCaretUpFilled, TbCaretDownFilled } from 'react-icons/tb';

const MarketStatisticCard = ({ title, data, trendText, filter, filterByTime }) => {
  const filteredData = filterByTime(data);
  const isRatingCard = title === "Rating";

  const count = isRatingCard
    ? filteredData.length > 0
      ? (filteredData.reduce((sum, item) => sum + (item.rating || 0), 0) / filteredData.length).toFixed(1)
      : "0.0"
    : filteredData.length;

  // totalCount for trendText
  const totalCount = isRatingCard
    ? data.length > 0
      ? data.length
      : 0
    : data.length;

  // 🔹 Previous period and trend logic (same as before)
  const getPreviousPeriodCount = () => {
    if (!data) return 0;
    const now = new Date();
    const previousData = data.filter((item) => {
      const created = new Date(item.created_at);
      switch (filter) {
        case "today": {
          const yesterday = new Date(now);
          yesterday.setDate(now.getDate() - 1);
          return created.toDateString() === yesterday.toDateString();
        }
        case "week": {
          const lastWeekStart = new Date(now);
          lastWeekStart.setDate(now.getDate() - now.getDay() - 7);
          const lastWeekEnd = new Date(lastWeekStart);
          lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
          return created >= lastWeekStart && created <= lastWeekEnd;
        }
        case "month": {
          const lastMonth = now.getMonth() - 1;
          const year = lastMonth < 0 ? now.getFullYear() - 1 : now.getFullYear();
          const month = lastMonth < 0 ? 11 : lastMonth;
          return created.getMonth() === month && created.getFullYear() === year;
        }
        case "year": {
          const lastYear = now.getFullYear() - 1;
          return created.getFullYear() === lastYear;
        }
        case "all":
        default:
          return false;
      }
    });

    if (isRatingCard) {
      return previousData.length > 0
        ? previousData.reduce((sum, item) => sum + (item.rating || 0), 0) / previousData.length
        : 0;
    }

    return previousData.length;
  };

  const prevCount = getPreviousPeriodCount();

  let trendUp, trendPercent;
  const currentCount = isRatingCard ? parseFloat(count) : Number(count);

  trendUp = currentCount >= prevCount;
  if (currentCount === 0 && prevCount === 0) trendPercent = 0;
  else if (prevCount === 0) trendPercent = 100;
  else trendPercent = Math.floor(((currentCount - prevCount) / prevCount) * 100);

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <div className="flex items-end justify-start">
        <p className="text-4xl font-semibold text-gray-800">{count}</p>
        {filter !== "all" && (
          <div className="flex items-end">
            {trendUp ? (
              <TbCaretUpFilled className="text-green-500 -mb-2.5 -mx-1.5" size={40} />
            ) : (
              <TbCaretDownFilled className="text-red-500 -mb-1.5 -mx-1.5" size={40}/>
            )}
            <span className={`text-xl ${trendUp ? "text-green-500" : "text-red-500"}`}>
              {trendPercent}%
            </span>
          </div>
        )}
      </div>

      {/* 🔹 Trend text for all time */}
      <p className="text-xs text-gray-500">
        {trendText.replace("xx", totalCount)}
      </p>
    </div>
  );
};

export default MarketStatisticCard;
