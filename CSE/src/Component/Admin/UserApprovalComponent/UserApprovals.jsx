import React, { useState, useMemo } from "react";
import {
  getApplicantUsers,
  filterApplicantsByStatus,
  getApplicantStatusCounts,
  updateApplicantStatusApi,
} from "../../../Utils/adminUserApproval/userApprovalUtils";
import ApprovalHeader from "./ApprovalHeader";
import ApplicantTable from "./ApplicantTable";
import ApplicantDetailsCard from "./ApplicantDetailsCard";
import DocumentPreviewModal from "./DocumentPreviewModal";

const UserApprovals = ({ users = [], setUsers, loading }) => {
  const [statusFilter, setStatusFilter] = useState("pending");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [previewDocModal, setPreviewDocModal] = useState(null);

  const applicantUsers = useMemo(() => getApplicantUsers(users), [users]);

  const filteredUsers = useMemo(
    () => filterApplicantsByStatus(applicantUsers, statusFilter),
    [applicantUsers, statusFilter]
  );

  const counts = useMemo(
    () => getApplicantStatusCounts(applicantUsers),
    [applicantUsers]
  );

  const selectedUser = useMemo(() => {
    if (filteredUsers.length === 0) return null;
    return (
      filteredUsers.find(
        (u) => String(u.id || u._id) === String(selectedUserId)
      ) || filteredUsers[0]
    );
  }, [filteredUsers, selectedUserId]);

  const handleStatusUpdate = async (targetUser, newStatus) => {
    if (!targetUser) return;
    setActionLoading(true);
    setToastMessage("");

    try {
      const updatedId = await updateApplicantStatusApi(targetUser, newStatus);

      setUsers((prev) =>
        prev.map((u) =>
          String(u.id || u._id) === String(updatedId)
            ? { ...u, status: newStatus, isVerified: newStatus === "approved" }
            : u
        )
      );

      setToastMessage(
        newStatus === "approved"
          ? `${targetUser.name} has been approved and can now sign in.`
          : `${targetUser.name}'s account request has been rejected.`
      );
    } catch (err) {
      console.error("User Approval Update Error:", err);
      setToastMessage("Failed to update user status. Check backend server.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <ApprovalHeader
        statusFilter={statusFilter}
        onFilterChange={(newFilter) => {
          setStatusFilter(newFilter);
          setToastMessage("");
        }}
        counts={counts}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <ApplicantTable
          applicants={filteredUsers}
          selectedUser={selectedUser}
          onSelectUser={(id) => {
            setSelectedUserId(id);
            setToastMessage("");
          }}
          statusFilter={statusFilter}
          loading={loading}
        />

        <ApplicantDetailsCard
          user={selectedUser}
          actionLoading={actionLoading}
          toastMessage={toastMessage}
          onApprove={(u) => handleStatusUpdate(u, "approved")}
          onReject={(u) => handleStatusUpdate(u, "rejected")}
          onOpenPreview={(imgUrl) => setPreviewDocModal(imgUrl)}
        />
      </div>

      <DocumentPreviewModal
        imageUrl={previewDocModal}
        applicantName={selectedUser?.name}
        onClose={() => setPreviewDocModal(null)}
      />
    </>
  );
};

export default UserApprovals;