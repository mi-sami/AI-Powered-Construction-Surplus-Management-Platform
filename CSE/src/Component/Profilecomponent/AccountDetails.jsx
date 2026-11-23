import React from "react";
import { useTranslation } from "react-i18next";

const AccountDetails = ({
  isCompany,
  register,
  handleSubmit,
  onSubmit,
  errors,
  loading,
  updateSuccess,
  reset,
  watch,
}) => {
  const { t } = useTranslation();
  const newPassword = watch ? watch("newPassword") : "";

  return (
    <div className="bg-white rounded-lg border border-gray-200/80 p-6 sm:p-8 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {t("profilePage.account.heading")}
      </h2>

      {updateSuccess && (
        <div className="mb-4 p-3 bg-emerald-50 border-l-2 border-emerald-500 text-emerald-700 text-xs">
        <div className="mb-4 p-3 bg-emerald-50 border-l-2 border-emerald-500 text-emerald-700 text-xs">
          {updateSuccess}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Full Name / Company Name */}
        <div>
          <label className="block text-[10px] font-bold tracking-widest text-gray-900 uppercase mb-1">
            {isCompany
              ? t("profilePage.account.companyName")
              : t("profilePage.account.fullName")}{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="relative flex items-center border-b border-gray-300 focus-within:border-[#4f5bd5] pb-1.5">
            <input
              type="text"
              placeholder={
                isCompany
                  ? t("profilePage.account.companyPlaceholder")
                  : t("profilePage.account.fullNamePlaceholder")
              }
              {...register("name", {
                required: t("profilePage.account.nameRequired"),
              })}
              className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-500 focus:outline-none"
            />
          </div>
          {errors.name && (
            <span className="text-red-500 text-[11px] mt-1 block">
              {errors.name.message}
            </span>
            <span className="text-red-500 text-[11px] mt-1 block">
              {errors.name.message}
            </span>
          )}
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-[10px] font-bold tracking-widest text-gray-900 uppercase mb-1">
              {t("profilePage.account.email")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center border-b border-gray-300 focus-within:border-[#4f5bd5] pb-1.5">
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: t("profilePage.account.emailRequired"),
                })}
                className="w-full bg-transparent text-sm font-medium text-[#4f5bd5] placeholder-gray-500 focus:outline-none"
              />
            </div>
            {errors.email && (
              <span className="text-red-500 text-[11px] mt-1 block">
                {errors.email.message}
              </span>
              <span className="text-red-500 text-[11px] mt-1 block">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-widest text-gray-900 uppercase mb-1">
              {t("profilePage.account.phone")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center border-b border-gray-300 focus-within:border-[#4f5bd5] pb-1.5">
              <input
                type="text"
                placeholder="017XXXXXXXX"
                {...register("phone", {
                  required: t("profilePage.account.phoneRequired"),
                })}
                className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-500 focus:outline-none"
              />
            </div>
            {errors.phone && (
              <span className="text-red-500 text-[11px] mt-1 block">
                {errors.phone.message}
              </span>
              <span className="text-red-500 text-[11px] mt-1 block">
                {errors.phone.message}
              </span>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-[10px] font-bold tracking-widest text-gray-900 uppercase mb-1">
            {t("profilePage.account.address")}{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="relative flex items-center border-b border-gray-300 focus-within:border-[#4f5bd5] pb-1.5">
            <input
              type="text"
              placeholder={t("profilePage.account.addressPlaceholder")}
              {...register("address", {
                required: t("profilePage.account.addressRequired"),
              })}
              className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-500 focus:outline-none"
            />
          </div>
          {errors.address && (
            <span className="text-red-500 text-[11px] mt-1 block">
              {errors.address.message}
            </span>
            <span className="text-red-500 text-[11px] mt-1 block">
              {errors.address.message}
            </span>
          )}
        </div>

        {/* Readonly: NID / Trade License */}
        <div>
          <label className="block text-[10px] font-bold tracking-widest text-gray-900 uppercase mb-1">
            {isCompany
              ? t("profilePage.account.tradeLicenseLabel")
              : t("profilePage.account.nidLabel")}{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="relative flex items-center border-b border-dashed border-gray-300 bg-gray-100/70 px-2 py-1.5 rounded-t-xs">
            <input
              type="text"
              disabled
              placeholder={
                isCompany
                  ? t("profilePage.account.tradeLicensePlaceholder")
                  : t("profilePage.account.nidPlaceholder")
              }
              {...register("licenseOrNid")}
              className="w-full bg-transparent text-sm text-gray-600 cursor-not-allowed select-none focus:outline-none"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            {t("profilePage.account.verifiedNote", {
              docType: isCompany
                ? t("profilePage.account.tradeLicensePlaceholder")
                : t("profilePage.account.nidPlaceholder"),
            })}
          </p>
        </div>

        {/* Password Change Section */}
        <div className="pt-4 border-t border-gray-200/80 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              {t("profilePage.account.changePasswordHeading")}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {t("profilePage.account.changePasswordHint")}
            </p>
          </div>

          {/* Current Password */}
          <div>
            <label className="block text-[10px] font-bold tracking-widest text-gray-900 uppercase mb-1">
              {t("profilePage.account.currentPassword")}
            </label>
            <div className="relative flex items-center border-b border-gray-300 focus-within:border-[#4f5bd5] pb-1.5">
              <input
                type="password"
                placeholder="••••••••"
                {...register("currentPassword", {
                  validate: (value) =>
                    !newPassword ||
                    Boolean(value) ||
                    t("profilePage.account.currentPasswordRequired"),
                })}
                className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-500 focus:outline-none"
              />
            </div>
            {errors.currentPassword && (
              <span className="text-red-500 text-[11px] mt-1 block">
                {errors.currentPassword.message}
              </span>
            )}
          </div>

          {/* New Password & Confirm New Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-900 uppercase mb-1">
                {t("profilePage.account.newPassword")}
              </label>
              <div className="relative flex items-center border-b border-gray-300 focus-within:border-[#4f5bd5] pb-1.5">
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("newPassword", {
                    minLength: {
                      value: 6,
                      message: t("profilePage.account.minPasswordLength"),
                    },
                  })}
                  className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-500 focus:outline-none"
                />
              </div>
              {errors.newPassword && (
                <span className="text-red-500 text-[11px] mt-1 block">
                  {errors.newPassword.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest text-gray-900 uppercase mb-1">
                {t("profilePage.account.confirmNewPassword")}
              </label>
              <div className="relative flex items-center border-b border-gray-300 focus-within:border-[#4f5bd5] pb-1.5">
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmNewPassword", {
                    validate: (value) =>
                      !newPassword ||
                      value === newPassword ||
                      t("profilePage.account.passwordsMismatch"),
                  })}
                  className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-500 focus:outline-none"
                />
              </div>
              {errors.confirmNewPassword && (
                <span className="text-red-500 text-[11px] mt-1 block">
                  {errors.confirmNewPassword.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full bg-[#4f5bd5] hover:bg-[#3f4bc2] text-white shadow-md shadow-[#4f5bd5]/25 transition-all cursor-pointer disabled:opacity-50"
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full bg-[#4f5bd5] hover:bg-[#3f4bc2] text-white shadow-md shadow-[#4f5bd5]/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading
              ? t("profilePage.account.saving")
              : t("profilePage.account.saveChanges")}
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-full transition-colors cursor-pointer"
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-full transition-colors cursor-pointer"
          >
            {t("profilePage.account.cancel")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountDetails;