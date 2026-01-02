import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";


const MarketspaceForm = ({ vendor, space }) => {
  if (!vendor || !space) return null;

    const lockedFields = ["icFront", "icBack", "businessLicenseFile"];

    const isLocked = (name) => lockedFields.includes(name);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        icFront: null,
        icBack: null,
        businessLicenseFile: null,
        permitLicenseFile: null,
    });

    const downloadFileAsFile = async (path, filename) => {
        const { data, error } = await supabase
            .storage
            .from("tamulokal-private")
            .download(path);

        if (error || !data) return null;

        return new File([data], filename, { type: data.type });
    };
    
    useEffect(() => {
        if (!vendor?.id) return;

        const fetchPrivateDocuments = async () => {
            try {
            const [icFront, icBack, businessLicense] = await Promise.all([
                downloadFileAsFile(
                `vendors/${vendor.id}/nricfront.jpg`,
                "nricfront.jpg"
                ),
                downloadFileAsFile(
                `vendors/${vendor.id}/nricback.jpg`,
                "nricback.jpg"
                ),
                downloadFileAsFile(
                `vendors/${vendor.id}/businesslicense.jpg`,
                "businesslicense.jpg"
                ),
            ]);

            setFormData((prev) => ({
                ...prev,
                icFront: icFront || prev.icFront,
                icBack: icBack || prev.icBack,
                businessLicenseFile: businessLicense || prev.businessLicenseFile,
            }));
            } catch (err) {
            console.error("Failed to fetch private documents", err);
            }
        };

        fetchPrivateDocuments();
    }, [vendor]);




  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleRemove = (name) => {
    setFormData((prev) => ({ ...prev, [name]: null }));
  };

  const renderUploadField = (id, label, name, accept, description) => (
<div
  key={name}
  className={`w-full border rounded-xl p-4 flex flex-col transition-all ${
    formData[name] ? "border-orange-500" : "border-gray-200"
  }`}
>
  <div className="flex justify-between items-center">
      {/* Left */}
      <div className="flex flex-col">
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <span className="text-xs text-gray-400">{description}</span>
      </div>

      {/* Right */}
        <div className="flex items-center gap-2">


        {formData[name] ? (
            isLocked(name) ? (
            <button
                type="button"
                disabled
                className="w-[100px] h-[36px] rounded-lg bg-gray-300 text-gray-600 text-sm font-medium cursor-not-allowed"
            >
                Uploaded
            </button>
            ) : (
            <button
                type="button"
                onClick={() => handleRemove(name)}
                className="w-[100px] h-[36px] rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600"
            >
                Remove
            </button>
            )
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
                className="w-[100px] h-[36px] flex items-center justify-center rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 cursor-pointer"
            >
                Add
            </label>
            </>
        )}
        </div>
    </div>
     {errors[name] && (
    <p className="text-xs text-red-500 mt-1">
      {errors[name]}
    </p>
  )}
</div>
  );
    const handleSubmit = async () => {
  const requiredFields = {
    icFront: "Required",
    icBack: "Required",
    businessLicenseFile: "Required",
    permitLicenseFile: "Required",
  };

  const newErrors = {};

  Object.keys(requiredFields).forEach((key) => {
    if (!formData[key]) {
      newErrors[key] = requiredFields[key];
    }
  });

  setErrors(newErrors);

  // stop if any error exists
  if (Object.keys(newErrors).length > 0) return;

  try {
    const base_url = import.meta.env.VITE_BACKEND_API_URL;

    const res = await fetch(
      `${base_url}/marketspace/${space.id}/apply`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vendor_id: vendor.id,
        }),
      }
    );

    if (!res.ok) throw new Error("Failed to submit application");
    
    const data = await res.json();

    if (data.image && formData.businessLicenseFile) {
        const uploadPath = `${data.image}businesslicense.jpg`;
        const { error: uploadError } = await supabase.storage
            .from("tamulokal-private")
            .upload(
            uploadPath,
            formData.businessLicenseFile,
            {
                contentType: formData.businessLicenseFile.type,
                upsert: true,
            }
            );

        if (uploadError) {
            console.error("Failed to upload business license:", uploadError);
        }
    }
  } catch (err) {
    console.error(err);
  }
};


  return (
    <div className="p-4 space-y-6">
      {/* Vendor Info */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Vendor Information
        </h2>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Name:</span>{" "}
          {vendor.name || vendor.username}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Business License:</span>{" "}
          {vendor.license || "-"}
        </p>
      </div>

      {/* Space Info */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Space Information
        </h2>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Lot:</span> {space.lot}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Rent:</span> RM{space.fee}
        </p>
      </div>

      {/* Application Form */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Application Documents
        </h2>

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

        {renderUploadField(
          "permitLicenseFile",
          "Upload Permit License",
          "permitLicenseFile",
          ".pdf,image/*",
          "PDF or Image (max 5MB)"
        )}
      </div>
        <div className="w-full bg-white border-t border-gray-200 px-6 py-4">
            <button
                type="submit"
                onClick={handleSubmit}
                className="w-full py-3 bg-[#FF8225] text-white rounded-md font-medium hover:bg-[#e6731f] transition"
            >
                Submit
            </button>
        </div>

    </div>
  );
};

export default MarketspaceForm;
