import React, { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useTranslation } from "react-i18next";

const FilterSidebar = ({ filters, setFilters, onApplyFilters, onResetFilters }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyAndClose = () => {
    onApplyFilters();
    setIsOpen(false);
  };

  const activeFilterCount = [
    filters.category && filters.category !== "All",
    filters.brand?.trim(),
    filters.minPrice !== "" && filters.minPrice !== undefined,
    filters.maxPrice !== "" && filters.maxPrice !== undefined,
    filters.condition && filters.condition !== "Any",
    filters.location?.trim(),
    filters.neededBy,
  ].filter(Boolean).length;

  return (
    <>
      {/* সাইড বাটন */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 hover:border-[#4f5bd5] text-gray-800 hover:text-[#4f5bd5] rounded-lg shadow-xs text-xs font-bold tracking-wide transition cursor-pointer"
      >
        <SlidersHorizontal className="w-4 h-4 text-[#4f5bd5]" />
        <span>{t("searchPage.filters")}</span>
        {activeFilterCount > 0 && (
          <span className="ml-1 px-1.5 py-0.5 text-[10px] font-extrabold bg-[#4f5bd5] text-white rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* ব্যাকড্রপ ওভারলে */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-40 transition-opacity"
        />
      )}

      {/* বাম পাশ থেকে স্লাইড হয়ে আসা Filter Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#4f5bd5]" />
            <h2 className="text-base font-bold text-gray-900">
              {t("searchPage.filters")}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onResetFilters}
              className="text-[11px] text-[#008ba9] hover:underline font-semibold cursor-pointer"
            >
              {t("searchPage.reset")}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close filters"
              className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Filter Fields */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Product Type */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              {t("searchPage.productType")}
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            >
              <option value="All">{t("searchPage.all")}</option>
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

          {/* Brand */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              {t("searchPage.brand")}
            </label>
            <input
              type="text"
              name="brand"
              value={filters.brand}
              onChange={handleChange}
              placeholder={t("searchPage.brandPlaceholder")}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            />
          </div>

          {/* Min Price & Max Price */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                {t("searchPage.minPrice")}
              </label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                {t("searchPage.maxPrice")}
              </label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleChange}
                placeholder={t("searchPage.any")}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
              />
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              {t("searchPage.condition")}
            </label>
            <select
              name="condition"
              value={filters.condition}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            >
              <option value="Any">{t("searchPage.conditions.Any")}</option>
              <option value="Unused">{t("searchPage.conditions.Unused")}</option>
              <option value="Like new">{t("searchPage.conditions.Like new")}</option>
              <option value="Used - Good">
                {t("searchPage.conditions.Used - Good")}
              </option>
              <option value="Scrap / Surplus">
                {t("searchPage.conditions.Scrap / Surplus")}
              </option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              {t("searchPage.location")}
            </label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleChange}
              placeholder={t("searchPage.locationPlaceholder")}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            />
          </div>

          {/* Needed by */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              {t("searchPage.neededBy")}
            </label>
            <input
              type="date"
              name="neededBy"
              value={filters.neededBy}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            />
          </div>
        </div>

        {/* Sticky Footer with Apply Button */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-center">
          <button
            type="button"
            onClick={handleApplyAndClose}
            className="w-full py-2.5 text-xs font-bold tracking-wider rounded-full bg-[#4f5bd5] hover:bg-[#3f4bc2] text-white shadow-md shadow-[#4f5bd5]/25 transition-all cursor-pointer"
          >
            {t("searchPage.applyFilters")}
          </button>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;