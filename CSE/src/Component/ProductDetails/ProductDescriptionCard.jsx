import React from "react";
import { useTranslation } from "react-i18next";

const ProductDescriptionCard = ({ description }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg border border-gray-200/80 p-6 shadow-sm">
      <h2 className="text-sm font-bold text-gray-900 mb-2">
        {t("productDetails.description.heading")}
      </h2>
      <p className="text-xs text-gray-600 leading-relaxed">
        {description?.trim()
          ? description
          : t("productDetails.description.empty")}
      </p>
    </div>
  );
};

export default ProductDescriptionCard;