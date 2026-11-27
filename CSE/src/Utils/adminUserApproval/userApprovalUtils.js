import { handleApiAction } from "../ApiHandler";

// অ্যাডমিন অ্যাকাউন্ট বাদে শুধুমাত্র সাধারণ আবেদনকারীদের ফিল্টার করা
export const getApplicantUsers = (users = []) =>
  users.filter((u) => u.role !== "admin" && u.accountType !== "Admin");

// স্ট্যাটাস অনুযায়ী ইউজার ফিল্টার করা
export const filterApplicantsByStatus = (applicants = [], statusFilter = "pending") => {
  if (statusFilter === "all") return applicants;
  return applicants.filter(
    (u) => (u.status || "pending").toLowerCase() === statusFilter
  );
};

// প্রতিটি স্ট্যাটাসের সংখ্যা গণনা করা
export const getApplicantStatusCounts = (applicants = []) => ({
  pending: applicants.filter(
    (u) => (u.status || "pending").toLowerCase() === "pending"
  ).length,
  approved: applicants.filter(
    (u) => u.status?.toLowerCase() === "approved"
  ).length,
  rejected: applicants.filter(
    (u) => u.status?.toLowerCase() === "rejected"
  ).length,
  all: applicants.length,
});

// ব্যাকএন্ডে ইউজারের স্ট্যাটাস (approved / rejected) আপডেট করা
export const updateApplicantStatusApi = async (targetUser, newStatus) => {
  const userIdentifier = targetUser.id || targetUser._id;
  if (!userIdentifier) {
    throw new Error("User ID not found!");
  }

  await handleApiAction({
    action: "EDIT",
    target: "users",
    payload: {
      id: userIdentifier,
      status: newStatus,
      isVerified: newStatus === "approved",
      reviewedAt: new Date().toISOString().split("T")[0],
    },
  });

  return userIdentifier;
};