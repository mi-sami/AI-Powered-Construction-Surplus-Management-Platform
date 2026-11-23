import React from "react";
import { useTranslation } from "react-i18next";

const ReceiptMaterialTable = ({ order }) => {
  const { t, i18n } = useTranslation();
  const numLocale = i18n.language?.startsWith("bn") ? "bn-BD" : "en-US";

  const translatedUnit = order.unit
    ? t(`materialForm.units.${order.unit}`, { defaultValue: order.unit })
    : t("dashboard.defaultUnit");

  return (
    <div className="overflow-x-auto mb-8">
      <table className="w-full text-left border-collapse text-xs sm:text-sm">
        <thead>
          <tr className="border-b-2 border-gray-800 text-gray-900 font-bold">
            <th className="py-2.5 pr-4">{t("receiptPage.table.material")}</th>
            <th className="py-2.5 px-3">{t("receiptPage.table.qty")}</th>
            <th className="py-2.5 px-3">{t("receiptPage.table.unitPrice")}</th>
            <th className="py-2.5 px-3">{t("receiptPage.table.total")}</th>
            <th className="py-2.5 px-3">
              {t("receiptPage.table.advancePaid")}
            </th>
            <th className="py-2.5 pl-3 text-right">
              {t("receiptPage.table.due")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 border-b border-gray-200">
          <tr className="text-gray-800">
            <td className="py-3.5 pr-4 font-medium">{order.listingTitle}</td>
            <td className="py-3.5 px-3">
              {order.quantity || 1} {translatedUnit}
            </td>
            <td className="py-3.5 px-3">
              ৳{Number(order.unitPrice || 0).toLocaleString(numLocale)}
            </td>
            <td className="py-3.5 px-3">
              ৳{Number(order.totalAmount || 0).toLocaleString(numLocale)}
            </td>
            <td className="py-3.5 px-3 font-semibold text-gray-900">
              ৳{Number(order.advancePaid || 0).toLocaleString(numLocale)}
            </td>
            <td className="py-3.5 pl-3 text-right font-semibold text-gray-900">
              ৳{Number(order.dueBalance || 0).toLocaleString(numLocale)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ReceiptMaterialTable;