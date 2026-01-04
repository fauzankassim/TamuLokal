import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import useMarket from "../hooks/useMarket";
import { TbInfoCircle } from "react-icons/tb";
import MarketCard from "../components/MarketCard";
import MarketCardSkeleton from "../components/MarketCardSkeleton";


const categories = [
  { id: 1, name: "Fresh Produce", emoji: "🍅" },
  { id: 2, name: "Street Food", emoji: "🍢" },
  { id: 3, name: "Snacks & Drinks", emoji: "🧃" },
  { id: 4, name: "Clothing", emoji: "👕" },
  { id: 5, name: "Handicrafts", emoji: "🧵" },
  { id: 6, name: "Fruits", emoji: "🍇" },
  { id: 7, name: "Seafood", emoji: "🦐" },
  { id: 8, name: "Performance", emoji: "🎷" },
];

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
    <div className="relative h-screen">
      <header className="w-full h-16 px-4 py-1 flex justify-between items-center bg-[var(--white)] z-20">
        <div className="flex justify-center py-2">
            <div className="flex items-center gap-2">
                <img src="/tamulokal.png" alt="tamulokal" className="w-8 h-8" />
                <h1 className="text-xl font-bold">Tamulokal</h1>
            </div>
        </div>
        <button
          onClick={() => setShowInfo(true)}
          className="p-2 text-sm"
        >
          <TbInfoCircle size={28} className="text-[var(--black)]"/>
        </button>
      </header>

      {/* --- Swipable About Cards --- */}
      <div className="w-full grid grid-cols-4 lg:grid-cols-8 gap-3 px-4 py-4">
        {categories.map((cat) => (
          <NavLink
            key={cat.id}
            to={`/category/${cat.id}`} // Pass category ID
            className="bg-[var(--white)] rounded-xl shadow-sm border border-[var(--gray)] flex flex-col items-center justify-center aspect-square hover:border-[var(--orange)] hover:shadow-md transition"
          >
            <span className="text-2xl mb-1">{cat.emoji}</span>
            <span className="text-xs font-medium text-[var(--black)] text-center px-1">
              {cat.name}
            </span>
          </NavLink>
        ))}
      </div>


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
<div className="px-4 w-full mt-2">
  <div
    ref={containerRef}
    className={`
      flex gap-2 overflow-x-auto snap-x snap-mandatory scroll-smooth
      no-scrollbar
      lg:overflow-visible lg:justify-between
    `}
    style={{ scrollSnapType: "x mandatory" }}
  >
    {!markets?.length
      ? Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="snap-start flex-shrink-0 w-[90vw] lg:w-[32%]"
          >
            <MarketCardSkeleton />
          </div>
        ))
      : markets.map((market) => (
          <div
            key={market.id}
            className="snap-start flex-shrink-0 w-[90vw] lg:w-[32%]"
          >
            <MarketCard market={market} />
          </div>
        ))}
  </div>
</div>


      {/* --- Info Overlay --- */}
      {showInfo && (
        <div className="fixed inset-0 bg-[var(--black)] bg-opacity-40 flex items-center justify-center z-[70]">
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