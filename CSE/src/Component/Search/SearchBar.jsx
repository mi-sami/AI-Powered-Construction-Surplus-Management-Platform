import React from "react";
import { IoSearchSharp } from "react-icons/io5";

const SearchBar = ({ searchQuery, setSearchQuery, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <div className="mb-8">
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
        Search
      </label>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        {/* Input Field with Icon at the Right (End) */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g. white glossy ceramic floor tile"
            className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#008ba9]"
          />
          <IoSearchSharp className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
        </div>

        
      </form>
    </div>
  );
};

export default SearchBar;