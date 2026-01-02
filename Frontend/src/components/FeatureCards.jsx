import { useState, useRef, useEffect } from "react";
import { TbMap2, TbSearch, TbUserPlus } from "react-icons/tb";

const cards = [
  {
    title: "Explore Nearby Markets",
    desc: "Discover tamu locations around you through an interactive map.",
    icon: <TbMap2 size={36} />,
  },
  {
    title: "Search Anything",
    desc: "Find markets by category, products, location and more.",
    icon: <TbSearch size={36} />,
  },
  {
    title: "Join as Vendor / Organizer",
    desc: "Register your stall or your entire tamu event — grow your audience.",
    icon: <TbUserPlus size={36} />,
  },
];

export default function FeatureCards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  const onScroll = () => {
    const el = containerRef.current;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setCurrentIndex(index);
  };

  return (
    <div className="w-full mt-4 px-2 ">
      <div
        ref={containerRef}
        onScroll={onScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
      >
        {cards.map((card, i) => (
          <div
            key={i}
            className="min-w-full snap-center"
          >
            <div className="bg-[var(--white)] p-5 rounded-xl shadow-md border flex flex-col items-center text-center mx-1 h-[100px]">
              <div className="mb-2 text-[var(--black)]">
                {card.icon}
              </div>
              <h3 className="font-semibold text-[var(--black)]">{card.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- Indicator --- */}
      <div className="flex justify-center mt-3 gap-2">
        {cards.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              currentIndex === i
                ? "bg-[var(--orange)] scale-110"
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
