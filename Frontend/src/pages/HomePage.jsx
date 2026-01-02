import React, { useState, useRef, useEffect } from "react";
import LogoTitle from '../components/LogoTitle';
import CategoryCards from "../components/CategoryCards";
import { NavLink } from "react-router-dom";
import useMarket from "../hooks/useMarket";
import { TbInfoCircle } from "react-icons/tb";
import MarketCard from "../components/MarketCard";

const HomePage = () => {
  const { markets } = useMarket(3);
  const [showInfo, setShowInfo] = useState(false);
  const containerRef = useRef(null);

  // Auto scroll effect
  useEffect(() => {
    if (!containerRef.current || !markets?.length) return;

    let index = 0;
    const container = containerRef.current;

    const interval = setInterval(() => {
      index = (index + 1) % markets.length;
      container.scrollTo({
        left: container.clientWidth * index,
        behavior: "smooth",
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [markets]);

  return (
    <div className="relative bg-[var(--white)] h-screen overflow-hidden">
      {/* --- Header --- */}
      <header className="w-full h-16 px-4 py-1 flex justify-between items-center bg-[var(--white)] z-20">
        <LogoTitle />
        <button
          onClick={() => setShowInfo(true)}
          className="p-2 text-sm"
        >
          <TbInfoCircle size={28} className="text-[var(--black)]"/>
        </button>
      </header>

      {/* --- Swipable About Cards --- */}
      <CategoryCards onSelect={(cat) => console.log("Selected:", cat)} />

      {/* --- Market Section Title --- */}
      <div className="px-4 mt-4 flex justify-between items-center">
        <h2 className="font-semibold text-lg text-[var(--black)]">Explore Tamu</h2>
        <NavLink
          to="/market"
          className="text-sm text-[var(--orange)] font-medium hover:underline"
        >
          View All
        </NavLink>
      </div>

      {/* --- Horizontal Market Cards --- */}
      <div className="px-4 w-full overflow-hidden mt-2">
        <div
          ref={containerRef}
          className="
            flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth
            no-scrollbar
          "
          style={{ scrollSnapType: "x mandatory" }}
        >
          {markets?.map((market) => (
            <div
              key={market.id}
              className="snap-start flex-shrink-0"
              style={{ width: "90vw" }}
            >
              <MarketCard market={market} />
            </div>
          ))}
        </div>
      </div>

      {/* --- Info Overlay --- */}
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[70]">
          <div className="bg-white p-6 rounded-xl shadow-xl w-4/5 max-w-md">
            <h3 className="font-semibold text-lg mb-2 text-center">How to Use TamuLokal</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Browse available night markets near you</li>
              <li>• Swipe feature cards to learn more features</li>
              <li>• Tap markets for vendor details & directions</li>
              <li>• Save your favorite markets to revisit easier</li>
            </ul>
            <button
              onClick={() => setShowInfo(false)}
              className="mt-4 w-full bg-gray-800 text-white py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;