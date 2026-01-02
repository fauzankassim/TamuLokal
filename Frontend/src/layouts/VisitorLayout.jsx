import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LocationWatcher from '../components/LocationWatcher';

const VisitorLayout = () => {
  return (
    <div className="bg-[var(--white)] min-h-screen flex flex-col">
      <LocationWatcher />
      {/* Page content */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* Navbar at the bottom */}
      <Navbar />
    </div>
  );
};

export default VisitorLayout;
