import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { handleApiAction } from "../Utils/ApiHandler";
import {
  generateSixDigitOtp,
  sendVerificationEmailOtp,
} from "../Utils/otpService";

// 1. Login Thunk
export const loginUserThunk = createAsyncThunk(
  "auth/loginUser",
  async ({ identifier, password }, { rejectWithValue }) => {
    try {
      const response = await handleApiAction({
        action: "GET",
        target: "users",
      });
      const users = Array.isArray(response) ? response : [];

      const loggedUser = users.find(
        (u) =>
          (u.email?.trim().toLowerCase() === identifier.trim().toLowerCase() ||
            u.phone?.trim() === identifier.trim()) &&
          String(u.password) === String(password)
      );

      if (!loggedUser) {
        return rejectWithValue("Invalid email/phone or password!");
      }
      if (loggedUser.status !== "approved") {
        return rejectWithValue("Your account is pending admin approval.");
      }

      return loggedUser;
    } catch (err) {
      return rejectWithValue(
        err.message || "Server connection failed. Ensure backend is running."
      );
    }
  }
);

// 2. Check Email & Send Registration OTP via Backend SMTP
export const initiateRegistrationOtpThunk = createAsyncThunk(
  "auth/initiateRegistrationOtp",
  async (newUserPayload, { rejectWithValue }) => {
    try {
      const allUsers = await handleApiAction({
        action: "GET",
        target: "users",
      });

      const emailExists = (Array.isArray(allUsers) ? allUsers : []).some(
        (u) =>
          u.email?.toLowerCase() === newUserPayload.email.trim().toLowerCase()
      );

      if (emailExists) {
        return rejectWithValue("An account with this email already exists.");
      }

      const otpCode = generateSixDigitOtp();
      await sendVerificationEmailOtp({
        email: newUserPayload.email,
        name: newUserPayload.name,
        otp: otpCode,
      });

      return {
        pendingUser: newUserPayload,
        otpCode,
        otpExpiry: Date.now() + 5 * 60 * 1000,
      };
    } catch (err) {
      return rejectWithValue(
        err.message || "Failed to send verification code via backend SMTP."
      );
    }
  }
);

// 3. Resend Registration OTP via Backend SMTP
export const resendRegistrationOtpThunk = createAsyncThunk(
  "auth/resendRegistrationOtp",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { pendingNewUser } = getState().auth;
      if (!pendingNewUser) {
        return rejectWithValue("No pending registration found.");
      }

      const otpCode = generateSixDigitOtp();
      await sendVerificationEmailOtp({
        email: pendingNewUser.email,
        name: pendingNewUser.name,
        otp: otpCode,
      });

      return {
        otpCode,
        otpExpiry: Date.now() + 5 * 60 * 1000,
      };
    } catch (err) {
      return rejectWithValue(err.message || "Could not resend OTP.");
    }
  }
);

// 4. Verify OTP & Save Account to Database
export const completeRegistrationThunk = createAsyncThunk(
  "auth/completeRegistration",
  async (enteredOtp, { getState, rejectWithValue }) => {
    const { generatedRegOtp, regOtpExpiry, pendingNewUser } = getState().auth;

    if (!enteredOtp || enteredOtp.trim().length !== 6) {
      return rejectWithValue("Please enter the 6-digit verification code.");
    }
    if (regOtpExpiry && Date.now() > regOtpExpiry) {
      return rejectWithValue(
        "Verification code expired. Please resend a new code."
      );
    }
    if (enteredOtp.trim() !== generatedRegOtp) {
      return rejectWithValue(
        "Invalid verification code! Please check your email."
      );
    }

    try {
      await handleApiAction({
        action: "ADD",
        target: "users",
        payload: pendingNewUser,
      });
      return true;
    } catch (err) {
      return rejectWithValue(
        err.message || "Failed to save account. Ensure backend is running."
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loginLoading: false,
    authError: "",
    regLoading: false,
    serverError: "",
    regOtpStep: false,
    generatedRegOtp: "",
    regOtpExpiry: null,
    pendingNewUser: null,
  },
  reducers: {
    clearAuthErrors: (state) => {
      state.authError = "";
      state.serverError = "";
    },
    resetRegistrationOtpState: (state) => {
      state.regOtpStep = false;
      state.generatedRegOtp = "";
      state.regOtpExpiry = null;
      state.pendingNewUser = null;
      state.serverError = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.loginLoading = true;
        state.authError = "";
      })
      .addCase(loginUserThunk.fulfilled, (state) => {
        state.loginLoading = false;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loginLoading = false;
        state.authError = action.payload;
      })
      .addCase(initiateRegistrationOtpThunk.pending, (state) => {
        state.regLoading = true;
        state.serverError = "";
      })
      .addCase(initiateRegistrationOtpThunk.fulfilled, (state, action) => {
        state.regLoading = false;
        state.pendingNewUser = action.payload.pendingUser;
        state.generatedRegOtp = action.payload.otpCode;
        state.regOtpExpiry = action.payload.otpExpiry;
        state.regOtpStep = true;
      })
      .addCase(initiateRegistrationOtpThunk.rejected, (state, action) => {
        state.regLoading = false;
        state.serverError = action.payload;
      })
      .addCase(resendRegistrationOtpThunk.pending, (state) => {
        state.regLoading = true;
        state.serverError = "";
      })
      .addCase(resendRegistrationOtpThunk.fulfilled, (state, action) => {
        state.regLoading = false;
        state.generatedRegOtp = action.payload.otpCode;
        state.regOtpExpiry = action.payload.otpExpiry;
      })
      .addCase(resendRegistrationOtpThunk.rejected, (state, action) => {
        state.regLoading = false;
        state.serverError = action.payload;
      })
      .addCase(completeRegistrationThunk.pending, (state) => {
        state.regLoading = true;
        state.serverError = "";
      })
      .addCase(completeRegistrationThunk.fulfilled, (state) => {
        state.regLoading = false;
        state.regOtpStep = false;
        state.generatedRegOtp = "";
        state.regOtpExpiry = null;
        state.pendingNewUser = null;
      })
      .addCase(completeRegistrationThunk.rejected, (state, action) => {
        state.regLoading = false;
        state.serverError = action.payload;
      });
  },
});

export const { clearAuthErrors, resetRegistrationOtpState } = authSlice.actions;
export default authSlice.reducer;