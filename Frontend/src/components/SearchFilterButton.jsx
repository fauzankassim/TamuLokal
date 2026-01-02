import { useState, useEffect } from "react";
import { TbAdjustmentsHorizontal, TbX } from "react-icons/tb";

const SearchFilterButton = ({ filters, setFilters }) => {
  const [open, setOpen] = useState(false);

  // Sort options
  const sortOptions = ["Relevance", "Newest", "Oldest", "Popular"];
  const [sortBy, setSortBy] = useState(filters?.sortBy || "Relevance");

  // Entity / Search Target
  const entityOptions = ["Visitor", "Vendor", "Organizer", "Product", "Market"];
  const [selectedEntities, setSelectedEntities] = useState(
    filters?.selectedEntities || ["All"]
  );

  useEffect(() => {
    // Update parent filters whenever local state changes
    setFilters && setFilters({ sortBy, selectedEntities });
  }, [sortBy, selectedEntities]);

  const toggleOverlay = () => setOpen((prev) => !prev);

  const handleEntitySelect = (entity) => {
    if (entity === "All") {
      setSelectedEntities(["All"]);
      return;
    }

    let updated = [...selectedEntities];

    if (updated.includes("All")) updated = [];

    if (updated.includes(entity)) {
      updated = updated.filter((e) => e !== entity);
    } else {
      updated.push(entity);
    }

    if (updated.length === 0) updated = ["All"];

    setSelectedEntities(updated);
  };

  const applyFilters = () => setOpen(false);
  const resetFilters = () => {
    setSortBy("Relevance");
    setSelectedEntities(["All"]);
  };

  return (
    <>
      {/* Button */}
      <button
        onClick={toggleOverlay}
        className="w-14 h-14 bg-[var(--orange)] rounded-xl shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors relative z-50"
      >
        {open ? <TbX className="text-[var(--white)] w-5 h-5" /> : <TbAdjustmentsHorizontal className="text-[var(--white)] w-5 h-5" />}
      </button>

      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black/40 z-40" onClick={toggleOverlay}></div>}

      {/* Bottom Sheet */}
      <div
        className={`fixed left-0 w-full bg-white rounded-t-2xl shadow-xl z-70 p-6 transition-all duration-300 ${
          open ? "bottom-0" : "-bottom-[60%]"
        }`}
        style={{ height: "50%" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <button onClick={resetFilters} className="text-sm text-gray-500 font-medium">
            Reset
          </button>
          <h3 className="text-lg font-semibold">Filter</h3>
          <button onClick={applyFilters} className="text-sm text-[var(--orange)] font-medium">
            Apply
          </button>
        </div>

        <div className="w-full h-[1px] bg-gray-200 mb-4"></div>

        {/* Sort By */}
        <div className="mb-5">
          <p className="font-medium mb-2">Sort By</p>
          <div className="flex flex-wrap gap-2">
            {sortOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setSortBy(opt)}
                className={`px-3 py-1 rounded-full border text-sm ${
                  sortBy === opt
                    ? "bg-[var(--orange)] text-white border-[var(--orange)]"
                    : "bg-white border-gray-300"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Search Target */}
        <div className="mb-5">
          <p className="font-medium mb-2">Search Target</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleEntitySelect("All")}
              className={`px-3 py-1 rounded-full border text-sm ${
                selectedEntities.includes("All")
                  ? "bg-[var(--orange)] text-white border-[var(--orange)]"
                  : "bg-white border-gray-300"
              }`}
            >
              All
            </button>
            {entityOptions.map((entity) => (
              <button
                key={entity}
                onClick={() => handleEntitySelect(entity)}
                className={`px-3 py-1 rounded-full border text-sm ${
                  selectedEntities.includes(entity)
                    ? "bg-[var(--orange)] text-white border-[var(--orange)]"
                    : "bg-white border-gray-300"
                }`}
              >
                {entity}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchFilterButton;
