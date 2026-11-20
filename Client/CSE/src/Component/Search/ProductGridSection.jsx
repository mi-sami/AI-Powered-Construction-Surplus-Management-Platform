import React, { useState, useEffect, useRef } from "react";
import ProductCard from "./ProductCard";

const ProductGridSection = ({ products = [], loading = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // প্রতি পেজে ১৫টি বিজ্ঞাপন
  const scrollContainerRef = useRef(null);

  // নতুন ফিল্টার বা সার্চ হলে ১ম পেজে ফিরে যাবে
  useEffect(() => {
    setCurrentPage(1);
  }, [products.length]);

  // Pagination Calculations
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // পেজ পরিবর্তন হলে স্ক্রলবার উপরে চলে যাবে
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500 text-sm">
        Loading surplus materials...
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Results Counter Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-xs text-gray-600 font-medium">
          Showing <span className="font-bold text-gray-900">{currentProducts.length}</span> of{" "}
          <span className="font-bold text-gray-900">{totalItems}</span> advertisements
        </p>
        {totalPages > 1 && (
          <p className="text-xs text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
        )}
      </div>

      {/* Scrollable Product Grid Area */}
      <div
        ref={scrollContainerRef}
        className="max-h-[720px] overflow-y-auto pr-2 pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      >
        {currentProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {currentProducts.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500 text-sm">
            No surplus materials matched your search or filters.
          </div>
        )}
      </div>

      {/* Pagination Controls (15 items per page) */}
      {totalPages > 1 && (
        <div className="mt-6 pt-4 border-t border-gray-200/80 flex items-center justify-between">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3.5 py-1.5 bg-white border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            ← Previous
          </button>

          <div className="flex items-center space-x-1.5">
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  currentPage === page
                    ? "bg-[#008ba9] text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3.5 py-1.5 bg-white border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGridSection;