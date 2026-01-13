import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ProductForm from "../components/ProductForm";
import { TbChevronLeft } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const ProductActionPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // undefined for add route
  const session = useAuth(true); // ensure we have user session
  const [productData, setProductData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const base_url = import.meta.env.VITE_BACKEND_API_URL;

  // Fetch product if editing
  useEffect(() => {
    if (!id) return; // only fetch if editing

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${base_url}/product/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();

        setProductData(data.product);
        setCategoryData(data.categories);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
  }, [id]);
  console.log(productData);
  if (!session) return null; // wait for session

  return (
    
    <div className="w-screen h-screen">

      <Header title={id ? "Edit Product" : "Add Product"} backPath={"/business/product"} />

      <main className="overflow-hidden flex flex-col items-center font-inter p-4">
        <ProductForm
          vendorId={session.user.id}
          product={id ? productData : null} // pass product data if editing
          category={id ? categoryData : null}
          onClose={() => window.history.back()}
        />
      </main>

    </div>
  );
};

export default ProductActionPage;
