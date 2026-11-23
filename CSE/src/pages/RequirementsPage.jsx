import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { fetchListings } from "../Feature/listingSlice";
import RequirementForm from "../Component/Requirements/RequirementForm";
import MatchCard from "../Component/Requirements/MatchCard";

const initialRequirements = {
  productType: "",
  specification: "",
  quantity: "",
  unit: "",
  brand: "",
  maxBudget: "",
  location: "",
};

const RequirementsPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { items: allListings, loading } = useSelector((state) => state.listings);

  const [requirements, setRequirements] = useState(initialRequirements);
  const [appliedReq, setAppliedReq] = useState(initialRequirements);

  useEffect(() => {
    dispatch(fetchListings());
  }, [dispatch]);

  const handleFindMatches = () => {
    setAppliedReq({ ...requirements });
  };

  // Strict Product Type ফিল্টার + ৬টি ক্রাইটেরিয়া অনুযায়ী Integer Percentage ক্যালকুলেশন
  const rankedMatches = useMemo(() => {
    const filteredListings = allListings.filter((item) => {
      if (item.status?.toLowerCase() !== "available") return false;

      if (
        appliedReq.productType &&
        item.category?.toLowerCase() !== appliedReq.productType.toLowerCase()
      ) {
        return false;
      }

      return true;
    });

    const scoredList = filteredListings.map((item) => {
      let matchedCriteriaCount = 0;
      const totalCriteria = 6;

      // Criteria 1: Product Type
      const isProductTypeMatch =
        !appliedReq.productType ||
        item.category?.toLowerCase() === appliedReq.productType.toLowerCase();
      if (isProductTypeMatch) matchedCriteriaCount += 1;

      // Criteria 2: Specification
      const specQuery = appliedReq.specification.toLowerCase();
      const isSpecMatch =
        !specQuery ||
        item.description?.toLowerCase().includes(specQuery) ||
        item.title?.toLowerCase().includes(specQuery) ||
        item.condition?.toLowerCase().includes(specQuery);
      if (isSpecMatch) matchedCriteriaCount += 1;

      // Criteria 3: Quantity & Unit
      const reqQty = Number(appliedReq.quantity) || 0;
      const isUnitMatch =
        !appliedReq.unit ||
        item.unit?.toLowerCase() === appliedReq.unit.toLowerCase();
      const isQuantityMatch =
        (!appliedReq.quantity || Number(item.quantity) >= reqQty) && isUnitMatch;
      if (isQuantityMatch) matchedCriteriaCount += 1;

      // Criteria 4: Brand
      const isBrandMatch =
        !appliedReq.brand ||
        item.brand?.toLowerCase().includes(appliedReq.brand.toLowerCase());
      if (isBrandMatch) matchedCriteriaCount += 1;

      // Criteria 5: Max Budget
      const maxPrice = Number(appliedReq.maxBudget);
      const isPriceMatch =
        !appliedReq.maxBudget || Number(item.pricePerUnit) <= maxPrice;
      if (isPriceMatch) matchedCriteriaCount += 1;

      // Criteria 6: Location
      const isLocationMatch =
        !appliedReq.location ||
        item.location?.toLowerCase().includes(appliedReq.location.toLowerCase());
      if (isLocationMatch) matchedCriteriaCount += 1;

      const unitPenalty = 100 / totalCriteria;
      const unmatchedCount = totalCriteria - matchedCriteriaCount;
      const matchPercentage =
        matchedCriteriaCount === totalCriteria
          ? 100
          : Math.round(100 - unmatchedCount * unitPenalty);

      return {
        ...item,
        matchedCriteriaCount,
        matchPercentage,
        breakdown: {
          productType: isProductTypeMatch,
          specification: isSpecMatch,
          quantity: isQuantityMatch,
          brand: isBrandMatch,
          price: isPriceMatch,
          location: isLocationMatch,
        },
      };
    });

    return scoredList.sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [allListings, appliedReq]);

  const translatedProductType = appliedReq.productType
    ? t(`materialForm.categories.${appliedReq.productType}`, {
        defaultValue: appliedReq.productType,
      })
    : "";

  return (
    <div className="min-h-screen bg-[#f7f6f2] font-sans text-gray-900 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("requirementsPage.title")}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {t("requirementsPage.subtitle")}
          </p>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Requirement Form with All Dropdowns */}
          <div className="lg:col-span-5">
            <RequirementForm
              requirements={requirements}
              setRequirements={setRequirements}
              onFindMatches={handleFindMatches}
              listings={allListings}
            />
          </div>

          {/* Right Column: Ranked Matches List */}
          <div className="lg:col-span-7">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              {appliedReq.productType
                ? t("requirementsPage.matchesFor", { type: translatedProductType })
                : t("requirementsPage.matchesTitle")}
            </h2>

            {loading ? (
              <div className="bg-white rounded-lg border border-gray-200 p-10 text-center text-xs text-gray-500">
                {t("requirementsPage.findingMatches")}
              </div>
            ) : rankedMatches.length > 0 ? (
              <div className="space-y-5 max-h-[750px] overflow-y-auto pr-1">
                {rankedMatches.map((item) => (
                  <MatchCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-10 text-center text-xs text-gray-500">
                {appliedReq.productType
                  ? t("requirementsPage.noMatchesForType", {
                      type: translatedProductType,
                    })
                  : t("requirementsPage.noMatchesRightNow")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequirementsPage;