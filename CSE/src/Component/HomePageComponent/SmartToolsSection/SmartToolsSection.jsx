import React from "react";

const SmartToolsSection = () => {
  const tools = [
    {
      title: "AI material recognition",
      description:
        "Add a photo and the system suggests what the material is, so listing takes less typing.",
    },
    {
      title: "AI buyer-material matching",
      description:
        "Your requirement is compared with available listings on type, quantity, brand, quality, condition, price, location and date.",
    },
    {
      title: "Suspicious listing checks",
      description:
        "Reused photos, unusually low prices and other warning signs are flagged for an admin to review.",
    },
  ];

  return (
    <section className="py-12 px-6 bg-[#f7f6f2] w-full">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Smart tools built in
        </h2>
        <p className="text-gray-600 text-sm mb-8">
          AI helps listing, matching and keeping the marketplace trustworthy.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-lg border border-gray-200/80 shadow-sm"
            >
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                {tool.title}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                {tool.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SmartToolsSection;
