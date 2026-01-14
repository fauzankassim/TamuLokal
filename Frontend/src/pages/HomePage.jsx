import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { TbWorld, TbFilter, TbStarFilled, TbMapPin } from "react-icons/tb";
import useMarket from "../hooks/useMarket";
import useCurrentLocation from "../hooks/useCurrentLocation";
import MarketCard from "../components/MarketCard";
import MarketCardSkeleton from "../components/MarketCardSkeleton";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";

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

const TAG_OPTIONS = ["Food", "Fresh Produce", "Handicraft", "Fashion", "Local Snack"];

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => i18n.changeLanguage(lng);
    const navigate = useNavigate();
  const session = useAuth(false);
  const isHello = localStorage.getItem("isHello");

  if (!isHello) window.location.href = "/hello";



  const savedRole = localStorage.getItem("signupRole");
  if (savedRole && session?.user?.id) {
    localStorage.removeItem("signupRole"); // remove after reading
    navigate(`/${savedRole}/registration`);
  }

  const { markets, loading } = useMarket();
  const currentLocation = useCurrentLocation();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    distance: null,
    rating: null,
    openNow: false,
    tags: [],
  });

  const startTour = () => {
  const tour = driver({
    showProgress: true,
    allowClose: true,
    overlayOpacity: 0.5,
    steps: [
      {
        element: "#tour-categories",
        popover: {
          title: t("Product Categories"),
          description:
            t("Browse food, crafts, fashion, and more from local vendors by category."),
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "#tour-markets",
        popover: {
          title: t("Street Markets"),
          description:
            t("Explore nearby street markets and tamu. Filter by distance, rating, and availability."),
          side: "top",
          align: "start",
        },
      },
    ],
    onDestroyed: () => {
      localStorage.setItem("home_tour_seen", "true");
    },
  });

  tour.drive();
};

useEffect(() => {
  const seen = localStorage.getItem("home_tour_seen");
  if (!seen && !loading && markets?.length > 0) {
    startTour();
  }
}, [loading, markets]);

  const isMarketOpen = (market) => {
    if (!market?.open_time || !market?.close_time) return false;
    const now = new Date().getHours();
    const open = new Date(market.open_time).getHours();
    const close = new Date(market.close_time).getHours();
    return open <= close ? now >= open && now <= close : now >= open || now <= close;
  };

  const safeMarkets = markets || [];
  const filteredMarkets = safeMarkets.filter((m) => {
    if (filters.openNow && !isMarketOpen(m)) return false;
    if (filters.rating && m.average_rating < filters.rating) return false;
    if (filters.distance && m.distance > filters.distance) return false;
    if (filters.tags.length > 0 && !filters.tags.some((t) => m.tags?.includes(t))) return false;
    return true;
  });

  const toggleTag = (tag) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  return (
    <div className="relative min-h-screen bg-[var(--white)]">
      {/* HEADER */}
      <header className="w-full bg-[var(--white)]">
        <div className="w-full px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src="/tamulokal.png"
              alt="Tamukinabalu logo"
              className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
            />
            <span className="text-base sm:text-xl font-semibold text-[var(--black)]">
              TamuKinabalu
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              className={`inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition shadow-sm hover:shadow-md border bg-[var(--white)] ${
                currentLocation
                  ? "border-[var(--green)] text-[var(--green)]"
                  : "border-[var(--red)] text-[var(--red)]"
              }`}
              title={currentLocation ? "Location enabled" : "Location disabled"}
            >
              <TbMapPin className="text-sm sm:text-base" />
              <p>{currentLocation ? t("Enabled") : t("Disabled")}</p>
            </button>
            <button
              onClick={() => changeLanguage(i18n.language === "en" ? "ms" : "en")}
              className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition shadow-sm hover:shadow-md border border-[var(--gray)] bg-[color-mix(in srgb,var(--white) 70%,transparent)] text-[var(--black)]"
            >
              <TbWorld className="text-base sm:text-lg" />
              {i18n.language === "en" ? "EN" : "MS"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full pt-4 pb-24">
        {/* Section: Product Categories */}
        <div id="tour-categories" className="px-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--orange)]">
                {t("Product Categories")}
              </p>
              <p className="text-sm text-[var(--gray)] max-w-2xl mt-1">
                {t(
                  "Browse by category to quickly find food, crafts, fashion, and more from local vendors."
                )}
              </p>
            </div>
          </div>

          <div className="w-full grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 mt-4">
            {categories.map((cat) => (
              <NavLink
                key={cat.id}
                to={`/category/${cat.id}`}
                className="
                  bg-[var(--white)] rounded-xl shadow-sm border border-[var(--gray)]
                  flex flex-col items-center justify-center
                  aspect-square
                  hover:border-[var(--orange)] hover:shadow-md transition
                "
              >
                <span className="text-2xl mb-1">{cat.emoji}</span>
                <span className="text-xs font-medium text-[var(--black)] text-center px-1">
                   {t(cat.name)}
                </span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Section: Street Markets / Tamu */}
        <div id="tour-markets" className="px-4 mt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--orange)]">
                {t("Street Markets")}
              </p>
              <p className="text-sm text-[var(--gray)] max-w-2xl mt-1">
                {t(
                  "Filter by distance, ratings, what’s open now, and tags to find the perfect market to visit."
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:flex sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-full bg-[var(--orange)] text-white text-sm font-semibold shadow-sm hover:shadow-md transition border border-[var(--orange)]"
              >
                <TbFilter size={16} />
                {t("Filters")}
              </button>
            </div>
          </div>

          {/* Market List (grid) */}
          <div className="mt-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {!loading && filteredMarkets.length === 0 && (
                <p className="text-gray-600 text-center col-span-full">
                  {t("No markets found with selected filters.")}
                </p>
              )}

              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="w-full h-[350px]">
                      <MarketCardSkeleton height={350} />
                    </div>
                  ))
                : filteredMarkets.map((market) => (
                    <div key={market.id} className="w-full h-[350px]">
                      <MarketCard market={market} height={350} />
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </main>

      {/* Filter Overlay */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/50 z-[80] flex items-end justify-center lg:items-stretch lg:justify-start">
          <div className="bg-white w-full max-w-xl rounded-t-2xl p-6 shadow-lg lg:h-full lg:max-w-md lg:rounded-none lg:rounded-r-2xl lg:shadow-2xl lg:overflow-y-auto">
            {/* Top bar */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() =>
                  setFilters({ distance: null, rating: null, openNow: false, tags: [] })
                }
                className="text-sm text-gray-500 font-medium"
              >
                {t("Reset")}
              </button>
              <h3 className="text-lg font-semibold">{t("Filter")}</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-sm text-[var(--orange)] font-medium"
              >
                {t("Apply")}
              </button>
            </div>

            {/* Distance Slider */}
            <div className="mb-5">
              <p className="font-medium mb-2">
                {t("Distance")}{" "}
                {filters.distance ? `( ${filters.distance} km )` : t("Any")}
              </p>
              <input
                type="range"
                min={5}
                max={20}
                step={5}
                value={filters.distance || 20}
                onChange={(e) => setFilters({ ...filters, distance: Number(e.target.value) })}
                className="w-full accent-orange-500"
              />
            </div>

            {/* Rating Slider */}
            <div className="mb-5">
              <p className="font-medium mb-2 flex items-center gap-1">
                {t("Rating")}
                {filters.rating ? (
                  <span className="flex items-center gap-0.5">
                    ( {filters.rating} <TbStarFilled className="text-yellow-400" /> )
                  </span>
                ) : (
                  ` ${t("Any")}`
                )}
              </p>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={filters.rating || 1}
                onChange={(e) => setFilters({ ...filters, rating: Number(e.target.value) })}
                className="w-full accent-orange-500"
              />
            </div>

            {/* Open Only Toggle */}
            <div className="mb-5 flex items-center justify-between">
              <p className="font-medium mb-0">{t("Open Only")}</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.openNow}
                  onChange={() => setFilters({ ...filters, openNow: !filters.openNow })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:bg-orange-500 transition-colors" />
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md peer-checked:translate-x-5 transition-transform" />
              </label>
            </div>

            {/* Tags */}
            <div className="mb-2">
              <p className="font-medium mb-2">{t("Tags")}</p>
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs border ${
                      filters.tags.includes(tag)
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    {t(tag)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;