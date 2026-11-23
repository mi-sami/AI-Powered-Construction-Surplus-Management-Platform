import React from "react";
import { useTranslation } from "react-i18next";

const PaymentSummaryCard = ({
  totalAmount,
  currentAdvance,
  dueBalance,
  isReducedBySeller,
}) => {
  const { t, i18n } = useTranslation();
  const numLocale = i18n.language?.startsWith("bn") ? "bn-BD" : "en-US";

  return (
    <div className="divide-y divide-gray-200 border-b border-gray-200 text-sm">
      <div className="py-3 flex items-center justify-between">
        <span className="text-gray-500">
          {t("advancePayment.summary.total")}
        </span>
        <span className="font-bold text-gray-900">
          ৳{Number(totalAmount || 0).toLocaleString(numLocale)}
        </span>
      </div>

      <div className="py-3 flex items-center justify-between">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-gray-500">
            {t("advancePayment.summary.advanceNow")}
          </span>
          {isReducedBySeller && (
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
              {t("advancePayment.summary.reducedBySeller")}
            </span>
          )}
        </div>
        <span className="font-bold text-gray-900">
          ৳{Number(currentAdvance || 0).toLocaleString(numLocale)}
        </span>
      </div>

      <div className="py-3 flex items-center justify-between">
        <span className="text-gray-500">
          {t("advancePayment.summary.dueBalance")}
        </span>
        <span className="font-bold text-gray-900">
          ৳{Number(dueBalance || 0).toLocaleString(numLocale)}
        </span>
      </div>
    </div>
  );
};

export default PaymentSummaryCard;