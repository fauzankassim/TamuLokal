import { useState } from "react";
import { TbSearch, TbX } from "react-icons/tb";
import useMarket from "../hooks/useMarket";

const dummyMarkets = [
  { id: 1, name: "Gaya Street Market" },
  { id: 2, name: "Tamu Donggongon" },
  { id: 3, name: "Tamu Inanam" },
  { id: 4, name: "Kundasang Market" },
  { id: 5, name: "Tamu Kota Belud" },
  { id: 6, name: "Tamu Kota Marudu" },
  { id: 7, name: "Tamu Beaufort" },
];


const CommunityForumForm = () => {
  const { markets } = useMarket();
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [market, setMarket] = useState("");
  const [showMarketPopup, setShowMarketPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ title, caption, market });
  };

  const filteredMarkets = markets.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectMarket = (m) => {
    setMarket(m.name);
    setShowMarketPopup(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <form onSubmit={handleSubmit} className="flex-1 px-6 py-4 space-y-6 pb-28">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter forum title..."
            className="w-full border border-gray-300 rounded-md p-3 text-sm bg-white focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />
        </div>

        {/* Caption */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
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
            <span className={market ? "text-gray-900" : "text-gray-400"}>
              {market || "Select a market..."}
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
          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowMarketPopup(false)}
          ></div>

          {/* Bottom sheet container */}
          <div
            className="relative bg-white rounded-t-2xl shadow-lg p-5 w-full h-[70vh] animate-slide-up z-10 flex flex-col"
            style={{
              animation: "slideUp 0.3s ease-out",
            }}
          >
            {/* Drag handle */}
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>

            {/* Header */}
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

            {/* Search Input */}
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

            {/* Market List (Scrollable Area) */}
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

export default CommunityForumForm;
