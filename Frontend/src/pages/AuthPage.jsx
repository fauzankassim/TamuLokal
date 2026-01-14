import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SignupForm from "../components/SignupForm";
import SigninForm from "../components/SigninForm";
import { useAuth } from "../hooks/useAuth";
import { TbX } from "react-icons/tb"; 

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from || "/";

  // Use the custom hook to redirect if session exists
  const session = useAuth(false, "/"); // false = don't redirect if no session

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Redirect to homepage if session exists
    if (session) {
      navigate("/", { replace: true });
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [from, navigate, session]);

  const handleClose = () => {
    navigate(from, { replace: true });
  };

  const toggleForm = () => setIsSignUp(!isSignUp);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-[#FFFDFA] px-4 font-inter relative">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
      >
        <TbX className="w-5 h-5" /> {/* ✅ TbX icon */}
      </button>

      <img src="/tamulokal.png" alt="tamulokal" className="w-16 h-16" />
      {isSignUp ? <SignupForm /> : <SigninForm />}

      <div className="mt-4 text-sm text-gray-600 text-center">
        {isSignUp ? (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={toggleForm}
              className="text-[#FF8225] font-medium hover:underline"
            >
              Login
            </button>
          </>
        ) : (
          <>
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={toggleForm}
              className="text-[#FF8225] font-medium hover:underline"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
