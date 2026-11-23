import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { items: allListings, loading } = useSelector((state) => state.listings);

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState(initialFilterState);
  const [appliedFilters, setAppliedFilters] = useState(initialFilterState);

  useEffect(() => {
    dispatch(fetchListings());
  }, [dispatch]);

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
  };

  const handleResetFilters = () => {
    setFilters(initialFilterState);
    setAppliedFilters(initialFilterState);
    setSearchQuery("");
  };

  const filteredProducts = allListings.filter((item) => {
    if (item.status?.toLowerCase() !== "available") return false;

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchCat = item.category?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }

    if (
      appliedFilters.category !== "All" &&
      item.category?.toLowerCase() !== appliedFilters.category.toLowerCase()
    ) {
      return false;
    }

    if (
      appliedFilters.brand.trim() !== "" &&
      !item.brand?.toLowerCase().includes(appliedFilters.brand.toLowerCase())
    ) {
      return false;
    }

    const price = Number(item.pricePerUnit) || 0;
    if (appliedFilters.minPrice !== "" && price < Number(appliedFilters.minPrice)) {
      return false;
    }
    if (appliedFilters.maxPrice !== "" && price > Number(appliedFilters.maxPrice)) {
      return false;
    }

    if (
      appliedFilters.condition !== "Any" &&
      item.condition?.toLowerCase() !== appliedFilters.condition.toLowerCase()
    ) {
      return false;
    }

    if (
      appliedFilters.location.trim() !== "" &&
      !item.location?.toLowerCase().includes(appliedFilters.location.toLowerCase())
    ) {
      return false;
    }

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
          {t("searchPage.heading")}
        </h1>

        {/* Top Search Component */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleApplyFilters}
        />

        {/* Main Content: Left Filter Button + Full Remaining Width for Advertisements */}
        <div className=" gap-5 items-start mt-4">
          {/* Left Side Filter Trigger Button */}
          <div className="shrink-0">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* Right Product Chart Grid (Takes all remaining width) */}
          <div className="flex-1 w-full min-w-0">
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