import React from "react";
import {
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  MapPin,
  FileText,
  ExternalLink,
} from "lucide-react";
import { StatusBadge } from "./ApplicantTable";

const ApplicantDetailsCard = ({
  user,
  actionLoading,
  toastMessage,
  onApprove,
  onReject,
  onOpenPreview,
}) => {
  if (!user) return null;

  const accountType = user.accountType || user.type || "Individual";
  const docImage = user.tradeLicenseImage || user.nidImage;
  const currentStatus = (user.status || "pending").toLowerCase();

  return (
    <div className="lg:col-span-4 bg-white rounded-xl border border-purple-200/70 p-6 shadow-xs">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
          <p className="text-[11px] font-semibold text-purple-700 mt-0.5">
            {accountType} Account
          </p>
        </div>
        <StatusBadge status={user.status} />
      </div>

      {/* Contact & Location Details */}
      <div className="mt-4 space-y-2.5 text-xs text-gray-700 border-t border-gray-100 pt-4">
        <div className="flex items-center gap-2">
          <Mail className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span className="break-all">{user.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span>{user.phone || "No phone provided"}</span>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
          <span>{user.address || "No address provided"}</span>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span className="font-semibold text-gray-900">
            {accountType === "Company"
              ? `Trade License: ${user.tradeLicenseNo || "N/A"}`
              : `NID No: ${user.nidNo || "N/A"}`}
          </span>
        </div>
      </div>

      {/* Uploaded Document Preview */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">
            Verification Document
          </h3>
          {docImage && (
            <button
              type="button"
              onClick={() => onOpenPreview(docImage)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 hover:text-purple-900 cursor-pointer"
            >
              <span>Full View</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {docImage ? (
          <div
            onClick={() => onOpenPreview(docImage)}
            className="border border-dashed border-purple-300 rounded-lg p-2 bg-purple-50/50 cursor-pointer group overflow-hidden"
          >
            <img
              src={docImage}
              alt="Verification Document"
              className="w-full h-36 object-cover rounded group-hover:scale-[1.02] transition-transform"
            />
          </div>
        ) : (
          <div className="h-28 rounded-lg border border-dashed border-purple-300 bg-purple-50/40 flex items-center justify-center text-xs text-purple-800/70">
            No document image uploaded
          </div>
        )}
      </div>

      {toastMessage && (
        <div className="mt-4 p-2.5 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-900 font-medium">
          {toastMessage}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-5 space-y-2.5">
        {currentStatus !== "approved" && (
          <button
            type="button"
            disabled={actionLoading}
            onClick={() => onApprove(user)}
            className="w-full py-2.5 px-6 rounded-full bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#9333ea] hover:from-[#4c1d95] hover:to-[#7e22ce] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionLoading ? "Updating..." : "Approve Account"}</span>
          </button>
        )}

        {currentStatus !== "rejected" && (
          <button
            type="button"
            disabled={actionLoading}
            onClick={() => onReject(user)}
            className="w-full py-2.5 px-6 rounded-full bg-white hover:bg-purple-50 text-purple-900 border border-purple-300 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4 text-purple-700" />
            <span>Reject Request</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ApplicantDetailsCard;