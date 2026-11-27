import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthInfo from "./useAuthInfo";
import {
  loginUserThunk,
  initiateRegistrationOtpThunk,
  resendRegistrationOtpThunk,
  completeRegistrationThunk,
  clearAuthErrors,
  resetRegistrationOtpState,
} from "../Feature/authSlice";

const useAuthPortal = (initialMode = "login") => {
  const [isSignUp, setIsSignUp] = useState(initialMode === "register");
  const [isSweeping, setIsSweeping] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuthInfo();
  const from = location.state?.from?.pathname || "/profile";

  const {
    loginLoading,
    authError,
    regLoading,
    serverError,
    regOtpStep,
    pendingNewUser,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsSignUp(initialMode === "register");
  }, [initialMode]);

  useEffect(() => {
    if (user?.email) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const switchMode = (targetMode) => {
    const goingSignUp = targetMode === "register";
    if (goingSignUp === isSignUp || isSweeping) return;

    dispatch(resetRegistrationOtpState());
    dispatch(clearAuthErrors());

    setIsSweeping(true);
    setTimeout(() => {
      setIsSignUp(goingSignUp);
      navigate(goingSignUp ? "/register" : "/login", { replace: true });
    }, 550);

    setTimeout(() => {
      setIsSweeping(false);
    }, 1200);
  };

  const handleLogin = async (formData) => {
    const res = await dispatch(loginUserThunk(formData));
    if (loginUserThunk.fulfilled.match(res)) {
      setUser(res.payload);
      localStorage.setItem("user", JSON.stringify(res.payload));
      navigate(from, { replace: true });
    }
  };

  const handleStartRegistration = async (newUserPayload) => {
    const res = await dispatch(initiateRegistrationOtpThunk(newUserPayload));
    if (initiateRegistrationOtpThunk.fulfilled.match(res)) {
      setResendCooldown(30);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    const res = await dispatch(resendRegistrationOtpThunk());
    if (resendRegistrationOtpThunk.fulfilled.match(res)) {
      setResendCooldown(30);
    }
  };

  const handleVerifyOtpAndCreate = async (enteredOtp, onSuccessCleanup) => {
    const res = await dispatch(completeRegistrationThunk(enteredOtp));
    if (completeRegistrationThunk.fulfilled.match(res)) {
      alert(
        "Email verified & account created successfully! Please wait for admin approval."
      );
      if (onSuccessCleanup) onSuccessCleanup();
      switchMode("login");
    }
  };

  return {
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
    backToRegisterForm: () => dispatch(resetRegistrationOtpState()),
  };
};

export default useAuthPortal;