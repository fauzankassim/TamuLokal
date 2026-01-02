import React from "react";
import TotalEngagementCard from "../components/TotalEngagementCard";

const OrganizerHomePage = () => {
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TotalEngagementCard />
      </div>
    </div>
  );
};

export default OrganizerHomePage;
