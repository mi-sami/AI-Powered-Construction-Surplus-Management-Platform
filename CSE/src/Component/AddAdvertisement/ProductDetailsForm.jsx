import React from "react";
import { useTranslation } from "react-i18next";

const ProductDetailsForm = ({
  register,
  errors,
  loading,
  onSaveDraft,
  isEditMode = false,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg border border-gray-200/80 p-6 sm:p-8 shadow-sm">
      <h3 className="text-base font-bold text-gray-900 mb-5">
        {isEditMode
          ? t("materialForm.detailsTitleEdit")
          : t("materialForm.detailsTitleCreate")}
      </h3>

      <div className="space-y-4">
        {/* Status Option (Only visible in Edit Mode) */}
        {isEditMode && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {t("materialForm.status")}
            </label>
            <select
              {...register("status")}
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            >
              <option value="available">{t("materialForm.available")}</option>
              <option value="reserved">{t("materialForm.reserved")}</option>
            </select>
          </div>
        )}

        {/* Product Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            {t("materialForm.productName")}
          </label>
          <input
            type="text"
            placeholder={t("materialForm.productNamePlaceholder")}
            {...register("title", {
              required: t("materialForm.productNameRequired"),
            })}
            className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
          />
          {errors?.title && (
            <span className="text-red-500 text-xs mt-1 block">
              {errors.title.message}
            </span>
          )}
        </div>

        {/* Product Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            {t("materialForm.productType")}
          </label>
          <select
            {...register("category", { required: true })}
            className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
          >
            <option value="Tiles">{t("materialForm.categories.Tiles")}</option>
            <option value="Bricks">{t("materialForm.categories.Bricks")}</option>
            <option value="Cement">{t("materialForm.categories.Cement")}</option>
            <option value="Steel">{t("materialForm.categories.Steel")}</option>
            <option value="Pipes">{t("materialForm.categories.Pipes")}</option>
            <option value="Paint">{t("materialForm.categories.Paint")}</option>
            <option value="Sanitary items">
              {t("materialForm.categories.Sanitary items")}
            </option>
          </select>
        </div>

        {/* Quantity & Unit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {t("materialForm.quantity")}
            </label>
            <input
              type="number"
              placeholder="500"
              {...register("quantity", { required: true, valueAsNumber: true })}
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {t("materialForm.unit")}
            </label>
            <select
              {...register("unit")}
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            >
              <option value="sqft">{t("materialForm.units.sqft")}</option>
              <option value="bags">{t("materialForm.units.bags")}</option>
              <option value="pcs">{t("materialForm.units.pcs")}</option>
              <option value="ton">{t("materialForm.units.ton")}</option>
            </select>
          </div>
        </div>

        {/* Condition & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {t("materialForm.condition")}
            </label>
            <select
              {...register("condition")}
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            >
              <option value="Unused">{t("materialForm.conditions.Unused")}</option>
              <option value="Used - Good">
                {t("materialForm.conditions.Used - Good")}
              </option>
              <option value="Scrap / Surplus">
                {t("materialForm.conditions.Scrap / Surplus")}
              </option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {t("materialForm.pricePerUnit")}
            </label>
            <input
              type="number"
              placeholder="55"
              {...register("pricePerUnit", {
                required: true,
                valueAsNumber: true,
              })}
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            />
          </div>
        </div>

        {/* Brand & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {t("materialForm.brand")}
            </label>
            <input
              type="text"
              placeholder={t("materialForm.brandPlaceholder")}
              {...register("brand")}
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {t("materialForm.location")}
            </label>
            <input
              type="text"
              placeholder={t("materialForm.locationPlaceholder")}
              {...register("location", { required: true })}
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            />
          </div>
        </div>

        {/* Amount of Advance (Seller Sets Advance Amount) */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            {t("materialForm.advanceAmount")} <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            step="any"
            placeholder={t("materialForm.advancePlaceholder")}
            {...register("advanceAmount", {
              required: t("materialForm.advanceRequired"),
              min: {
                value: 0,
                message: t("materialForm.advanceNegative"),
              },
            })}
            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
          />
          <p className="text-[11px] text-gray-500 mt-1">
            {t("materialForm.advanceHint")}
          </p>
          {errors.advanceAmount && (
            <span className="text-red-500 text-xs mt-1 block">
              {errors.advanceAmount.message}
            </span>
          )}
        </div>

        {/* Available from */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            {t("materialForm.availableFrom")}
          </label>
          <input
            type="date"
            {...register("availableFrom")}
            className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            {t("materialForm.description")}
          </label>
          <textarea
            rows="3"
            {...register("description")}
            className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pt-3">
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2.5 text-white text-xs font-semibold rounded transition-colors cursor-pointer ${
              isEditMode
                ? "bg-[#1b5e3a] hover:bg-[#14472c] rounded-full"
                : "bg-[#4f5bd5] hover:bg-[#3f4bc2] rounded-full"
            }`}
          >
            {loading
              ? t("materialForm.processing")
              : isEditMode
                ? t("materialForm.saveChanges")
                : t("materialForm.publishAd")}
          </button>

          {onSaveDraft && (
            <button
              type="button"
              onClick={onSaveDraft}
              className="px-5 py-2.5 bg-[#eae9e5] hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded transition-colors cursor-pointer rounded-full"
            >
              {isEditMode ? t("materialForm.cancel") : t("materialForm.saveDraft")}
            </button>
          )}
        </div>

        <p className="text-[11px] text-gray-400 mt-2 leading-tight">
          {isEditMode
            ? t("materialForm.editNotice")
            : t("materialForm.createNotice")}
        </p>
      </div>
    </div>
  );
};

export default ProductDetailsForm;