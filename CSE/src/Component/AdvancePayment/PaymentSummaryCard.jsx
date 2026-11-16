import React from "react";

const PaymentSummaryCard = ({
  totalAmount,
  currentAdvance,
  dueBalance,
  isReducedBySeller,
}) => {
  return (
    <div className="divide-y divide-gray-200 border-b border-gray-200 text-sm">
      <div className="py-3 flex items-center justify-between">
        <span className="text-gray-500">Total</span>
        <span className="font-bold text-gray-900">
          ৳{totalAmount.toLocaleString()}
        </span>
      </div>

      <div className="py-3 flex items-center justify-between">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-gray-500">Advance to pay now</span>
          {isReducedBySeller && (
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
              Reduced by seller
            </span>
          )}
        </div>
        <span className="font-bold text-gray-900">
          ৳{currentAdvance.toLocaleString()}
        </span>
      </div>

      <div className="py-3 flex items-center justify-between">
        <span className="text-gray-500">Due balance</span>
        <span className="font-bold text-gray-900">
          ৳{dueBalance.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default PaymentSummaryCard;