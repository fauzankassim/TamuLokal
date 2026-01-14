import React, { useState, useRef } from "react";
import { FaGoogle } from "react-icons/fa";
import { TbEye, TbEyeClosed } from "react-icons/tb"
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // debounce reference
  const debounceRef = useRef(null);

  const checkUsername = async (username) => {
    if (!username) {
      setUsernameAvailable(null);
      return;
    }

    setCheckingUsername(true);

    const { data, error } = await supabase
      .from("visitor")
      .select("username")
      .eq("username", username)
      .maybeSingle();

    if (error) {
      console.error(error);
    }

    if (!data) {
      setUsernameAvailable(true);
    } else {
      setUsernameAvailable(false);
    }

    setCheckingUsername(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "username") {
      // clear previous debounce
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        checkUsername(e.target.value);
      }, 500);
    }
  };

  const togglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
          },
        },
      });

      if (error) throw error;

      const visitor = data.user;
      if (!visitor) throw new Error("Signup failed: user not created.");
      localStorage.setItem("isHello", "true");
      navigate("/");

    } catch (err) {
      console.error("Signup failed:", err);
      alert(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center font-inter">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Create your account
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-2 w-[300px]"
      >
        {/* Username */}
        <div className="w-full">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onFocus={() => setFocusedField("username")}
            onBlur={() => setFocusedField(null)}
            placeholder="Enter your username"
            className="w-full h-[40px] border border-gray-300 rounded-xl px-3 
                       text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8225]"
            required
          />

          {focusedField === "username" && (
            <>
              {checkingUsername && (
                <p className="text-xs text-gray-500 mt-1">Checking username...</p>
              )}

              {usernameAvailable === false && !checkingUsername && (
                <p className="text-xs text-red-500 mt-1">Username already taken</p>
              )}

              {usernameAvailable === true && !checkingUsername && (
                <p className="text-xs text-green-500 mt-1">Username available</p>
              )}
            </>
          )}
        </div>

        {/* Email */}
        <div className="w-full">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onFocus={() => setFocusedField("email")}
            placeholder="example@gmail.com"
            className="w-full h-[40px] border border-gray-300 rounded-xl px-3 
                       text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8225]"
            required
          />
        </div>

        {/* Password */}
        <div className="w-full mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocusedField("password")}
              placeholder="Enter your password"
              className="w-full h-[40px] border border-gray-300 rounded-xl px-3 
                         text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#FF8225]"
              required
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <TbEye /> : <TbEyeClosed />}
            </button>
          </div>
        </div>

        {/* Signup Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-[40px] rounded-xl bg-[#FF8225] text-white 
                     font-medium text-sm hover:bg-[#e6731f] transition-colors disabled:opacity-50"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <div className="flex items-center w-full my-2">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-sm text-gray-500">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <button
          type="button"
          className="w-full h-[40px] rounded-xl border border-gray-300 
                     flex items-center justify-center gap-2 text-sm font-medium 
                     hover:bg-gray-50 transition-colors"
          onClick={async () => {
            const { data, error } = await supabase.auth.signInWithOAuth({
              provider: "google",
            });
            if (error) console.error(error);
          }}
        >
          <FaGoogle className="text-[#DB4437]" />
          Continue with Google
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
