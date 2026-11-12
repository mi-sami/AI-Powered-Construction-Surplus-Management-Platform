import React from "react";

const ProductInfoCard = ({ product }) => {
  // Format Date (e.g. 20 October 2026)
  const formatDate = (dateStr) => {
    if (!dateStr) return "Immediately";
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const specRows = [
    { label: "Category", value: product.category || "N/A" },
    { label: "Quantity", value: `${product.quantity || 0} ${product.unit || ""}` },
    { label: "Condition", value: product.condition || "Unused" },
    { label: "Brand", value: product.brand?.trim() ? product.brand : "Not specified" },
    { label: "Location", value: product.location || "Not specified" },
    { label: "Available from", value: formatDate(product.availableFrom) },
    { label: "Seller", value: product.sellerName || "Rahim Traders" },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200/80 p-6 shadow-sm h-full">
      <h2 className="text-sm font-bold text-gray-900 mb-4">Product details</h2>

      {/* Price & Condition Header */}
      <div className="flex items-center justify-between pb-4 mb-2 border-b border-gray-100">
        <p className="text-xl font-bold text-gray-900">
          ৳{product.pricePerUnit} per {product.unit || "unit"}
        </p>
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#eae8e1] text-gray-700">
          {product.condition || "Unused"}
        </span>
      </div>

      {/* Specification List */}
      <div className="divide-y divide-gray-100 text-xs">
        {specRows.map((row, index) => (
          <div key={index} className="py-3 flex items-center justify-between">
            <span className="text-gray-500 font-medium">{row.label}</span>
            <span className="text-gray-900 font-bold text-right">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductInfoCard;