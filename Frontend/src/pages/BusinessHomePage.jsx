import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../supabaseClient";
import VendorHomePage from "../pages/VendorHomePage";
import OrganizerHomePage from "../pages/OrganizerHomePage";

const BusinessHomePage = () => {
  const session = useAuth(true);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!session?.user) return;

      try {
        const userId = session.user.id;
        const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/user/${userId}/roles`);
        const data = await res.json();

        if (res.ok && data.roles) {
          // Check which business role the user has
          if (data.roles.includes("Vendor")) setRole("Vendor");
          else if (data.roles.includes("Organizer")) setRole("Organizer");
          else setRole("None"); // fallback if user has no business role
        } else {
          setRole("None");
        }
      } catch (err) {
        console.error(err);
        setRole("None");
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [session]);

  if (loading) return <div>Loading...</div>;

  if (role === "Vendor") return <VendorHomePage />;
  if (role === "Organizer") return <OrganizerHomePage />;

  return <div>No business account found. Please register.</div>;
};

export default BusinessHomePage;
