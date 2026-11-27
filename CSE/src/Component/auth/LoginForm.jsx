import React from "react";
import { useForm } from "react-hook-form";
import { Sparkles } from "lucide-react";

const LoginForm = ({ onSubmit, loading, error, onSwitchToRegister }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const identifierValue = watch("identifier");

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="mb-7">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-purple-700 bg-purple-100/80 px-3 py-1 rounded-full mb-3">
          <Sparkles className="w-3 h-3" /> Surplus Exchange
        </span>
        <h1 className="text-3xl sm:text-[34px] font-extrabold text-gray-900 tracking-tight">
          Sign in
        </h1>
        <p className="text-xs text-gray-500 mt-1.5">
          Enter your registered email or phone number to access your dashboard.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
            Email or phone number <span className="text-purple-600">*</span>
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="you@example.com or 017XXXXXXXX"
              {...register("identifier", {
                required: "Email or phone number is required",
              })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 transition"
            />
            {identifierValue?.trim().length > 4 && (
              <span className="absolute right-3 text-emerald-500 text-xs font-bold">
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

        <div>
          <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
            Password <span className="text-purple-600">*</span>
          </label>
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
            className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 transition"
          />
          {errors.password && (
            <span className="text-red-500 text-[11px] mt-1 block">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("keepLoggedIn")}
              className="h-3.5 w-3.5 accent-purple-600 rounded cursor-pointer"
            />
            <span className="text-xs text-gray-600">Keep me signed in</span>
          </label>

          <a
            href="#forgot-password"
            className="text-xs font-semibold text-purple-700 hover:text-purple-900 hover:underline"
          >
            Forgot password?
          </a>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-2.5 rounded-full bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#9333ea] hover:from-[#4c1d95] hover:to-[#7e22ce] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>

      <p className="text-center text-xs text-gray-500 mt-6">
        New to Surplus Exchange?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="font-bold text-purple-700 hover:text-purple-900 underline underline-offset-2 cursor-pointer"
        >
          Create an account
        </button>
      </p>
    </div>
  );
};

export default LoginForm;