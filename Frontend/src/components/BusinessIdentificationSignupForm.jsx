import React, { useState } from "react";



const BusinessIdentificationSignupForm = ({ onChange, role }) => {
  const [formData, setFormData] = useState({
    userType: role, // default selection
    fullName: "",
    nric: "",
    businessName: "",
    businessLicense: "",
  });

  const handleChange = (e) => {
    const updatedData = { ...formData, [e.target.name]: e.target.value };
    setFormData(updatedData);
    if (onChange) onChange(updatedData);
  };

  
  return (
    <div className="flex flex-col items-center font-inter w-full">
      <div className="flex flex-col gap-3 w-[300px]">
        {/* Full Name */}
        <div className="w-full">
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name (as per NRIC)
          </label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full h-[40px] border border-gray-300 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8225]"
            required
          />
        </div>

        {/* NRIC */}
        <div className="w-full">
          <label
            htmlFor="nric"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            National ID (NRIC)
          </label>
          <input
            id="nric"
            type="text"
            name="nric"
            value={formData.nric}
            onChange={handleChange}
            placeholder="e.g. 980101-14-5678"
            className="w-full h-[40px] border border-gray-300 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8225]"
            required
          />
        </div>

        {/* Business Name */}
        <div className="w-full">
          <label
            htmlFor="businessName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Business Name
          </label>
          <input
            id="businessName"
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Enter your business name"
            className="w-full h-[40px] border border-gray-300 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8225]"
            required
          />
        </div>

        {/* Business License */}
        <div className="w-full">
          <label
            htmlFor="businessLicense"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Business License
          </label>
          <input
            id="businessLicense"
            type="text"
            name="businessLicense"
            value={formData.businessLicense}
            onChange={handleChange}
            placeholder="Enter your license number"
            className="w-full h-[40px] border border-gray-300 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8225]"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default BusinessIdentificationSignupForm;
