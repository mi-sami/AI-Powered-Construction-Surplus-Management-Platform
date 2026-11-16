import React from "react";

const ReceiptMaterialTable = ({ order }) => {
  return (
    <div className="overflow-x-auto mb-8">
      <table className="w-full text-left border-collapse text-xs sm:text-sm">
        <thead>
          <tr className="border-b-2 border-gray-800 text-gray-900 font-bold">
            <th className="py-2.5 pr-4">Material</th>
            <th className="py-2.5 px-3">Qty</th>
            <th className="py-2.5 px-3">Unit price</th>
            <th className="py-2.5 px-3">Total</th>
            <th className="py-2.5 px-3">Advance paid</th>
            <th className="py-2.5 pl-3 text-right">Due</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 border-b border-gray-200">
          <tr className="text-gray-800">
            <td className="py-3.5 pr-4 font-medium">{order.listingTitle}</td>
            <td className="py-3.5 px-3">
              {order.quantity || 1} {order.unit || "unit"}
            </td>
            <td className="py-3.5 px-3">
              ৳{Number(order.unitPrice || 0).toLocaleString()}
            </td>
            <td className="py-3.5 px-3">
              ৳{Number(order.totalAmount || 0).toLocaleString()}
            </td>
            <td className="py-3.5 px-3 font-semibold text-gray-900">
              ৳{Number(order.advancePaid || 0).toLocaleString()}
            </td>
            <td className="py-3.5 pl-3 text-right font-semibold text-gray-900">
              ৳{Number(order.dueBalance || 0).toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ReceiptMaterialTable;