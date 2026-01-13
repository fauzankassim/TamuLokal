import React, { useState, useEffect } from "react";
import {
  TbMenu2,
  TbX,
  TbLogout,
  TbChevronRight,
  TbBell,
  TbBookmark,
  TbBuildingStore,
  TbHistoryToggle,
  TbLayoutGrid,
  TbPlus,
  TbPackage,
  TbClipboardList,
  TbHourglass,
  TbStar,
  TbChartBar,
  TbNotes
} from "react-icons/tb";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../supabaseClient";

const ProfileHamburger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [subOpenOrganizer, setSubOpenOrganizer] = useState(true);
  const [subOpenRegistration, setSubOpenRegistration] = useState(false);
  const [subOpenVendor, setSubOpenVendor] = useState(true);
  const [roles, setRoles] = useState([]);
  const [isVerified, setVerification] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const session = useAuth(true);

  const toggleMenu = () => setIsOpen((prev) => !prev);

useEffect(() => {
  const fetchRolesAndVerification = async () => {
    if (!session || !session.user) return;
    const userId = session.user.id;

    try {
      // 1️⃣ Fetch roles
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/user/${userId}/roles`
      );
      const data = await res.json();
      let fetchedRoles = [];
      if (res.ok && data.roles) {
        fetchedRoles = data.roles;
        setRoles(fetchedRoles);
      } else {
        setRoles([]);
      }

      // 2️⃣ If user has vendor or organizer role, fetch verification status
      if (fetchedRoles.includes("Vendor")) {
        const verifyRes = await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}/vendor/${userId}/verify`
        );
        const verifyData = await verifyRes.json();
        setVerification(verifyData.verified);
      }

      if (fetchedRoles.includes("Organizer")) {
        const verifyRes = await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}/organizer/${userId}/verify`
        );
        const verifyData = await verifyRes.json();
        setVerification(verifyData.verified);

      }
    } catch (err) {
      console.error("Error fetching roles or verification:", err);
      setRoles([]);
    }
  };

  fetchRolesAndVerification();
}, [session]);


  const handleSignOut = async () => {
    try {
      setIsOpen(false);
      // Clear local storage before sign-out to remove cached user/session data
      localStorage.clear();

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      navigate("/auth", { replace: true });
    } catch (error) {
      console.error("Sign-out error:", error.message);
      alert("Failed to sign out: " + error.message);
    }
  };

  const isVendor = roles.includes("Vendor");
  const isOrganizer = roles.includes("Organizer");
  const hasBusinessRole = isVendor || isOrganizer;

  return (
    <div className="relative z-[60]">
      <button
        onClick={toggleMenu}
        className={`text-3xl text-gray-800 hover:text-[#FF8225] transition-colors duration-200 relative z-[70]
          ${isOpen ? "md:hidden" : ""}
        `}
      >
        {isOpen ? <TbX /> : <TbMenu2 />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-[var(--white)] z-[60] flex flex-col justify-between transition-all duration-300">
          <button
            onClick={toggleMenu}
            className="absolute top-4 right-4 text-3xl text-gray-800 hover:text-[#FF8225] transition-colors duration-200"
          >
            <TbX />
          </button>

          <div className="flex flex-col mt-16 px-6 gap-8 overflow-y-auto">
            <div>
              <h2 className="text-sm uppercase tracking-wide text-gray-400 mb-3">
                My Account
              </h2>

              <button
                onClick={() => {
                  navigate("/market/history");
                  setIsOpen(false);
                }}
                className="flex justify-between items-center w-full py-2.5 text-gray-800 hover:text-[#FF8225] transition-colors"
              >
                <div className="flex items-center gap-3 font-medium">
                  <TbHistoryToggle className="text-xl" />
                  Market History
                </div>
                <TbChevronRight className="text-gray-400 ml-auto" />
              </button>

              <button
                onClick={() => {
                  navigate("/notifications");
                  setIsOpen(false);
                }}
                className="flex justify-between items-center w-full py-2.5 text-gray-800 hover:text-[#FF8225] transition-colors"
              >
                <div className="flex items-center gap-3 font-medium">
                  <TbBell className="text-xl" />
                  Notifications
                </div>
                <TbChevronRight className="text-gray-400 ml-auto" />
              </button>

              <button
                onClick={() => {
                  navigate("/market/bookmark");
                  setIsOpen(false);
                }}
                className="flex justify-between items-center w-full py-2.5 text-gray-800 hover:text-[#FF8225] transition-colors"
              >
                <div className="flex items-center gap-3 font-medium">
                  <TbBookmark className="text-xl" />
                  Bookmarks
                </div>
                <TbChevronRight className="text-gray-400 ml-auto" />
              </button>

              {!isVendor && !isOrganizer && (
                <>
                              <button
                onClick={() => {
                  navigate("/product-review");
                  setIsOpen(false);
                }}
                className="flex justify-between items-center w-full py-2.5 text-gray-800 hover:text-[#FF8225] transition-colors"
              >
                <div className="flex items-center gap-3 font-medium">
                  <TbStar className="text-xl" />
                  Product Reviews
                </div>
                <TbChevronRight className="text-gray-400 ml-auto" />
              </button>
                <div className="flex flex-col">
                  <button
                    onClick={() => setSubOpenRegistration((prev) => !prev)}
                    className="flex justify-between items-center w-full py-2.5 text-gray-800 hover:text-[#FF8225] transition-colors"
                  >
                    <div className="flex items-center gap-3 font-medium">
                      <TbClipboardList className="text-xl" />
                      Switch to business account
                    </div>
                    <TbChevronRight
                      className={`text-gray-400 ml-auto transition-transform duration-200 ${
                        subOpenRegistration ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  {subOpenRegistration && (
                    <div className="ml-4 flex flex-col gap-1 mt-1">
                      <button
                        onClick={() => {
                          navigate("/organizer/registration");
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-3 text-gray-800 hover:text-[#FF8225] py-2 text-left text-base font-normal"
                      >
                        <TbBuildingStore className="text-xl" />
                        Organizer
                      </button>

                      <button
                        onClick={() => {
                          navigate("/vendor/registration");
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-3 text-gray-800 hover:text-[#FF8225] py-2 text-left text-base font-normal"
                      >
                        <TbPackage className="text-xl" />
                        Vendor
                      </button>
                    </div>
                  )}
                </div>
                </>
              )}
            </div>

            {hasBusinessRole && (
              <div>
                <h2 className="text-sm uppercase tracking-wide text-gray-400 mb-3">
                  Business
                </h2>
              {isVerified ? (
                <div className="flex flex-col gap-2">
                  {isVendor && (
                    <div className="flex flex-col">
                      <button
                        onClick={() => {
                          navigate("/business/product");
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-3 text-gray-800 hover:text-[#FF8225] py-2 text-left text-base font-normal"
                      >
                        <div className="flex items-center gap-3 font-medium">
                          <TbPackage className="text-xl" />
                          Product
                        </div>
                      </button>
                      <button
                        onClick={() => setSubOpenVendor((prev) => !prev)}
                        className="flex justify-between items-center w-full py-2.5 text-gray-800 hover:text-[#FF8225] transition-colors"
                      >
                        <div className="flex items-center gap-3 font-medium">
                          <TbBuildingStore className="text-xl" />
                          Market Space
                        </div>
                        <TbChevronRight
                          className={`text-gray-400 ml-auto transition-transform duration-200 ${
                            subOpenVendor ? "rotate-90" : ""
                          }`}
                        />
                      </button>

                      {subOpenVendor && (
                        <div className="ml-4 flex flex-col gap-1 mt-1">
                          <button
                            onClick={() => {
                              navigate("/business/marketspace");
                              setIsOpen(false);
                            }}
                            className="flex items-center gap-3 text-gray-800 hover:text-[#FF8225] py-2 text-left text-base font-normal"
                          >
                            <TbLayoutGrid className="text-xl" />
                            Manage
                          </button>
                          <button
                            onClick={() => {
                              navigate("/business/marketspace/available");
                              setIsOpen(false);
                            }}
                            className="flex items-center gap-3 text-gray-800 hover:text-[#FF8225] py-2 text-left text-base font-normal"
                          >
                            <TbPlus className="text-xl" />
                            Available
                          </button>
                          <button
                            onClick={() => {
                              navigate("/business/marketspace/application");
                              setIsOpen(false);
                            }}
                            className="flex items-center gap-3 text-gray-800 hover:text-[#FF8225] py-2 text-left text-base font-normal"
                          >
                            <TbNotes className="text-xl" />
                            My Application
                          </button>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          navigate(`/business/vendor/${session?.user?.id}/statistic`);
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-3 text-gray-800 hover:text-[#FF8225] py-2 text-left text-base font-normal"
                      >
                        <div className="flex items-center gap-3 font-medium">
                          <TbChartBar className="text-xl" />
                          Statistic
                        </div>
                      </button>
                    </div>
                    
                  )}

                  {isOrganizer && (
                    <div className="flex flex-col">
                      <button
                        onClick={() => setSubOpenOrganizer((prev) => !prev)}
                        className="flex justify-between items-center w-full py-2.5 text-gray-800 hover:text-[#FF8225] transition-colors"
                      >
                        <div className="flex items-center gap-3 font-medium">
                          <TbBuildingStore className="text-xl" />
                          Market
                        </div>
                        <TbChevronRight
                          className={`text-gray-400 ml-auto transition-transform duration-200 ${
                            subOpenOrganizer ? "rotate-90" : ""
                          }`}
                        />
                      </button>

                      {subOpenOrganizer && (
                        <div className="ml-4 flex flex-col gap-1 mt-1">
                          <button
                            onClick={() => {
                              navigate("/business/market/");
                              setIsOpen(false);
                            }}
                            className="flex items-center gap-3 text-gray-800 hover:text-[#FF8225] py-2 text-left text-base font-normal"
                          >
                            <TbLayoutGrid className="text-xl" />
                            Manage
                          </button>
                          <button
                            onClick={() => {
                              navigate("/business/market/apply");
                              setIsOpen(false);
                            }}
                            className="flex items-center gap-3 text-gray-800 hover:text-[#FF8225] py-2 text-left text-base font-normal"
                          >
                            <TbPlus className="text-xl" />
                            Apply
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
  
                  ) : (
      // ✅ Pending Application Section
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-gray-800 py-2 text-left text-base font-medium">
          <TbHourglass className="text-xl" />
          Application in Progress
        </div>
      </div>
    )}
  </div>
            )}
          </div>

          <div
            className="flex items-center gap-2 p-6 text-red-600 hover:text-red-700 cursor-pointer border-t border-gray-100"
            onClick={handleSignOut}
          >
            <TbLogout className="text-xl" />
            <span className="text-sm font-medium">Sign Out</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHamburger;