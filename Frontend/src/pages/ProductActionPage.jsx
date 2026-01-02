import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ProductForm from "../components/ProductForm";
import { TbChevronLeft } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const ProductActionPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // undefined for add route
  const session = useAuth(true); // ensure we have user session
  const [productData, setProductData] = useState(null);
  const base_url = import.meta.env.VITE_BACKEND_API_URL;

  // Fetch product if editing
  useEffect(() => {
    if (!id) return; // only fetch if editing

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${base_url}/product/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();

        setProductData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
  }, [id]);

  if (!session) return null; // wait for session

  return (
    
    <div className="relative h-screen overflow-hidden bg-[#FFFDFA] flex flex-col items-center font-inter p-4">

      <div className="max-w-xl w-full">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/profile")}
            className="text-gray-700 hover:text-orange-500 transition"
          >
            <TbChevronLeft className="text-2xl" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            {id ? "Edit Product" : "Add Product"}
          </h1>
        </div>
      </div>
      <ProductForm
        vendorId={session.user.id}
        product={id ? productData : null} // pass product data if editing
        onClose={() => window.history.back()}
      />
    </div>
  );
};

export default ProductActionPage;
