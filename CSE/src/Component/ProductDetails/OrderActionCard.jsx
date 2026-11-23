import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const OrderActionCard = ({ product, onBuyNow }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const translatedUnit = product?.unit
    ? t(`materialForm.units.${product.unit}`, { defaultValue: product.unit })
    : t("dashboard.defaultUnit");

  const handleClick = () => {
    if (typeof onBuyNow === "function") {
      onBuyNow();
    } else {
      const targetId = product?.id || product?._id;
      if (targetId) {
        navigate(`/advance-payment/${targetId}`);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200/80 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h3 className="text-sm font-bold text-gray-900">
          {t("productDetails.orderAction.heading")}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          {t("productDetails.orderAction.subtext", {
            price: product?.pricePerUnit || 0,
            unit: translatedUnit,
            quantity: product?.quantity || 0,
          })}
        </p>
      </div>

      <button
        type="button"
        onClick={handleClick}
        className="px-10 py-2.5 bg-[#008ba9] hover:bg-[#007690] text-white text-xs font-semibold rounded transition-colors cursor-pointer text-center"
      >
        {t("productDetails.orderAction.buyNow")}
      </button>
    </div>
  );
};

export default OrderActionCard;