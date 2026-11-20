import React from "react";

const OrderActionCard = ({ product, onBuyNow }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200/80 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h3 className="text-sm font-bold text-gray-900">Ready to order?</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          ৳{product.pricePerUnit} per {product.unit || "unit"} • {product.quantity}{" "}
          {product.unit || ""} available
        </p>
      </div>

      <button
        type="button"
        onClick={onBuyNow}
        className="px-10 py-2.5 bg-[#008ba9] hover:bg-[#007690] text-white text-xs font-semibold rounded transition-colors cursor-pointer text-center"
      >
        Buy now
      </button>
    </div>
  );
};

export default OrderActionCard;