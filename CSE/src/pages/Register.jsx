import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router";

const Register = () => {
  const [accountType, setAccountType] = useState("Company"); // 'Company' or 'Individual'
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  // Watch password for confirm password matching
  const password = watch("password");

  // Handle Form Submission to json-server
  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");

    // Payload mapping based on selected Account Type
    const newUser = {
      id: `u_${Date.now()}`,
      name: accountType === "Company" ? data.companyName : data.fullName,
      type: accountType,
      email: data.email,
      phone: data.phone,
      address: accountType === "Company" ? data.companyAddress : data.address,
      tradeLicenseNo: accountType === "Company" ? data.tradeLicenseNo : null,
      nidNo: accountType === "Individual" ? data.nidNo : null,
      password: data.password,
      status: "pending", // Default status as shown in prompt info
      createdAt: new Date().toISOString().split("T")[0],
    };

    try {
      // 1. Check if user with this email already exists
      const existingUserCheck = await axios.get(
        `http://localhost:5000/users?email=${data.email}`,
      );

      if (existingUserCheck.data.length > 0) {
        setServerError("An account with this email already exists.");
        setLoading(false);
        return;
      }

      // 2. Save data to db.json
      const response = await axios.post("http://localhost:5000/users", newUser);

      if (response.status === 201 || response.status === 200) {
        alert("Account created successfully! Please wait for admin approval.");
        reset();
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      setServerError(
        "Failed to connect to server. Ensure json-server is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-sans">
      {/* Left Banner Section */}
      <div className="w-full md:w-1/2 bg-[#1e232a] text-white p-8 md:p-16 flex flex-col justify-between min-h-[400px] md:min-h-screen">
        <div>
          <span
            onClick={() => navigate("/")}
            className="text-xl font-bold tracking-tight text-white cursor-pointer"
          >
            Surplus Exchange
          </span>
        </div>

        <div className="max-w-md my-auto py-12">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            What happens next
            <br />
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            1. Verify your email with an OTP or link. <br /> 2. Admin reviews and
            verifies your account. Log in Sell / Buy Products <br /> 3. Start listing
            or requesting materials. One account can buy and sell.
          </p>
        </div>

        <div className="hidden md:block text-xs text-gray-500">
          © Surplus Exchange Platform
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/2 bg-[#f7f6f2] flex items-center justify-center p-6 sm:p-10 md:p-12 overflow-y-auto">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-200/80 w-full max-w-lg my-6">
          {/* Top Navigation Toggle */}
          <div className="flex items-center space-x-3 mb-6">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="px-6 py-2 bg-white text-gray-700 text-sm font-medium rounded border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Login
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-[#c24e00] text-white text-sm font-medium rounded transition-colors"
            >
              Register
            </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Create your account
          </h2>

          {/* Account Type Toggle (Company vs Individual) */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              I am registering as
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-md">
              <button
                type="button"
                onClick={() => {
                  setAccountType("Company");
                  reset();
                }}
                className={`py-2 text-sm font-semibold rounded transition-all ${
                  accountType === "Company"
                    ? "bg-[#c24e00] text-white shadow-sm"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Company
              </button>
              <button
                type="button"
                onClick={() => {
                  setAccountType("Individual");
                  reset();
                }}
                className={`py-2 text-sm font-semibold rounded transition-all ${
                  accountType === "Individual"
                    ? "bg-[#c24e00] text-white shadow-sm"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Individual
              </button>
            </div>
          </div>

          {/* Error Alert Box */}
          {serverError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded">
              {serverError}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Dynamic Name Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {accountType === "Company" ? "Company name" : "Full name"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register(
                  accountType === "Company" ? "companyName" : "fullName",
                  {
                    required: `${accountType === "Company" ? "Company name" : "Full name"} is required`,
                  },
                )}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#c24e00] text-sm text-gray-900"
              />
              {errors[
                accountType === "Company" ? "companyName" : "fullName"
              ] && (
                <span className="text-red-500 text-xs mt-1 block">
                  {
                    errors[
                      accountType === "Company" ? "companyName" : "fullName"
                    ].message
                  }
                </span>
              )}
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#c24e00] text-sm text-gray-900"
                />
                {errors.email && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#c24e00] text-sm text-gray-900"
                />
                {errors.phone && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.phone.message}
                  </span>
                )}
              </div>
            </div>

            {/* Dynamic Address Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {accountType === "Company" ? "Company address" : "Address"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register(
                  accountType === "Company" ? "companyAddress" : "address",
                  {
                    required: "Address is required",
                  },
                )}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#c24e00] text-sm text-gray-900"
              />
              {errors[
                accountType === "Company" ? "companyAddress" : "address"
              ] && (
                <span className="text-red-500 text-xs mt-1 block">
                  {
                    errors[
                      accountType === "Company" ? "companyAddress" : "address"
                    ].message
                  }
                </span>
              )}
            </div>

            {/* Dynamic Field: Trade License No vs NID No */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {accountType === "Company" ? "Trade license no." : "NID no."}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register(
                  accountType === "Company" ? "tradeLicenseNo" : "nidNo",
                  {
                    required: `${accountType === "Company" ? "Trade license no." : "NID no."} is required`,
                  },
                )}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#c24e00] text-sm text-gray-900"
              />
              {errors[
                accountType === "Company" ? "tradeLicenseNo" : "nidNo"
              ] && (
                <span className="text-red-500 text-xs mt-1 block">
                  {
                    errors[
                      accountType === "Company" ? "tradeLicenseNo" : "nidNo"
                    ].message
                  }
                </span>
              )}
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters",
                    },
                  })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#c24e00] text-sm text-gray-900"
                />
                {errors.password && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Confirm password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  {...register("confirmPassword", {
                    required: "Please confirm password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#c24e00] text-sm text-gray-900"
                />
                {errors.confirmPassword && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 bg-[#c24e00] hover:bg-[#a84300] text-white text-sm font-semibold rounded transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Footer Info Text */}
          <p className="mt-4 text-xs text-gray-500 leading-normal">
            We email you a verification code. An admin checks your{" "}
            {accountType === "Company" ? "trade license" : "NID number"} before
            approving the account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
