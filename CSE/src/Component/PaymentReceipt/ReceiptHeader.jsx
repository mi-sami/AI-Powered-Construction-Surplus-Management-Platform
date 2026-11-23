import React from "react";
import { useTranslation } from "react-i18next";

const ReceiptHeader = ({ onDownloadPDF }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {t("receiptPage.title")}
        </h1>
        <span className="inline-block mt-2.5 px-3 py-0.5 text-xs font-semibold text-[#15803d] bg-[#f0fdf4] border border-[#16a34a] rounded-full">
          {t("receiptPage.orderConfirmed")}
        </span>
      </div>

      <button
        type="button"
        onClick={onDownloadPDF}
        className="px-5 py-2.5 bg-[#b44b00] hover:bg-[#993f00] text-white text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer print:hidden"
      >
        {t("receiptPage.downloadPdf")}
      </button>
    </div>
  );
};

export default ReceiptHeader;