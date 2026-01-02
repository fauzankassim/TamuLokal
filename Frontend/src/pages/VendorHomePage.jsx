import React from "react";
import TotalEngagementCard from "../components/TotalEngagementCard";
import LogoTitle from "../components/LogoTitle"; // import your component

const VendorHomePage = () => {
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Centered Logo Title */}
      <div className="flex justify-center mb-6">
        <LogoTitle />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TotalEngagementCard />
      </div>
    </div>
  );
};

export default VendorHomePage;
