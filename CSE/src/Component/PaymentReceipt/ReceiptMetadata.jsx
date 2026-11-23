import React from "react";
import { useTranslation } from "react-i18next";

const ReceiptMetadata = ({ order }) => {
  const { t } = useTranslation();

  return (
    <div className="divide-y divide-gray-200 border-b border-gray-200 text-xs sm:text-sm mb-8">
      <div className="py-3 flex items-center justify-between">
        <span className="text-gray-500">
          {t("receiptPage.metadata.receiptNo")}
        </span>
        <span className="font-bold text-gray-900">
          {order.receiptNo || `REC-${order.id}`}
        </span>
      </div>

      <div className="py-3 flex items-center justify-between">
        <span className="text-gray-500">
          {t("receiptPage.metadata.dateTime")}
        </span>
        <span className="font-semibold text-gray-900">
          {order.dateTime || order.createdAt}
        </span>
      </div>

      <div className="py-3 flex items-center justify-between">
        <span className="text-gray-500">
          {t("receiptPage.metadata.orderId")}
        </span>
        <span className="font-semibold text-gray-900">{order.id}</span>
      </div>

      <div className="py-3 flex items-center justify-between">
        <span className="text-gray-500">
          {t("receiptPage.metadata.transactionId")}
        </span>
        <span className="font-semibold text-gray-900">
          {order.transactionId || `TXN-${order.id}`}
        </span>
      </div>
    </div>
  );
};

export default ReceiptMetadata;