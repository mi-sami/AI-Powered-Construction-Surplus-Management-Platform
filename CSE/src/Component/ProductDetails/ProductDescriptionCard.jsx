import React from "react";

const ProductDescriptionCard = ({ description }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200/80 p-6 shadow-sm">
      <h2 className="text-sm font-bold text-gray-900 mb-2">Description</h2>
      <p className="text-xs text-gray-600 leading-relaxed">
        {description?.trim()
          ? description
          : "No additional description provided by the seller."}
      </p>
    </div>
  );
};

export default ProductDescriptionCard;