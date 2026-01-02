import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TotalEngagementCard = () => {
  const data = [
    { month: "Jan", engagement: 520 },
    { month: "Feb", engagement: 680 },
    { month: "Mar", engagement: 756 },
    { month: "Apr", engagement: 640 },
    { month: "May", engagement: 710 },
  ];

  const defaultIndex = 2; // March
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const latest = data[activeIndex]?.engagement || 0;
  const prev =
    activeIndex > 0 ? data[activeIndex - 1]?.engagement : data[0]?.engagement;
  const percentageChange = prev === 0 ? 0 : ((latest - prev) / prev) * 100;
  const isPositive = percentageChange >= 0;

  // Create CustomTick with access to activeIndex
  const CustomTick = (props) => {
    const { x, y, payload, index } = props;
    // Find the data index for this month
    const dataIndex = data.findIndex(item => item.month === payload.value);
    const isActive = dataIndex === activeIndex;
    
    return (
      <text
        x={x}
        y={y + 10}
        textAnchor="middle"
        fontSize={11}
        fontWeight={isActive ? "bold" : "normal"}
        fill={isActive ? "#FF8225" : "#888"}
      >
        {payload.value}
      </text>
    );
  };

  const renderDot = ({ cx, cy, index }) => (
    <circle
      key={index}
      cx={cx}
      cy={cy}
      r={index === activeIndex ? 6 : 3}
      fill={index === activeIndex ? "#FF8225" : "#FFD4B2"}
      stroke="#fff"
      strokeWidth={2}
      style={{ cursor: "pointer" }}
    />
  );

  // Handle click on chart
  const handleChartClick = (data) => {
    if (data && data.activeTooltipIndex !== undefined) {
      setActiveIndex(data.activeTooltipIndex);
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md p-5 font-inter"
      style={{
        width: "335px",
        height: "250px",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-gray-400 font-medium">Statistics</p>
          <h2 className="text-base font-semibold text-gray-800">
            Total Engagements
          </h2>
        </div>
        <button className="text-[#FF8225] text-lg font-bold">→</button>
      </div>

      <hr className="border-gray-200 mb-3" />

      {/* Number + triangle + percentage */}
      <div className="flex justify-center mb-3">
        <div className="flex items-end gap-0">
          <p className="text-3xl font-bold text-gray-900 leading-none">{latest}</p>
          <svg
            className={`w-3 h-3 block ${
              isPositive ? "text-green-600" : "text-red-600 rotate-180"
            }`}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginBottom: 2, outline: "none" }}
          >
            <path d="M12 5l7 12H5l7-12z" />
          </svg>
          <p
            className={`text-sm font-semibold leading-none pb-[2px] ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {Math.abs(percentageChange).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <div
        className="h-[135px]"
        style={{
          outline: "none",
          WebkitTapHighlightColor: "transparent",
          userSelect: "none",
        }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
          style={{ outline: "none", pointerEvents: "auto" }}
        >
          <AreaChart
            data={data}
            margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
            onMouseMove={(e) => {
              if (e && e.activeTooltipIndex != null) {
                setActiveIndex(e.activeTooltipIndex);
              }
            }}
            onMouseLeave={() => setActiveIndex(defaultIndex)}
            onClick={handleChartClick}
            tabIndex={-1}
            style={{
              outline: "none",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
              cursor: "pointer",
            }}
          >
            <defs>
              <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF8225" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF8225" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={CustomTick} 
            />
            <Tooltip cursor={false} contentStyle={{ display: "none" }} />
            <Area 
              type="monotone" 
              dataKey="engagement" 
              stroke="#FF8225" 
              strokeWidth={3} 
              fill="url(#colorEngagement)" 
              dot={renderDot}
              activeDot={{ 
                r: 6, 
                fill: "#FF8225", 
                stroke: "#fff", 
                strokeWidth: 2,
                style: { cursor: "pointer" }
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TotalEngagementCard;