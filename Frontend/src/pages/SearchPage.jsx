import React, { useState, useEffect, useRef } from "react";
import SearchDropdown from "../components/SearchDropdown";
import { TbSearch } from "react-icons/tb";
import SearchFilterButton from "../components/SearchFilterButton";

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

  // Focus input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Debounce query
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(handler);
  }, [query]);

  // Fetch all results matching query
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
  }, [debouncedQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    setQuery(item.name);
    setShowDropdown(false);
    console.log("Selected:", item);
  };

  // Filter results based on selectedEntities
  const filteredResults = results.filter((item) =>
    filters.selectedEntities.includes("All")
      ? true
      : filters.selectedEntities
          .map((e) => e.toLowerCase())
          .includes(item.type)
  );

  return (
    <div className="px-4 py-4 relative" ref={wrapperRef}>
      <div className="flex gap-2 items-start relative">
        {/* Search input */}
        <div className="flex-1 relative">
          <div className="flex items-center bg-white rounded-xl shadow-md px-4 py-4 gap-2">
            <TbSearch className="text-gray-500" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by market or visitor"
              className="flex-1 bg-transparent outline-none text-gray-700 text-base"
            />
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <SearchDropdown results={filteredResults} onSelect={handleSelect} />
          )}
        </div>

        {/* Filter button */}
        <div className="h-full">
          <SearchFilterButton filters={filters} setFilters={setFilters} />
        </div>
      </div>

      {/* Full-width horizontal splitter */}
      <div className="absolute left-0 right-0 h-px bg-gray-300 mt-4 z-10"></div>
    </div>
  );
};

export default SearchPage;