// ProductList.jsx
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { TbPlus } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
const base_url = import.meta.env.VITE_BACKEND_API_URL;

const ProductList = ({ vendorId, isOwnProfile, showAvailabilityToggle = false }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!vendorId) return;

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${base_url}/product?vendor_id=${vendorId}`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [vendorId]);

  if (loading) return <div className="text-gray-500 text-center mt-4">Loading products...</div>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 pb-12 max-w-6xl">

      {/* Add Product Card */}
      {isOwnProfile && (
        <div
          onClick={() => navigate("/business/product/add")}
          className="flex flex-col border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#FF8225] transition-colors overflow-hidden"
        >
          <div className="w-full aspect-square flex items-center justify-center bg-gray-100">
            <TbPlus className="text-4xl text-gray-400" />
          </div>
          <div className="p-3 flex-1 flex items-center justify-center">
            <span className="text-gray-500 text-sm text-center">Add Product</span>
          </div>
        </div>
      )}

      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isOwnProfile={isOwnProfile}
          showAvailabilityToggle={showAvailabilityToggle}
        />
      ))}
    </div>
  );
};

export default ProductList;
