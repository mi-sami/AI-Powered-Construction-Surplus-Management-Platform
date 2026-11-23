import React, { useRef, useState } from "react";
import { FaCamera, FaSpinner } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import useAuthInfo from "../../Hook/useAuthInfo";
import { handleApiAction } from "../../Utils/ApiHandler";

const ProfileInfo = ({
  user,
  activeListingsCount,
  ordersCount,
  handleLogout,
}) => {
  const { t } = useTranslation();
  const { setUser } = useAuthInfo();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleAvatarClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert(t("profilePage.info.invalidImage"));
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert(t("profilePage.info.imageTooLarge"));
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      setUploading(true);

      try {
        const updatedUserResponse = await handleApiAction({
          action: "EDIT",
          target: "users",
          payload: {
            id: user.id,
            avatar: base64Image,
          },
        });

        const updatedUser = {
          ...user,
          ...(updatedUserResponse || {}),
          avatar: base64Image,
        };

        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (error) {
        console.error("Avatar Upload Error:", error);
        alert(t("profilePage.info.avatarFailed"));
      } finally {
        setUploading(false);
        e.target.value = "";
      }
    };

    reader.readAsDataURL(file);
  };

  const translatedType =
    user?.type === "Company"
      ? t("profilePage.info.company")
      : t("profilePage.info.individual");

  const translatedStatus =
    user?.status?.toLowerCase() === "pending"
      ? t("profilePage.info.pending")
      : t("profilePage.info.approved");

  return (
    <div className="bg-white rounded-lg border border-gray-200/80 p-6 shadow-sm text-center">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      {/* Avatar Wrapper with Bottom-Right Camera Badge */}
      <div
        onClick={handleAvatarClick}
        title={t("profilePage.info.uploadTitle")}
        className="relative w-24 h-24 mx-auto mb-4 cursor-pointer group"
      >
        <div className="w-full h-full bg-[#e8e6df] rounded-full flex items-center justify-center border border-gray-300 overflow-hidden">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user?.name || "Profile"}
              className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
            />
          ) : (
            <span className="text-3xl font-medium text-gray-700">
              {user?.name ? user.name.charAt(0).toUpperCase() : "I"}
            </span>
          )}
        </div>

        {/* Bottom-Right Corner Camera Icon Badge */}
        <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#4f5bd5] group-hover:bg-[#3f4bc2] text-white flex items-center justify-center border-2 border-white shadow-md transition-colors">
          {uploading ? (
            <FaSpinner className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <FaCamera className="w-3.5 h-3.5" />
          )}
        </span>
      </div>

      {/* Name */}
      <h2 className="text-lg font-bold text-gray-900 mb-2">
        {user?.name || t("profilePage.info.defaultName")}
      </h2>

      {/* Badges */}
      <div className="flex items-center justify-center space-x-2 mb-6">
        <span className="px-3 py-0.5 bg-gray-100 text-gray-700 border border-gray-300 text-xs font-medium rounded-full">
          {translatedType}
        </span>
        <span className="px-3 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-medium rounded-full">
          {translatedStatus}
        </span>
      </div>

      {/* Account Info Details */}
      <div className="space-y-3 text-sm border-t border-gray-100 pt-4 mb-6 text-left">
        <div className="flex justify-between items-center text-gray-600">
          <span>{t("profilePage.info.memberSince")}</span>
          <span className="font-semibold text-gray-900">
            {user?.createdAt || "[date]"}
          </span>
        </div>
        <div className="flex justify-between items-center text-gray-600 border-t border-gray-100 pt-2">
          <span>{t("profilePage.info.activeListings")}</span>
          <span className="font-semibold text-gray-900">
            [{activeListingsCount}]
          </span>
        </div>
        <div className="flex justify-between items-center text-gray-600 border-t border-gray-100 pt-2">
          <span>{t("profilePage.info.orders")}</span>
          <span className="font-semibold text-gray-900">[{ordersCount}]</span>
        </div>
      </div>

      {/* Log Out Button */}
      <button
        type="button"
        onClick={handleLogout}
        className="w-full py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-sm font-semibold rounded transition-colors cursor-pointer"
      >
        {t("profilePage.info.logOut")}
      </button>
    </div>
  );
};

export default ProfileInfo;