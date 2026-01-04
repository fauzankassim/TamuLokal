import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CategoryVendorCard from "../components/CategoryVendorCard";
import Header from "../components/Header";
import Spinner from "../components/Spinner";

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
  const category = categories.find((cat) => cat.id === Number(id));
  const base_url = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(() => {
    if (!id) return;

    const fetchVendors = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${base_url}/category/${id}`);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

        const data = await res.json();
        setVendors(data);
      } catch (err) {
        console.error("Error fetching vendors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [id, base_url]);

  if (loading) return <Spinner loading={loading} />
  return (
    <div className="w-screen h-full flex flex-col relative">

      <Header title={category ? `${category.name}` : "Category"} backPath="/" />

      {/* No vendors message */}
      {vendors.length === 0 && (
        <p className="text-center mt-4 text-[var(--gray)]">No vendors found</p>
      )}

      {/* Vendor grid */}
      {vendors.length > 0 && (
        <div className="w-full p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {vendors.map((vendor) => (
            <CategoryVendorCard key={vendor.vendor_id} vendor={vendor} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
