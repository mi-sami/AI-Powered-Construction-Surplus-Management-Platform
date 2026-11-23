import React from "react";
import { useTranslation } from "react-i18next";

const ProductInfoCard = ({ product }) => {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language?.startsWith("bn") ? "bn-BD" : "en-GB";

  const formatDate = (dateStr) => {
    if (!dateStr) return t("productDetails.info.immediately");
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    return date.toLocaleDateString(dateLocale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const translatedCategory = product?.category
    ? t(`materialForm.categories.${product.category}`, {
        defaultValue: product.category,
      })
    : "N/A";

  const translatedUnit = product?.unit
    ? t(`materialForm.units.${product.unit}`, { defaultValue: product.unit })
    : t("dashboard.defaultUnit");

  const translatedCondition = product?.condition
    ? t(`searchPage.conditions.${product.condition}`, {
        defaultValue: product.condition,
      })
    : t("searchPage.conditions.Unused");

  const specRows = [
    { label: t("productDetails.info.category"), value: translatedCategory },
    {
      label: t("productDetails.info.quantity"),
      value: `${product?.quantity || 0} ${translatedUnit}`,
    },
    { label: t("productDetails.info.condition"), value: translatedCondition },
    {
      label: t("productDetails.info.brand"),
      value: product?.brand?.trim()
        ? product.brand
        : t("productDetails.info.notSpecified"),
    },
    {
      label: t("productDetails.info.location"),
      value: product?.location || t("productDetails.info.notSpecified"),
    },
    {
      label: t("productDetails.info.availableFrom"),
      value: formatDate(product?.availableFrom),
    },
    {
      label: t("productDetails.info.seller"),
      value: product?.sellerName || t("productDetails.info.defaultSeller"),
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200/80 p-6 shadow-sm h-full">
      <h2 className="text-sm font-bold text-gray-900 mb-4">
        {t("productDetails.info.heading")}
      </h2>

      {/* Price & Condition Header */}
      <div className="flex items-center justify-between pb-4 mb-2 border-b border-gray-100">
        <p className="text-xl font-bold text-gray-900">
          {t("productDetails.info.perUnit", {
            price: product?.pricePerUnit || 0,
            unit: translatedUnit,
          })}
        </p>
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#eae8e1] text-gray-700">
          {translatedCondition}
        </span>
      </div>

      {/* Specification List */}
      <div className="divide-y divide-gray-100 text-xs">
        {specRows.map((row, index) => (
          <div key={index} className="py-3 flex items-center justify-between">
            <span className="text-gray-500 font-medium">{row.label}</span>
            <span className="text-gray-900 font-bold text-right">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductInfoCard;