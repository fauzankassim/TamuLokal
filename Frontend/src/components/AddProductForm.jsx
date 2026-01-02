import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const AddProductForm = ({ onClose, vendorId }) => {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quantityTypes, setQuantityTypes] = useState([]);
  const [quantityTypeObj, setQuantityTypeObj] = useState(null);

  const base_url = import.meta.env.VITE_BACKEND_API_URL;

  // Fetch quantity types
  useEffect(() => {
    const fetchQuantityTypes = async () => {
      try {
        const res = await fetch(`${base_url}/product/qtype`);
        if (!res.ok) throw new Error("Failed to fetch quantity types");
        const data = await res.json();
        setQuantityTypes(data || []);
        if (data && data.length > 0) setQuantityTypeObj(data[0]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuantityTypes();
  }, [base_url]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quantityTypeObj) {
      alert("Please select a quantity type");
      return;
    }

    try {
      // Step 1: Insert product without image
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

      const insertedProduct = await res.json();

      const productId = insertedProduct.id;
      console.log(productId);
      const productName = insertedProduct.name;

      // Step 2: Upload image if exists
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

        const filePath = `vendors/${vendorId}/${productName}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from("tamulokal")
          .upload(filePath, jpegBlob, { contentType: "image/jpeg" });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("tamulokal")
          .getPublicUrl(filePath);

        // Step 3: Update product with image URL
        const updateRes = await fetch(`${base_url}/product/${productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: publicUrl }),
        });

        if (!updateRes.ok) throw new Error("Failed to update product image");
      }

      alert("Product added successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to add product");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col p-6 overflow-auto font-inter">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Product</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md mx-auto">
        {/* Image Upload */}
        <div className="w-full flex flex-col items-center gap-2">
          <div className="w-40 h-40 rounded-xl bg-gray-100 mb-2 flex items-center justify-center overflow-hidden">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <span className="text-gray-400 text-xs">Preview</span>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="file"
              accept="image/*"
              id="productImage"
              className="hidden"
              onChange={handleImageChange}
            />
            <label
              htmlFor="productImage"
              className="w-[100px] h-[36px] flex items-center justify-center rounded-lg bg-[#FF8225] text-white text-sm font-medium hover:bg-[#e9711c] cursor-pointer transition-all"
            >
              Add
            </label>
            {previewUrl && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="w-[100px] h-[36px] rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-all"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {/* Name */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name"
          className="w-full h-[40px] border border-gray-300 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8225]"
          required
        />

        {/* Price */}
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="w-full h-[40px] border border-gray-300 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8225]"
          required
        />

        {/* Quantity & Type */}
        <div className="flex gap-2">
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
            className="flex-1 h-[40px] border border-gray-300 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8225]"
            required
          />
          <select
            value={quantityTypeObj?.id || ""}
            onChange={(e) => {
              const selected = quantityTypes.find(qt => qt.id === parseInt(e.target.value));
              setQuantityTypeObj(selected);
            }}
            className="w-[100px] h-[40px] border border-gray-300 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8225]"
            required
          >
            {quantityTypes.map((qt) => (
              <option key={qt.id} value={qt.id}>
                {qt.title}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <button
          type="submit"
          className="w-full h-[40px] rounded-xl bg-[#FF8225] text-white font-medium text-sm hover:bg-[#e6731f] transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full h-[40px] rounded-xl bg-gray-300 text-gray-800 font-medium text-sm hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
