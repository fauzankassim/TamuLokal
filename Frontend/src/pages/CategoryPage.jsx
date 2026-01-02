import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { TbChevronLeft } from "react-icons/tb";
import CategoryVendorCard from "../components/CategoryVendorCard";
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

const CategoryPage = () => {
  const { id } = useParams(); // category ID
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const category = categories.find((cat) => cat.id === Number(id));
  const base_url = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(() => {
    if (!id) return;

    const fetchVendors = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${base_url}/category/${id}`);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

        const data = await res.json();
        setVendors(data);
      } catch (err) {
        console.error("Error fetching vendors:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [id, base_url]);


  return (
    <div className="relative bg-[var(--white)] h-screen overflow-y-auto p-4">
      <div className="max-w-xl w-full mx-auto flex flex-col gap-4">
        {/* Header — always visible */}
        <div className="flex items-center gap-3 mb-6">
          <NavLink
            to="/"
            className="text-gray-700 hover:text-orange-500 transition"
          >
            <TbChevronLeft className="text-2xl" />
          </NavLink>
          <h1 className="text-xl font-semibold text-gray-800">
            {category ? `${category.name}` : "Category"}
          </h1>
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-center mt-4">Loading...</p>
        ) : error ? (
          <p className="text-center mt-4 text-red-500">{error}</p>
        ) : vendors.length === 0 ? (
          <p className="text-center mt-4">No vendors found in this category</p>
        ) : (
          <div className="flex flex-col gap-4">
            {vendors.map((vendor) => (
              <CategoryVendorCard key={vendor.vendor_id} vendor={vendor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

};

export default CategoryPage;
