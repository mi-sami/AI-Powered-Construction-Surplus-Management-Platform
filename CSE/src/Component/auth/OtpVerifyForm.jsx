import React, { useState } from "react";
import { MailCheck, ArrowLeft } from "lucide-react";

const OtpVerifyForm = ({
  email,
  loading,
  error,
  resendCooldown,
  onVerify,
  onResend,
  onBack,
}) => {
  const [enteredOtp, setEnteredOtp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify(enteredOtp, () => setEnteredOtp(""));
  };

  return (
    <div className="space-y-5 py-4">
      <button
        type="button"
        onClick={() => {
          setEnteredOtp("");
          onBack();
        }}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-900 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to edit details
      </button>

      <div>
        <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
          <MailCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Verify your email
        </h1>
        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
          We sent a 6-digit verification code to{" "}
          <span className="font-bold text-gray-800">{email}</span>. Enter it
          below to complete your account registration.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
            6-Digit Verification Code <span className="text-purple-600">*</span>
          </label>
          <input
            type="text"
            maxLength={6}
            value={enteredOtp}
            onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="••••••"
            className="w-full px-4 py-3 rounded-lg bg-white border border-purple-300 text-center text-xl font-extrabold tracking-[0.5em] text-purple-900 placeholder-gray-300 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        <div className="pt-1 flex justify-center">
          <button
            type="submit"
            disabled={loading || enteredOtp.length !== 6}
            className="px-9 py-2.5 rounded-full bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#9333ea] hover:from-[#4c1d95] hover:to-[#7e22ce] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Verify & Create Account"}
          </button>
        </div>
      </form>

      <p className="text-center text-xs text-gray-500 pt-2">
        Didn't receive the email?{" "}
        <button
          type="button"
          disabled={resendCooldown > 0 || loading}
          onClick={onResend}
          className="font-bold text-purple-700 hover:text-purple-900 underline underline-offset-2 cursor-pointer disabled:opacity-50 disabled:no-underline"
        >
          {resendCooldown > 0
            ? `Resend in ${resendCooldown}s`
            : "Resend code"}
        </button>
      </p>
    </div>
  );
};

export default OtpVerifyForm;