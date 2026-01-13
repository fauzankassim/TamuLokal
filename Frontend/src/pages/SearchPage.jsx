import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import React, { useState, useEffect, useRef } from "react";
import { TbSearch, TbAdjustmentsHorizontal} from "react-icons/tb";

import { useNavigate } from "react-router-dom";


const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: "Relevance",
    selectedEntities: ["All"],
  });

  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const base_url = import.meta.env.VITE_BACKEND_API_URL;

  const navigate = useNavigate();

  /* -------------------- Effects -------------------- */
const startTour = () => {
  const tour = driver({
    showProgress: true,
    allowClose: true,
    overlayOpacity: 0.5,
    steps: [
      {
        element: "#search-input",
        popover: {
          title: "Search Input",
          description:
            "Type here to search for markets, vendors, or visitors.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "#filter-button",
        popover: {
          title: "Filters",
          description:
            "Click here to filter your search results.",
          side: "top",
          align: "start",
        },
      },
    ],
    onDestroyed: () => {
      localStorage.setItem("search_tour_seen", "true");
    },
  });

  tour.drive();
};

useEffect(() => {
  const seen = localStorage.getItem("search_tour_seen");
  if (!seen) {
    startTour();
  }
}, []);

  // Focus input on mount
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, []);

  // Debounce query
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(handler);
  }, [query]);

  // Fetch search results
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await fetch(`${base_url}/user?search=${debouncedQuery}`);
        const data = await res.json();
        setResults(data || []);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      }
    };

    fetchResults();
  }, [debouncedQuery, base_url]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* -------------------- Helpers -------------------- */

  const handleSelect = (item) => {
    setQuery(item.name);
    setShowDropdown(false);

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
        console.warn("Unknown type:", item.type);
    }
  };

  const filteredResults = results.filter((item) =>
    filters.selectedEntities.includes("All")
      ? true
      : filters.selectedEntities
          .map((e) => e.toLowerCase())
          .includes(item.type)
  );

  /* -------------------- UI -------------------- */

  return (
    <div className="px-4 py-4 relative" ref={wrapperRef}>
      <div className="flex gap-2 items-start relative">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div id="search-input" className="flex items-center bg-[var(--white)] border border-[var(--black)] rounded-xl shadow-md px-4 py-4 gap-2">
            <TbSearch className="text-[var(--gray)]" />
            <input
   
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by market or visitor"
              className="flex-1 bg-transparent outline-none text-[var(--gray)]"
            />
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div className="fixed z-10 mt-4 left-0 right-0 max-h-64 overflow-y-auto px-4">
              {filteredResults.length > 0 ? (
                filteredResults.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={`py-2 cursor-pointer flex items-center gap-2`}
                  >
                    <img
                      src={item.image === "" ? "/profile.png" : item.image}
                      alt={item.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-[var(--black)]">{item.name}</span>
                  </div>
                ))
              ) : (
                <div className="py-2 text-[var(--gray)]">No results found.</div>
              )}
            </div>
          )}
        </div>

        {/* Filter Button */}
        <SearchFilter filters={filters} setFilters={setFilters} />
      </div>

    </div>
  );
};

/* -------------------- Inline Filter Component -------------------- */

const SearchFilter = ({ filters, setFilters }) => {
  const [open, setOpen] = useState(false);
  const sortOptions = ["Relevance", "Newest", "Oldest", "Popular"];
  const entityOptions = ["Visitor", "Vendor", "Organizer", "Market"];

  const [sortBy, setSortBy] = useState(filters.sortBy);
  const [selectedEntities, setSelectedEntities] = useState(filters.selectedEntities);

  useEffect(() => {
    setFilters({ sortBy, selectedEntities });
  }, [sortBy, selectedEntities, setFilters]);

  const handleEntitySelect = (entity) => {
    if (entity === "All") return setSelectedEntities(["All"]);

    let updated = selectedEntities.includes("All") ? [] : [...selectedEntities];

    updated = updated.includes(entity)
      ? updated.filter((e) => e !== entity)
      : [...updated, entity];

    if (updated.length === 0) updated = ["All"];
    setSelectedEntities(updated);
  };

  return (
    <>
      {/* Filter Button */}
      <button
        id="filter-button"
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-[var(--orange)] rounded-xl shadow-md flex items-center justify-center"
      >
        <TbAdjustmentsHorizontal className="text-[var(--white)]" />
      </button>

      {/* Background overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-[var(--black)]/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Filter panel */}
      <div
        className={`
          fixed bg-[var(--white)] rounded-t-2xl p-6 shadow-xl transition-all duration-300 z-70
          w-full lg:w-96
          ${open ? "bottom-0 left-0 rounded-t-2xl lg:rounded-r-2xl lg:rounded-t-none" : "-bottom-[60%] lg:-left-96"}
          lg:top-0
          lg:h-full
          lg:rounded-t-none
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => {
              setSortBy("Relevance");
              setSelectedEntities(["All"]);
            }}
            className="text-sm text-[var(--gray)]"
          >
            Reset
          </button>
          <h3 className="text-lg font-semibold">Filter</h3>
          <button onClick={() => setOpen(false)} className="text-sm text-[var(--orange)]">
            Apply
          </button>
        </div>

        {/* Sort By */}
        <p className="font-medium mb-2">Sort By</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {sortOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setSortBy(opt)}
              className={`px-3 py-1 rounded-full border border-[var(--black)] ${
                sortBy === opt ? "bg-[var(--orange)] text-[var(--white)]" : ""
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Search Target */}
        <p className="font-medium mb-2">Search Target</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleEntitySelect("All")}
            className={`px-3 py-1 rounded-full border ${
              selectedEntities.includes("All") ? "bg-[var(--orange)] text-[var(--white)]" : ""
            }`}
          >
            All
          </button>
          {entityOptions.map((e) => (
            <button
              key={e}
              onClick={() => handleEntitySelect(e)}
              className={`px-3 py-1 rounded-full border ${
                selectedEntities.includes(e) ? "bg-[var(--orange)] text-[var(--white)]" : ""
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};


export default SearchPage;