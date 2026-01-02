// hooks/useAuth.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export const useAuth = (redirectIfNoSession = false, redirectPath = "/auth") => {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error fetching session:", error);
          return;
        }

        setSession(data.session || null);

        if (redirectIfNoSession && !data.session) {
          navigate(redirectPath, { replace: true });
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkSession();
  }, [navigate, redirectIfNoSession, redirectPath]);

  return session;
};
