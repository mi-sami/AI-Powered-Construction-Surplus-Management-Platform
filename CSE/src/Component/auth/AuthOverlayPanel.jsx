import React from "react";
import sideBgImg from "../../assets/pexels-mart-production-7709283.jpg";
import Logo from "../../assets/surplusx_logo_transparent_white_text.png";

const AuthOverlayPanel = ({
  isSignUp,
  isSweeping,
  regOtpStep,
  onSwitchMode,
  onLogoClick,
}) => {
  return (
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
      <img
        src={sideBgImg}
        alt="Construction Surplus"
        className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#1b0b3b] via-[#4c1d95] to-[#7e22ce] opacity-95"></div>

      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full border border-purple-300/15 bg-purple-400/10 blur-xs pointer-events-none"></div>
      <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full border border-fuchsia-300/15 bg-indigo-500/10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-10 w-[1px] bg-gradient-to-b from-transparent via-purple-300/20 to-transparent rotate-6 pointer-events-none"></div>

      {!isSweeping && (
        <div
          onClick={onLogoClick}
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

          <div className="mt-8">
            <button
              type="button"
              onClick={() => onSwitchMode(isSignUp ? "login" : "register")}
              className="px-6 py-2 rounded-full border border-purple-200/40 bg-white/10 hover:bg-white/20 backdrop-blur-md text-[11px] font-semibold tracking-wider uppercase text-white transition-all cursor-pointer"
            >
              {isSignUp ? "← Sign in" : "Create account →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthOverlayPanel;