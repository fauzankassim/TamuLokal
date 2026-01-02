import React from "react";
import { NavLink } from "react-router-dom";

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

const CategoryCards = () => {
  return (
    <div className="w-full grid grid-cols-4 gap-3 px-4 py-4">
      {categories.map((cat) => (
        <NavLink
          key={cat.id}
          to={`/category/${cat.id}`} // Pass category ID
          className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center aspect-square hover:border-orange-400 hover:shadow-md transition"
        >
          <span className="text-2xl mb-1">{cat.emoji}</span>
          <span className="text-xs font-medium text-gray-700 text-center px-1">
            {cat.name}
          </span>
        </NavLink>
      ))}
    </div>
  );
};

export default CategoryCards;
