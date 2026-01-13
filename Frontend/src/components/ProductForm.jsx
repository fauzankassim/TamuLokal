import React, { useState, useEffect } from "react";
import { TbPhotoPlus } from "react-icons/tb";
import { supabase } from "../supabaseClient";

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

const ProductForm = ({ product = null, category = null, vendorId, onClose }) => {
  const isEdit = !!product;

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quantityTypes, setQuantityTypes] = useState([]);
  const [quantityTypeObj, setQuantityTypeObj] = useState(null);

  // New state for category tags
  const [selectedCategories, setSelectedCategories] = useState([]);

  const base_url = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(() => {
    if (product && category) {
      setName(product.name || "");
      setPrice(product.price || "");
      setQuantity(product.quantity || "");
      setPreviewUrl(product.image || null);

      // ✅ FIX: map category objects → array of ids
      if (Array.isArray(category)) {
        setSelectedCategories(category.map((c) => c.category_id));
      }

      // Keep this as-is (if backend sometimes returns product.categories)
      if (product.categories) setSelectedCategories(product.categories);
    }
  }, [product, category]);

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

  // Category selection handler
  const handleCategoryClick = (id) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== id));
    } else if (selectedCategories.length < 3) {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const handleDelete = async () => {
    if (!isEdit || !product?.id) return;
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`${base_url}/product/${product.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to delete product");

      if (product.image) {
        try {
          const url = product.image;
          const basePath = "tamulokal/";
          const startIndex = url.indexOf(basePath);
          if (startIndex !== -1) {
            const filePath = url.substring(startIndex + basePath.length);
            const { error: deleteError } = await supabase.storage
              .from("tamulokal")
              .remove([filePath]);
            if (deleteError) console.warn("Failed to delete image from storage:", deleteError);
          } else {
            console.warn("Could not extract file path from image URL:", url);
          }
        } catch (storageErr) {
          console.warn("Error deleting image from storage:", storageErr);
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
    if (selectedCategories.length === 0) {
      alert("Please select at least 1 category");
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
            categories: selectedCategories,
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
            categories: selectedCategories
          }),
        });
        if (!res.ok) throw new Error("Failed to add product");
        const inserted = await res.json();
        productId = inserted.id;
      }

      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const filePath = `vendors/${vendorId}/${productId}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("tamulokal")
          .upload(filePath, imageFile, { upsert: true });

        if (uploadError) throw uploadError;

        // 3️⃣ Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("tamulokal").getPublicUrl(filePath);

        // 4️⃣ Update product with image URL
        const imgRes = await fetch(`${base_url}/product/${productId}/image`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: publicUrl }),
        });

        if (!imgRes.ok) throw new Error("Failed to update product image");
      }

      alert(isEdit ? "Product updated!" : "Product added!");
      onClose();
    } catch (err) {
      console.error(err);
      alert(isEdit ? "Failed to update product" : "Failed to add product");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col font-inter">
      <form onSubmit={handleSubmit} className="flex-1 w-full px-4 md:px-8 py-6">
        <div className="w-full max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:gap-8 md:items-stretch">
            {/* Image Upload (left, 1/4 on desktop) */}
            <div className="w-full md:w-1/4 md:flex md:flex-col">
              <div
                className="relative border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white w-full aspect-square cursor-pointer hover:border-orange-400 transition"
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
            </div>

            {/* Right column inputs; card only on desktop, match image height */}
            <div className="w-full md:w-3/4 mt-6 md:mt-0 md:flex md:flex-col md:self-stretch">
              <div className="flex flex-col gap-2 p-0 md:p-6 md:bg-white md:border md:border-gray-200 md:rounded-lg md:shadow-sm md:h-full">
                <label htmlFor="productName" className="text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Product Name"
                  className="w-full h-[42px] border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white rounded-md"
                  required
                />
                <label htmlFor="productPrice" className="text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price"
                  className="w-full h-[42px] border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white rounded-md"
                  required
                />
                <label htmlFor="productQuantity" className="text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Quantity"
                    className="flex-1 h-[42px] border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white rounded-md"
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
                    className="w-[120px] h-[42px] border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white rounded-md"
                    required
                  >
                    {quantityTypes.map((qt) => (
                      <option key={qt.id} value={qt.id}>
                        {qt.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category tags input */}
                <label className="text-sm font-medium text-gray-700 mt-4 mb-1">
                  Category (pick up to 3)
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      className={
                        "px-3 py-1.5 rounded-full text-sm border flex items-center gap-1 transition " +
                        (selectedCategories.includes(cat.id)
                          ? "bg-orange-100 border-orange-500 text-orange-700 font-semibold"
                          : "bg-white border-gray-200 text-gray-800 hover:border-orange-400")
                      }
                      style={{
                        opacity:
                          !selectedCategories.includes(cat.id) &&
                          selectedCategories.length >= 3
                            ? 0.6
                            : 1,
                        pointerEvents:
                          !selectedCategories.includes(cat.id) &&
                          selectedCategories.length >= 3
                            ? "none"
                            : "auto",
                      }}
                      onClick={() => handleCategoryClick(cat.id)}
                    >
                      <span>{cat.emoji}</span>
                      {cat.name}
                    </button>
                  ))}
                </div>
                {selectedCategories.length === 0 && (
                  <p className="text-xs text-orange-600 mt-1">Pick at least 1 category.</p>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons (outside the box) */}
          <div className="flex flex-col md:flex-row md:justify-end gap-3">
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                className="w-full md:w-auto px-5 py-2.5 text-sm font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition"
              >
                Delete
              </button>
            )}
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2.5 bg-[#FF8225] text-white rounded-md font-medium hover:bg-[#e6731f] transition"
            >
              {isEdit ? "Save" : "Create"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;