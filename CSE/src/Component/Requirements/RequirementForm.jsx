import React from "react";
import { useTranslation } from "react-i18next";
import {
  buildDropdownOptions,
  getSpecificationsByType,
  QUANTITY_OPTIONS,
  BUDGET_OPTIONS,
} from "../../Utils/requirementHelpers";

const RequirementForm = ({
  requirements,
  setRequirements,
  onFindMatches,
  listings = [],
}) => {
  const { t } = useTranslation();
  const { categories, brands, locations, units } =
    buildDropdownOptions(listings);
  const activeSpecifications = getSpecificationsByType(
    requirements.productType,
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "productType") {
      setRequirements((prev) => ({
        ...prev,
        productType: value,
        specification: "",
      }));
      return;
    }

    setRequirements((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFindMatches();
  };

  const translatedSelectedType = requirements.productType
    ? t(`materialForm.categories.${requirements.productType}`, {
        defaultValue: requirements.productType,
      }).toLowerCase()
    : "";

  return (
    <div className="bg-white rounded-lg border border-gray-200/80 p-6 shadow-sm">
      <h2 className="text-base font-bold text-gray-900 mb-5">
        {t("requirementsPage.form.heading")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* 1. Product Type */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1.5">
            {t("requirementsPage.form.productType")}
          </label>
          <select
            name="productType"
            value={requirements.productType}
            onChange={handleChange}
            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
          >
            <option value="">{t("requirementsPage.form.selectProductType")}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {t(`materialForm.categories.${cat}`, { defaultValue: cat })}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Dynamic Specification */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1.5">
            {t("requirementsPage.form.specification")}
          </label>
          <select
            name="specification"
            value={requirements.specification}
            onChange={handleChange}
            disabled={!requirements.productType}
            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#008ba9] disabled:bg-gray-100 disabled:text-gray-400"
          >
            <option value="">
              {requirements.productType
                ? t("requirementsPage.form.anySpec", {
                    type: translatedSelectedType,
                  })
                : t("requirementsPage.form.selectTypeFirst")}
            </option>
            {activeSpecifications.map((spec) => (
              <option key={spec.value} value={spec.value}>
                {spec.label}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Quantity, Unit & Brand */}
        <div className="grid grid-cols-3 gap-2.5">
          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">
              {t("requirementsPage.form.quantity")}
            </label>
            <select
              name="quantity"
              value={requirements.quantity}
              onChange={handleChange}
              className="w-full px-2.5 py-2.5 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            >
              <option value="">{t("requirementsPage.form.any")}</option>
              {QUANTITY_OPTIONS.map((qty) => (
                <option key={qty} value={qty}>
                  {qty}+
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">
              {t("requirementsPage.form.unit")}
            </label>
            <select
              name="unit"
              value={requirements.unit}
              onChange={handleChange}
              className="w-full px-2.5 py-2.5 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            >
              <option value="">{t("requirementsPage.form.any")}</option>
              {units.map((u) => (
                <option key={u} value={u}>
                  {t(`materialForm.units.${u}`, { defaultValue: u })}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">
              {t("requirementsPage.form.brand")}
            </label>
            <select
              name="brand"
              value={requirements.brand}
              onChange={handleChange}
              className="w-full px-2.5 py-2.5 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            >
              <option value="">{t("requirementsPage.form.optional")}</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. Max Budget & Location */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">
              {t("requirementsPage.form.maxBudget")}
            </label>
            <select
              name="maxBudget"
              value={requirements.maxBudget}
              onChange={handleChange}
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            >
              <option value="">{t("requirementsPage.form.noLimit")}</option>
              {BUDGET_OPTIONS.map((budget) => (
                <option key={budget} value={budget}>
                  {t("requirementsPage.form.upToBudget", { budget })}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">
              {t("requirementsPage.form.location")}
            </label>
            <select
              name="location"
              value={requirements.location}
              onChange={handleChange}
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            >
              <option value="">{t("requirementsPage.form.anyLocation")}</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button (Centered) */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold tracking-wider rounded-full bg-[#4f5bd5] hover:bg-[#3f4bc2] text-white shadow-md shadow-[#4f5bd5]/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {t("requirementsPage.form.findMatches")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequirementForm;