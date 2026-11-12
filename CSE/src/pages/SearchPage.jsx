import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchListings } from "../Feature/listingSlice";
import SearchBar from "../Component/Search/SearchBar";
import FilterSidebar from "../Component/Search/FilterSidebar";
import ProductGridSection from "../Component/Search/ProductGridSection";

const initialFilterState = {
  category: "All",
  brand: "",
  minPrice: "",
  maxPrice: "",
  condition: "Any",
  location: "",
  neededBy: "",
};

const SearchPage = () => {
  const dispatch = useDispatch();
  const { items: allListings, loading } = useSelector((state) => state.listings);

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState(initialFilterState);
  const [appliedFilters, setAppliedFilters] = useState(initialFilterState);

  useEffect(() => {
    dispatch(fetchListings());
  }, [dispatch]);

  // Apply Filters Handler
  const handleApplyFilters = () => {
    setAppliedFilters(filters);
  };

  // Reset Filters Handler
  const handleResetFilters = () => {
    setFilters(initialFilterState);
    setAppliedFilters(initialFilterState);
    setSearchQuery("");
  };

  // Filter & Search Logic (শুধুমাত্র অ্যাডমিন অ্যাপ্রুভড 'available' বিজ্ঞাপন দেখাবে)
  const filteredProducts = allListings.filter((item) => {
    // 1. Admin Approval Check: শুধুমাত্র 'available' স্ট্যাটাসের বিজ্ঞাপন দেখাবে
    if (item.status?.toLowerCase() !== "available") return false;

    // 2. Search Text Match
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchCat = item.category?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }

    // 3. Category Filter
    if (
      appliedFilters.category !== "All" &&
      item.category?.toLowerCase() !== appliedFilters.category.toLowerCase()
    ) {
      return false;
    }

    // 4. Brand Filter
    if (
      appliedFilters.brand.trim() !== "" &&
      !item.brand?.toLowerCase().includes(appliedFilters.brand.toLowerCase())
    ) {
      return false;
    }

    // 5. Price Range Filter
    const price = Number(item.pricePerUnit) || 0;
    if (appliedFilters.minPrice !== "" && price < Number(appliedFilters.minPrice)) {
      return false;
    }
    if (appliedFilters.maxPrice !== "" && price > Number(appliedFilters.maxPrice)) {
      return false;
    }

    // 6. Condition Filter
    if (
      appliedFilters.condition !== "Any" &&
      item.condition?.toLowerCase() !== appliedFilters.condition.toLowerCase()
    ) {
      return false;
    }

    // 7. Location Filter
    if (
      appliedFilters.location.trim() !== "" &&
      !item.location?.toLowerCase().includes(appliedFilters.location.toLowerCase())
    ) {
      return false;
    }

    // 8. Needed By Date Filter (AvailableFrom <= NeededBy)
    if (appliedFilters.neededBy !== "" && item.availableFrom) {
      if (new Date(item.availableFrom) > new Date(appliedFilters.neededBy)) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#f7f6f2] font-sans text-gray-900 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Page Heading */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Search surplus materials
        </h1>

        {/* Top Search Component */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleApplyFilters}
        />

        {/* Main Content Grid: Left Filter + Right Scrollable Product Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Filter Component */}
          <div className="lg:col-span-3">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* Right Product Chart Grid + Scroll + Pagination */}
          <div className="lg:col-span-9">
            <ProductGridSection
              products={filteredProducts}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;