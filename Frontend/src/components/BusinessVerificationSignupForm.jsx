import React, { useState } from "react";

const BusinessVerificationSignupForm = ({ onChange }) => {
  const [formData, setFormData] = useState({
    icFront: null,
    icBack: null,
    businessLicenseFile: null,
  });

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const updatedData = { ...formData, [name]: files[0] };
    setFormData(updatedData);
    if (onChange) onChange(updatedData);
  };

  const handleRemove = (name) => {
    const updatedData = { ...formData, [name]: null };
    setFormData(updatedData);
    if (onChange) onChange(updatedData);
  };

  const renderUploadField = (id, label, name, accept, description) => (
    <div
      className={`w-full border rounded-xl p-4 flex justify-between items-center transition-all duration-300 ${
        formData[name] ? "border-[#FF8225]" : "border-gray-200"
      }`}
    >
      {/* Left Side: Label + Description */}
      <div className="flex flex-col text-left">
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
        <span className="text-xs text-gray-400">{description}</span>
      </div>

      {/* Right Side: Button */}
      <div className="flex items-center justify-center">
        {formData[name] ? (
          <button
            onClick={() => handleRemove(name)}
            className="w-[100px] h-[36px] rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-all"
          >
            Remove
          </button>
        ) : (
          <>
            <input
              type="file"
              id={id}
              name={name}
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor={id}
              className="w-[100px] h-[36px] flex items-center justify-center rounded-lg bg-[#FF8225] text-white text-sm font-medium hover:bg-[#e9711c] cursor-pointer transition-all"
            >
              Add
            </label>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center font-inter w-full">
      <div className="flex flex-col gap-4 w-[300px]">
        {renderUploadField(
          "icFront",
          "Upload NRIC (Front)",
          "icFront",
          "image/*",
          "Image only (PNG, JPG)"
        )}
        {renderUploadField(
          "icBack",
          "Upload NRIC (Back)",
          "icBack",
          "image/*",
          "Image only (PNG, JPG)"
        )}
        {renderUploadField(
          "businessLicenseFile",
          "Upload Business License",
          "businessLicenseFile",
          ".pdf,image/*",
          "PDF or Image (max 5MB)"
        )}
      </div>
    </div>
  );
};

export default BusinessVerificationSignupForm;
