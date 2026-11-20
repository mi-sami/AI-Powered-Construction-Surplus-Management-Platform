import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ item }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${item.id}`)}
      className="bg-white rounded-lg border border-gray-200/90 p-3.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Product Image Placeholder */}
        <div className="w-full h-36 bg-[#e2e0d8] rounded flex items-center justify-center overflow-hidden mb-3">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/400x300?text=No+Image";
              }}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-500 font-medium">Photo</span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1">
          {item.title}
        </h3>

        {/* Quantity & Price */}
        <p className="text-xs font-medium text-gray-800 mb-0.5">
          {item.quantity} {item.unit} • ৳{item.pricePerUnit}/{item.unit}
        </p>

        {/* Location */}
        <p className="text-[11px] text-gray-500 mb-3">
          {item.location || "Location not specified"}
        </p>
      </div>

      {/* Bottom Badges */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full border border-gray-300 text-gray-700 bg-gray-50">
          {item.condition || "Unused"}
        </span>
        <span className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full border border-emerald-600 text-emerald-700 bg-emerald-50/60">
          Verified seller
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
