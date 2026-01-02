import React, { useState } from "react";

const MarketNavbar = ({ onTabChange }) => {
  const [active, setActive] = useState("detail");

  const tabs = [
    { id: "detail", label: "Detail" },
    { id: "vendors", label: "Vendors" },
    { id: "reviews", label: "Reviews" },
  ];

  const handleClick = (tabId) => {
    setActive(tabId);
    if (onTabChange) onTabChange(tabId);
  };

  return (
    <div className="flex justify-around shadow-md py-2 z-10">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleClick(tab.id)}
          className={`text-sm font-medium px-4 py-2 transition-colors ${
            active === tab.id
              ? "text-[var(--orange)] border-b-2 border-[var(--orange)]"
              : "text-[var(--gray)]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default MarketNavbar;
