import React from "react";

const FilterSidebar = ({ filters, setFilters, onApplyFilters, onResetFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200/80 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-900">Filters</h2>
        <button
          type="button"
          onClick={onResetFilters}
          className="text-[11px] text-[#008ba9] hover:underline font-medium cursor-pointer"
        >
          Reset
        </button>
      </div>

      <div className="space-y-4 text-xs">
        {/* Product Type */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Product Type
          </label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
          >
            <option value="All">All</option>
            <option value="Tiles">Tiles</option>
            <option value="Bricks">Bricks</option>
            <option value="Cement">Cement</option>
            <option value="Steel">Steel</option>
            <option value="Pipes">Pipes</option>
            <option value="Paint">Paint</option>
            <option value="Sanitary items">Sanitary items</option>
          </select>
        </div>

        {/* Brand */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Brand
          </label>
          <input
            type="text"
            name="brand"
            value={filters.brand}
            onChange={handleChange}
            placeholder="e.g. RAK, BSRM"
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
          />
        </div>

        {/* Min Price & Max Price */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Min price
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
              Max price
            </label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="Any"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
            />
          </div>
        </div>

        {/* Condition */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Condition
          </label>
          <select
            name="condition"
            value={filters.condition}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
          >
            <option value="Any">Any</option>
            <option value="Unused">Unused</option>
            <option value="Like new">Like new</option>
            <option value="Used - Good">Used - Good</option>
            <option value="Scrap / Surplus">Scrap / Surplus</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="e.g. Bashundhara"
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
          />
        </div>

        {/* Needed by */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Needed by
          </label>
          <input
            type="date"
            name="neededBy"
            value={filters.neededBy}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
          />
        </div>

        {/* Apply Filters Button */}
        <button
          type="button"
          onClick={onApplyFilters}
          className="w-full py-2.5 bg-[#008ba9] hover:bg-[#007690] text-white font-semibold rounded transition-colors cursor-pointer mt-2"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;