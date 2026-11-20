import React from "react";

const ReceiptMetadata = ({ order }) => {
  return (
    <div className="divide-y divide-gray-200 border-b border-gray-200 text-xs sm:text-sm mb-8">
      <div className="py-3 flex items-center justify-between">
        <span className="text-gray-500">Receipt no.</span>
        <span className="font-bold text-gray-900">
          {order.receiptNo || `REC-${order.id}`}
        </span>
      </div>

      <div className="py-3 flex items-center justify-between">
        <span className="text-gray-500">Date and time</span>
        <span className="font-semibold text-gray-900">
          {order.dateTime || order.createdAt}
        </span>
      </div>

      <div className="py-3 flex items-center justify-between">
        <span className="text-gray-500">Order ID</span>
        <span className="font-semibold text-gray-900">{order.id}</span>
      </div>

      <div className="py-3 flex items-center justify-between">
        <span className="text-gray-500">Transaction ID</span>
        <span className="font-semibold text-gray-900">
          {order.transactionId || `TXN-${order.id}`}
        </span>
      </div>
    </div>
  );
};

export default ReceiptMetadata;