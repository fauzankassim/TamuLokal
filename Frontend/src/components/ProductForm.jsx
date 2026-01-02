import React, { useState, useEffect } from "react";
import { TbPhotoPlus, TbTrash } from "react-icons/tb";
import { supabase } from "../supabaseClient";

const ProductForm = ({ product = null, vendorId, onClose }) => {
  const isEdit = !!product;

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quantityTypes, setQuantityTypes] = useState([]);
  const [quantityTypeObj, setQuantityTypeObj] = useState(null);

  const base_url = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setPrice(product.price || "");
      setQuantity(product.quantity || "");
      setPreviewUrl(product.image || null);
    }
  }, [product]);

  useEffect(() => {
    const fetchQuantityTypes = async () => {
      try {
        const res = await fetch(`${base_url}/product/qtype`);
        if (!res.ok) throw new Error("Failed to fetch quantity types");
        const data = (await res.json()) || [];
        setQuantityTypes(data);

        if (product) {
          const currentType = data.find((qt) => qt.id === product.quantity_type);
          setQuantityTypeObj(currentType || data[0] || null);
        } else {
          setQuantityTypeObj(data[0] || null);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuantityTypes();
  }, [base_url, product]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  const handleDelete = async () => {
    if (!isEdit || !product?.id) return;
    
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {

      const res = await fetch(`${base_url}/product/${product.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      
      if (!res.ok) throw new Error("Failed to delete product");
      
if (product.image) {
      try {
        // Extract file path from URL
        // URL example: https://jraryrxoyhdjsbojezow.supabase.co/storage/v1/object/public/tamulokal/vendors/29e7d2a0-ff80-4c2c-b583-b92d5de520aa/test.jpg
        // We want: vendors/29e7d2a0-ff80-4c2c-b583-b92d5de520aa/test.jpg
        
        // Method 1: Using split
        const url = product.image;
        const basePath = "tamulokal/";
        const startIndex = url.indexOf(basePath);
        
        if (startIndex !== -1) {
          const filePath = url.substring(startIndex + basePath.length);
          
          const { error: deleteError } = await supabase.storage
            .from("tamulokal")
            .remove([filePath]);
            
          if (deleteError) {
            console.warn("Failed to delete image from storage:", deleteError);
          } else {
            console.log("Image deleted from storage:", filePath);
          }
        } else {
          console.warn("Could not extract file path from image URL:", url);
        }
      } catch (storageErr) {
        console.warn("Error deleting image from storage:", storageErr);
        // Continue anyway - the product record is already deleted
      }
    }
      alert("Product deleted!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quantityTypeObj) {
      alert("Please select a quantity type");
      return;
    }

    try {
      let productId;

      if (isEdit) {
        const updateRes = await fetch(`${base_url}/product/${product.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            price: parseFloat(price),
            quantity: parseFloat(quantity),
            quantity_type: quantityTypeObj.id,
          }),
        });
        if (!updateRes.ok) throw new Error("Failed to update product");
        const updated = await updateRes.json();
        productId = updated.id;
      } else {
        const res = await fetch(`${base_url}/product`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vendor_id: vendorId,
            name,
            price: parseFloat(price),
            quantity: parseFloat(quantity),
            quantity_type: quantityTypeObj.id,
            image: null,
          }),
        });
        if (!res.ok) throw new Error("Failed to add product");
        const inserted = await res.json();
        productId = inserted.id;
      }

      if (imageFile) {
        const imageBitmap = await createImageBitmap(imageFile);
        const canvas = document.createElement("canvas");
        canvas.width = imageBitmap.width;
        canvas.height = imageBitmap.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(imageBitmap, 0, 0);
        const jpegBlob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/jpeg", 0.9)
        );

        const filePath = `vendors/${vendorId || product.vendor_id}/${name}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from("tamulokal")
          .upload(filePath, jpegBlob, { contentType: "image/jpeg", upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("tamulokal")
          .getPublicUrl(filePath);

        const imageUpdateRes = await fetch(`${base_url}/product/${productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: publicUrl }),
        });
        if (!imageUpdateRes.ok) throw new Error("Failed to update product image");
      }

      alert(isEdit ? "Product updated!" : "Product added!");
      onClose();
    } catch (err) {
      console.error(err);
      alert(isEdit ? "Failed to update product" : "Failed to add product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative font-inter">
      {/* Delete Icon - Only shown in edit mode */}
      {isEdit && (
        <div className="fixed top-4 right-4 z-10">
          <button
            type="button"
            onClick={handleDelete}
            aria-label="Delete product"
          >
            <TbTrash className="text-2xl text-red-500 hover:text-red-600 transition" />
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex-1 px-6 py-6 space-y-6 pb-28">


      {/* Image Upload (Redesigned like CommunityPostForm) */}
       <div className="flex justify-center">
          <div>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white w-40 h-40 cursor-pointer hover:border-orange-400 transition"
              onClick={() => document.getElementById("productImage").click()}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <TbPhotoPlus className="text-4xl mb-2" />
                  <span className="text-sm">Click to upload photo</span>
                </div>
              )}
              <input
                id="productImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* Dynamic Label below image */}
            <label className="block text-sm font-medium text-gray-700 mt-2 text-center cursor-pointer" onClick={() => document.getElementById("productImage").click()}>
              {previewUrl ? "Change Image" : "Add Image"}
            </label>
          </div>
        </div>

        {/* Name */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name"
          className="w-full h-[40px] border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          required
        />

        {/* Price */}
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="w-full h-[40px] border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          required
        />

        {/* Quantity & Type */}
        <div className="flex gap-2">
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
            className="flex-1 h-[40px] border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            required
          />
          <select
            value={quantityTypeObj?.id || ""}
            onChange={(e) => {
              const selected = quantityTypes.find(
                (qt) => qt.id === parseInt(e.target.value)
              );
              setQuantityTypeObj(selected);
            }}
            className="w-[100px] h-[40px] border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            required
          >
            {quantityTypes.map((qt) => (
              <option key={qt.id} value={qt.id}>
                {qt.title}
              </option>
            ))}
          </select>
        </div>
      </form>

      {/* Fixed Save Button */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-6 py-4">
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full py-3 bg-[#FF8225] text-white rounded-md font-medium hover:bg-[#e6731f] transition"
        >
          {isEdit ? "Save" : "Create"}
        </button>
      </div>
    </div>
  );
};

export default ProductForm;
