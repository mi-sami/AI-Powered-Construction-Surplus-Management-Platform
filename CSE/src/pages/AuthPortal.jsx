import React from "react";
import { UserRound } from "lucide-react";
import useAuthPortal from "../Hook/useAuthPortal";
import LoginForm from "../Component/auth/LoginForm";
import RegisterForm from "../Component/auth/RegisterForm";
import OtpVerifyForm from "../Component/auth/OtpVerifyForm";
import AuthOverlayPanel from "../Component/auth/AuthOverlayPanel";
import Logo from "../assets/surplusx_logo_transparent_white_text.png";

const AuthPortal = ({ initialMode = "login" }) => {
  const {
    isSignUp,
    isSweeping,
    switchMode,
    navigate,
    loginLoading,
    authError,
    handleLogin,
    regLoading,
    serverError,
    regOtpStep,
    pendingNewUser,
    resendCooldown,
    handleStartRegistration,
    handleResendOtp,
    handleVerifyOtpAndCreate,
    backToRegisterForm,
  } = useAuthPortal(initialMode);

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
        {/* Mobile Top Purple Banner */}
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

        {/* Left Half: Sign In */}
        <div
          className={`md:col-span-6 flex flex-col justify-center px-6 py-8 sm:px-10 md:px-12 transition-all duration-700 ${
            isSignUp
              ? "hidden md:flex md:opacity-0 md:pointer-events-none md:-translate-x-6"
              : "flex opacity-100 translate-x-0"
          }`}
        >
          <LoginForm
            onSubmit={handleLogin}
            loading={loginLoading}
            error={authError}
            onSwitchToRegister={() => switchMode("register")}
          />
        </div>

        {/* Right Half: Create Account OR Email OTP Verification */}
        <div
          className={`md:col-span-6 flex flex-col justify-center px-6 py-7 sm:px-9 md:px-10 transition-all duration-700 ${
            !isSignUp
              ? "hidden md:flex md:opacity-0 md:pointer-events-none md:translate-x-6"
              : "flex opacity-100 translate-x-0"
          }`}
        >
          <div className="max-w-md w-full mx-auto">
            {!regOtpStep ? (
              <RegisterForm
                onStartRegistration={handleStartRegistration}
                loading={regLoading}
                serverError={serverError}
                onSwitchToLogin={() => switchMode("login")}
              />
            ) : (
              <OtpVerifyForm
                email={pendingNewUser?.email}
                loading={regLoading}
                error={serverError}
                resendCooldown={resendCooldown}
                onVerify={handleVerifyOtpAndCreate}
                onResend={handleResendOtp}
                onBack={backToRegisterForm}
              />
            )}
          </div>
        </div>

        {/* Desktop Sliding Diagonal Overlay */}
        <AuthOverlayPanel
          isSignUp={isSignUp}
          isSweeping={isSweeping}
          regOtpStep={regOtpStep}
          onSwitchMode={switchMode}
          onLogoClick={() => navigate("/")}
        />
      </div>
    </div>
  );
};

export default AuthPortal;