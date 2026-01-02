import React from "react";
import { useNavigate } from "react-router-dom";

const SearchDropdown = ({ results, onSelect }) => {
  const navigate = useNavigate();

  if (!results) return null;

  const handleSelect = (item) => {
    if (!item?.id || !item?.type) return;

    switch (item.type) {
      case "market":
        navigate(`/market/${item.id}`);
        break;
      case "vendor":
        navigate(`/vendor/${item.id}`);
        break;
      case "visitor":
        navigate(`/visitor/${item.id}`);
        break;
      case "organizer":
        navigate(`/organizer/${item.id}`);
        break;
      default:
        console.warn("Unknown profile type:", item.type);
    }

    onSelect && onSelect(item);
  };

  return (
    <div className="fixed z-10 mt-6 left-0 right-0 w-full max-w-full max-h-64 overflow-y-auto px-6">
      {results.length > 0 ? (
        results.map((item, index) => (
          <div
            key={item.id}
            className={`py-2 cursor-pointer flex items-center gap-2 ${
              index < results.length - 1 ? "border-b border-gray-200" : ""
            } hover:bg-gray-50 transition`}
            onClick={() => handleSelect(item)}
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <span className="text-gray-800">{item.name}</span>
          </div>
        ))
      ) : (
        <div className="py-2 text-gray-400">No results found.</div>
      )}
    </div>
  );
};

export default SearchDropdown;
