import React from "react";
import {
  CheckCircle2,
  XCircle,
  Building2,
  User,
  Clock,
} from "lucide-react";

export const StatusBadge = ({ status }) => {
  const normalized = (status || "pending").toLowerCase();
  if (normalized === "approved") {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-0.5 text-[11px] font-semibold rounded-full border border-purple-300 text-purple-800 bg-purple-100/80">
        <CheckCircle2 className="w-3 h-3 text-purple-700" /> Approved
      </span>
    );
  }
  if (normalized === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-0.5 text-[11px] font-semibold rounded-full border border-red-300 text-red-700 bg-red-50">
        <XCircle className="w-3 h-3" /> Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-3 py-0.5 text-[11px] font-semibold rounded-full border border-violet-300 text-violet-800 bg-violet-50">
      <Clock className="w-3 h-3 text-violet-600" /> Pending
    </span>
  );
};

const ApplicantTable = ({
  applicants,
  selectedUser,
  onSelectUser,
  statusFilter,
  loading,
}) => {
  return (
    <div className="lg:col-span-8 bg-white rounded-xl border border-purple-200/70 p-6 shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-purple-900/80 text-xs font-bold text-gray-900">
              <th className="pb-3 pr-4">Applicant</th>
              <th className="pb-3 px-4">Type</th>
              <th className="pb-3 px-4">Document No</th>
              <th className="pb-3 px-4">Applied</th>
              <th className="pb-3 pl-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-xs text-gray-800">
            {loading ? (
              <tr>
                <td colSpan="5" className="py-10 text-center text-gray-500">
                  Loading user applications...
                </td>
              </tr>
            ) : applicants.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-10 text-center text-gray-500">
                  No {statusFilter !== "all" ? statusFilter : ""} user accounts
                  found.
                </td>
              </tr>
            ) : (
              applicants.map((applicant) => {
                const rowId = applicant.id || applicant._id;
                const isSelected =
                  String(selectedUser?.id || selectedUser?._id) ===
                  String(rowId);
                const accType =
                  applicant.accountType || applicant.type || "Individual";
                const docNo =
                  accType === "Company"
                    ? applicant.tradeLicenseNo
                    : applicant.nidNo;

                return (
                  <tr
                    key={rowId}
                    onClick={() => onSelectUser(rowId)}
                    className={`cursor-pointer transition ${
                      isSelected ? "bg-purple-50/90" : "hover:bg-purple-50/40"
                    }`}
                  >
                    <td className="py-3.5 pr-4">
                      <div className="font-bold text-gray-900">
                        {applicant.name}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {applicant.email}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-800 bg-purple-100/70 px-2.5 py-0.5 rounded-full">
                        {accType === "Company" ? (
                          <Building2 className="w-3 h-3" />
                        ) : (
                          <User className="w-3 h-3" />
                        )}
                        {accType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-gray-700">
                      {docNo || "—"}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      {applicant.createdAt || "—"}
                    </td>
                    <td className="py-3.5 pl-4">
                      <StatusBadge status={applicant.status} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicantTable;