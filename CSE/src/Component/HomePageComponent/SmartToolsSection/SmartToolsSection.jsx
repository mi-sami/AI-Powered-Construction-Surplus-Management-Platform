import React from "react";
import { useTranslation } from "react-i18next";
import { HiOutlineSparkles } from "react-icons/hi";
import { LuFlag } from "react-icons/lu";

const SmartToolsSection = () => {
  const { t } = useTranslation();

  const tools = [
    {
      icon: HiOutlineSparkles,
      gradient: "from-[#008ba9] to-cyan-500",
      title: t("homePage.smartTools.matchingTitle"),
      description: t("homePage.smartTools.matchingDesc"),
    },
    {
      icon: LuFlag,
      gradient: "from-[#c24e00] to-amber-500",
      title: t("homePage.smartTools.checksTitle"),
      description: t("homePage.smartTools.checksDesc"),
    },
  ];

  return (
    <section className="py-12 px-6 bg-[#f7f6f2] w-full">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {t("homePage.smartTools.heading")}
        </h2>
        <p className="text-gray-600 text-sm mb-8">
          {t("homePage.smartTools.subtitle")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool, idx) => {
            const IconComponent = tool.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Gradient Icon Badge */}
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