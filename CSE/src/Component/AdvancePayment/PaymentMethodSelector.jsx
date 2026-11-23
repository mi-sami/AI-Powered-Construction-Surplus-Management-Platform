import React from "react";
import { useTranslation } from "react-i18next";

const PaymentMethodSelector = ({
  selectedMethod,
  onSelectMethod,
  onConfirmOrder,
  paying,
}) => {
  const { t } = useTranslation();

  const paymentMethods = [
    {
      id: "bKash",
      name: t("advancePayment.methods.bkash"),
      subtitle: t("advancePayment.methods.mobileWallet"),
      badgeText: "bK",
      badgeBg: "bg-[#e2136e]",
    },
    {
      id: "Nagad",
      name: t("advancePayment.methods.nagad"),
      subtitle: t("advancePayment.methods.mobileWallet"),
      badgeText: "Ng",
      badgeBg: "bg-[#ed1c24]",
    },
    {
      id: "Rocket",
      name: t("advancePayment.methods.rocket"),
      subtitle: t("advancePayment.methods.mobileWallet"),
      badgeText: "Rk",
      badgeBg: "bg-[#8c3494]",
    },
    {
      id: "Card",
      name: t("advancePayment.methods.card"),
      subtitle: t("advancePayment.methods.debitOrCredit"),
      badgeText: "▭",
      badgeBg: "bg-[#1e232a]",
    },
  ];

  return (
    <div className="mt-6">
      <p className="text-sm font-bold text-gray-900 mb-3">
        {t("advancePayment.methods.heading")}
      </p>

      <div className="grid grid-cols-2 gap-3">
        {paymentMethods.map((method) => {
          const isSelected = selectedMethod === method.id;
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onSelectMethod(method.id)}
              className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all cursor-pointer ${
                isSelected
                  ? "border-[#b44b00] ring-1 ring-[#b44b00] bg-white"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-md ${method.badgeBg} text-white font-bold text-xs flex items-center justify-center flex-shrink-0`}
              >
                {method.badgeText}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">
                  {method.name}
                </p>
                <p className="text-[11px] text-gray-500 truncate">
                  {method.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Primary CTA Button */}
      <button
        type="button"
        onClick={onConfirmOrder}
        disabled={paying}
        className="w-full mt-6 py-3 bg-[#b44b00] hover:bg-[#993f00] text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer disabled:opacity-50"
      >
        {paying
          ? t("advancePayment.methods.processing")
          : t("advancePayment.methods.confirmButton")}
      </button>

      {/* Footer Note */}
      <p className="text-[11px] text-gray-500 leading-relaxed mt-3">
        {t("advancePayment.methods.footerNote")}
      </p>
    </div>
  );
};

export default PaymentMethodSelector;