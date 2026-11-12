import React from "react";
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
  const { categories, brands, locations, units } = buildDropdownOptions(listings);
  const activeSpecifications = getSpecificationsByType(requirements.productType);

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

  return (
    <div className="bg-white rounded-lg border border-gray-200/80 p-6 shadow-sm">
      <h2 className="text-base font-bold text-gray-900 mb-5">
        Your requirement
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* 1. Product Type */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1.5">
            Product type
          </label>
          <select
            name="productType"
            value={requirements.productType}
            onChange={handleChange}
            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
          >
            <option value="">Select product type</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Dynamic Specification */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1.5">
            Specification
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
                ? `Any ${requirements.productType.toLowerCase()} specification`
                : "Select product type first"}
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
              Quantity
            </label>
            <select
              name="quantity"
              value={requirements.quantity}
              onChange={handleChange}
              className="w-full px-2.5 py-2.5 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            >
              <option value="">Any</option>
              {QUANTITY_OPTIONS.map((qty) => (
                <option key={qty} value={qty}>
                  {qty}+
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">
              Unit
            </label>
            <select
              name="unit"
              value={requirements.unit}
              onChange={handleChange}
              className="w-full px-2.5 py-2.5 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            >
              <option value="">Any</option>
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">
              Brand
            </label>
            <select
              name="brand"
              value={requirements.brand}
              onChange={handleChange}
              className="w-full px-2.5 py-2.5 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            >
              <option value="">Optional</option>
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
              Max budget (৳)
            </label>
            <select
              name="maxBudget"
              value={requirements.maxBudget}
              onChange={handleChange}
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            >
              <option value="">No limit</option>
              {BUDGET_OPTIONS.map((budget) => (
                <option key={budget} value={budget}>
                  Up to ৳{budget} / unit
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">
              Location
            </label>
            <select
              name="location"
              value={requirements.location}
              onChange={handleChange}
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            >
              <option value="">Any location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2.5 bg-[#008ba9] hover:bg-[#007690] text-white font-semibold rounded transition-colors cursor-pointer mt-2"
        >
          Find matches
        </button>
      </form>
    </div>
  );
};

export default RequirementForm;