import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, CheckCircle2, ShieldAlert } from "lucide-react";
import { verifyDocumentContent, fileToBase64 } from "../../Utils/docVerifier";

const RegisterForm = ({
  onStartRegistration,
  loading,
  serverError,
  onSwitchToLogin,
}) => {
  const [accountType, setAccountType] = useState("Company");
  const [docImage, setDocImage] = useState("");
  const [docError, setDocError] = useState("");
  const [localError, setLocalError] = useState("");
  const [isVerifyingDoc, setIsVerifyingDoc] = useState(false);
  const [isDocVerified, setIsDocVerified] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const regPassword = watch("password");
  const regEmailValue = watch("email");
  const enteredDocNo = watch(
    accountType === "Company" ? "tradeLicenseNo" : "nidNo"
  );

  const isEmailValid =
    regEmailValue &&
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(regEmailValue);

  const nameFieldKey = accountType === "Company" ? "companyName" : "fullName";
  const docNoFieldKey =
    accountType === "Company" ? "tradeLicenseNo" : "nidNo";
  const addressFieldKey =
    accountType === "Company" ? "companyAddress" : "address";

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    setDocImage("");
    setDocError("");
    setLocalError("");
    setIsDocVerified(false);
    setIsVerifyingDoc(false);
    clearErrors();
    reset();
  };

  const handleImageUpload = async (e) => {
    setDocError("");
    setIsDocVerified(false);
    setDocImage("");

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64Img = await fileToBase64(file);
      setIsVerifyingDoc(true);

      const result = await verifyDocumentContent(
        base64Img,
        accountType,
        enteredDocNo
      );

      if (result.valid) {
        setDocImage(base64Img);
        setIsDocVerified(true);
      } else {
        setDocError(result.message);
        e.target.value = "";
      }
    } catch (err) {
      setDocError(
        err.message ||
          "Could not verify document. Please upload a clearer photo."
      );
      e.target.value = "";
    } finally {
      setIsVerifyingDoc(false);
    }
  };

  const handleFormSubmit = (data) => {
    setLocalError("");
    if (isVerifyingDoc) {
      setDocError("Please wait while we verify your document...");
      return;
    }
    if (!docImage || !isDocVerified) {
      setDocError(
        accountType === "Company"
          ? "A valid verified Trade License image is required."
          : "A valid verified NID Card image is required."
      );
      return;
    }
    if (!agreedTerms) {
      setLocalError("Please accept the terms & conditions to continue.");
      return;
    }

    const newUser = {
      id: `u_${Date.now()}`,
      name: accountType === "Company" ? data.companyName : data.fullName,
      role: "user",
      type: accountType,
      accountType,
      email: data.email.trim(),
      phone: data.phone,
      address: accountType === "Company" ? data.companyAddress : data.address,
      tradeLicenseNo: accountType === "Company" ? data.tradeLicenseNo : null,
      tradeLicenseImage: accountType === "Company" ? docImage : null,
      nidNo: accountType === "Individual" ? data.nidNo : null,
      nidImage: accountType === "Individual" ? docImage : null,
      password: data.password,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
    };

    onStartRegistration(newUser);
  };

  const displayError = localError || serverError;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Create account
          </h1>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Verified marketplace onboarding
          </p>
        </div>

        <div className="inline-flex rounded-full bg-purple-100/80 p-1 border border-purple-200">
          {["Company", "Individual"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleAccountTypeChange(type)}
              className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full transition cursor-pointer ${
                accountType === type
                  ? "bg-gradient-to-r from-[#6d28d9] to-[#9333ea] text-white shadow-xs"
                  : "text-purple-800/70 hover:text-purple-950"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {displayError && (
        <div className="mb-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
          {displayError}
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3.5">
        <div>
          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
            {accountType === "Company" ? "Company name" : "Full name"}{" "}
            <span className="text-purple-600">*</span>
          </label>
          <input
            key={nameFieldKey}
            type="text"
            placeholder={
              accountType === "Company"
                ? "Enter company name"
                : "Enter your full name"
            }
            {...register(nameFieldKey, {
              required: `${
                accountType === "Company" ? "Company name" : "Full name"
              } is required`,
            })}
            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20"
          />
          {errors[nameFieldKey] && (
            <span className="text-red-500 text-[10px] mt-0.5 block">
              {errors[nameFieldKey].message}
            </span>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
            Email address <span className="text-purple-600">*</span>
          </label>
          <div className="relative flex items-center">
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 pr-7"
            />
            {isEmailValid && (
              <span className="absolute right-2.5 text-emerald-500 text-xs font-bold">
                ✓
              </span>
            )}
          </div>
          {errors.email && (
            <span className="text-red-500 text-[10px] mt-0.5 block">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 mb-1">
              Password <span className="text-purple-600">*</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters" },
              })}
              className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20"
            />
            {errors.password && (
              <span className="text-red-500 text-[10px] mt-0.5 block">
                {errors.password.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-700 mb-1">
              Confirm password <span className="text-purple-600">*</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword", {
                required: "Confirm password",
                validate: (val) =>
                  val === regPassword || "Passwords do not match",
              })}
              className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20"
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-[10px] mt-0.5 block">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 mb-1">
              Phone / WhatsApp <span className="text-purple-600">*</span>
            </label>
            <input
              key={`phone-${accountType}`}
              type="tel"
              placeholder="017XXXXXXXX"
              {...register("phone", {
                required: "WhatsApp number is required",
              })}
              className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20"
            />
            {errors.phone && (
              <span className="text-red-500 text-[10px] mt-0.5 block">
                {errors.phone.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-700 mb-1">
              {accountType === "Company" ? "Trade License No" : "NID No"}{" "}
              <span className="text-purple-600">*</span>
            </label>
            <input
              key={docNoFieldKey}
              type="text"
              placeholder={
                accountType === "Company" ? "TL-XXXXXX" : "NID Number"
              }
              {...register(docNoFieldKey, {
                required: `${
                  accountType === "Company" ? "Trade license no." : "NID no."
                } is required`,
              })}
              className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20"
            />
            {errors[docNoFieldKey] && (
              <span className="text-red-500 text-[10px] mt-0.5 block">
                {errors[docNoFieldKey].message}
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
            Address <span className="text-purple-600">*</span>
          </label>
          <input
            key={addressFieldKey}
            type="text"
            placeholder={
              accountType === "Company"
                ? "Office / Company address"
                : "Present address"
            }
            {...register(addressFieldKey, { required: "Address is required" })}
            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20"
          />
          {errors[addressFieldKey] && (
            <span className="text-red-500 text-[10px] mt-0.5 block">
              {errors[addressFieldKey].message}
            </span>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-semibold text-gray-700">
              {accountType === "Company"
                ? "Trade License Image"
                : "NID Card Image"}{" "}
              <span className="text-purple-600">*</span>
            </label>
            {docImage && !isVerifyingDoc && (
              <button
                type="button"
                onClick={() => {
                  setDocImage("");
                  setIsDocVerified(false);
                }}
                className="text-[10px] font-semibold text-red-500 hover:underline cursor-pointer"
              >
                Remove
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white border border-dashed border-purple-300">
            <input
              type="file"
              accept="image/*"
              disabled={isVerifyingDoc}
              onChange={handleImageUpload}
              className="w-full text-[11px] text-gray-500 file:mr-2.5 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer disabled:opacity-50"
            />
            {docImage && isDocVerified && (
              <img
                src={docImage}
                alt="Doc Preview"
                className="h-8 w-12 object-cover rounded border border-emerald-400 shrink-0"
              />
            )}
          </div>

          {isVerifyingDoc && (
            <div className="flex items-center gap-1.5 text-purple-700 text-[11px] font-medium mt-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>
                Scanning & verifying{" "}
                {accountType === "Company" ? "Trade License" : "NID Card"}...
              </span>
            </div>
          )}

          {isDocVerified && !isVerifyingDoc && (
            <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-semibold mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                Valid {accountType === "Company" ? "Trade License" : "NID Card"}{" "}
                verified!
              </span>
            </div>
          )}

          {docError && (
            <div className="flex items-start gap-1.5 text-red-500 text-[11px] font-medium mt-1">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{docError}</span>
            </div>
          )}
        </div>

        <div className="flex items-start space-x-2 pt-0.5">
          <input
            id="termsCheck"
            type="checkbox"
            checked={agreedTerms}
            onChange={(e) => setAgreedTerms(e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 accent-purple-600 rounded cursor-pointer"
          />
          <label
            htmlFor="termsCheck"
            className="text-[11px] text-gray-500 leading-snug cursor-pointer"
          >
            I agree to the{" "}
            <span className="font-semibold text-gray-800">
              terms & conditions
            </span>{" "}
            and confirm my{" "}
            <span className="font-semibold text-gray-800">
              {accountType === "Company" ? "trade license" : "NID document"}
            </span>{" "}
            is valid for admin approval.
          </label>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            type="submit"
            disabled={loading || isVerifyingDoc || !isDocVerified}
            className="px-9 py-2.5 rounded-full bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#9333ea] hover:from-[#4c1d95] hover:to-[#7e22ce] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Sending OTP..."
              : isVerifyingDoc
                ? "Verifying..."
                : "Create account"}
          </button>
        </div>
      </form>

      <p className="text-center text-xs text-gray-500 mt-4">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-bold text-purple-700 hover:text-purple-900 underline underline-offset-2 cursor-pointer"
        >
          Sign in
        </button>
      </p>
    </>
  );
};

export default RegisterForm;