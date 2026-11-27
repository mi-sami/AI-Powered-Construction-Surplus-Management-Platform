const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const generateSixDigitOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const sendVerificationEmailOtp = async ({ email, name, otp }) => {
  const res = await fetch(`${API_BASE_URL}/api/otp/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      name: name || "User",
      otp,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to send verification email.");
  }
  return data;
};