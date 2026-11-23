import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MatchCard = ({ item }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { matchPercentage, breakdown } = item;

  const progressBars = [
    { label: t("requirementsPage.card.materialType"), matched: breakdown.productType },
    { label: t("requirementsPage.card.quantity"), matched: breakdown.quantity },
    { label: t("requirementsPage.card.price"), matched: breakdown.price },
    { label: t("requirementsPage.card.location"), matched: breakdown.location },
  ];

  const translatedUnit = item.unit
    ? t(`materialForm.units.${item.unit}`, { defaultValue: item.unit })
    : "";

  return (
    <div className="bg-white rounded-lg border border-gray-200/80 p-6 shadow-sm">
      {/* Top Header: Title, Subtitle & Integer Match Percentage */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {item.quantity} {translatedUnit} • ৳{item.pricePerUnit}/{translatedUnit} •{" "}
            {item.location || t("requirementsPage.card.locationNA")}
          </p>
        </div>

        <div className="text-right flex-shrink-0">
          <p className="text-2xl font-bold text-gray-900 leading-none">
            {matchPercentage}%
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            {t("requirementsPage.card.match")}
          </p>
        </div>
      </div>

      {/* 4 Progress Bars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-5">
        {progressBars.map((bar, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-[11px] text-gray-600 mb-1">
              <span>{bar.label}</span>
              <span className="font-medium text-gray-400">
                {bar.matched
                  ? t("requirementsPage.card.matched")
                  : t("requirementsPage.card.partial")}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#ebe8e0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2b3036] rounded-full transition-all duration-300"
                style={{ width: bar.matched ? "95%" : "35%" }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={() => navigate(`/product/${item.id}`)}
        className="px-6 py-2.5 text-xs font-bold tracking-wider rounded-full bg-[#4f5bd5] hover:bg-[#3f4bc2] text-white shadow-md shadow-[#4f5bd5]/25 transition-all cursor-pointer disabled:opacity-50"
      >
        {t("requirementsPage.card.viewAndOrder")}
      </button>
    </div>
  );
};

export default MatchCard;