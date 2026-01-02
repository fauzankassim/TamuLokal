import React, { useState } from "react";

const BusinessFinishSignupForm = ({ onChange }) => {
  const [formData, setFormData] = useState({
    profilePicture: null,
    username: "",
  });

  const handleFileChange = (e) => {
    const { files } = e.target;
    const updatedData = { ...formData, profilePicture: files[0] };
    setFormData(updatedData);
    if (onChange) onChange(updatedData);
  };

  const handleRemoveFile = () => {
    const updatedData = { ...formData, profilePicture: null };
    setFormData(updatedData);
    if (onChange) onChange(updatedData);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    const updatedData = { ...formData, username: value };
    setFormData(updatedData);
    if (onChange) onChange(updatedData);
  };

  return (
    <div className="flex flex-col items-center font-inter w-full">
      <div className="flex flex-col gap-4 w-[300px]">

        {/* Profile Picture Upload */}
        <div className="w-full flex flex-col items-center">
          {/* Always show preview box */}
          <div className="w-24 h-24 rounded-full bg-gray-100 mb-6 flex items-center justify-center overflow-hidden">
            {formData.profilePicture ? (
              <img
                src={URL.createObjectURL(formData.profilePicture)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-xs">Preview</span>
            )}
          </div>

          <div
            className={`w-full border rounded-xl p-4 flex justify-between items-center transition-all duration-300 ${
              formData.profilePicture ? "border-[#FF8225]" : "border-gray-200"
            }`}
          >
            <div className="flex flex-col text-left">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Profile Picture
              </label>
              <span className="text-xs text-gray-400">Image only (PNG, JPG)</span>
            </div>

            <div className="flex items-center justify-center">
              {formData.profilePicture ? (
                <button
                  onClick={handleRemoveFile}
                  className="w-[100px] h-[36px] rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-all"
                >
                  Remove
                </button>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="profilePicture"
                  />
                  <label
                    htmlFor="profilePicture"
                    className="w-[100px] h-[36px] flex items-center justify-center rounded-lg bg-[#FF8225] text-white text-sm font-medium hover:bg-[#e9711c] cursor-pointer transition-all"
                  >
                    Add
                  </label>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Username Input */}
        <div className="w-full flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FF8225]"
          />
        </div>
      </div>
    </div>
  );
};

export default BusinessFinishSignupForm;
