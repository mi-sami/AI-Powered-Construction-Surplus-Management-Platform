import React from "react";
import { HiOutlineSparkles } from "react-icons/hi";
import { LuFlag } from "react-icons/lu";

const SmartToolsSection = () => {
  const tools = [
    {
      icon: HiOutlineSparkles,
      gradient: "from-[#008ba9] to-cyan-500",
      title: "AI buyer-material matching",
      description:
        "Your requirement is compared with available listings on type, quantity, brand, quality, condition, price, location and date.",
    },
    {
      icon: LuFlag,
      gradient: "from-[#c24e00] to-amber-500",
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool, idx) => {
            const IconComponent = tool.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Gradient Icon Badge (Title-এর উপরে) */}
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-white mb-4 shadow-sm`}
                >
                  <IconComponent className="text-2xl" />
                </div>

                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                  {tool.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {tool.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SmartToolsSection;