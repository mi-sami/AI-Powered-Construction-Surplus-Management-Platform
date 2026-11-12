import React from "react";
import { useNavigate } from "react-router-dom";

const MatchCard = ({ item }) => {
  const navigate = useNavigate();
  const { matchPercentage, breakdown } = item;

  const progressBars = [
    { label: "Material type", matched: breakdown.productType },
    { label: "Quantity", matched: breakdown.quantity },
    { label: "Price", matched: breakdown.price },
    { label: "Location", matched: breakdown.location },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200/80 p-6 shadow-sm">
      {/* Top Header: Title, Subtitle & Integer Match Percentage */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {item.quantity} {item.unit} • ৳{item.pricePerUnit}/{item.unit} •{" "}
            {item.location || "Location N/A"}
          </p>
        </div>

        <div className="text-right flex-shrink-0">
          <p className="text-2xl font-bold text-gray-900 leading-none">
            {matchPercentage}%
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Match</p>
        </div>
      </div>

      {/* 4 Progress Bars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-5">
        {progressBars.map((bar, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-[11px] text-gray-600 mb-1">
              <span>{bar.label}</span>
              <span className="font-medium text-gray-400">
                {bar.matched ? "Matched" : "Partial"}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#ebe8e0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2b3036] rounded-full transition-all duration-300"
                style={{ width: bar.matched ? "95%" : "35%" }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={() => navigate(`/product/${item.id}`)}
        className="px-6 py-2 bg-[#008ba9] hover:bg-[#007690] text-white text-xs font-semibold rounded transition-colors cursor-pointer"
      >
        View and order
      </button>
    </div>
  );
};

export default MatchCard;