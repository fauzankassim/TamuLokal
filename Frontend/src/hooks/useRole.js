import { useEffect, useState } from "react";

/**
 * useUserRoles
 * -------------
 * Fetches roles for the currently logged-in user
 *
 * @param {object} session - Supabase/Auth session
 * @param {string} baseUrl - Backend API base URL
 */
const useRole = (session, baseUrl = import.meta.env.VITE_BACKEND_API_URL) => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      if (!session?.user) {
        setRoles([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${baseUrl}/user/${session.user.id}/roles`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch user roles");
        }

        const data = await res.json();
        setRoles(data.roles || []);
      } catch (err) {
        console.error("Error fetching roles:", err);
        setError(err.message);
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [session, baseUrl]);

  return {
    roles,
    loading,
    error,
    isVendor: roles.includes("Vendor"),
    isOrganizer: roles.includes("Organizer"),
    isAdmin: roles.includes("Admin"),
  };
};

export default useRole;
