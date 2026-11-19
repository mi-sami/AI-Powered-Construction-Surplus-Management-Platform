import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { UserRound } from "lucide-react";
import useAuthInfo from "../Hook/useAuthInfo";
import { handleApiAction } from "../Utils/ApiHandler";
import loginSideImg from "../assets/pexels-mart-production-7709283.jpg";
import Logo from "../assets/surplusx_logo_transparent.png";

const Login = () => {
  const { user, setUser } = useAuthInfo();
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect target path (Default: /profile)
  const from = location.state?.from?.pathname || "/profile";

  // Check persistent login status
  useEffect(() => {
    if (user?.email) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const identifierValue = watch("identifier");

  // Handle Login Submission using handleApiAction
  const onSubmit = async (data) => {
    setAuthError("");
    setLoading(true);

    try {
      const response = await handleApiAction({
        action: "GET",
        target: "users",
      });

      const users = Array.isArray(response) ? response : [];

      // Filter user by Email or Phone + Password
      const loggedUser = users.find(
        (u) =>
          (u.email?.trim().toLowerCase() ===
            data.identifier.trim().toLowerCase() ||
            u.phone?.trim() === data.identifier.trim()) &&
          String(u.password) === String(data.password)
      );

      if (loggedUser) {
        if (loggedUser.status !== "approved") {
          setAuthError("Your account is pending admin approval.");
          setLoading(false);
          return;
        }

        // Set state & LocalStorage
        setUser(loggedUser);
        localStorage.setItem("user", JSON.stringify(loggedUser));

        // Navigate to target page
        navigate(from, { replace: true });
      } else {
        setAuthError("Invalid email/phone or password!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setAuthError(
        "Server connection failed. Ensure json-server is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-8 bg-[#161922] overflow-x-hidden font-sans">
      {/* Split Background (Dark Top + Indigo/Slate Bottom) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-[58%] bg-[#161922] relative overflow-hidden">
          <div className="hidden md:block absolute -top-24 left-1/3 w-[520px] h-[520px] bg-[#1e222e] rotate-45 opacity-80"></div>
        </div>
        <div className="h-[42%] bg-gradient-to-r from-[#4b5cc4] to-[#5a67d8]"></div>
      </div>

      {/* Main Wrapper with Vertical "LOGIN" Label on the Left */}
      <div className="relative z-10 flex items-center max-w-5xl w-full my-6">
        {/* Vertical LOGIN Text Outside Card */}
        <div className="hidden lg:flex flex-col items-center justify-center mr-6 select-none">
          <span
            className="text-xs font-extrabold tracking-[0.55em] text-white/90 uppercase"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            LOGIN
          </span>
        </div>

        {/* Layered White Card Effect */}
        <div className="relative w-full">
          {/* Subtle Stacked Shadow Cards at Bottom */}
          <div className="hidden sm:block absolute -bottom-2.5 inset-x-4 h-6 bg-white/80 rounded-sm shadow"></div>
          <div className="hidden sm:block absolute -bottom-5 inset-x-8 h-6 bg-white/50 rounded-sm shadow"></div>

          {/* Primary White Card */}
          <div className="relative bg-white rounded-sm shadow-2xl p-5 sm:p-8 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-stretch">
            {/* Mobile & Tablet Header (White Background, No Logo, Large Purple-Blue Gradient Icon) */}
            <div className="md:hidden flex flex-col items-center justify-center bg-white py-3 px-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#4f5bd5] via-[#5b50d6] to-[#7c3aed] flex items-center justify-center shadow-lg shadow-[#4f5bd5]/30">
                <UserRound className="w-12 h-12 text-white" strokeWidth={2} />
              </div>
              <p className="text-xs font-medium text-gray-500 mt-3 tracking-wide">
                Sign in to your Surplus Exchange account
              </p>
            </div>

            {/* Desktop Left Side Image Card */}
            <div className="hidden md:block md:col-span-5 relative rounded-sm overflow-hidden min-h-[480px] shadow-md group">
              <img
                src={loginSideImg}
                alt="Surplus Exchange Login"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              {/* Dark Indigo Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a2035]/90 via-[#1a2035]/25 to-transparent"></div>

              {/* Top Logo */}
              <div
                onClick={() => navigate("/")}
                className="absolute top-4 left-4 backdrop-blur-xs px-2 py-1 rounded-xs cursor-pointer"
              >
                <img
                  className="h-14 w-auto object-contain"
                  src={Logo}
                  alt="Surplus Exchange Logo"
                />
              </div>

              {/* Bottom Caption on Image */}
              <div className="absolute bottom-6 inset-x-6 text-white">
                <p className="text-lg font-bold leading-snug">
                  Sell what is left.
                  <br />
                  Buy what you need.
                </p>
                <p className="text-[11px] text-white/75 mt-1.5 leading-relaxed">
                  Construction surplus marketplace for verified companies &
                  individuals.
                </p>
              </div>
            </div>

            {/* Right Side Form Content (Vertically Centered) */}
            <div className="md:col-span-7 flex flex-col justify-center py-4 md:py-10">
              {/* Header: Login_ */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                    Login<span className="text-[#4f5bd5]">_</span>
                  </h1>
                  <div className="w-12 h-[3px] bg-[#4f5bd5] mt-2"></div>
                </div>

                {/* Quick Switch Pill (Login vs Register) */}
                <div className="inline-flex rounded-full bg-gray-100 p-1 border border-gray-200">
                  <button
                    type="button"
                    className="px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full bg-[#4f5bd5] text-white shadow-xs"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full text-gray-500 hover:text-gray-800 transition cursor-pointer"
                  >
                    Register
                  </button>
                </div>
              </div>

              {/* Auth Error Alert */}
              {authError && (
                <div className="mb-5 p-2.5 bg-red-50 border-l-2 border-red-500 text-red-600 text-xs">
                  {authError}
                </div>
              )}

              {/* Underline Style Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email or Phone Field */}
                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-gray-900 uppercase mb-1">
                    EMAIL / PHONE <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center border-b border-gray-300 focus-within:border-[#4f5bd5] pb-2">
                    <input
                      type="text"
                      placeholder="you@example.com or 017XXXXXXXX"
                      {...register("identifier", {
                        required: "Email or phone number is required",
                      })}
                      className="w-full bg-transparent text-sm font-medium text-[#4f5bd5] placeholder-gray-500 focus:outline-none pr-6"
                    />
                    {identifierValue?.trim().length > 4 && (
                      <span className="text-emerald-500 text-xs font-bold shrink-0">
                        ✓
                      </span>
                    )}
                  </div>
                  {errors.identifier && (
                    <span className="text-red-500 text-[11px] mt-1 block">
                      {errors.identifier.message}
                    </span>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-gray-900 uppercase mb-1">
                    PASSWORD <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center border-b border-gray-300 focus-within:border-[#4f5bd5] pb-2">
                    <input
                      type="password"
                      placeholder="••••••••"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-500 focus:outline-none"
                    />
                  </div>
                  {errors.password && (
                    <span className="text-red-500 text-[11px] mt-1 block">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                {/* Keep me logged in & Forgot password */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("keepLoggedIn")}
                      className="h-3.5 w-3.5 accent-[#4f5bd5] rounded cursor-pointer"
                    />
                    <span className="text-[11px] text-gray-600 font-medium">
                      Keep me logged in
                    </span>
                  </label>

                  <a
                    href="#forgot-password"
                    className="text-[11px] font-bold text-[#4f5bd5] hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Bottom Bar: Register Link + Pill Submit Button */}
                <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
                  <p className="text-xs text-gray-500">
                    New here?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/register")}
                      className="font-bold text-gray-900 hover:text-[#4f5bd5] transition cursor-pointer"
                    >
                      Create Account
                    </button>
                  </p>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-9 py-3 bg-[#4f5bd5] hover:bg-[#3f4bc2] text-white text-xs font-bold tracking-widest uppercase rounded-full shadow-lg shadow-[#4f5bd5]/30 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? "SIGNING IN..." : "SIGN IN"}
                  </button>
                </div>
              </form>

              {/* Footer Note */}
              <div className="mt-8 pt-4 border-t border-gray-100 text-[11px] text-gray-400">
                Register as a{" "}
                <span
                  onClick={() => navigate("/register")}
                  className="text-gray-700 font-semibold underline cursor-pointer"
                >
                  Company
                </span>{" "}
                or an{" "}
                <span
                  onClick={() => navigate("/register")}
                  className="text-gray-700 font-semibold underline cursor-pointer"
                >
                  Individual
                </span>{" "}
                to buy or list surplus construction materials.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;