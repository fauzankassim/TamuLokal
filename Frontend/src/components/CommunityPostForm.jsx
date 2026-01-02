import { useState } from "react";
import { TbPhotoPlus, TbSearch, TbX } from "react-icons/tb";
import useMarket from "../hooks/useMarket";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../supabaseClient";

const CommunityPostForm = () => {

  const session = useAuth();
  const { markets } = useMarket();

  const [photo, setPhoto] = useState(null); // preview only
  const [caption, setCaption] = useState("");
  const [market, setMarket] = useState("");
  const [marketName, setMarketName] = useState("");
  const [showMarketPopup, setShowMarketPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file)); // preview only
    }
  };

  // 🔥 NEW: JSON request, no file upload
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session?.user?.id) {
      alert("User not logged in");
      return;
    }

    const payload = {
      caption,
      market_id: market,
      visitor_id: session.user.id,
      type: 1,
    };

    try {
      // 1️⃣ Create content
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/content?type=post`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to create content");

      const created = await res.json();
      console.log("Created content:", created);

      const contentId = created?.data?.id || created?.id;  // NEW
      if (!contentId) throw new Error("No content ID returned");

      // 2️⃣ Upload image to STORAGE if exists (photo preview chosen)
      const fileInput = document.getElementById("photoUpload");
      const file = fileInput.files[0];

      if (file) {
        const filePath = `contents/${contentId}/${file.name}`;  // NEW

        const { data: uploadData, error: uploadError } =
          await supabase.storage
            .from("tamulokal")
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        console.log("Image uploaded:", uploadData);

        // 3️⃣ Get public URL
        const { data: urlData } = supabase.storage
          .from("tamulokal")
          .getPublicUrl(filePath);

        const publicUrl = urlData.publicUrl;
        console.log("Image URL:", publicUrl);

        // 4️⃣ Update content image in backend
        const imgRes = await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}/content/${contentId}/image`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: publicUrl }),
          }
        );

        if (!imgRes.ok) throw new Error("Failed to update image");
      }

      alert("Posted!");

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };


  const filteredMarkets = markets.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectMarket = (m) => {
    setMarket(m.id);
    setMarketName(m.name);
    setShowMarketPopup(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <form onSubmit={handleSubmit} className="flex-1 px-6 py-4 space-y-6 pb-28">

        {/* Photo Preview Only */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photo (preview only)
          </label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white h-40 cursor-pointer hover:border-orange-400 transition"
            onClick={() => document.getElementById("photoUpload").click()}
          >
            {photo ? (
              <img
                src={photo}
                alt="Preview"
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <TbPhotoPlus className="text-4xl mb-2" />
                <span className="text-sm">Click to preview image</span>
              </div>
            )}
            <input
              id="photoUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>
        </div>

        {/* Caption */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Caption
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write something..."
            rows="4"
            className="w-full border border-gray-300 rounded-md p-3 text-sm bg-white focus:ring-2 focus:ring-orange-400 focus:outline-none"
          ></textarea>
        </div>

        {/* Market Tag */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tag a Market
          </label>
          <div
            className="border border-gray-300 rounded-md p-3 text-sm bg-white cursor-pointer hover:border-orange-400 transition flex justify-between items-center"
            onClick={() => setShowMarketPopup(true)}
          >
            <span className={marketName ? "text-gray-900" : "text-gray-400"}>
              {marketName || "Select a market..."}
            </span>
            <TbSearch className="text-gray-500" />
          </div>
        </div>
      </form>

      {/* Fixed Share Button */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-6 py-4">
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full py-3 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition"
        >
          Share
        </button>
      </div>

      {/* Market Bottom Sheet */}
      {showMarketPopup && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowMarketPopup(false)}
          ></div>

          <div
            className="relative bg-white rounded-t-2xl shadow-lg p-5 w-full h-[70vh] animate-slide-up z-10 flex flex-col"
            style={{ animation: "slideUp 0.3s ease-out" }}
          >
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Select a Market
              </h2>
              <button
                onClick={() => setShowMarketPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <TbX className="text-xl" />
              </button>
            </div>

            <div className="flex items-center border border-gray-300 rounded-md px-2 mb-3">
              <TbSearch className="text-gray-500 text-lg" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search markets..."
                className="flex-1 p-2 outline-none text-sm"
              />
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {filteredMarkets.length > 0 ? (
                filteredMarkets.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleSelectMarket(m)}
                    className="p-3 text-sm hover:bg-orange-50 cursor-pointer transition"
                  >
                    {m.name}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 text-sm py-4">
                  No markets found
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPostForm;
