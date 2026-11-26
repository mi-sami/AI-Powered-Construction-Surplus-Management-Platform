import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import {
  UserRound,
  Loader2,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  MailCheck,
  ArrowLeft,
} from "lucide-react";
import Tesseract from "tesseract.js";
import emailjs from "@emailjs/browser";
import useAuthInfo from "../Hook/useAuthInfo";
import { handleApiAction } from "../Utils/ApiHandler";
import sideBgImg from "../assets/pexels-mart-production-7709283.jpg";
import Logo from "../assets/surplusx_logo_transparent.png";

// ⚠️ তোমার EmailJS ড্যাশবোর্ড থেকে Service ID এবং Public Key এখানে বসাও
const EMAILJS_SERVICE_ID = "service_9letepq";
const EMAILJS_TEMPLATE_ID = "template_s3nf07e";
const EMAILJS_PUBLIC_KEY = "IXksf3SCML4raFjBV";

const AuthPortal = ({ initialMode = "login" }) => {
  const [isSignUp, setIsSignUp] = useState(initialMode === "register");
  const [isSweeping, setIsSweeping] = useState(false);

  const { user, setUser } = useAuthInfo();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/profile";

  // Sync mode if route changes externally
  useEffect(() => {
    setIsSignUp(initialMode === "register");
  }, [initialMode]);

  // Check persistent login status
  useEffect(() => {
    if (user?.email) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  // Smooth diagonal blade transition between Login & Register
  const switchMode = (targetMode) => {
    const goingSignUp = targetMode === "register";
    if (goingSignUp === isSignUp || isSweeping) return;

    // Reset Registration OTP state when switching modes
    setRegOtpStep(false);
    setPendingNewUser(null);
    setEnteredRegOtp("");
    setServerError("");

    setIsSweeping(true);
    setTimeout(() => {
      setIsSignUp(goingSignUp);
      navigate(goingSignUp ? "/register" : "/login", { replace: true });
    }, 550);

    setTimeout(() => {
      setIsSweeping(false);
    }, 1200);
  };

  // ==================== LOGIN FORM STATE & LOGIC (DIRECT LOGIN) ====================
  const [authError, setAuthError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    watch: watchLogin,
    formState: { errors: loginErrors },
  } = useForm();

  const identifierValue = watchLogin("identifier");

  const onLoginSubmit = async (data) => {
    setAuthError("");
    setLoginLoading(true);

    try {
      const response = await handleApiAction({
        action: "GET",
        target: "users",
      });

      const users = Array.isArray(response) ? response : [];

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
          setLoginLoading(false);
          return;
        }

        setUser(loggedUser);
        localStorage.setItem("user", JSON.stringify(loggedUser));
        navigate(from, { replace: true });
      } else {
        setAuthError("Invalid email/phone or password!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setAuthError(
        "Server connection failed. Ensure backend server is running on port 5000."
      );
    } finally {
      setLoginLoading(false);
    }
  };

  // ==================== REGISTER + EMAIL OTP VERIFICATION STATE ====================
  const [accountType, setAccountType] = useState("Company");
  const [regLoading, setRegLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [docImage, setDocImage] = useState("");
  const [docError, setDocError] = useState("");
  const [isVerifyingDoc, setIsVerifyingDoc] = useState(false);
  const [isDocVerified, setIsDocVerified] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Registration Email OTP States
  const [regOtpStep, setRegOtpStep] = useState(false);
  const [generatedRegOtp, setGeneratedRegOtp] = useState("");
  const [enteredRegOtp, setEnteredRegOtp] = useState("");
  const [regOtpExpiry, setRegOtpExpiry] = useState(null);
  const [pendingNewUser, setPendingNewUser] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Cooldown timer for Resend OTP
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const {
    register: registerSignUp,
    handleSubmit: handleRegSubmit,
    watch: watchReg,
    reset: resetReg,
    clearErrors: clearRegErrors,
    formState: { errors: regErrors },
  } = useForm({
    mode: "onChange",
  });

  const regPassword = watchReg("password");
  const regEmailValue = watchReg("email");
  const enteredNidNo = watchReg("nidNo");
  const enteredLicenseNo = watchReg("tradeLicenseNo");

  // Helper: Generate & Send 6-Digit OTP to New User's Email
  const sendRegistrationOtp = async (userPayload) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedRegOtp(code);
    setRegOtpExpiry(Date.now() + 5 * 60 * 1000); // 5 minutes validity
    setResendCooldown(30);

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email: userPayload.email,
        to_name: userPayload.name || "User",
        otp_code: code,
      },
      EMAILJS_PUBLIC_KEY
    );
  };

  const verifyDocumentContent = async (imageDataUrl, type) => {
    const {
      data: { text },
    } = await Tesseract.recognize(imageDataUrl, "eng+ben");

    const normalizedText = text.toLowerCase().replace(/\s+/g, " ");
    const digitsOnlyText = text.replace(/\D/g, "");

    if (type === "Individual") {
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
        normalizedText.includes(kw)
      );
      const hasNidNumberPattern = /\b\d{10}\b|\b\d{13}\b|\b\d{17}\b/.test(
        digitsOnlyText
      );

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
        normalizedText.includes(kw)
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
          "Could not verify document. Please upload a clearer, well-lit photo."
        );
        e.target.value = "";
      } finally {
        setIsVerifyingDoc(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    setDocImage("");
    setDocError("");
    setIsDocVerified(false);
    setIsVerifyingDoc(false);
    clearRegErrors();
    resetReg();
  };

  // Step 1 of Registration: Validate Form & Send Email OTP
  const onRegisterSubmit = async (data) => {
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
      setServerError("Please accept the terms & conditions to continue.");
      return;
    }

    setRegLoading(true);
    setServerError("");

    const newUser = {
      id: `u_${Date.now()}`,
      name: accountType === "Company" ? data.companyName : data.fullName,
      role: "user",
      type: accountType,
      accountType: accountType,
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

    try {
      const allUsers = await handleApiAction({
        action: "GET",
        target: "users",
      });

      const emailExists = (Array.isArray(allUsers) ? allUsers : []).some(
        (u) => u.email?.toLowerCase() === data.email.trim().toLowerCase()
      );

      if (emailExists) {
        setServerError("An account with this email already exists.");
        setRegLoading(false);
        return;
      }

      // Send OTP to user's email before creating account
      await sendRegistrationOtp(newUser);
      setPendingNewUser(newUser);
      setRegOtpStep(true);
      setEnteredRegOtp("");
    } catch (error) {
      console.error("Registration OTP Error:", error);
      setServerError(
        "Failed to send verification code. Check server or EmailJS keys."
      );
    } finally {
      setRegLoading(false);
    }
  };

  // Step 2 of Registration: Verify Email OTP & Save User to Database
  const handleVerifyRegOtp = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!enteredRegOtp || enteredRegOtp.trim().length !== 6) {
      setServerError("Please enter the 6-digit verification code.");
      return;
    }

    if (regOtpExpiry && Date.now() > regOtpExpiry) {
      setServerError("Verification code expired. Please resend a new code.");
      return;
    }

    if (enteredRegOtp.trim() !== generatedRegOtp) {
      setServerError("Invalid verification code! Please check your email.");
      return;
    }

    setRegLoading(true);
    try {
      await handleApiAction({
        action: "ADD",
        target: "users",
        payload: pendingNewUser,
      });

      alert(
        "Email verified & account created successfully! Please wait for admin approval."
      );
      setDocImage("");
      setIsDocVerified(false);
      setRegOtpStep(false);
      setPendingNewUser(null);
      setEnteredRegOtp("");
      resetReg();
      switchMode("login");
    } catch (error) {
      console.error("Account Creation Error:", error);
      setServerError(
        "Failed to save account. Ensure backend server is running."
      );
    } finally {
      setRegLoading(false);
    }
  };

  const handleResendRegOtp = async () => {
    if (resendCooldown > 0 || !pendingNewUser) return;
    setServerError("");
    setRegLoading(true);
    try {
      await sendRegistrationOtp(pendingNewUser);
    } catch (err) {
      console.error("Resend OTP Error:", err);
      setServerError("Could not resend OTP. Please try again.");
    } finally {
      setRegLoading(false);
    }
  };

  const isEmailValid =
    regEmailValue &&
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(regEmailValue);

  const nameFieldKey = accountType === "Company" ? "companyName" : "fullName";
  const docNoFieldKey =
    accountType === "Company" ? "tradeLicenseNo" : "nidNo";
  const addressFieldKey =
    accountType === "Company" ? "companyAddress" : "address";

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#0d081a] overflow-x-hidden font-sans">
      {/* Ambient Deep Purple Gradient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-purple-700/25 blur-[120px]"></div>
        <div className="absolute -bottom-32 -right-32 w-[550px] h-[550px] rounded-full bg-violet-600/25 blur-[130px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-fuchsia-900/15 blur-[140px]"></div>
      </div>

      {/* Main Split Card Container */}
      <div className="relative z-10 w-full max-w-[1060px] min-h-[640px] bg-[#faf8ff] rounded-2xl shadow-[0_25px_80px_-15px_rgba(88,28,135,0.65)] border border-purple-200/40 overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* ================= MOBILE TOP PURPLE BANNER ================= */}
        <div className="md:hidden relative bg-gradient-to-br from-[#240b4c] via-[#4c1d95] to-[#7c3aed] p-6 text-white overflow-hidden">
          <div className="flex items-center justify-between">
            <img
              onClick={() => navigate("/")}
              src={Logo}
              alt="Surplus Exchange"
              className="h-10 w-auto object-contain cursor-pointer"
            />
            <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <UserRound className="w-5 h-5 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mt-4 tracking-tight">
            {isSignUp
              ? regOtpStep
                ? "Verify your email."
                : "Start your surplus journey."
              : "Welcome back."}
          </h2>
          <p className="text-xs text-purple-200/85 mt-1 leading-relaxed">
            Sell what is left. Buy what you need. Verified construction surplus
            marketplace.
          </p>
        </div>

        {/* ================= LEFT HALF: SIGN IN FORM ================= */}
        <div
          className={`md:col-span-6 flex flex-col justify-center px-6 py-8 sm:px-10 md:px-12 transition-all duration-700 ${
            isSignUp
              ? "hidden md:flex md:opacity-0 md:pointer-events-none md:-translate-x-6"
              : "flex opacity-100 translate-x-0"
          }`}
        >
          <div className="max-w-md w-full mx-auto">
            <div className="mb-7">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-purple-700 bg-purple-100/80 px-3 py-1 rounded-full mb-3">
                <Sparkles className="w-3 h-3" /> Surplus Exchange
              </span>
              <h1 className="text-3xl sm:text-[34px] font-extrabold text-gray-900 tracking-tight">
                Sign in
              </h1>
              <p className="text-xs text-gray-500 mt-1.5">
                Enter your registered email or phone number to access your
                dashboard.
              </p>
            </div>

            {authError && (
              <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                {authError}
              </div>
            )}

            <form
              onSubmit={handleLoginSubmit(onLoginSubmit)}
              className="space-y-5"
            >
              {/* Email or Phone */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
                  Email or phone number <span className="text-purple-600">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="you@example.com or 017XXXXXXXX"
                    {...registerLogin("identifier", {
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
                {loginErrors.identifier && (
                  <span className="text-red-500 text-[11px] mt-1 block">
                    {loginErrors.identifier.message}
                  </span>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
                  Password <span className="text-purple-600">*</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...registerLogin("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 transition"
                />
                {loginErrors.password && (
                  <span className="text-red-500 text-[11px] mt-1 block">
                    {loginErrors.password.message}
                  </span>
                )}
              </div>

              {/* Keep me signed in & Forgot password */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...registerLogin("keepLoggedIn")}
                    className="h-3.5 w-3.5 accent-purple-600 rounded cursor-pointer"
                  />
                  <span className="text-xs text-gray-600">
                    Keep me signed in
                  </span>
                </label>

                <a
                  href="#forgot-password"
                  className="text-xs font-semibold text-purple-700 hover:text-purple-900 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              {/* Centered Compact Rounded Pill Submit Button */}
              <div className="pt-2 flex justify-center">
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="px-10 py-2.5 rounded-full bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#9333ea] hover:from-[#4c1d95] hover:to-[#7e22ce] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loginLoading ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </form>

            {/* Centered Bottom Switch Link */}
            <p className="text-center text-xs text-gray-500 mt-6">
              New to Surplus Exchange?{" "}
              <button
                type="button"
                onClick={() => switchMode("register")}
                className="font-bold text-purple-700 hover:text-purple-900 underline underline-offset-2 cursor-pointer"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>

        {/* ================= RIGHT HALF: CREATE ACCOUNT + EMAIL OTP VERIFICATION ================= */}
        <div
          className={`md:col-span-6 flex flex-col justify-center px-6 py-7 sm:px-9 md:px-10 transition-all duration-700 ${
            !isSignUp
              ? "hidden md:flex md:opacity-0 md:pointer-events-none md:translate-x-6"
              : "flex opacity-100 translate-x-0"
          }`}
        >
          <div className="max-w-md w-full mx-auto">
            {!regOtpStep ? (
              <>
                {/* Header + Company/Individual Pill Switch */}
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
                    <button
                      type="button"
                      onClick={() => handleAccountTypeChange("Company")}
                      className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full transition cursor-pointer ${
                        accountType === "Company"
                          ? "bg-gradient-to-r from-[#6d28d9] to-[#9333ea] text-white shadow-xs"
                          : "text-purple-800/70 hover:text-purple-950"
                      }`}
                    >
                      Company
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAccountTypeChange("Individual")}
                      className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full transition cursor-pointer ${
                        accountType === "Individual"
                          ? "bg-gradient-to-r from-[#6d28d9] to-[#9333ea] text-white shadow-xs"
                          : "text-purple-800/70 hover:text-purple-950"
                      }`}
                    >
                      Individual
                    </button>
                  </div>
                </div>

                {serverError && (
                  <div className="mb-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                    {serverError}
                  </div>
                )}

                <form
                  onSubmit={handleRegSubmit(onRegisterSubmit)}
                  className="space-y-3.5"
                >
                  {/* Company Name / Full Name */}
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
                      {...registerSignUp(nameFieldKey, {
                        required: `${
                          accountType === "Company"
                            ? "Company name"
                            : "Full name"
                        } is required`,
                      })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20"
                    />
                    {regErrors[nameFieldKey] && (
                      <span className="text-red-500 text-[10px] mt-0.5 block">
                        {regErrors[nameFieldKey].message}
                      </span>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Email address <span className="text-purple-600">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="email"
                        placeholder="you@example.com"
                        {...registerSignUp("email", {
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
                    {regErrors.email && (
                      <span className="text-red-500 text-[10px] mt-0.5 block">
                        {regErrors.email.message}
                      </span>
                    )}
                  </div>

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Password <span className="text-purple-600">*</span>
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        {...registerSignUp("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Min 6 characters",
                          },
                        })}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20"
                      />
                      {regErrors.password && (
                        <span className="text-red-500 text-[10px] mt-0.5 block">
                          {regErrors.password.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Confirm password{" "}
                        <span className="text-purple-600">*</span>
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        {...registerSignUp("confirmPassword", {
                          required: "Confirm password",
                          validate: (val) =>
                            val === regPassword || "Passwords do not match",
                        })}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20"
                      />
                      {regErrors.confirmPassword && (
                        <span className="text-red-500 text-[10px] mt-0.5 block">
                          {regErrors.confirmPassword.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Phone & Trade License / NID No */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Phone / WhatsApp{" "}
                        <span className="text-purple-600">*</span>
                      </label>
                      <input
                        key={`phone-${accountType}`}
                        type="tel"
                        placeholder="017XXXXXXXX"
                        {...registerSignUp("phone", {
                          required: "WhatsApp number is required",
                        })}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20"
                      />
                      {regErrors.phone && (
                        <span className="text-red-500 text-[10px] mt-0.5 block">
                          {regErrors.phone.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        {accountType === "Company"
                          ? "Trade License No"
                          : "NID No"}{" "}
                        <span className="text-purple-600">*</span>
                      </label>
                      <input
                        key={docNoFieldKey}
                        type="text"
                        placeholder={
                          accountType === "Company" ? "TL-XXXXXX" : "NID Number"
                        }
                        {...registerSignUp(docNoFieldKey, {
                          required: `${
                            accountType === "Company"
                              ? "Trade license no."
                              : "NID no."
                          } is required`,
                        })}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20"
                      />
                      {regErrors[docNoFieldKey] && (
                        <span className="text-red-500 text-[10px] mt-0.5 block">
                          {regErrors[docNoFieldKey].message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Address */}
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
                      {...registerSignUp(addressFieldKey, {
                        required: "Address is required",
                      })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20"
                    />
                    {regErrors[addressFieldKey] && (
                      <span className="text-red-500 text-[10px] mt-0.5 block">
                        {regErrors[addressFieldKey].message}
                      </span>
                    )}
                  </div>

                  {/* Document Image Upload + OCR Status */}
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
                          {accountType === "Company"
                            ? "Trade License"
                            : "NID Card"}
                          ...
                        </span>
                      </div>
                    )}

                    {isDocVerified && !isVerifyingDoc && (
                      <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-semibold mt-1">
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
                      <div className="flex items-start gap-1.5 text-red-500 text-[11px] font-medium mt-1">
                        <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{docError}</span>
                      </div>
                    )}
                  </div>

                  {/* Terms Checkbox */}
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
                        {accountType === "Company"
                          ? "trade license"
                          : "NID document"}
                      </span>{" "}
                      is valid for admin approval.
                    </label>
                  </div>

                  {/* Centered Compact Rounded Pill Create Account Button */}
                  <div className="pt-2 flex justify-center">
                    <button
                      type="submit"
                      disabled={regLoading || isVerifyingDoc || !isDocVerified}
                      className="px-9 py-2.5 rounded-full bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#9333ea] hover:from-[#4c1d95] hover:to-[#7e22ce] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {regLoading
                        ? "Sending OTP..."
                        : isVerifyingDoc
                          ? "Verifying..."
                          : "Create account"}
                    </button>
                  </div>
                </form>

                {/* Centered Bottom Switch Link */}
                <p className="text-center text-xs text-gray-500 mt-4">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="font-bold text-purple-700 hover:text-purple-900 underline underline-offset-2 cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              </>
            ) : (
              /* ================= STEP 2 OF REGISTRATION: EMAIL OTP VERIFICATION ================= */
              <div className="space-y-5 py-4">
                <button
                  type="button"
                  onClick={() => {
                    setRegOtpStep(false);
                    setEnteredRegOtp("");
                    setServerError("");
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
                    <span className="font-bold text-gray-800">
                      {pendingNewUser?.email}
                    </span>
                    . Enter it below to complete your account registration.
                  </p>
                </div>

                {serverError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                    {serverError}
                  </div>
                )}

                <form onSubmit={handleVerifyRegOtp} className="space-y-5">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
                      6-Digit Verification Code{" "}
                      <span className="text-purple-600">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={enteredRegOtp}
                      onChange={(e) =>
                        setEnteredRegOtp(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="••••••"
                      className="w-full px-4 py-3 rounded-lg bg-white border border-purple-300 text-center text-xl font-extrabold tracking-[0.5em] text-purple-900 placeholder-gray-300 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>

                  {/* Centered Compact Rounded Pill Verify Button */}
                  <div className="pt-1 flex justify-center">
                    <button
                      type="submit"
                      disabled={regLoading || enteredRegOtp.length !== 6}
                      className="px-9 py-2.5 rounded-full bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#9333ea] hover:from-[#4c1d95] hover:to-[#7e22ce] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {regLoading
                        ? "Creating Account..."
                        : "Verify & Create Account"}
                    </button>
                  </div>
                </form>

                {/* Resend OTP Option */}
                <p className="text-center text-xs text-gray-500 pt-2">
                  Didn't receive the email?{" "}
                  <button
                    type="button"
                    disabled={resendCooldown > 0 || regLoading}
                    onClick={handleResendRegOtp}
                    className="font-bold text-purple-700 hover:text-purple-900 underline underline-offset-2 cursor-pointer disabled:opacity-50 disabled:no-underline"
                  >
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : "Resend code"}
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ================= DESKTOP SLIDING DIAGONAL PURPLE OVERLAY PANEL ================= */}
        <div
          className={`hidden md:flex flex-col justify-between absolute inset-y-0 z-30 transition-all duration-[1150ms] ease-[cubic-bezier(0.76,0,0.24,1)] text-white overflow-hidden select-none ${
            isSweeping
              ? "left-0 w-full"
              : isSignUp
                ? "left-0 w-[50%]"
                : "left-[50%] w-[50%]"
          }`}
          style={{
            clipPath: isSweeping
              ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
              : isSignUp
                ? "polygon(0 0, 100% 0, 91% 100%, 0 100%)"
                : "polygon(9% 0, 100% 0, 100% 100%, 0 100%)",
          }}
        >
          {/* Background Image + Rich Purple Gradient Overlay */}
          <img
            src={sideBgImg}
            alt="Construction Surplus"
            className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1b0b3b] via-[#4c1d95] to-[#7e22ce] opacity-95"></div>

          {/* Decorative Diagonal Geometric Ribbons */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full border border-purple-300/15 bg-purple-400/10 blur-xs pointer-events-none"></div>
          <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full border border-fuchsia-300/15 bg-indigo-500/10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-10 w-[1px] bg-gradient-to-b from-transparent via-purple-300/20 to-transparent rotate-6 pointer-events-none"></div>

          {/* Corner Brand Logo */}
          {!isSweeping && (
            <div
              onClick={() => navigate("/")}
              className={`absolute top-6 z-30 cursor-pointer group ${
                isSignUp ? "left-7" : "right-7"
              }`}
            >
              <img
                src={Logo}
                alt="Surplus Exchange Logo"
                className="h-11 w-auto object-contain group-hover:scale-105 transition-transform"
              />
            </div>
          )}

          {/* Center Logo Flash During Mid-Sweep */}
          <div
            className={`relative z-20 m-auto flex flex-col items-center transition-all duration-500 ${
              isSweeping
                ? "opacity-100 scale-105"
                : "opacity-0 scale-90 pointer-events-none hidden"
            }`}
          >
            <img
              src={Logo}
              alt="Surplus Exchange"
              className="h-20 w-auto object-contain drop-shadow-[0_10px_25px_rgba(168,85,247,0.6)]"
            />
            <span className="mt-3 text-xs font-bold tracking-[0.35em] text-purple-200 uppercase">
              SURPLUS EXCHANGE
            </span>
          </div>

          {/* Settled Overlay Text Content */}
          {!isSweeping && (
            <div
              className={`relative z-20 h-full flex flex-col justify-center ${
                isSignUp ? "pl-12 pr-16" : "pl-16 pr-12"
              }`}
            >
              <h2 className="text-4xl lg:text-[42px] font-serif font-medium leading-[1.15] tracking-tight text-white">
                {isSignUp ? (
                  regOtpStep ? (
                    <>
                      Check your
                      <br />
                      inbox.
                    </>
                  ) : (
                    <>
                      Start your
                      <br />
                      first listing.
                    </>
                  )
                ) : (
                  <>
                    Welcome
                    <br />
                    back.
                  </>
                )}
              </h2>

              <p className="mt-4 text-sm text-purple-100/80 leading-relaxed max-w-xs">
                {isSignUp
                  ? regOtpStep
                    ? "Enter the 6-digit verification code we just emailed you to activate your new account."
                    : "One verified account for every surplus batch, every project site, and every material transfer."
                  : "Your surplus materials, active requirements, and verified orders are right where you left them."}
              </p>

              {/* Compact Rounded Pill Switch Button inside Overlay */}
              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => switchMode(isSignUp ? "login" : "register")}
                  className="px-6 py-2 rounded-full border border-purple-200/40 bg-white/10 hover:bg-white/20 backdrop-blur-md text-[11px] font-semibold tracking-wider uppercase text-white transition-all cursor-pointer"
                >
                  {isSignUp ? "← Sign in" : "Create account →"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPortal;