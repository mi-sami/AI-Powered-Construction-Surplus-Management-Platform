import React from "react";

const DashboardStats = ({
  activeAdsCount = 0,
  awaitingAdvanceCount = 0,
  underReviewCount = 0,
}) => {
  const stats = [
    {
      label: "Active advertisements",
      count: activeAdsCount,
    },
    {
      label: "Orders awaiting advance",
      count: awaitingAdvanceCount,
    },
    {
      label: "Advertisements under review",
      count: underReviewCount,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-gray-200/80 p-5 shadow-sm"
        >
          <p className="text-xs font-medium text-gray-500 mb-2">{stat.label}</p>
          <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
