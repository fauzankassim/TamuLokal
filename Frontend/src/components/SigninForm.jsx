import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { TbEye, TbEyeClosed } from "react-icons/tb"
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const SigninForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate(); // ✅ initialize navigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🔐 Sign in using Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      console.log("✅ Signed in successfully:", data);

      // Session is automatically stored in localStorage by Supabase
      console.log("Access token:", data.session?.access_token);

      // ✅ Redirect to homepage
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Sign in failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex flex-col items-center font-inter">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Sign into your account
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 w-[300px]"
      >
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
            placeholder="example@gmail.com"
            className="w-full h-[40px] border border-gray-300 rounded-xl px-3 
                       text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8225]"
          />
        </div>

        {/* Password */}
        <div className="w-full">
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
              placeholder="Enter your password"
              className="w-full h-[40px] border border-gray-300 rounded-xl px-3 
                         text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#FF8225]"
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

        {/* Sign In Button */}
        <button
          type="submit"
          className="w-full h-[40px] rounded-xl bg-[#FF8225] text-white 
                     font-medium text-sm hover:bg-[#e6731f] transition-colors"
        >
          Sign In
        </button>

        {/* Divider */}
        <div className="flex items-center w-full my-2">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-sm text-gray-500">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Google Button */}
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
            console.log(data);
          }}
        >
          <FaGoogle className="text-[#DB4437]" />
          Continue with Google
        </button>
      </form>
    </div>
  );
};

export default SigninForm;
