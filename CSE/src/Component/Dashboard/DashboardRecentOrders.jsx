import React from "react";
import { useTranslation } from "react-i18next";

const DashboardRecentOrders = ({ orders = [], loading = false }) => {
  const { t } = useTranslation();

  const getOrderStatusBadge = (status) => {
    const formatted = status ? status.toLowerCase() : "pending";

    if (formatted === "confirmed" || formatted === "paid") {
      return (
        <span className="inline-block px-3 py-0.5 text-[11px] font-semibold rounded-full border border-emerald-600 text-emerald-700 bg-emerald-50/50">
          {t("dashboard.orders.statusConfirmed")}
        </span>
      );
    }
    if (formatted === "pending advance" || formatted === "pending") {
      return (
        <span className="inline-block px-3 py-0.5 text-[11px] font-semibold rounded-full border border-amber-600 text-amber-800 bg-amber-50/50">
          {t("dashboard.orders.statusPendingAdvance")}
        </span>
      );
    }

    return (
      <span className="inline-block px-3 py-0.5 text-[11px] font-semibold rounded-full border border-gray-300 text-gray-700 bg-gray-50">
        {status || t("dashboard.orders.statusPending")}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200/80 p-6 shadow-sm h-full">
      <h2 className="text-base font-bold text-gray-900 mb-4">
        {t("dashboard.orders.heading")}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-800 text-xs font-bold text-gray-900">
              <th className="pb-2.5 pr-3">{t("dashboard.orders.colOrder")}</th>
              <th className="pb-2.5 px-3">{t("dashboard.orders.colMaterial")}</th>
              <th className="pb-2.5 pl-3 text-right">
                {t("dashboard.orders.colStatus")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-xs text-gray-800">
            {loading ? (
              <tr>
                <td colSpan="3" className="py-6 text-center text-gray-500">
                  {t("dashboard.orders.loading")}
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((order) => {
                const translatedUnit = order.unit
                  ? t(`materialForm.units.${order.unit}`, {
                      defaultValue: order.unit,
                    })
                  : "";

                return (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="py-3 pr-3 font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="py-3 px-3 text-gray-700">
                      {order.materialTitle}, {order.quantity} {translatedUnit}
                    </td>
                    <td className="py-3 pl-3 text-right">
                      {getOrderStatusBadge(order.orderStatus)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="3" className="py-6 text-center text-gray-500">
                  {t("dashboard.orders.empty")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardRecentOrders;