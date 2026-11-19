import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UserRound, Loader2, CheckCircle2, ShieldAlert } from "lucide-react";
import Tesseract from "tesseract.js";
import { handleApiAction } from "../Utils/ApiHandler";
import registerSideImg from "../assets/pexels-mart-production-7709283.jpg";
import Logo from "../assets/surplusx_logo_transparent.png";

const Register = () => {
  const [accountType, setAccountType] = useState("Company"); // 'Company' or 'Individual'
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [docImage, setDocImage] = useState("");
  const [docError, setDocError] = useState("");
  const [isVerifyingDoc, setIsVerifyingDoc] = useState(false);
  const [isDocVerified, setIsDocVerified] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const password = watch("password");
  const emailValue = watch("email");
  const enteredNidNo = watch("nidNo");
  const enteredLicenseNo = watch("tradeLicenseNo");

  // ডকুমেন্টের টেক্সট বিশ্লেষণ করে NID বা Trade License কি না তা যাচাই
  const verifyDocumentContent = async (imageDataUrl, type) => {
    // ইংরেজি ও বাংলা উভয় টেক্সট রিড করার জন্য 'eng+ben'
    const {
      data: { text },
    } = await Tesseract.recognize(imageDataUrl, "eng+ben");

    const normalizedText = text.toLowerCase().replace(/\s+/g, " ");
    const digitsOnlyText = text.replace(/\D/g, "");

    if (type === "Individual") {
      // বাংলাদেশি NID কার্ডের কমন কীওয়ার্ড
      const nidKeywords = [
        "national id",
        "nid",
        "government of the people",
        "people's republic of bangladesh",
        "date of birth",
        "id no",
        "blood group",
        "জাতীয় পরিচয়",
        "পরিচয় পত্র",
        "গণপ্রজাতন্ত্রী বাংলাদেশ",
        "জন্ম তারিখ",
      ];

      const hasNidKeyword = nidKeywords.some((kw) =>
        normalizedText.includes(kw),
      );
      // ১০, ১৩ অথবা ১৭ ডিজিটের NID নম্বর আছে কি না
      const hasNidNumberPattern = /\b\d{10}\b|\b\d{13}\b|\b\d{17}\b/.test(
        digitsOnlyText,
      );

      // ইউজার যদি ফর্মে NID নম্বর লিখে থাকে, তা ছবির নম্বরের সাথে মিলছে কি না চেক
      const cleanEnteredNid = (enteredNidNo || "").replace(/\D/g, "");
      const matchesEnteredNid =
        cleanEnteredNid.length >= 10
          ? digitsOnlyText.includes(cleanEnteredNid)
          : true;

      if (!hasNidKeyword && !hasNidNumberPattern) {
        return {
          valid: false,
          message:
            "Invalid NID image! Please upload a clear photo of an official NID card.",
        };
      }

      if (!matchesEnteredNid) {
        return {
          valid: false,
          message:
            "Uploaded NID number does not match the NID No. entered above.",
        };
      }

      return { valid: true };
    } else {
      // Trade License-এর কমন কীওয়ার্ড
      const licenseKeywords = [
        "trade license",
        "trade licence",
        "license no",
        "licence no",
        "city corporation",
        "municipality",
        "pourashava",
        "union parishad",
        "business",
        "proprietor",
        "ট্রেড লাইসেন্স",
        "লাইসেন্স নং",
        "সিটি কর্পোরেশন",
        "পৌরসভা",
        "ইউনিয়ন পরিষদ",
      ];

      const hasLicenseKeyword = licenseKeywords.some((kw) =>
        normalizedText.includes(kw),
      );

      const cleanEnteredLicense = (enteredLicenseNo || "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
      const cleanOcrAlphaNum = normalizedText.replace(/[^a-z0-9]/g, "");

      const matchesEnteredLicense =
        cleanEnteredLicense.length >= 4
          ? cleanOcrAlphaNum.includes(cleanEnteredLicense)
          : true;

      if (!hasLicenseKeyword) {
        return {
          valid: false,
          message:
            "Invalid Trade License! Please upload a clear image of an official Trade License document.",
        };
      }

      if (!matchesEnteredLicense) {
        return {
          valid: false,
          message:
            "Uploaded document does not match the Trade License No. entered above.",
        };
      }

      return { valid: true };
    }
  };

  // ইমেজ আপলোড, সাইজ চেক ও OCR ভেরিফিকেশন
  const handleImageUpload = (e) => {
    setDocError("");
    setIsDocVerified(false);
    setDocImage("");

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setDocError("Only image files (JPG, PNG, WEBP) are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setDocError("Image size must be less than 3MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Img = reader.result;
      setIsVerifyingDoc(true);

      try {
        const result = await verifyDocumentContent(base64Img, accountType);

        if (result.valid) {
          setDocImage(base64Img);
          setIsDocVerified(true);
          setDocError("");
        } else {
          setDocImage("");
          setIsDocVerified(false);
          setDocError(result.message);
          e.target.value = "";
        }
      } catch (err) {
        console.error("OCR Verification Error:", err);
        setDocError(
          "Could not verify document. Please upload a clearer, well-lit photo.",
        );
        e.target.value = "";
      } finally {
        setIsVerifyingDoc(false);
      }
    };

    reader.readAsDataURL(file);
  };

  // Account Type পরিবর্তন করলে ফর্ম ও ছবি রিসেট
  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    setDocImage("");
    setDocError("");
    setIsDocVerified(false);
    setIsVerifyingDoc(false);
    reset();
  };

  // Form Submission
  const onSubmit = async (data) => {
    if (isVerifyingDoc) {
      setDocError("Please wait while we verify your document...");
      return;
    }

    if (!docImage || !isDocVerified) {
      setDocError(
        accountType === "Company"
          ? "A valid verified Trade License image is required."
          : "A valid verified NID Card image is required.",
      );
      return;
    }

    if (!agreedTerms) {
      setServerError("Please accept the terms & conditions to continue.");
      return;
    }

    setLoading(true);
    setServerError("");

    const newUser = {
      id: `u_${Date.now()}`,
      name: accountType === "Company" ? data.companyName : data.fullName,
      role: "user",
      type: accountType,
      accountType: accountType,
      email: data.email,
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

    try {
      const allUsers = await handleApiAction({
        action: "GET",
        target: "users",
      });

      const emailExists = (Array.isArray(allUsers) ? allUsers : []).some(
        (u) => u.email?.toLowerCase() === data.email.trim().toLowerCase(),
      );

      if (emailExists) {
        setServerError("An account with this email already exists.");
        setLoading(false);
        return;
      }

      await handleApiAction({
        action: "ADD",
        target: "users",
        payload: newUser,
      });

      alert("Account created successfully! Please wait for admin approval.");
      setDocImage("");
      setIsDocVerified(false);
      reset();
      navigate("/login");
    } catch (error) {
      console.error("Registration Error:", error);
      setServerError(
        "Failed to connect to server. Ensure json-server is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  const isEmailValid =
    emailValue && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailValue);

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-8 bg-[#161922] overflow-x-hidden font-sans">
      {/* Split Background (Dark Top + Indigo/Slate Bottom) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-[58%] bg-[#161922] relative overflow-hidden">
          <div className="hidden md:block absolute -top-24 left-1/3 w-[520px] h-[520px] bg-[#1e222e] rotate-45 opacity-80"></div>
        </div>
        <div className="h-[42%] bg-gradient-to-r from-[#4b5cc4] to-[#5a67d8]"></div>
      </div>

      {/* Main Wrapper with Vertical "REGISTER" Label on the Left */}
      <div className="relative z-10 flex items-center max-w-5xl w-full my-6">
        {/* Vertical REGISTER Text Outside Card */}
        <div className="hidden lg:flex flex-col items-center justify-center mr-6 select-none">
          <span
            className="text-xs font-extrabold tracking-[0.55em] text-white/90 uppercase"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            REGISTER
          </span>
        </div>

        {/* Layered White Card Effect */}
        <div className="relative w-full">
          {/* Subtle Stacked Shadow Cards at Bottom */}
          <div className="hidden sm:block absolute -bottom-2.5 inset-x-4 h-6 bg-white/80 rounded-sm shadow"></div>
          <div className="hidden sm:block absolute -bottom-5 inset-x-8 h-6 bg-white/50 rounded-sm shadow"></div>

          {/* Primary White Card */}
          <div className="relative bg-white rounded-sm shadow-2xl p-5 sm:p-8 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-stretch">
            {/* Mobile & Tablet Header */}
            <div className="md:hidden flex flex-col items-center justify-center bg-white py-3 px-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#4f5bd5] via-[#5b50d6] to-[#7c3aed] flex items-center justify-center shadow-lg shadow-[#4f5bd5]/30">
                <UserRound className="w-12 h-12 text-white" strokeWidth={2} />
              </div>
              <p className="text-xs font-medium text-gray-500 mt-3 tracking-wide">
                Create your verified Surplus Exchange account
              </p>
            </div>

            {/* Desktop Left Side Image Card */}
            <div className="hidden md:block md:col-span-5 relative rounded-sm overflow-hidden min-h-[580px] shadow-md group">
              <img
                src={registerSideImg}
                alt="Surplus Exchange Registration"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a2035]/90 via-[#1a2035]/20 to-transparent"></div>

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
            </div>

            {/* Right Side Form Content */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                {/* Header: Register_ + Account Type Switch */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                      Register<span className="text-[#4f5bd5]">_</span>
                    </h1>
                    <div className="w-12 h-[3px] bg-[#4f5bd5] mt-2"></div>
                  </div>

                  {/* Compact Account Type Toggle */}
                  <div className="inline-flex rounded-full bg-gray-100 p-1 border border-gray-200">
                    <button
                      type="button"
                      onClick={() => handleAccountTypeChange("Company")}
                      className={`px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full transition cursor-pointer ${
                        accountType === "Company"
                          ? "bg-[#4f5bd5] text-white shadow-xs"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      Company
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAccountTypeChange("Individual")}
                      className={`px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full transition cursor-pointer ${
                        accountType === "Individual"
                          ? "bg-[#4f5bd5] text-white shadow-xs"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      Individual
                    </button>
                  </div>
                </div>

                {/* Server Error */}
                {serverError && (
                  <div className="mb-4 p-2.5 bg-red-50 border-l-2 border-red-500 text-red-600 text-xs">
                    {serverError}
                  </div>
                )}

                {/* Underline Style Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Company Name / Full Name */}
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-gray-900 uppercase mb-1">
                      {accountType === "Company" ? "COMPANY" : "FULL NAME"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center border-b border-gray-300 focus-within:border-[#4f5bd5] pb-1.5">
                      <input
                        type="text"
                        placeholder={
                          accountType === "Company"
                            ? "Enter company name"
                            : "Enter your full name"
                        }
                        {...register(
                          accountType === "Company"
                            ? "companyName"
                            : "fullName",
                          {
                            required: `${
                              accountType === "Company"
                                ? "Company name"
                                : "Full name"
                            } is required`,
                          },
                        )}
                        className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-500 focus:outline-none"
                      />
                    </div>
                    {errors[
                      accountType === "Company" ? "companyName" : "fullName"
                    ] && (
                      <span className="text-red-500 text-[11px] mt-1 block">
                        {
                          errors[
                            accountType === "Company"
                              ? "companyName"
                              : "fullName"
                          ].message
                        }
                      </span>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-gray-900 uppercase mb-1">
                      EMAIL <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center border-b border-gray-300 focus-within:border-[#4f5bd5] pb-1.5">
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
                        className="w-full bg-transparent text-sm font-medium text-[#4f5bd5] placeholder-gray-500 focus:outline-none pr-6"
                      />
                      {isEmailValid && (
                        <span className="text-emerald-500 text-xs font-bold shrink-0">
                          ✓
                        </span>
                      )}
                    </div>
                    {errors.email && (
                      <span className="text-red-500 text-[11px] mt-1 block">
                        {errors.email.message}
                      </span>
                    )}
                  </div>

                  {/* Password & Confirm Password Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-bold tracking-widest text-gray-900 uppercase mb-1">
                        PASSWORD <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center border-b border-gray-300 focus-within:border-[#4f5bd5] pb-1.5">
                        <input
                          type="password"
                          placeholder="••••••••"
                          {...register("password", {
                            required: "Password is required",
                            minLength: {
                              value: 6,
                              message: "Min 6 characters",
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

                    <div>
                      <label className="block text-[10px] font-bold tracking-widest text-gray-900 uppercase mb-1">
                        CONFIRM <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center border-b border-gray-300 focus-within:border-[#4f5bd5] pb-1.5">
                        <input
                          type="password"
                          placeholder="••••••••"
                          {...register("confirmPassword", {
                            required: "Confirm password",
                            validate: (val) =>
                              val === password || "Passwords do not match",
                          })}
                          className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-500 focus:outline-none"
                        />
                      </div>
                      {errors.confirmPassword && (
                        <span className="text-red-500 text-[11px] mt-1 block">
                          {errors.confirmPassword.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Phone & Trade License / NID No Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-bold tracking-widest text-gray-900 uppercase mb-1">
                        PHONE <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center border-b border-gray-300 focus-within:border-[#4f5bd5] pb-1.5">
                        <input
                          type="text"
                          placeholder="017XXXXXXXX"
                          {...register("phone", {
                            required: "WhatsApp number is required",
                          })}
                          className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-500 focus:outline-none"
                        />
                      </div>
                      {errors.phone && (
                        <span className="text-red-500 text-[11px] mt-1 block">
                          {errors.phone.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold tracking-widest text-gray-900 uppercase mb-1">
                        {accountType === "Company" ? "LICENSE NO" : "NID NO"}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center border-b border-gray-300 focus-within:border-[#4f5bd5] pb-1.5">
                        <input
                          type="text"
                          placeholder={
                            accountType === "Company"
                              ? "TL-XXXXXX"
                              : "NID Number"
                          }
                          {...register(
                            accountType === "Company"
                              ? "tradeLicenseNo"
                              : "nidNo",
                            {
                              required: `${
                                accountType === "Company"
                                  ? "Trade license no."
                                  : "NID no."
                              } is required`,
                            },
                          )}
                          className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-500 focus:outline-none"
                        />
                      </div>
                      {errors[
                        accountType === "Company" ? "tradeLicenseNo" : "nidNo"
                      ] && (
                        <span className="text-red-500 text-[11px] mt-1 block">
                          {
                            errors[
                              accountType === "Company"
                                ? "tradeLicenseNo"
                                : "nidNo"
                            ].message
                          }
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Address Field */}
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-gray-900 uppercase mb-1">
                      ADDRESS <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center border-b border-gray-300 focus-within:border-[#4f5bd5] pb-1.5">
                      <input
                        type="text"
                        placeholder={
                          accountType === "Company"
                            ? "Office / Company address"
                            : "Present address"
                        }
                        {...register(
                          accountType === "Company"
                            ? "companyAddress"
                            : "address",
                          {
                            required: "Address is required",
                          },
                        )}
                        className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-500 focus:outline-none"
                      />
                    </div>
                    {errors[
                      accountType === "Company" ? "companyAddress" : "address"
                    ] && (
                      <span className="text-red-500 text-[11px] mt-1 block">
                        {
                          errors[
                            accountType === "Company"
                              ? "companyAddress"
                              : "address"
                          ].message
                        }
                      </span>
                    )}
                  </div>

                  {/* Trade License Image vs NID Card Image Upload with OCR Verification */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[10px] font-bold tracking-widest text-gray-900 uppercase">
                        {accountType === "Company"
                          ? "TRADE LICENSE IMAGE"
                          : "NID CARD IMAGE"}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      {docImage && !isVerifyingDoc && (
                        <button
                          type="button"
                          onClick={() => {
                            setDocImage("");
                            setIsDocVerified(false);
                          }}
                          className="text-[11px] text-red-500 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-3 border-b border-dashed border-gray-300 pb-2">
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isVerifyingDoc}
                        onChange={handleImageUpload}
                        className="w-full text-xs text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[11px] file:font-semibold file:bg-[#4f5bd5]/10 file:text-[#4f5bd5] hover:file:bg-[#4f5bd5]/20 cursor-pointer disabled:opacity-50"
                      />
                      {docImage && isDocVerified && (
                        <img
                          src={docImage}
                          alt="Doc Preview"
                          className="h-10 w-14 object-cover rounded border border-emerald-400 shrink-0"
                        />
                      )}
                    </div>

                    {/* Verification Status Messages */}
                    {isVerifyingDoc && (
                      <div className="flex items-center gap-1.5 text-[#4f5bd5] text-[11px] font-medium mt-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>
                          Scanning & verifying{" "}
                          {accountType === "Company"
                            ? "Trade License"
                            : "NID Card"}
                          ...
                        </span>
                      </div>
                    )}

                    {isDocVerified && !isVerifyingDoc && (
                      <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-semibold mt-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                          Valid{" "}
                          {accountType === "Company"
                            ? "Trade License"
                            : "NID Card"}{" "}
                          verified!
                        </span>
                      </div>
                    )}

                    {docError && (
                      <div className="flex items-start gap-1.5 text-red-500 text-[11px] font-medium mt-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{docError}</span>
                      </div>
                    )}
                  </div>

                  {/* Terms & Conditions Checkbox */}
                  <div className="flex items-start space-x-2.5 pt-1">
                    <input
                      id="termsCheck"
                      type="checkbox"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="mt-0.5 h-3.5 w-3.5 accent-[#4f5bd5] rounded cursor-pointer"
                    />
                    <label
                      htmlFor="termsCheck"
                      className="text-[11px] text-gray-500 leading-snug cursor-pointer"
                    >
                      By clicking you agree to accept our{" "}
                      <span className="font-bold text-gray-800">
                        terms & conditions
                      </span>
                      , and confirm your{" "}
                      <span className="font-bold text-gray-800">
                        {accountType === "Company"
                          ? "trade license"
                          : "NID document"}
                      </span>{" "}
                      is valid for admin verification.
                    </label>
                  </div>

                  {/* Bottom Bar: Sign In Link + Pill Submit Button */}
                  <div className="pt-3 flex flex-wrap items-center justify-between gap-4">
                    <p className="text-xs text-gray-400">
                      Already have an account ?{" "}
                      <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="font-bold text-gray-800 hover:text-[#4f5bd5] transition cursor-pointer"
                      >
                        Sign In
                      </button>
                    </p>

                    <button
                      type="submit"
                      disabled={loading || isVerifyingDoc || !isDocVerified}
                      className="px-8 py-3 bg-[#4f5bd5] hover:bg-[#3f4bc2] text-white text-xs font-bold tracking-widest uppercase rounded-full shadow-lg shadow-[#4f5bd5]/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading
                        ? "CREATING..."
                        : isVerifyingDoc
                          ? "VERIFYING DOC..."
                          : "OPEN ACCOUNT"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;