import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import BusinessIdentificationSignupForm from "../components/BusinessIdentificationSignupForm";
import BusinessVerificationSignupForm from "../components/BusinessVerificationSignupForm";
import BusinessFinishSignupForm from "../components/BusinessFinishSignupForm";
import { supabase } from "../supabaseClient";

const base_url = import.meta.env.VITE_BACKEND_API_URL;

const BusinessRegistrationPage = () => {

  const { role } = useParams();
  const session = useAuth(true);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [identificationData, setIdentificationData] = useState({});
  const [verificationData, setVerificationData] = useState({});
  const [finishData, setFinishData] = useState({});
  const [loading, setLoading] = useState(false);

  const isIdentificationComplete =
  identificationData.fullName?.trim() &&
  identificationData.nric?.trim() &&
  identificationData.businessName?.trim() &&
  identificationData.businessLicense?.trim();

  const isVerificationComplete =
  verificationData.icFront &&
  verificationData.icBack &&
  verificationData.businessLicenseFile;

  const isFinishComplete =
  finishData.username?.trim();


  
const handleNext = () => setStep((prev) => Math.min(prev + 1, 3));


  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (!session) {
      alert("You must be logged in to register a business.");
      return;
    }

    try {
      setLoading(true);

      const allFormData = {
        ...identificationData,
        ...verificationData,
        ...finishData,
      };

      const finalData = {
        ...allFormData,
        user_id: session.user.id,
        email: session.user.email,
      };

      const role =
        allFormData.userType?.toLowerCase() === "vendor"
          ? "vendor"
          : "organizer";

      const endpoint = `${base_url}/${role}`;
      console.log("📤 Submitting registration to:", endpoint);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Registration failed");
      }

      const result = await response.json();
      console.log(`${role} registration success:`, result);
      alert(`${role.charAt(0).toUpperCase() + role.slice(1)} registration complete!`);

      // ✅ Upload image if provided
      if (allFormData.profilePicture) {
        console.log("🟠 Starting image upload...");
        const vendorId = result.id || result[role]?.id || session.user.id;
        const file = allFormData.profilePicture;
        const filePath = `vendors/${vendorId}/profile.jpg`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("tamulokal")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true,
            contentType: file.type,
          });

        if (uploadError) {
          console.error("❌ Upload error:", uploadError);
          alert("Failed to upload image: " + uploadError.message);
        } else {
          const { data: publicData } = supabase.storage
            .from("tamulokal")
            .getPublicUrl(filePath);

          const publicUrl = publicData.publicUrl;
          console.log("✅ Public URL:", publicUrl);

          // Update vendor image via backend
          const updateResponse = await fetch(
            `${base_url}/${role}/${vendorId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ image: publicUrl }),
            }
          );

          if (!updateResponse.ok) {
            const err = await updateResponse.json().catch(() => ({}));
            throw new Error(err.message || `Failed to update ${role} image`);
          }

          console.log(`✅ ${role} image URL updated successfully!`);
        }
      }

      // ✅ Redirect to homepage after successful registration
      const redirectPath =
        role === "vendor" ? "/business/vendor" : "/business/organizer";
      console.log(`🔁 Redirecting to ${redirectPath}...`);

      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Identification" },
    { number: 2, title: "Verification" },
    { number: 3, title: "Finish" },
  ];

  return (
    <div className="flex flex-col items-center font-inter w-full min-h-screen bg-white relative">
      {/* Header */}
      <div className="fixed top-0 bg-white w-full flex flex-col items-center z-20 pb-2 pt-5 border-b border-gray-100">
        <h1 className="text-base font-semibold text-[var(--black)] mb-4">
          Business Registration
        </h1>

        {/* Progress Bar */}
        <div className="relative flex items-center justify-center w-full max-w-[300px]">
          {steps.map((s, index) => (
            <div
              key={s.number}
              className="flex-1 flex flex-col items-center justify-center relative"
            >
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-1/3 left-1/2 right-[-50%] h-[2px] 
                              ${step > s.number ? "bg-[#FF8225]" : "bg-gray-300"} 
                              -translate-y-1/2 transition-all duration-500 z-0`}
                ></div>
              )}
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium transition-all duration-300 z-10
                  ${
                    step === s.number
                      ? "border-[#FF8225] text-[#FF8225] bg-[var(--white)]"
                      : step > s.number
                      ? "border-[#FF8225] bg-[#FF8225] text-white"
                      : "border-gray-300 text-gray-400 bg-[var(--white)]"
                  }`}
              >
                {s.number}
              </div>
              <span
                className={`text-[10px] mt-1 ${
                  step === s.number
                    ? "text-[#FF8225] font-medium"
                    : "text-gray-400"
                }`}
              >
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Steps */}
      <div className="mt-[150px] mb-[100px] flex flex-col items-center justify-start w-full px-4 pb-10">
        {step === 1 && (
          <BusinessIdentificationSignupForm onChange={setIdentificationData} role={role}/>
        )}
        {step === 2 && (
          <BusinessVerificationSignupForm onChange={setVerificationData} />
        )}
        {step === 3 && (
          <BusinessFinishSignupForm onChange={setFinishData} user_id={session.user.id} />
        )}
      </div>

      {/* Footer Buttons */}
      <div className="fixed bottom-0 bg-white w-full flex flex-col items-center pb-5 pt-3 border-t border-gray-200 z-20">
        <div className="flex flex-col w-[300px] gap-2">
          {step < 3 ? (
            <>
              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && !isIdentificationComplete) ||
                  (step === 2 && !isVerificationComplete)
                }
                className={`h-[40px] rounded-xl font-medium text-sm w-full transition-colors
                ${
                  (step === 1 && !isIdentificationComplete) ||
                  (step === 2 && !isVerificationComplete)
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#FF8225] text-white hover:bg-[#e6731f]"
                }`}
              >
                Next
              </button>


              {step === 1 && (
                <button
                  onClick={() => navigate('/profile')}
                  className="h-[40px] rounded-xl border border-gray-300 text-gray-700
                             font-medium text-sm hover:bg-gray-50 transition-colors w-full"
                >
                  Cancel
                </button>
              )}

              {step === 2 && (
                <button
                  onClick={handleBack}
                  className="h-[40px] rounded-xl border border-gray-300 text-gray-700
                             font-medium text-sm hover:bg-gray-50 transition-colors w-full"
                >
                  Back
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={handleSubmit}
                disabled={loading || !isFinishComplete}
                className={`h-[40px] rounded-xl font-medium text-sm w-full ${
                  loading || !isFinishComplete
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-[#FF8225] text-white hover:bg-[#e6731f] transition-colors"
                }`}
              >
                {loading ? "Submitting..." : "Finish"}
              </button>

              <button
                onClick={handleBack}
                className="h-[40px] rounded-xl border border-gray-300 text-gray-700
                            font-medium text-sm hover:bg-gray-50 transition-colors w-full"
              >
                Back
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessRegistrationPage;
