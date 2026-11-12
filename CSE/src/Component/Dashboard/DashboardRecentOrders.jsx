import React from "react";

const DashboardRecentOrders = ({ orders = [], loading = false }) => {
  const getOrderStatusBadge = (status) => {
    const formatted = status ? status.toLowerCase() : "pending";

    if (formatted === "confirmed" || formatted === "paid") {
      return (
        <span className="inline-block px-3 py-0.5 text-[11px] font-semibold rounded-full border border-emerald-600 text-emerald-700 bg-emerald-50/50">
          Confirmed
        </span>
      );
    }
    if (formatted === "pending advance" || formatted === "pending") {
      return (
        <span className="inline-block px-3 py-0.5 text-[11px] font-semibold rounded-full border border-amber-600 text-amber-800 bg-amber-50/50">
          Pending advance
        </span>
      );
    }

    return (
      <span className="inline-block px-3 py-0.5 text-[11px] font-semibold rounded-full border border-gray-300 text-gray-700 bg-gray-50">
        {status || "Pending"}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200/80 p-6 shadow-sm h-full">
      <h2 className="text-base font-bold text-gray-900 mb-4">Recent orders</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-800 text-xs font-bold text-gray-900">
              <th className="pb-2.5 pr-3">Order</th>
              <th className="pb-2.5 px-3">Material</th>
              <th className="pb-2.5 pl-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-xs text-gray-800">
            {loading ? (
              <tr>
                <td colSpan="3" className="py-6 text-center text-gray-500">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50">
                  <td className="py-3 pr-3 font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="py-3 px-3 text-gray-700">
                    {order.materialTitle}, {order.quantity} {order.unit}
                  </td>
                  <td className="py-3 pl-3 text-right">
                    {getOrderStatusBadge(order.orderStatus)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-6 text-center text-gray-500">
                  No recent orders found.
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